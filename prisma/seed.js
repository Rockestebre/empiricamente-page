const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Plantando la base de datos con el catálogo de Empíricamente...');

  const productos = [
    { name: 'Guitarra Acústica (Luthería)', price: 195000, imageUrl: '/guitarra.jpg' },
    { name: 'Caja Vallenata (Acrílico)', price: 175000, imageUrl: '/caja.jpg' },
    { name: 'Guacharaca (Acero Inoxidable)', price: 55000, imageUrl: '/guacharaca.jpg' },
    { name: 'Combo Vallenato Puro', price: 205000, imageUrl: '/combo-vallenato.jpg' },
    { name: 'Combo Parranda Empírica', price: 400000, imageUrl: '/combo-full.jpg' }
  ];

  for (const prod of productos) {
    await prisma.product.create({
      data: prod,
    });
  }

  console.log('✅ ¡Catálogo subido con éxito!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });