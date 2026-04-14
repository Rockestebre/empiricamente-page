'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CartProvider, useCart } from '@/components/commerce/cart-context';
import { CartSummary } from '@/components/commerce/cart-summary';
import { ProductGrid } from './_components/product-grid';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryId: string;
  category?: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

function TiendaContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [loading, setLoading] = useState(true);
  const { cart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data || []);
        
        const cats = new Map();
        data?.forEach((p: Product) => {
          if (p.category) {
            cats.set(p.category.id, p.category);
          }
        });
        setCategories(Array.from(cats.values()));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = selectedCategory === 'todos'
    ? products
    : products.filter(p => p.category?.id === selectedCategory);

  const isAllSelected = selectedCategory === 'todos';
  const selectedCat = categories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:text-blue-600">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Volver</span>
          </Link>
          <h1 className="text-2xl font-bold text-blue-600">Tienda Empiricamente</h1>
          <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-600">{cart.length}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-1"
          >
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Categorias</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('todos')}
                  className={isAllSelected ? 'w-full text-left px-4 py-2 rounded-lg bg-blue-600 text-white transition' : 'w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition'}
                >
                  Todos
                </button>
                {categories.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={isSelected ? 'w-full text-left px-4 py-2 rounded-lg bg-blue-600 text-white transition' : 'w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition'}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Carrito</h2>
                <CartSummary />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-3"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isAllSelected ? 'Todos los Productos' : selectedCat?.name}
              </h2>
              <p className="text-gray-600">Se encontraron {filteredProducts.length} producto(s)</p>
            </div>

            <ProductGrid products={filteredProducts} loading={loading} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function TiendaPage() {
  return (
    <CartProvider>
      <TiendaContent />
    </CartProvider>
  );
}
