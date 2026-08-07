import { z } from "zod";

export const createMesaSchema = z.object({
  number: z.number().int().min(1, "Número da mesa deve ser maior que 0"),
  capacity: z.number().int().min(1, "Capacidade deve ser maior que 0").optional(),
  isActive: z.boolean().default(true),
});

export const updateMesaSchema = z.object({
  number: z.number().int().min(1, "Número da mesa deve ser maior que 0").optional(),
  capacity: z.number().int().min(1, "Capacidade deve ser maior que 0").optional(),
  isActive: z.boolean().optional(),
});

export type CreateMesaInput = z.infer<typeof createMesaSchema>;
export type UpdateMesaInput = z.infer<typeof updateMesaSchema>;
