import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().min(1, "ID do produto é obrigatório"),
  quantity: z.number().int().min(1, "Quantidade deve ser pelo menos 1"),
  notes: z.string().optional(),
});

export const createPedidoSchema = z
  .object({
    customerName: z.string().min(2, "Nome é obrigatório"),
    customerPhone: z.string().min(8, "Telefone é obrigatório"),
    orderType: z.enum(["PICKUP", "DELIVERY", "DINE_IN"]),
    deliveryAddress: z.string().optional(),
    tableId: z.string().optional(),
    paymentMethod: z.enum(["PIX", "DINHEIRO", "CARTAO_ENTREGA"]),
    notes: z.string().optional(),
    items: z.array(orderItemSchema).min(1, "O carrinho está vazio"),
  })
  .refine((data) => data.orderType !== "DELIVERY" || !!data.deliveryAddress, {
    message: "Endereço é obrigatório para entrega",
    path: ["deliveryAddress"],
  })
  .refine((data) => data.orderType !== "DINE_IN" || !!data.tableId, {
    message: "Mesa é obrigatória para comer no local",
    path: ["tableId"],
  });

export const updatePedidoStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"]),
});

export type CreatePedidoInput = z.infer<typeof createPedidoSchema>;
export type UpdatePedidoStatusInput = z.infer<typeof updatePedidoStatusSchema>;
