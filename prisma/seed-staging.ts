import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding staging database...");

  // Crear usuario admin para staging
  const hashedPassword = await bcrypt.hash("staging123", 10);

  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email: "admin@staging.com" },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: "admin@staging.com",
        password: hashedPassword,
        name: "Admin Staging",
      },
    });
    console.log("✅ Created admin user: admin@staging.com / staging123");
  } else {
    console.log("ℹ️ Admin user already exists");
  }

  console.log("✅ Staging database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
