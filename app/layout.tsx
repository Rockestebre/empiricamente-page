export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Empiricamente - Instrumentos Musicales',
  description: 'Tienda de instrumentos musicales en Santa Marta. Guitarras, cajas vallenatas, accesorios con envios express en menos de 2 horas.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png'
  },
  openGraph: {
    title: 'Empiricamente - Instrumentos Musicales',
    description: 'Tienda de instrumentos musicales en Santa Marta. Guitarra, caja vallenata, guacharaca y accesorios.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Empiricamente'
      }
    ]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className="bg-white text-gray-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
