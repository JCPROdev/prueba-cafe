import type { Metadata } from "next";
import { BrandSection } from "@/components/landing/BrandSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProductGrid } from "@/components/landing/ProductGrid";
import { getCachedLandingData } from "@/lib/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getCachedLandingData();
  return {
    title: brand?.name ?? "Cafetería",
    description:
      brand?.tagline ?? brand?.description ?? "Catálogo, ubicación y contacto.",
  };
}

export default async function HomePage() {
  const { brand, products, categories } = await getCachedLandingData();

  return (
    <>
      <HeroSection brand={brand} />
      <ProductGrid
        products={products}
        categories={categories}
        eagerImages={!brand?.heroImage}
      />
      <BrandSection brand={brand} />
      <ContactSection brand={brand} />
    </>
  );
}
