'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, MapPin, MessageCircle, ShieldCheck, Droplets, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data?.slice(0, 3) || []))
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
            <Link href="#about" className="text-sm text-gray-600 hover:text-blue-600 transition hidden sm:inline">Nosotros</Link>
            <Link href="/tienda" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">Tienda</Link>
            <a
              href="https://wa.me/573244167426"
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                <Image src="/uploads/logo.png" alt="Empíricamente" fill className="object-contain drop-shadow-2xl" />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Empíricamente
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Instrumentos musicales de calidad para la música local. Luthería artesanal, accesorios profesionales y envíos express en Santa Marta.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/tienda">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold w-full sm:w-auto">
                  Explorar Tienda <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="https://wa.me/573244167426" target="_blank">
                <Button size="lg" className="bg-white/20 text-white border border-white/40 hover:bg-white/30 w-full sm:w-auto">
                  <MessageCircle className="w-4 h-4 mr-2" /> Contáctanos
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Express Shipping Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-yellow-400"
      >
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 p-2 rounded-full">
                <Zap className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">⚡ Envíos Express en menos de 2 horas</h3>
                <p className="text-gray-800 text-sm">Compra ahora y recibe hoy mismo en Santa Marta</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Value Props */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm text-center"
            >
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-1">Entrega Rápida</h4>
              <p className="text-sm text-gray-600">Menos de 2 horas en Santa Marta</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm text-center"
            >
              <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-1">Inmunes al Clima</h4>
              <p className="text-sm text-gray-600">Resistentes a humedad y salitre</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm text-center"
            >
              <ShieldCheck className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-1">Luthería Artesanal</h4>
              <p className="text-sm text-gray-600">Calidad probada por músicos locales</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Quiénes Somos</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  En <span className="font-semibold text-blue-600">Empíricamente</span> creemos en el poder de la experiencia real. Cada instrumento en nuestra tienda ha sido cuidadosamente seleccionado y probado en condiciones reales, con las manos de músicos locales de Santa Marta.
                </p>
                <p>
                  Nuestros instrumentos no son solo productos: son herramientas para expresar la música que llevas dentro. Desde guitarras con luthería artesanal hasta cajas vallenatas de acrílico especialmente diseñadas para resistir el clima costeño.
                </p>
                <p>
                  Ofrecemos más que una venta: enseñanza personalizada, ajustes profesionales y una comunidad de músicos. Nuestra trayectoria compartida con nuestros clientes es lo que nos hace diferentes.
                </p>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="https://instagram.com/empiricamente_sm" target="_blank">
                  <Button variant="outline" className="w-full sm:w-auto">@empiricamente_sm</Button>
                </a>
                <a href="https://wa.me/573244167426" target="_blank">
                  <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                    <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                  </Button>
                </a>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden shadow-lg"
            >
              <Image
                src="/uploads/Collage 1.png"
                alt="Combo completo Empíricamente - Guitarra, Caja Vallenata y Guacharaca"
                fill
                className="object-contain p-4"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Productos Destacados</h2>
            <p className="text-gray-600">Instrumentos y accesorios de alta calidad para músicos</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
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
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-4">${product.price?.toLocaleString()} COP</p>
                  <Link href="/tienda">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver en Tienda</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/tienda">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Ver Todos los Productos <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
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
                <p className="text-gray-400 text-sm">Instrumentos musicales • Santa Marta</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <a href="https://wa.me/573244167426" target="_blank" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2">
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
