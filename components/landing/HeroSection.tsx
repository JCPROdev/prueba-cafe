import Image from "next/image";
import { HeroIntro } from "@/components/animations/HeroIntro";
import { urlFor } from "@/lib/sanity/image";
import type { BrandInfo } from "@/types/sanity";

export function HeroSection({ brand }: { brand: BrandInfo | null }) {
  const name = brand?.name ?? "Nuestra cafetería";

  return (
    <section className="relative isolate flex min-h-[85vh] items-center justify-center overflow-hidden bg-stone-900 px-6 py-24 text-center text-white">
      {brand?.heroImage && (
        <>
          <Image
            src={urlFor(brand.heroImage, 1920)}
            alt={brand.heroImage.alt ?? name}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-stone-950/60" aria-hidden />
        </>
      )}

      <HeroIntro className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        {brand?.logo && (
          <Image
            data-hero-item
            src={urlFor(brand.logo, 240)}
            alt={brand.logo.alt ?? `Logo de ${name}`}
            width={96}
            height={96}
            className="size-24 rounded-full object-cover"
          />
        )}
        <h1 data-hero-item className="text-4xl font-bold tracking-tight sm:text-6xl">
          {name}
        </h1>
        {brand?.tagline && (
          <p data-hero-item className="text-lg text-amber-200 sm:text-2xl">
            {brand.tagline}
          </p>
        )}
        <div data-hero-item className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            href="#catalogo"
            className="rounded-full bg-amber-500 px-6 py-3 font-medium text-stone-950 transition-colors hover:bg-amber-400"
          >
            Ver catálogo
          </a>
          <a
            href="#contacto"
            className="rounded-full border border-white/40 px-6 py-3 font-medium transition-colors hover:bg-white/10"
          >
            Visítanos
          </a>
        </div>
      </HeroIntro>
    </section>
  );
}
