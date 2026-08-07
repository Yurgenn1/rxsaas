const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
const EVOLUTION_INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME;

let cachedOwnerNumber: string | null = null;

async function getInstanceOwnerNumber(): Promise<string | null> {
  if (cachedOwnerNumber) return cachedOwnerNumber;
  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE_NAME) return null;

  const res = await fetch(`${EVOLUTION_API_URL}/instance/fetchInstances`, {
    headers: { apikey: EVOLUTION_API_KEY },
  });
  if (!res.ok) throw new Error(`fetchInstances failed: ${res.status}`);

  const instances = await res.json();
  const instance = Array.isArray(instances)
    ? instances.find((i: any) => i.name === EVOLUTION_INSTANCE_NAME)
    : null;
  if (!instance?.ownerJid) return null;

  cachedOwnerNumber = instance.ownerJid.split("@")[0];
  return cachedOwnerNumber;
}

async function sendWhatsAppMessage(number: string, text: string) {
  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE_NAME) {
    throw new Error("Evolution API não configurada (variáveis de ambiente ausentes)");
  }

  const res = await fetch(`${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE_NAME}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: EVOLUTION_API_KEY },
    body: JSON.stringify({ number, text }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Evolution sendText failed: ${res.status} ${body}`);
  }
}

const orderTypeLabels: Record<string, string> = {
  PICKUP: "Retirada",
  DELIVERY: "Entrega",
  DINE_IN: "Comer no local",
};

const paymentLabels: Record<string, string> = {
  PIX: "PIX",
  DINHEIRO: "Dinheiro",
  CARTAO_ENTREGA: "Cartão na entrega/retirada",
};

interface OrderForNotification {
  orderNumber: string;
  customerName?: string | null;
  customerPhone?: string | null;
  orderType: string;
  deliveryAddress?: string | null;
  tableId?: string | null;
  comandaNumber?: number | null;
  paymentMethod?: string | null;
  total: number;
  items: { quantity: number; product?: { name: string } }[];
}

export async function notifyNewOrder(order: OrderForNotification) {
  const target = await getInstanceOwnerNumber();
  if (!target) {
    console.warn("⚠️ [notifyNewOrder] Número da instância não disponível — notificação não enviada.");
    return;
  }

  const itemsList = order.items
    .map((i) => `  • ${i.quantity}x ${i.product?.name ?? "Item"}`)
    .join("\n");

  const extra =
    order.orderType === "DELIVERY"
      ? `📍 Endereço: ${order.deliveryAddress}`
      : order.orderType === "DINE_IN"
        ? `🪑 Mesa/Comanda: ${order.comandaNumber ?? "-"}`
        : "";

  const text = [
    `🆕 *Novo pedido ${order.orderNumber}*`,
    `👤 ${order.customerName} (${order.customerPhone})`,
    `🍽️ ${orderTypeLabels[order.orderType] ?? order.orderType}`,
    extra,
    "",
    "*Itens:*",
    itemsList,
    "",
    `💰 Total: R$ ${order.total.toFixed(2)}`,
    `💳 Pagamento: ${paymentLabels[order.paymentMethod ?? ""] ?? "-"}`,
  ]
    .filter(Boolean)
    .join("\n");

  await sendWhatsAppMessage(target, text);
}
