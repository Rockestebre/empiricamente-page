'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, MapPin, MessageCircle, ShieldCheck, Truck, Clock, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  priceFrom?: boolean;
}

const CATEGORIES = [
  { name: 'Guitarras', slug: 'guitarras', image: '/guitarra-acustica.jpeg' },
  { name: 'Cajas Vallenatas', slug: 'cajas-vallenatas', image: '/Caja sola.png' },
  { name: 'Percusión', slug: 'percusion', image: '/Guacha sola.png' },
];

const WHATSAPP = 'https://wa.me/573244167426';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data?.slice(0, 6) || []))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/uploads/logo.png" alt="Empíricamente Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">Empíricamente</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link href="/tienda" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">Tienda</Link>
            <a
              href={WHATSAPP}
              target="_blank"
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center gap-1.5 transition text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <Link
              href="/auth/login"
              className="text-xs text-gray-400 hover:text-blue-600 transition p-2"
              title="Panel Admin"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-5"
          >
            <div className="flex justify-center mb-2">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <Image src="/uploads/logo.png" alt="Empíricamente" fill className="object-contain drop-shadow-2xl" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Empíricamente
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Instrumentos para la música costeña y más, desde Santa Marta para toda Colombia.
            </p>
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-full text-sm sm:text-base">
                <Zap className="w-5 h-5" />
                Entrega en menos de 2 horas en Santa Marta
              </div>
              <p className="text-sm text-blue-200">¿Estás en otra ciudad? También hacemos envíos nacionales.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/tienda">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold w-full sm:w-auto">
                  Ver Productos <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href={WHATSAPP} target="_blank">
                <Button size="lg" className="bg-white/20 text-white border border-white/40 hover:bg-white/30 w-full sm:w-auto">
                  <MessageCircle className="w-4 h-4 mr-2" /> Escríbenos
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Clock className="w-7 h-7 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Entrega el mismo día</h4>
                <p className="text-xs text-gray-600">En menos de 2 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Truck className="w-7 h-7 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Sin fletes en Santa Marta</h4>
                <p className="text-xs text-gray-600">Envíos nacionales al resto del país</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Headphones className="w-7 h-7 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Asesoría por WhatsApp</h4>
                <p className="text-xs text-gray-600">Te ayudamos a elegir</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category shortcuts */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Explora por categoría</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link href={`/tienda?cat=${cat.slug}`} className="group block relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-gray-100 aspect-[4/3]">
                  <Image src={cat.image} alt={cat.name} fill className="object-contain p-6 group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center justify-between text-white">
                      <span className="font-bold text-lg">{cat.name}</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Nuestros Productos</h2>
            <Link href="/tienda" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative w-full bg-gray-50 aspect-square">
                  {product.imageUrl && (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm truncate">{product.name}</h3>
                  <p className="text-xl font-bold text-blue-600 mb-3">
                    {product.priceFrom && <span className="text-sm font-medium text-gray-500">Desde </span>}
                    ${product.price?.toLocaleString()} COP
                  </p>
                  <Link href="/tienda">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">Ver en Tienda</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA band */}
      <section className="bg-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">¿No sabes cuál elegir?</h2>
          <p className="text-green-50 max-w-xl mx-auto">Escríbenos por WhatsApp y te asesoramos al instante. Entrega el mismo día en Santa Marta y envíos nacionales a toda Colombia.</p>
          <a href={WHATSAPP} target="_blank" className="inline-block">
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-bold">
              <MessageCircle className="w-5 h-5 mr-2" /> Escríbenos por WhatsApp
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image src="/uploads/logo.png" alt="Logo Empíricamente" fill className="object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Empíricamente</h3>
                <p className="text-gray-400 text-sm">Instrumentos musicales • Santa Marta • Envíos a toda Colombia</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <a href={WHATSAPP} target="_blank" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> 324-416-7426
              </a>
              <a href="https://instagram.com/empiricamente_sm" target="_blank" className="text-gray-400 hover:text-white transition text-sm">
                @empiricamente_sm
              </a>
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Santa Marta, Colombia
              </span>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
            <p>&copy; 2026 Empíricamente. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
