const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const productos = require('./datos_tienda.json');

async function main() {
  console.log('🌱 Sembrando la base de datos desde el archivo JSON...');

  for (const prod of productos) {
    await prisma.product.create({
      data: {
        name: prod.name,
        price: prod.price,
        imageUrl: prod.imageUrl,
        description: prod.description,
        category: {
          connectOrCreate: {
            where: { name: prod.categoryName },
            create: { name: prod.categoryName, slug: prod.categorySlug }
          }
        }
      },
    });
  }
  console.log('✅ ¡Base de datos sincronizada con éxito!');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());