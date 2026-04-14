export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return !!(session?.user && (session.user as any).isAdmin);
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Admin products GET error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, description, price, stock, imageUrl, categoryId } = body;

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price),
        stock: parseInt(stock) || 0,
        imageUrl: imageUrl || '',
        categoryId
      },
      include: { category: true }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Admin products POST error:', error);
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}
