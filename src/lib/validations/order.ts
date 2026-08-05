import { z } from "zod";

export const createOrderSchema = z.object({
  restaurantId: z.string(),
  customerId: z.string(),
  subtotal: z.number(),
  tax: z.number().default(0),
  discount: z.number().default(0),
  tip: z.number().default(0),
  total: z.number(),
  orderType: z.enum(["PICKUP", "DELIVERY", "DINE_IN"]).default("PICKUP"),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
