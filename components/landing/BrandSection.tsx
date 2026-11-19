import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import type { BrandInfo } from "@/types/sanity";

export function BrandSection({ brand }: { brand: BrandInfo | null }) {
  if (!brand?.description) return null;

  return (
    <section id="nosotros" className="scroll-mt-16 bg-amber-50 px-6 py-20">
      <RevealOnScroll className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Sobre {brand.name}
        </h2>
        <p className="mt-6 whitespace-pre-line text-lg leading-8 text-stone-700">
          {brand.description}
        </p>
      </RevealOnScroll>
    </section>
  );
}
