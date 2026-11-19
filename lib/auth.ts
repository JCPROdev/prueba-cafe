import "server-only";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations";
import type { Role } from "@/types/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
});

export type SessionUser = { id: string; role: Role };

/** Devuelve el usuario activo o null. */
export async function requireSession(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user) return null;
  return { id: session.user.id, role: session.user.role };
}

/** Devuelve el usuario solo si es ADMIN; si no, null. */
export async function requireAdmin(): Promise<SessionUser | null> {
  const user = await requireSession();
  return user?.role === "ADMIN" ? user : null;
}
