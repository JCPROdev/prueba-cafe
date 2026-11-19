import { defineConfig, env } from "prisma/config";

try {
  process.loadEnvFile(".env.local");
} catch {
  // archivo opcional
}
try {
  process.loadEnvFile(".env");
} catch {
  // archivo opcional
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
