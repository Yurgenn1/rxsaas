"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

type OrderType = "PICKUP" | "DELIVERY" | "DINE_IN";
type PaymentMethod = "PIX" | "DINHEIRO" | "CARTAO_ENTREGA";

const orderTypeOptions: { value: OrderType; label: string }[] = [
  { value: "PICKUP", label: "Retirada" },
  { value: "DELIVERY", label: "Entrega" },
  { value: "DINE_IN", label: "Comer no local" },
];

const paymentOptions: { value: PaymentMethod; label: string }[] = [
  { value: "PIX", label: "PIX" },
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "CARTAO_ENTREGA", label: "Cartão na entrega/retirada" },
];

interface Table {
  id: string;
  number: number;
  capacity: number | null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("PICKUP");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [tableId, setTableId] = useState<string>("");
  const [comandaNumber, setComandaNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");
  const [notes, setNotes] = useState("");
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  const storeWhatsappNumber = process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER;

  useEffect(() => {
    if (orderType === "DINE_IN" && tables.length === 0) {
      fetch("/api/tables")
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setTables(res.data.tables);
        })
        .catch(() => {});
    }
  }, [orderType, tables.length]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body = {
        customerName,
        customerPhone,
        orderType,
        deliveryAddress: orderType === "DELIVERY" ? deliveryAddress : undefined,
        tableId: orderType === "DINE_IN" ? tableId : undefined,
        comandaNumber: orderType === "DINE_IN" && comandaNumber ? Number(comandaNumber) : undefined,
        paymentMethod,
        notes: notes || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          optionId: i.optionId,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.error || "Erro ao enviar pedido");

      if (storeWhatsappNumber) {
        const table = tables.find((t) => t.id === tableId);
        const lines = [
          `Pedido ${result.data.orderNumber}`,
          `Cliente: ${customerName}`,
          `Tipo: ${orderTypeOptions.find((o) => o.value === orderType)?.label}`,
          orderType === "DELIVERY" ? `Endereço: ${deliveryAddress}` : "",
          orderType === "DINE_IN"
            ? `Mesa ${table?.number ?? ""}${comandaNumber ? ` · Comanda ${comandaNumber}` : ""}`
            : "",
          "",
          "Itens:",
          ...items.map(
            (i) => `${i.quantity}x ${i.name}${i.optionName ? ` (${i.optionName})` : ""}`
          ),
          "",
          `Total: ${formatCurrency(totalPrice)}`,
          `Pagamento: ${paymentOptions.find((o) => o.value === paymentMethod)?.label}`,
          notes ? `Obs: ${notes}` : "",
        ].filter(Boolean);

        setWhatsappLink(
          `https://wa.me/${storeWhatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`
        );
      }

      setSuccess(result.data.orderNumber);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar pedido");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="max-w-sm w-full text-center">
          <CardContent className="pt-8 pb-6 space-y-3">
            <CheckCircle2 className="size-14 text-emerald-500 mx-auto" />
            <h1 className="text-lg font-bold">Pedido enviado!</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Pedido <span className="font-semibold">{success}</span> recebido.
              {whatsappLink
                ? " Envie pelo WhatsApp abaixo para agilizar a confirmação."
                : " A loja vai confirmar em breve."}
            </p>
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#25D366] hover:bg-[#1fb855] text-white font-medium text-sm px-4 py-2.5 transition"
              >
                Enviar pedido no WhatsApp
              </a>
            )}
            <Button render={<Link href="/cardapio" />} nativeButton={false} variant="outline" className="w-full">
              Voltar ao cardápio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="text-center space-y-3">
          <p className="text-slate-600 dark:text-slate-400">Seu carrinho está vazio.</p>
          <Button render={<Link href="/cardapio" />} nativeButton={false}>Ver cardápio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/cardapio" className="text-slate-500 hover:text-[#E85D5D]">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="font-bold">Finalizar Pedido</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-5">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive text-sm">
            ❌ {error}
          </div>
        )}

        <Card>
          <CardContent className="pt-4 space-y-3">
            <h2 className="font-semibold text-sm">Resumo do pedido</h2>
            {items.map((item) => (
              <div key={item.cartLineId} className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  {item.quantity}x {item.name}
                  {item.optionName ? ` (${item.optionName})` : ""}
                </span>
                <span className="font-medium">{formatCurrency(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Total</span>
              <span className="text-[#E85D5D]">{formatCurrency(totalPrice)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="font-semibold text-sm">Seus dados</h2>
          <Input
            placeholder="Nome completo"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <Input
            placeholder="WhatsApp (com DDD)"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-sm">Como você quer receber?</h2>
          <div className="grid grid-cols-3 gap-2">
            {orderTypeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setOrderType(opt.value)}
                className={`px-2 py-2.5 rounded-lg border text-sm font-medium transition ${
                  orderType === opt.value
                    ? "border-[#E85D5D] bg-[#E85D5D]/5 text-slate-900 dark:text-slate-50"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {orderType === "DELIVERY" && (
          <Input
            placeholder="Endereço completo (rua, número, bairro, complemento)"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
          />
        )}

        {orderType === "DINE_IN" && (
          <div className="flex gap-3">
            <div className="flex-1">
              <Select
                value={tableId}
                onValueChange={(v) => setTableId(v ?? "")}
                items={Object.fromEntries(tables.map((t) => [t.id, `Mesa ${t.number}`]))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a mesa" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      Mesa {t.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Nº comanda"
              value={comandaNumber}
              onChange={(e) => setComandaNumber(e.target.value)}
              className="w-32"
              inputMode="numeric"
            />
          </div>
        )}

        <div className="space-y-2">
          <h2 className="font-semibold text-sm">Forma de pagamento</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Combinado direto com a loja pelo WhatsApp — ainda não processamos pagamento online.
          </p>
          <div className="grid grid-cols-1 gap-2">
            {paymentOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPaymentMethod(opt.value)}
                className={`px-3 py-2.5 rounded-lg border text-sm font-medium text-left transition ${
                  paymentMethod === opt.value
                    ? "border-[#E85D5D] bg-[#E85D5D]/5 text-slate-900 dark:text-slate-50"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          placeholder="Observações (opcional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Enviando..." : `Confirmar Pedido · ${formatCurrency(totalPrice)}`}
        </Button>
      </form>
    </div>
  );
}
