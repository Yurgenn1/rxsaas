import { db } from "@/lib/db";
import { CreateOrderInput, UpdateOrderStatusInput } from "@/lib/validations/order";

export const orderService = {
  async listOrders(restaurantId: string, page = 1, limit = 10, status?: string) {
    const skip = (page - 1) * limit;

    const where = {
      restaurantId,
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        skip,
        take: limit,
        include: { customer: true, items: true },
        orderBy: { createdAt: "desc" },
      }),
      db.order.count({ where }),
    ]);

    return { orders, total, page, limit };
  },

  async getOrder(id: string) {
    return db.order.findUnique({
      where: { id },
      include: { customer: true, items: { include: { product: true } } },
    });
  },

  async createOrder(data: CreateOrderInput) {
    const orderNumber = `PED-${Date.now()}`;
    return db.order.create({
      data: { ...data, orderNumber },
      include: { customer: true, items: true },
    });
  },

  async updateOrderStatus(id: string, data: UpdateOrderStatusInput) {
    return db.order.update({
      where: { id },
      data,
      include: { customer: true, items: true },
    });
  },

  async cancelOrder(id: string) {
    return db.order.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: { customer: true, items: true },
    });
  },
};
