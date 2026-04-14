import { prisma } from '../lib/db';
import bcrypt from 'bcryptjs';

const PRODUCTS = [
  {
    name: 'Guitarra Acústica',
    description: 'Guitarra acústica de madera real con luthería artesanal de alta calidad. Sonido cálido y resonancia natural. Perfecta para aprender y tocar géneros locales como vallenato, cumbia y más.',
    price: 195000,
    stock: 5,
    imageUrl: '/uploads/guitarra-acustica.jpeg',
    category: 'Instrumentos'
  },
  {
    name: 'Caja Vallenata',
    description: 'Caja de vallenato de acrílico de primera calidad, inmune a la humedad y el salitre del clima costeño. Material ultra resistente que no se daña con la exposición continua a ambientes salinos y húmedos. Sonido potente y definido.',
    price: 175000,
    stock: 8,
    imageUrl: '/uploads/combo-caja-guacharaca.jpeg',
    category: 'Instrumentos'
  },
  {
    name: 'Guacharaca',
    description: 'Guacharaca de acero inoxidable, instrumento de percusión tradicional del vallenato. Sonido auténtico y duradero. Resistente a corrosión y óxido, ideal para el clima costeño.',
    price: 55000,
    stock: 12,
    imageUrl: '/uploads/combo-caja-guacharaca.jpeg',
    category: 'Instrumentos'
  },
  {
    name: 'Combo Vallenato Puro',
    description: 'Pack completo: Caja Vallenata de acrílico + Guacharaca de acero inoxidable. Todo lo que necesitas para tocar vallenato auténtico. ¡Ahorra $25.000 comprando el combo!',
    price: 205000,
    stock: 6,
    imageUrl: '/uploads/combo-caja-guacharaca.jpeg',
    category: 'Combos'
  },
  {
    name: 'Combo Parranda Empírica',
    description: 'Pack premium: Guitarra Acústica + Caja Vallenata + Guacharaca. La solución completa para armar tu parranda. ¡Ahorra $25.000 comprando el combo completo!',
    price: 400000,
    stock: 3,
    imageUrl: '/uploads/combo-parranda.jpeg',
    category: 'Combos'
  },
  {
    name: 'Cuerdas de Nylon para Guitarra Clásica',
    description: 'Set completo de cuerdas de nylon profesionales para guitarra clásica. Clear Nylon con entorchado de cobre plateado. Tensión normal, sonido brillante y duradero.',
    price: 18000,
    stock: 4,
    imageUrl: '/uploads/cuerdas-nylon-1.png',
    category: 'Accesorios'
  },
  {
    name: 'Cuerdas de Metal para Guitarra Acústica',
    description: 'Set completo de cuerdas de acero inoxidable para guitarra acústica. Núcleo de acero con recubrimiento anti-óxido y entorchado de aleación de cobre. Sonido brillante y duradero.',
    price: 22000,
    stock: 4,
    imageUrl: '/uploads/cuerdas-metal-1.png',
    category: 'Accesorios'
  },
  {
    name: 'Correa para Guitarra - Diseño Llamas',
    description: 'Correa/strap para guitarra con diseño de llamas rojas sobre fondo negro. Ajustable, cómoda y resistente. Ideal para guitarras acústicas y eléctricas.',
    price: 22000,
    stock: 1,
    imageUrl: '/uploads/correa-roja-llamas.avif',
    category: 'Accesorios'
  },
  {
    name: 'Correa Fender para Guitarra',
    description: 'Correa/strap Fender original para guitarra. Diseño clásico negro con logo Fender dorado. Ajustable, cómoda y de alta calidad. Compatible con todo tipo de guitarras.',
    price: 22000,
    stock: 1,
    imageUrl: '/uploads/correa-fender-amarilla.avif',
    category: 'Accesorios'
  },
  {
    name: 'Pack de Púas x3',
    description: 'Pack de 3 púas Meideal de diferentes espesores (0.4mm, 0.6mm, 1.8mm). Material resistente y duradero. Ideales para diferentes estilos de toque.',
    price: 9000,
    stock: 6,
    imageUrl: '/uploads/puas-pack.png',
    category: 'Accesorios'
  }
];

async function main() {
  console.log('Iniciando seed de la base de datos...');

  try {
    const categories = await Promise.all(
      ['Instrumentos', 'Combos', 'Accesorios'].map(name =>
        prisma.category.upsert({
          where: { slug: name.toLowerCase() },
          update: {},
          create: {
            name,
            slug: name.toLowerCase()
          }
        })
      )
    );

    console.log(`OK: ${categories.length} categorías creadas`);

    for (const product of PRODUCTS) {
      const category = categories.find(c => c.name === product.category);
      if (!category) continue;

      const productId = `prod_${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/, '')}`;
      await prisma.product.upsert({
        where: { id: productId },
        update: {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl,
          categoryId: category.id
        },
        create: {
          id: productId,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl,
          categoryId: category.id
        }
      });
    }

    console.log(`OK: ${PRODUCTS.length} productos creados`);

    const hashedPassword = await bcrypt.hash('johndoe123', 10);
    await prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        name: 'Test Admin',
        password: hashedPassword,
        isAdmin: true
      }
    });

    const additionalAdminPassword = await bcrypt.hash('Empiricamente2026', 10);
    await prisma.user.upsert({
      where: { email: 'admin@empiricamente.com' },
      update: {},
      create: {
        email: 'admin@empiricamente.com',
        name: 'Admin Empíricamente',
        password: additionalAdminPassword,
        isAdmin: true
      }
    });

    console.log('OK: Seed completado exitosamente');
  } catch (error) {
    console.error('Error durante seed:', error);
    process.exit(1);
  }
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
