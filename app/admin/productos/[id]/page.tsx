import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories, getProductById } from "@/lib/sanity/queries";

async function EditProductForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);
  if (!product) notFound();
  return <ProductForm categories={categories} product={product} />;
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar producto</h1>
      <Suspense fallback={<p className="text-neutral-500">Cargando…</p>}>
        <EditProductForm params={params} />
      </Suspense>
    </section>
  );
}
