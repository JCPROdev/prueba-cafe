import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";
import type { BrandInfo } from "@/types/sanity";

export function Navbar({ brand }: { brand: BrandInfo | null }) {
  const name = brand?.name ?? "Cafetería";

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-stone-900">
          {brand?.logo && (
            <Image
              src={urlFor(brand.logo, 64)}
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-full object-cover"
            />
          )}
          {name}
        </Link>
        <div className="flex items-center gap-5 text-sm text-stone-700">
          <a href="#catalogo" className="hover:text-amber-700">
            Catálogo
          </a>
          <a href="#contacto" className="hover:text-amber-700">
            Contacto
          </a>
          <Link href="/login" className="text-stone-400 hover:text-stone-700">
            Acceso
          </Link>
        </div>
      </nav>
    </header>
  );
}
