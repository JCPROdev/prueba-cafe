import "server-only";
import { createClient } from "next-sanity";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

const projectId = requireEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");
const dataset = requireEnv("NEXT_PUBLIC_SANITY_DATASET");
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

/**
 * Cliente de lectura sin CDN (sin token). El CDN de Sanity puede devolver datos
 * anteriores a una escritura durante varios minutos, lo que dejaba productos
 * obsoletos tanto en el panel como en la landing (cacheada con "use cache").
 * La caché de Next.js ya gestiona el rendimiento y se invalida con updateTag.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

/** Cliente privado de escritura. Solo usar desde Server Actions. */
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: requireEnv("SANITY_API_WRITE_TOKEN"),
});
