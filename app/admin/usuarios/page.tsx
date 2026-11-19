import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function UsersTable() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-neutral-200 text-neutral-500">
        <tr>
          <th className="py-2">Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Creado</th>
          <th className="text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="border-b border-neutral-100">
            <td className="py-2 font-medium">{u.name}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>{u.createdAt.toLocaleDateString("es-MX")}</td>
            <td>
              <div className="flex justify-end gap-2">
                <Link
                  href={`/admin/usuarios/${u.id}`}
                  className="rounded-md border border-neutral-300 px-3 py-1 hover:bg-neutral-100"
                >
                  Editar
                </Link>
                {u.id !== admin.id && <DeleteUserButton id={u.id} name={u.name} />}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function UsersPage() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        <Link
          href="/admin/usuarios/nuevo"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Nuevo usuario
        </Link>
      </div>
      <Suspense fallback={<p className="text-neutral-500">Cargando…</p>}>
        <UsersTable />
      </Suspense>
    </section>
  );
}
