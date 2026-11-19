"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteProductAction } from "@/lib/actions/product.actions";
import { Button } from "@/components/ui/Button";

interface DeleteProductButtonProps {
  id: string;
  name: string;
}

export function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    const formData = new FormData();
    formData.set("id", id);
    startTransition(async () => {
      const result = await deleteProductAction(null, formData);
      if (result.success) toast.success("Producto eliminado");
      else toast.error(result.error);
    });
  }

  return (
    <Button
      type="button"
      variant="danger"
      className="px-3 py-1"
      disabled={pending}
      onClick={handleDelete}
    >
      {pending ? "Eliminando…" : "Eliminar"}
    </Button>
  );
}
