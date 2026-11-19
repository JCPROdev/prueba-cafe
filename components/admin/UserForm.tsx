"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createUserAction, updateUserAction } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ActionResult } from "@/types/actions";
import type { Role } from "@/types/auth";

interface UserFormProps {
  user?: { id: string; name: string; email: string; role: Role };
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult<{ id: string }> | null,
    FormData
  >(user ? updateUserAction : createUserAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(user ? "Usuario actualizado" : "Usuario creado");
      router.push("/admin/usuarios");
    } else {
      toast.error(state.error);
    }
  }, [state, user, router]);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {user && <input type="hidden" name="id" value={user.id} />}

      <Input label="Nombre" name="name" required defaultValue={user?.name} />
      <Input
        label="Correo electrónico"
        name="email"
        type="email"
        required
        autoComplete="off"
        defaultValue={user?.email}
      />
      <Input
        label={user ? "Nueva contraseña (vacío = sin cambios)" : "Contraseña"}
        name="password"
        type="password"
        minLength={8}
        required={!user}
        autoComplete="new-password"
      />

      <label className="flex flex-col gap-1 text-sm font-medium">
        Rol
        <select
          name="role"
          defaultValue={user?.role ?? "EMPLOYEE"}
          className="rounded-md border border-neutral-300 px-3 py-2 font-normal"
        >
          <option value="EMPLOYEE">EMPLOYEE</option>
          <option value="ADMIN">ADMIN</option>
        </select>
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
          onClick={() => router.push("/admin/usuarios")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
