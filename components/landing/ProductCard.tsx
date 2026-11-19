import Image from "next/image";
import { Coffee } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/sanity";

export function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const { name, description, price, image, available } = product;

  return (
    <article
      data-stagger-item
      className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
    >
      <div className="relative aspect-[4/3] bg-stone-100">
        {image ? (
          <Image
            src={urlFor(image, 640, 480)}
            alt={image.alt ?? name}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={cn("object-cover", !available && "grayscale")}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-stone-300">
            <Coffee className="size-10" aria-hidden />
          </div>
        )}
        {!available && (
          <span className="absolute left-3 top-3 rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white">
            Agotado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-stone-900">{name}</h3>
          <span className="shrink-0 font-semibold text-amber-700">{formatCurrency(price)}</span>
        </div>
        <p className="line-clamp-2 text-sm text-stone-600">{description}</p>
      </div>
    </article>
  );
}
