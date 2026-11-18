import { defineQuery } from "next-sanity";
import { sanityClient } from "@/lib/sanity/client";
import type { BrandInfo, Product } from "@/types/sanity";

export const PRODUCT_TAG = "products";
export const BRAND_TAG = "brand";

const PRODUCT_PROJECTION = `{
  _id,
  name,
  "slug": slug.current,
  description,
  price,
  image,
  "category": category->{ _id, title, "slug": slug.current },
  "available": coalesce(available, true)
}`;

export const PRODUCTS_QUERY = defineQuery(
  `*[_type == "product"] | order(name asc) ${PRODUCT_PROJECTION}`,
);

export const PRODUCT_BY_ID_QUERY = defineQuery(
  `*[_type == "product" && _id == $id][0] ${PRODUCT_PROJECTION}`,
);

export const BRAND_QUERY = defineQuery(`*[_type == "brand"][0]{
  _id,
  name,
  tagline,
  description,
  logo,
  heroImage,
  address,
  phone,
  email,
  schedule
}`);

export function getProducts(): Promise<Product[]> {
  return sanityClient.fetch<Product[]>(
    PRODUCTS_QUERY,
    {},
    { next: { tags: [PRODUCT_TAG] } },
  );
}

export function getProductById(id: string): Promise<Product | null> {
  return sanityClient.fetch<Product | null>(
    PRODUCT_BY_ID_QUERY,
    { id },
    { next: { tags: [PRODUCT_TAG] } },
  );
}

export function getBrandInfo(): Promise<BrandInfo | null> {
  return sanityClient.fetch<BrandInfo | null>(
    BRAND_QUERY,
    {},
    { next: { tags: [BRAND_TAG] } },
  );
}
