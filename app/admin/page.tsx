import Link from "next/link";

export default function AdminHomePage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Panel de administración</h1>
      <p className="text-neutral-600">Gestiona el catálogo de la cafetería.</p>
      <Link
        href="/admin/productos"
        className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
      >
        Ir a productos
      </Link>
    </section>
  );
}
