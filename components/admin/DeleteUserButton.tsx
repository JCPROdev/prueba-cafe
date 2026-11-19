"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteUserAction } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/Button";

interface DeleteUserButtonProps {
  id: string;
  name: string;
}

export function DeleteUserButton({ id, name }: DeleteUserButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`¿Eliminar a "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    const formData = new FormData();
    formData.set("id", id);
    startTransition(async () => {
      const result = await deleteUserAction(null, formData);
      if (result.success) toast.success("Usuario eliminado");
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
