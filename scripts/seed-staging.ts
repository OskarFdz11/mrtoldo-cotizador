import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding staging database...");

  // Limpiar datos existentes
  await prisma.quotation.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.billingDetails.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.address.deleteMany();

  console.log("🧹 Cleaned existing data");

  // Crear usuario admin para staging
  const hashedPassword = await bcrypt.hash("staging123", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@staging.com",
      password: hashedPassword,
      name: "Admin Staging",
    },
  });

  console.log("👤 Created admin user");

  // Crear categorías de prueba
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Toldos 3x3 m",
        description: "Toldos de 3x3 metros para testing",
      },
    }),
    prisma.category.create({
      data: {
        name: "Lonas Reforzadas",
        description: "Lonas reforzadas para testing",
      },
    }),
    prisma.category.create({
      data: {
        name: "Estructuras",
        description: "Estructuras metálicas para testing",
      },
    }),
  ]);

  console.log("📂 Created categories");

  // Crear productos de prueba
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Toldo 3x3 m Azul Sencillo",
        description:
          "Toldo de 3x3 metros en color azul, ideal para eventos y comercios. Estructura de aluminio resistente.",
        price: 1390.0,
        quantity: 25,
        brand: "MrToldo",
        image_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Lona Reforzada 4x6 m",
        description:
          "Lona reforzada de 4x6 metros, material impermeable de alta calidad.",
        price: 890.0,
        quantity: 15,
        brand: "MrToldo",
        image_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Estructura Metálica 3x3",
        description:
          "Estructura metálica galvanizada de 3x3 metros para toldos.",
        price: 2500.0,
        quantity: 8,
        brand: "MrToldo",
        image_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        categoryId: categories[2].id,
      },
    }),
  ]);

  console.log("🛍️ Created products");

  // Crear direcciones de prueba
  const addresses = await Promise.all([
    prisma.address.create({
      data: {
        street: "Av. Constitución 1234",
        outsideNumber: "1234",
        colony: "Centro",
        city: "Monterrey",
        cp: "64000",
      },
    }),
    prisma.address.create({
      data: {
        street: "Calle Morelos 567",
        outsideNumber: "567",
        colony: "San Pedro",
        city: "San Pedro Garza García",
        cp: "66230",
      },
    }),
  ]);

  // Crear clientes de prueba
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Carlos",
        lastname: "González",
        email: "juan.gonzalez@staging.com",
        company: "Eventos González",
        rfc: "GOXJ850101ABC",
        phone: BigInt("8112345678"),
      },
    }),
    prisma.customer.create({
      data: {
        name: "María Elena",
        lastname: "Martínez",
        email: "maria.martinez@staging.com",
        company: "Restaurante El Patio",
        rfc: "MARM750615XYZ",
        phone: BigInt("8187654321"),
      },
    }),
  ]);

  console.log("👥 Created customers");

  // Crear billing details de prueba
  const billingDetails = await Promise.all([
    prisma.billingDetails.create({
      data: {
        name: "Carlos",
        lastname: "Rodríguez",
        company: "MRTOLDO S.A. DE C.V.",
        rfc: "MRT180518HK0",
        phone: BigInt("8183351041"),
        email: "carlos@mrtoldo.com",
        cardNumber: "4152313412341234",
        clabe: "0112167050123456",
        checkAccount: "0112167050",
        address: {
          connect: {
            id: addresses[0].id,
          },
        },
      },
    }),
  ]);

  // Crear cotizaciones de prueba
  const quotations = await Promise.all([
    prisma.quotation.create({
      data: {
        subtotal: 4170.0,
        total: 4837.2,
        iva: true,
        notes: "Cotización de prueba para staging - Entrega en 5 días hábiles",
        date: new Date(),
        status: "PENDING",
        customerId: customers[0].id,
        billingDetailsId: billingDetails[0].id,
        products: {
          create: [
            {
              quantity: 3,
              price: 1390.0,
              productId: products[0].id,
            },
          ],
        },
      },
    }),
    prisma.quotation.create({
      data: {
        subtotal: 3390.0,
        total: 3932.4,
        iva: true,
        notes: "Cotización múltiple - productos variados",
        date: new Date(),
        status: "PENDING",
        customerId: customers[1].id,
        billingDetailsId: billingDetails[0].id,
        products: {
          create: [
            {
              quantity: 1,
              price: 2500.0,
              productId: products[2].id,
            },
            {
              quantity: 1,
              price: 890.0,
              productId: products[1].id,
            },
          ],
        },
      },
    }),
  ]);

  console.log("📋 Created quotations");

  console.log("✅ Staging database seeded successfully!");
  console.log("📊 Summary:");
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${products.length} products`);
  console.log(`   - ${customers.length} customers`);
  console.log(`   - ${quotations.length} quotations`);
  console.log("");
  console.log("🔑 Admin credentials:");
  console.log("   Email: admin@staging.com");
  console.log("   Password: staging123");
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
