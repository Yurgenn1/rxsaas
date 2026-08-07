import { db } from "@/lib/db";
import { CreateOrderInput, UpdateOrderStatusInput } from "@/lib/validations/order";

// Prisma retorna subtotal/tax/discount/tip/total como Decimal; o frontend espera number.
function serializeOrder<T extends { subtotal: unknown; tax: unknown; discount: unknown; tip: unknown; total: unknown }>(
  order: T
) {
  return {
    ...order,
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    discount: Number(order.discount),
    tip: Number(order.tip),
    total: Number(order.total),
  };
}

export const orderService = {
  async listOrders(restaurantId: string, page = 1, limit = 10, status?: string) {
    const skip = (page - 1) * limit;

    const where = {
      restaurantId,
      ...(status && { status: status as any }),
    };

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        skip,
        take: limit,
        include: { customer: true, table: true, items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      }),
      db.order.count({ where }),
    ]);

    return { orders: orders.map(serializeOrder), total, page, limit };
  },

  async getOrder(id: string) {
    const order = await db.order.findUnique({
      where: { id },
      include: { customer: true, items: { include: { product: true } } },
    });
    return order ? serializeOrder(order) : null;
  },

  async createOrder(restaurantId: string, customerId: string, data: CreateOrderInput) {
    const productIds = data.items.map((i) => i.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds }, restaurantId },
      include: { optionGroups: { include: { options: true } } },
    });

    let subtotal = 0;
    const itemsToCreate = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Produto não encontrado: ${item.productId}`);

      let unitPrice = Number(product.price);
      let modifiers: { optionId: string; price: number; quantity: number }[] = [];

      if (item.optionId) {
        const option = product.optionGroups
          .flatMap((g) => g.options)
          .find((o) => o.id === item.optionId);
        if (!option) throw new Error(`Opção inválida para o produto ${product.name}`);
        unitPrice += Number(option.price);
        modifiers = [{ optionId: option.id, price: Number(option.price), quantity: 1 }];
      }

      subtotal += unitPrice * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        notes: item.notes,
        modifiers: modifiers.length > 0 ? { create: modifiers } : undefined,
      };
    });

    const total = subtotal;
    const orderNumber = `PED-${Date.now()}`;

    const order = await db.order.create({
      data: {
        orderNumber,
        restaurantId,
        customerId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        orderType: data.orderType,
        deliveryAddress: data.deliveryAddress,
        tableId: data.tableId,
        comandaNumber: data.comandaNumber,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        subtotal,
        total,
        items: { create: itemsToCreate },
      },
      include: { customer: true, table: true, items: { include: { product: true } } },
    });
    return serializeOrder(order);
  },

  async updateOrderStatus(id: string, data: UpdateOrderStatusInput) {
    const order = await db.order.update({
      where: { id },
      data,
      include: { customer: true, items: true },
    });
    return serializeOrder(order);
  },

  async cancelOrder(id: string) {
    const order = await db.order.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: { customer: true, items: true },
    });
    return serializeOrder(order);
  },
};
