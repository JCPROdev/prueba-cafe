"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import {
  userFormCreateSchema,
  userFormUpdateSchema,
} from "@/lib/validations";
import type { ActionResult } from "@/types/actions";

type UserResult = ActionResult<{ id: string }>;

const FORBIDDEN: UserResult = {
  success: false,
  error: "No autorizado: se requiere rol ADMIN",
};

function revalidateUsers(): void {
  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/auditoria");
}

export async function createUserAction(
  _prev: UserResult | null,
  formData: FormData,
): Promise<UserResult> {
  const admin = await requireAdmin();
  if (!admin) return FORBIDDEN;

  const parsed = userFormCreateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  try {
    const { name, email, password, role } = parsed.data;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return { success: false, error: "Ya existe un usuario con ese correo" };

    const user = await prisma.user.create({
      data: { name, email, role, password: await bcrypt.hash(password, 12) },
    });

    await createAuditLog({
      userId: admin.id,
      action: "CREATE",
      entity: "USER",
      entityId: user.id,
      details: `Usuario creado: ${email} (${role})`,
    });
    revalidateUsers();
    return { success: true, data: { id: user.id } };
  } catch {
    return { success: false, error: "No se pudo crear el usuario" };
  }
}

export async function updateUserAction(
  _prev: UserResult | null,
  formData: FormData,
): Promise<UserResult> {
  const admin = await requireAdmin();
  if (!admin) return FORBIDDEN;

  const parsed = userFormUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password") ?? "",
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  try {
    const { id, name, email, password, role } = parsed.data;
    const previous = await prisma.user.findUnique({ where: { id } });
    if (!previous) return { success: false, error: "Usuario no encontrado" };

    if (id === admin.id && role !== "ADMIN") {
      return { success: false, error: "No puedes quitarte el rol ADMIN a ti mismo" };
    }
    if (email !== previous.email) {
      const taken = await prisma.user.findUnique({ where: { email } });
      if (taken) return { success: false, error: "Ya existe un usuario con ese correo" };
    }

    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        ...(password && { password: await bcrypt.hash(password, 12) }),
      },
    });

    const changes: string[] = [];
    if (previous.name !== name) changes.push("nombre");
    if (previous.email !== email) changes.push(`correo ${previous.email} → ${email}`);
    if (previous.role !== role) changes.push(`rol ${previous.role} → ${role}`);
    if (password) changes.push("contraseña restablecida");

    await createAuditLog({
      userId: admin.id,
      action: "UPDATE",
      entity: "USER",
      entityId: id,
      details: `Usuario editado: ${email}${changes.length ? ` (${changes.join(", ")})` : ""}`,
    });
    revalidateUsers();
    return { success: true, data: { id } };
  } catch {
    return { success: false, error: "No se pudo actualizar el usuario" };
  }
}

export async function deleteUserAction(
  _prev: UserResult | null,
  formData: FormData,
): Promise<UserResult> {
  const admin = await requireAdmin();
  if (!admin) return FORBIDDEN;

  const parsed = userFormUpdateSchema.pick({ id: true }).safeParse({
    id: formData.get("id"),
  });
  if (!parsed.success) return { success: false, error: "ID inválido" };

  try {
    const { id } = parsed.data;
    if (id === admin.id) {
      return { success: false, error: "No puedes eliminar tu propia cuenta" };
    }
    const target = await prisma.user.findUnique({
      where: { id },
      include: { _count: { select: { auditLogs: true } } },
    });
    if (!target) return { success: false, error: "Usuario no encontrado" };
    if (target._count.auditLogs > 0) {
      return {
        success: false,
        error: "El usuario tiene registros de auditoría y no puede eliminarse",
      };
    }

    await prisma.user.delete({ where: { id } });
    await createAuditLog({
      userId: admin.id,
      action: "DELETE",
      entity: "USER",
      entityId: id,
      details: `Usuario eliminado: ${target.email} (${target.role})`,
    });
    revalidateUsers();
    return { success: true, data: { id } };
  } catch {
    return { success: false, error: "No se pudo eliminar el usuario" };
  }
}
