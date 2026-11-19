import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
});

/** URL optimizada (formato automático) con ancho/alto opcionales. */
export function urlFor(
  source: SanityImageSource,
  width?: number,
  height?: number,
): string {
  let image = builder.image(source).auto("format").fit("max");
  if (width) image = image.width(width);
  if (height) image = image.height(height);
  return image.url();
}
