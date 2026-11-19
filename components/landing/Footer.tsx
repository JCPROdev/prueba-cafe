import { cacheLife } from "next/cache";
import type { BrandInfo } from "@/types/sanity";

export async function Footer({ brand }: { brand: BrandInfo | null }) {
  "use cache";
  cacheLife("days");

  return (
    <footer className="bg-stone-900 px-6 py-8 text-center text-sm text-stone-400">
      © {new Date().getFullYear()} {brand?.name ?? "Cafetería"}. Todos los derechos reservados.
    </footer>
  );
}
