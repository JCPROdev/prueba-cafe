import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuditLogTable } from "@/components/admin/AuditLogTable";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import { auditFilterSchema } from "@/lib/validations";

const PAGE_SIZE = 100;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const selectClass = "rounded-md border border-neutral-300 px-3 py-2 text-sm";

async function AuditContent({ searchParams }: { searchParams: SearchParams }) {
  if (!(await requireAdmin())) redirect("/admin");

  const raw = await searchParams;
  const filters = auditFilterSchema.parse({
    entity: first(raw.entity) || undefined,
    action: first(raw.action) || undefined,
    userId: first(raw.userId) || undefined,
    from: first(raw.from) || undefined,
    to: first(raw.to) || undefined,
  });

  const where: Prisma.AuditLogWhereInput = {
    ...(filters.entity && { entity: filters.entity }),
    ...(filters.action && { action: filters.action }),
    ...(filters.userId && { userId: filters.userId }),
    ...((filters.from || filters.to) && {
      createdAt: {
        ...(filters.from && { gte: new Date(`${filters.from}T00:00:00`) }),
        ...(filters.to && { lte: new Date(`${filters.to}T23:59:59.999`) }),
      },
    }),
  };

  const [logs, users] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.user.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <>
      <form method="get" className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium">
          Usuario
          <select name="userId" defaultValue={filters.userId ?? ""} className={selectClass}>
            <option value="">Todos</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          Entidad
          <select name="entity" defaultValue={filters.entity ?? ""} className={selectClass}>
            <option value="">Todas</option>
            <option value="PRODUCT">PRODUCT</option>
            <option value="USER">USER</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          Acción
          <select name="action" defaultValue={filters.action ?? ""} className={selectClass}>
            <option value="">Todas</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="LOGIN">LOGIN</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          Desde
          <input type="date" name="from" defaultValue={filters.from} className={selectClass} />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          Hasta
          <input type="date" name="to" defaultValue={filters.to} className={selectClass} />
        </label>
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Filtrar
        </button>
        <Link
          href="/admin/auditoria"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
        >
          Limpiar
        </Link>
      </form>
      <AuditLogTable logs={logs} />
      {logs.length === PAGE_SIZE && (
        <p className="text-xs text-neutral-500">
          Mostrando los {PAGE_SIZE} registros más recientes; afina los filtros para ver más.
        </p>
      )}
    </>
  );
}

export default function AuditPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Auditoría</h1>
      <Suspense fallback={<p className="text-neutral-500">Cargando…</p>}>
        <AuditContent searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
