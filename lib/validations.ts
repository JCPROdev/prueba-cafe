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
const roleSchema = z.enum(["ADMIN", "EMPLOYEE"], "Rol inválido");

export const userFormCreateSchema = userCreateSchema.extend({ role: roleSchema });

export const userFormUpdateSchema = z.object({
  id: z.string().min(1, "ID requerido"),
  name: z.string().trim().min(2, "Nombre requerido"),
  email: z.email("Correo inválido").trim().toLowerCase(),
  // Vacío = conservar la contraseña actual.
  password: z
    .string()
    .refine((v) => v === "" || v.length >= 8, "Mínimo 8 caracteres"),
  role: roleSchema,
});

export const auditFilterSchema = z.object({
  entity: z.enum(["PRODUCT", "USER"]).optional().catch(undefined),
  action: z.enum(["CREATE", "UPDATE", "DELETE", "LOGIN"]).optional().catch(undefined),
  userId: z.string().trim().min(1).optional().catch(undefined),
  from: z.iso.date().optional().catch(undefined),
  to: z.iso.date().optional().catch(undefined),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
