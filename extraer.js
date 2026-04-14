const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  console.log('📦 Extrayendo tus instrumentos de la base de datos...');
  const productos = await prisma.product.findMany({
    include: { category: true }
  });

  const dataParaSemilla = productos.map(p => ({
    name: p.name,
    price: p.price,
    description: p.description,
    imageUrl: p.imageUrl,
    categoryName: p.category.name,
    categorySlug: p.category.slug
  }));

  fs.writeFileSync('prisma/datos_tienda.json', JSON.stringify(dataParaSemilla, null, 2));
  console.log('✅ ¡Listo! Tus datos se guardaron en prisma/datos_tienda.json');
}

main().finally(() => prisma.$disconnect());