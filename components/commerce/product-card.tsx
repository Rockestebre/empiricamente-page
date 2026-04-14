'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './cart-context';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export function ProductCard({ id, name, price, imageUrl, stock }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (stock > 0) {
      addToCart({ id, name, price, imageUrl });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="relative w-full bg-gray-100 aspect-square">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain p-4"
            priority={false}
          />
        )}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Agotado</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm truncate text-gray-900">{name}</h3>
        <p className="text-xl font-bold text-blue-600 mt-2">${price?.toLocaleString() || 0} COP</p>
        <p className="text-xs text-gray-600 mt-1">{stock} disponibles</p>
        <Button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </div>
    </motion.div>
  );
}