import { StaggerProducts } from "@/components/animations/StaggerProducts";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ProductCard } from "@/components/landing/ProductCard";
import type { Category, Product } from "@/types/sanity";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  /** Carga sin lazy las primeras imágenes (usar cuando el catálogo queda sobre el pliegue). */
  eagerImages?: boolean;
}

const EAGER_COUNT = 4;

interface Group {
  key: string;
  title: string;
  products: Product[];
}

function groupProducts(products: Product[], categories: Category[]): Group[] {
  const groups: Group[] = categories
    .map((category) => ({
      key: category._id,
      title: category.title,
      products: products.filter((p) => p.category?._id === category._id),
    }))
    .filter((group) => group.products.length > 0);

  const known = new Set(categories.map((c) => c._id));
  const others = products.filter((p) => !p.category || !known.has(p.category._id));
  if (others.length > 0) {
    groups.push({
      key: "otros",
      title: groups.length > 0 ? "Otros" : "Nuestro menú",
      products: others,
    });
  }
  return groups;
}

export function ProductGrid({ products, categories, eagerImages = false }: ProductGridProps) {
  const groups = groupProducts(products, categories);

  return (
    <section id="catalogo" className="scroll-mt-16 bg-stone-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Nuestro catálogo
          </h2>
          <p className="mt-3 text-stone-600">Preparado con cariño, listo para disfrutar.</p>
        </RevealOnScroll>

        {groups.length === 0 ? (
          <p className="text-center text-stone-500">Pronto publicaremos nuestros productos.</p>
        ) : (
          <div className="space-y-14">
            {groups.map((group, groupIndex) => (
              <div key={group.key}>
                <h3 className="mb-6 border-b border-stone-200 pb-2 text-xl font-semibold text-stone-800">
                  {group.title}
                </h3>
                <StaggerProducts className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {group.products.map((product, index) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      eager={eagerImages && groupIndex === 0 && index < EAGER_COUNT}
                    />
                  ))}
                </StaggerProducts>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
