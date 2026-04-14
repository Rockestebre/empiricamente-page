'use client';

import { ProductCard } from '@/components/commerce/product-card';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  category?: { name: string };
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          {...product}
        />
      ))}
    </div>
  );
}
