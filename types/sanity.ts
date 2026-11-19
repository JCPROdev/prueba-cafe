import type { SanityImageSource } from "@sanity/image-url";

/** Imagen de Sanity con asset referenciado (tal como la devuelve GROQ). */
export type SanityImage = SanityImageSource & {
  alt?: string;
};

export interface Category {
  _id: string;
  title: string;
  slug: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: SanityImage | null;
  category: Category | null;
  available: boolean;
}

export interface BrandInfo {
  _id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  logo: SanityImage | null;
  heroImage: SanityImage | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  schedule: string | null;
}
