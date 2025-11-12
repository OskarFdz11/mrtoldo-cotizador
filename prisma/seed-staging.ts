import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding staging database...");

  // Crear usuario admin para staging
  const hashedPassword = await bcrypt.hash("Pol25896", 10);

  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email: "carlos@mrtoldo.com" },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: "carlos@mrtoldo.com",
        password: hashedPassword,
        name: "Carlos Fernández",
      },
    });
    console.log("✅ Created admin user: carlos@mrtoldo.com / Pol25896");
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
