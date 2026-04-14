const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Inyectando tus credenciales de Empíricamente en la Mac...');

  // Las credenciales exactas que te dio la IA
  const email = 'admin@empiricamente.com';
  const passwordEnClaro = 'Empiricamente2026'; 

  // Encriptamos la contraseña para que el sistema de seguridad la acepte
  const hash = await bcrypt.hash(passwordEnClaro, 10);

  // Inyectamos el usuario en tu base de datos local (dev.db)
  await prisma.user.upsert({
    where: { email: email },
    update: { password: hash, isAdmin: true },
    create: { email: email, name: 'Admin Empíricamente', password: hash, isAdmin: true },
  });

  console.log('✅ ¡Llave maestra forjada con éxito en tu base de datos local!');
}

main().finally(() => prisma.$disconnect());