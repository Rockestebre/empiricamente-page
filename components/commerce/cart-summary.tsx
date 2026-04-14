'use client';

import { useCart } from './cart-context';
import { Button } from '@/components/ui/button';
import { Trash2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function CartSummary() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();

  const handleWhatsApp = () => {
    const items = cart.map(item => `${item.name} (x${item.quantity})`).join('\n');
    const message = `Hola! Me interesa realizar el siguiente pedido:%0A%0A${encodeURIComponent(items)}%0A%0ATotal: $${total.toLocaleString()} COP`;
    window.open(`https://wa.me/573244167426?text=${message}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Tu carrito esta vacio</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {cart.map(item => (
        <motion.div
          key={item.id}
          layout
          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex-1">
            <p className="font-semibold text-sm">{item.name}</p>
            <p className="text-xs text-gray-600">${item.price?.toLocaleString() || 0} COP</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              -
            </button>
            <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-amber-500">${total?.toLocaleString() || 0} COP</span>
        </div>
        <Button
          onClick={handleWhatsApp}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Comprar por WhatsApp
        </Button>
        <Button
          onClick={clearCart}
          variant="outline"
          className="w-full"
          size="sm"
        >
          Vaciar carrito
        </Button>
      </div>
    </motion.div>
  );
}