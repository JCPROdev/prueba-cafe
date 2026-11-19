"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createProductAction,
  updateProductAction,
} from "@/lib/actions/product.actions";
import { MAX_IMAGE_BYTES, MAX_IMAGE_MB } from "@/lib/upload";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ActionResult } from "@/types/actions";
import type { Category, Product } from "@/types/sanity";

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult<{ id: string }> | null,
    FormData
  >(product ? updateProductAction : createProductAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(product ? "Producto actualizado" : "Producto creado");
      router.push("/admin/productos");
    } else {
      toast.error(state.error);
    }
  }, [state, product, router]);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        const file = new FormData(e.currentTarget).get("image");
        if (file instanceof File && file.size > MAX_IMAGE_BYTES) {
          e.preventDefault();
          toast.error(
            `No se pueden subir imágenes de más de ${MAX_IMAGE_MB} MB (la seleccionada pesa ${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
          );
        }
      }}
      className="flex max-w-xl flex-col gap-4">
      {product && <input type="hidden" name="id" value={product._id} />}

      <Input label="Nombre" name="name" required defaultValue={product?.name} />

      <label className="flex flex-col gap-1 text-sm font-medium">
        Descripción
        <textarea
          name="description"
          rows={3}
          maxLength={300}
          defaultValue={product?.description}
          className="rounded-md border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-900"
        />
      </label>

      <Input
        label="Precio"
        name="price"
        type="number"
        min={0}
        step="0.01"
        required
        defaultValue={product?.price}
      />

      <label className="flex flex-col gap-1 text-sm font-medium">
        Categoría
        <select
          name="categoryId"
          defaultValue={product?.category?._id ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 font-normal"
        >
          <option value="">Sin categoría</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </label>

      <Input
        label={product ? "Reemplazar imagen (opcional)" : "Imagen"}
        name="image"
        type="file"
        accept="image/*"
      />

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="available"
          defaultChecked={product?.available ?? true}
        />
        Disponible
      </label>

      {state && !state.success && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/productos")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
