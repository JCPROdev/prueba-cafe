import { Suspense } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/sanity/queries";

async function NewProductForm() {
  const categories = await getCategories();
  return <ProductForm categories={categories} />;
}

export default function NewProductPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nuevo producto</h1>
      <Suspense fallback={<p className="text-neutral-500">Cargando…</p>}>
        <NewProductForm />
      </Suspense>
    </section>
  );
}
