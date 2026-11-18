"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, updateTag } from "next/cache";
import { requireSession } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { sanityWriteClient } from "@/lib/sanity/client";
import { PRODUCT_TAG } from "@/lib/sanity/queries";
import { slugify } from "@/lib/utils";
import { productSchema, productUpdateSchema } from "@/lib/validations";
import type { ActionResult } from "@/types/actions";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

type ProductResult = ActionResult<{ id: string }>;

function readFields(formData: FormData) {
  const category = formData.get("categoryId");
  return {
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    price: formData.get("price"),
    categoryId: typeof category === "string" && category ? category : undefined,
    available: formData.get("available") === "on",
  };
}

function readImage(formData: FormData): File | null | "invalid" {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return null;
  if (!file.type.startsWith("image/") || file.size > MAX_IMAGE_BYTES) {
    return "invalid";
  }
  return file;
}

async function uploadImage(file: File) {
  const asset = await sanityWriteClient.assets.upload("image", file, {
    filename: file.name,
  });
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
  };
}

function revalidateProducts(): void {
  updateTag(PRODUCT_TAG);
  revalidatePath("/");
  revalidatePath("/admin/productos");
}

export async function createProductAction(
  _prev: ProductResult | null,
  formData: FormData,
): Promise<ProductResult> {
  const user = await requireSession();
  if (!user) return { success: false, error: "No autorizado" };

  const parsed = productSchema.safeParse(readFields(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const image = readImage(formData);
  if (image === "invalid") {
    return { success: false, error: "Imagen inválida (máx. 4 MB)" };
  }

  try {
    const { name, description, price, categoryId, available } = parsed.data;
    const doc = await sanityWriteClient.create({
      _type: "product",
      name,
      slug: {
        _type: "slug",
        current: `${slugify(name)}-${randomUUID().slice(0, 6)}`,
      },
      description,
      price,
      available,
      ...(categoryId && {
        category: { _type: "reference", _ref: categoryId },
      }),
      ...(image && { image: await uploadImage(image) }),
    });

    await createAuditLog({
      userId: user.id,
      action: "CREATE",
      entity: "PRODUCT",
      entityId: doc._id,
      details: `Producto creado: "${name}" (precio ${price}, ${available ? "disponible" : "no disponible"})`,
    });
    revalidateProducts();
    return { success: true, data: { id: doc._id } };
  } catch {
    return { success: false, error: "No se pudo crear el producto" };
  }
}

export async function updateProductAction(
  _prev: ProductResult | null,
  formData: FormData,
): Promise<ProductResult> {
  const user = await requireSession();
  if (!user) return { success: false, error: "No autorizado" };

  const parsed = productUpdateSchema.safeParse({
    ...readFields(formData),
    id: formData.get("id"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const image = readImage(formData);
  if (image === "invalid") {
    return { success: false, error: "Imagen inválida (máx. 4 MB)" };
  }

  try {
    const { id, name, description, price, categoryId, available } = parsed.data;
    const previous = await sanityWriteClient.fetch<{
      name: string;
      price: number;
    } | null>(`*[_type == "product" && _id == $id][0]{ name, price }`, { id });
    if (!previous) return { success: false, error: "Producto no encontrado" };

    const patch = sanityWriteClient.patch(id).set({
      name,
      description,
      price,
      available,
      ...(image && { image: await uploadImage(image) }),
    });
    await (categoryId
      ? patch.set({ category: { _type: "reference", _ref: categoryId } })
      : patch.unset(["category"])
    ).commit();

    const changes: string[] = [];
    if (previous.name !== name) changes.push(`nombre "${previous.name}" → "${name}"`);
    if (previous.price !== price) changes.push(`precio ${previous.price} → ${price}`);
    if (image) changes.push("imagen actualizada");

    await createAuditLog({
      userId: user.id,
      action: "UPDATE",
      entity: "PRODUCT",
      entityId: id,
      details: `Producto editado: "${name}"${changes.length ? ` (${changes.join(", ")})` : ""}`,
    });
    revalidateProducts();
    return { success: true, data: { id } };
  } catch {
    return { success: false, error: "No se pudo actualizar el producto" };
  }
}

export async function deleteProductAction(
  _prev: ProductResult | null,
  formData: FormData,
): Promise<ProductResult> {
  const user = await requireSession();
  if (!user) return { success: false, error: "No autorizado" };

  const parsed = productUpdateSchema.pick({ id: true }).safeParse({
    id: formData.get("id"),
  });
  if (!parsed.success) return { success: false, error: "ID inválido" };

  try {
    const { id } = parsed.data;
    const existing = await sanityWriteClient.fetch<{ name: string } | null>(
      `*[_type == "product" && _id == $id][0]{ name }`,
      { id },
    );
    if (!existing) return { success: false, error: "Producto no encontrado" };

    await sanityWriteClient.delete(id);
    await createAuditLog({
      userId: user.id,
      action: "DELETE",
      entity: "PRODUCT",
      entityId: id,
      details: `Producto eliminado: "${existing.name}"`,
    });
    revalidateProducts();
    return { success: true, data: { id } };
  } catch {
    return { success: false, error: "No se pudo eliminar el producto" };
  }
}
