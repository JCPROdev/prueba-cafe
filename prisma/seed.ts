import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { userCreateSchema } from "../lib/validations";

try {
  process.loadEnvFile(".env.local");
} catch {
  // opcional
}
try {
  process.loadEnvFile(".env");
} catch {
  // opcional
}

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL no está definida");

  const parsed = userCreateSchema.safeParse({
    name: process.env.SEED_ADMIN_NAME,
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
  });
  if (!parsed.success) {
    throw new Error(
      `SEED_ADMIN_* inválidas: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
    );
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const password = await bcrypt.hash(parsed.data.password, 12);
    const admin = await prisma.user.upsert({
      where: { email: parsed.data.email },
      update: { name: parsed.data.name, password, role: "ADMIN" },
      create: { name: parsed.data.name, email: parsed.data.email, password, role: "ADMIN" },
    });
    console.log(`ADMIN listo: ${admin.email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
