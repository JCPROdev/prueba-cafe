"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/lib/actions/auth.actions";
import type { ActionResult } from "@/types/actions";

export function LoginForm() {
  const callbackUrl = useSearchParams().get("callbackUrl") ?? "/admin";
  const [state, action, pending] = useActionState<
    ActionResult<null> | null,
    FormData
  >(loginAction, null);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <label className="flex flex-col gap-1 text-sm font-medium">
        Correo electrónico
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-900"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Contraseña
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          className="rounded-md border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-900"
        />
      </label>

      {state && !state.success && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
