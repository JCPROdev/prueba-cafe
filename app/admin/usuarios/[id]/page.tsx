import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { UserForm } from "@/components/admin/UserForm";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function EditUserForm({ params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) redirect("/admin");
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) notFound();
  return <UserForm user={user} />;
}

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar usuario</h1>
      <Suspense fallback={<p className="text-neutral-500">Cargando…</p>}>
        <EditUserForm params={params} />
      </Suspense>
    </section>
  );
}
