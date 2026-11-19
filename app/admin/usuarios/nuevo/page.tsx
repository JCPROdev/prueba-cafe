import { Suspense } from "react";
import { redirect } from "next/navigation";
import { UserForm } from "@/components/admin/UserForm";
import { requireAdmin } from "@/lib/auth";

async function NewUserForm() {
  if (!(await requireAdmin())) redirect("/admin");
  return <UserForm />;
}

export default function NewUserPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nuevo usuario</h1>
      <Suspense fallback={<p className="text-neutral-500">Cargando…</p>}>
        <NewUserForm />
      </Suspense>
    </section>
  );
}
