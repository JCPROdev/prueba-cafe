import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth.actions";
import type { Role } from "@/types/auth";

interface NavItem {
  href: string;
  label: string;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Resumen", roles: ["ADMIN", "EMPLOYEE"] },
  { href: "/admin/productos", label: "Productos", roles: ["ADMIN", "EMPLOYEE"] },
  { href: "/admin/usuarios", label: "Usuarios", roles: ["ADMIN"] },
  { href: "/admin/auditoria", label: "Auditoría", roles: ["ADMIN"] },
];

async function AdminSidebar() {
  // Marca el componente como dinámico antes de que auth() use valores aleatorios.
  await connection();
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { role, name } = session.user;

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-6 border-r border-neutral-200 p-4">
      <div>
        <p className="font-semibold">{name ?? "Usuario"}</p>
        <p className="text-xs text-neutral-500">{role}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm hover:bg-neutral-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <form action={logoutAction}>
        <button
          type="submit"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100"
        >
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<aside className="w-56 shrink-0 border-r border-neutral-200" />}>
        <AdminSidebar />
      </Suspense>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
