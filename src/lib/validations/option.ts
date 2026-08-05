import { z } from "zod";

export const createOptionGroupSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["SIZE", "FLAVOR", "ADDITIONAL", "REMOVAL", "CUSTOM"]),
  isRequired: z.boolean().default(false),
  minSelect: z.number().default(0),
  maxSelect: z.number().optional(),
  productId: z.string(),
});

export const createOptionSchema = z.object({
  name: z.string().min(1),
  price: z.number().default(0),
  groupId: z.string(),
});

export type CreateOptionGroupInput = z.infer<typeof createOptionGroupSchema>;
export type CreateOptionInput = z.infer<typeof createOptionSchema>;
