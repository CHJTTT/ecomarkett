// prisma/seed.ts
import { PrismaClient } from '@prisma/client'; // Asegúrate que la ruta sea correcta

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- Crear Categorías ---
  const category1 = await prisma.category.upsert({
    where: { name: 'Frutas Orgánicas' },
    update: {},
    create: {
      name: 'Frutas Orgánicas',
      description: 'Las frutas más frescas y libres de químicos.',
    },
  });

  const category2 = await prisma.category.upsert({
    where: { name: 'Verduras Orgánicas' },
    update: {},
    create: {
      name: 'Verduras Orgánicas',
      description: 'Verduras de temporada cultivadas de forma sostenible.',
    },
  });

  const category3 = await prisma.category.upsert({
    where: { name: 'Despensa Orgánica' },
    update: {},
    create: {
      name: 'Despensa Orgánica',
      description: 'Granos, legumbres, aceites y más.',
    },
  });

  console.log(`Created categories:`, category1.name, category2.name, category3.name);


  // --- Crear Productos ---

  // Productos para Frutas Orgánicas (usando category1.id)
  await prisma.product.upsert({
    where: { sku: 'FRU-MAN-FUJI-01' },
    update: { published: true }, // También añade aquí si quieres que se publique si ya existe
    create: {
      name: 'Manzana Fuji Orgánica (Kg)',
      description: 'Manzanas Fuji crujientes y dulces, cultivadas orgánicamente.',
      price: 3.50,
      sku: 'FRU-MAN-FUJI-01',
      imageUrl: '/images/products/manzana_fuji.jpg',
      stock: 50,
      categoryId: category1.id,
      published: true, // <-- AÑADIDO
    },
  });

  await prisma.product.upsert({
    where: { sku: 'FRU-BAN-CAV-01' },
    update: { published: true }, // También añade aquí
    create: {
      name: 'Banana Cavendish Orgánica (Manojo)',
      description: 'Bananas dulces y cremosas, fuente natural de potasio.',
      price: 2.80,
      sku: 'FRU-BAN-CAV-01',
      imageUrl: '/images/products/banana.jpg',
      stock: 80,
      categoryId: category1.id,
      published: true, // <-- AÑADIDO
    },
  });

  // Productos para Verduras Orgánicas (usando category2.id)
   await prisma.product.upsert({
    where: { sku: 'VER-TOM-CHER-01' },
    update: { published: true }, // También añade aquí
    create: {
      name: 'Tomate Cherry Orgánico (Bandeja)',
      description: 'Pequeños tomates llenos de sabor, ideales para ensaladas.',
      price: 4.20,
      sku: 'VER-TOM-CHER-01',
      imageUrl: '/images/products/tomate_cherry.jpg',
      stock: 40,
      categoryId: category2.id,
      published: true, // <-- AÑADIDO
    },
  });

   await prisma.product.upsert({
    where: { sku: 'VER-ESP-FRE-01' },
    update: { published: true }, // También añade aquí
    create: {
      name: 'Espinaca Fresca Orgánica (Bolsa)',
      description: 'Hojas tiernas de espinaca, perfectas para cocinar o ensaladas.',
      price: 3.10,
      sku: 'VER-ESP-FRE-01',
      imageUrl: '/images/products/espinaca.jpg',
      stock: 35,
      categoryId: category2.id,
      published: true, // <-- AÑADIDO
    },
  });


  // Productos para Despensa Orgánica (usando category3.id)
   await prisma.product.upsert({
    where: { sku: 'DES-LEN-PAR-01' },
    update: { published: true }, // También añade aquí
    create: {
      name: 'Lenteja Pardina Orgánica (500g)',
      description: 'Lentejas nutritivas y versátiles, base de muchos platos.',
      price: 2.50,
      sku: 'DES-LEN-PAR-01',
      imageUrl: '/images/products/lentejas.jpg',
      stock: 100,
      categoryId: category3.id,
      published: true, // <-- AÑADIDO
    },
  });


  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });