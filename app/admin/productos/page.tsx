import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { getProducts } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { formatCurrency } from "@/lib/utils";

async function ProductsTable() {
  const products = await getProducts();

  if (products.length === 0) {
    return <p className="text-neutral-600">Aún no hay productos.</p>;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-neutral-200 text-neutral-500">
        <tr>
          <th className="py-2">Imagen</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Estado</th>
          <th className="text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p._id} className="border-b border-neutral-100">
            <td className="py-2">
              {p.image ? (
                <Image
                  src={urlFor(p.image, 96, 96)}
                  alt={p.name}
                  width={48}
                  height={48}
                  className="size-12 rounded object-cover"
                />
              ) : (
                <div className="size-12 rounded bg-neutral-100" />
              )}
            </td>
            <td className="font-medium">{p.name}</td>
            <td>{p.category?.title ?? "—"}</td>
            <td>{formatCurrency(p.price)}</td>
            <td>{p.available ? "Disponible" : "Agotado"}</td>
            <td>
              <div className="flex justify-end gap-2">
                <Link
                  href={`/admin/productos/${p._id}`}
                  className="rounded-md border border-neutral-300 px-3 py-1 hover:bg-neutral-100"
                >
                  Editar
                </Link>
                <DeleteProductButton id={p._id} name={p.name} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ProductsPage() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Nuevo producto
        </Link>
      </div>
      <Suspense fallback={<p className="text-neutral-500">Cargando…</p>}>
        <ProductsTable />
      </Suspense>
    </section>
  );
}
