import type { NextAuthConfig } from "next-auth";

const ADMIN_ONLY_PREFIXES = ["/admin/usuarios", "/admin/auditoria"];

export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const { pathname } = nextUrl;
      if (!pathname.startsWith("/admin")) return true;

      if (!auth?.user) return false; // redirige a /login?callbackUrl=...

      const isAdminOnly = ADMIN_ONLY_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
      );
      if (isAdminOnly && auth.user.role !== "ADMIN") {
        return Response.redirect(new URL("/admin", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.sub ?? "";
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (typeof token.id === "string") session.user.id = token.id;
      if (token.role === "ADMIN" || token.role === "EMPLOYEE") {
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
