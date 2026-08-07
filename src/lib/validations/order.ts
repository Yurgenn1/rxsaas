import { z } from "zod";

const orderItemInputSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
  optionId: z.string().optional(), // ProductOption selecionado (ex: tamanho)
  notes: z.string().optional(),
});

export const createOrderSchema = z
  .object({
    customerName: z.string().min(2, "Nome é obrigatório"),
    customerPhone: z.string().min(8, "Telefone é obrigatório"),
    orderType: z.enum(["PICKUP", "DELIVERY", "DINE_IN"]),
    deliveryAddress: z.string().optional(),
    tableId: z.string().optional(),
    comandaNumber: z.number().int().optional(),
    paymentMethod: z.enum(["PIX", "DINHEIRO", "CARTAO_ENTREGA"]),
    notes: z.string().optional(),
    items: z.array(orderItemInputSchema).min(1, "O carrinho está vazio"),
  })
  .refine((data) => data.orderType !== "DELIVERY" || !!data.deliveryAddress, {
    message: "Endereço é obrigatório para entrega",
    path: ["deliveryAddress"],
  })
  .refine((data) => data.orderType !== "DINE_IN" || !!data.tableId, {
    message: "Selecione a mesa",
    path: ["tableId"],
  });

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
