"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import type { ActionResult } from "@/types/actions";

function safeRedirect(value: FormDataEntryValue | null): string {
  if (typeof value === "string" && /^\/admin(\/[\w-]*)*$/.test(value)) {
    return value;
  }
  return "/admin";
}

export async function loginAction(
  _prev: ActionResult<null> | null,
  formData: FormData,
): Promise<ActionResult<null>> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { success: false, error: "Correo o contraseña inválidos" };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: safeRedirect(formData.get("callbackUrl")),
    });
    return { success: true, data: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Credenciales inválidas" };
    }
    throw error; // redirect de Next
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
