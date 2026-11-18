import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Correo inválido").trim().toLowerCase(),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export const userCreateSchema = z.object({
  name: z.string().trim().min(2, "Nombre requerido"),
  email: z.email("Correo inválido").trim().toLowerCase(),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Nombre requerido").max(80, "Máximo 80 caracteres"),
  description: z.string().trim().max(300, "Máximo 300 caracteres"),
  price: z.coerce.number("Precio inválido").min(0, "El precio no puede ser negativo"),
  categoryId: z.string().trim().optional(),
  available: z.boolean(),
});

export const productUpdateSchema = productSchema.extend({
  id: z.string().min(1, "ID requerido"),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
