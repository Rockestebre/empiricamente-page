import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Container } from '@/components/layouts/container';
import { Section } from '@/components/layouts/section';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Store, Clock, MapPin, Video } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Clases de música | Empíricamente',
  description:
    'Aprende acordeón, caja vallenata, guitarra, bajo, piano, batería o canto. Tres clases gratis por instrumento, desde Santa Marta para donde estés.',
};

/* ------------------------------------------------------------------
   CONFIGURACIÓN
   Cambia REGISTRO_ACTIVO a true cuando exista /clases/registro.
   Mientras esté en false, los botones llevan a WhatsApp y no
   queda ningún enlace roto en la página.
------------------------------------------------------------------ */
const REGISTRO_ACTIVO = false;

const WHATSAPP = 'https://wa.me/573244167426';
const wa = (mensaje: string) => `${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

const empezarHref = REGISTRO_ACTIVO
  ? '/clases/registro'
  : wa('Hola, quiero las 3 clases gratis');

const DISCIPLINAS = [
  {
    slug: 'acordeon',
    nombre: 'Acordeón',
    familia: 'Fuelle',
    logro: 'Tu primer paseo vallenato, de principio a fin.',
  },
  {
    slug: 'caja-vallenata',
    nombre: 'Caja vallenata',
    familia: 'Percusión',
    logro: 'El golpe base del paseo y del merengue.',
  },
  {
    slug: 'guitarra',
    nombre: 'Guitarra',
    familia: 'Cuerdas',
    logro: 'Cuatro acordes y tu primera canción completa.',
  },
  {
    slug: 'bajo',
    nombre: 'Bajo',
    familia: 'Cuerdas',
    logro: 'Marcar el bajo de una canción de verdad.',
  },
  {
    slug: 'piano',
    nombre: 'Piano',
    familia: 'Teclado',
    logro: 'Acompañar con las dos manos sin trabarte.',
  },
  {
    slug: 'bateria',
    nombre: 'Batería',
    familia: 'Percusión',
    logro: 'Tu primer ritmo sin perder el tiempo.',
  },
  {
    slug: 'tecnica-vocal',
    nombre: 'Técnica vocal',
    familia: 'Voz',
    logro: 'Afinar y sostener una nota sin forzar la garganta.',
  },
];

const PASOS = [
  {
    n: '01',
    titulo: 'Eliges tu instrumento',
    texto: 'Siete opciones. No necesitas saber nada antes de empezar.',
  },
  {
    n: '02',
    titulo: 'Ves las tres clases',
    texto: 'Diez minutos cada una. En la tercera ya estás tocando algo reconocible.',
  },
  {
    n: '03',
    titulo: 'Nos dices si quieres seguir',
    texto: 'Si te gustó, hablamos y armamos tu plan. Si no, te quedaste con las tres clases.',
  },
];

const MODALIDADES = [
  {
    icono: Video,
    titulo: 'Clases gratis en línea',
    precio: 'Gratis',
    texto:
      'Tres clases grabadas por instrumento, a tu ritmo y desde donde estés. Es por donde todo el mundo empieza.',
    accion: 'Empezar ahora',
    href: empezarHref,
    destacada: true,
  },
  {
    icono: MessageCircle,
    titulo: 'Clases personalizadas en línea',
    precio: 'Uno a uno',
    texto:
      'Videollamada con profesor, a tu horario y a tu ritmo. Funciona desde cualquier país.',
    accion: 'Consultar por WhatsApp',
    href: wa('Hola, me interesan las clases personalizadas en línea'),
    destacada: false,
  },
  {
    icono: MapPin,
    titulo: 'Clases presenciales en Santa Marta',
    precio: 'En la escuela',
    texto:
      'Individuales o en grupo, con el instrumento en las manos. Para niños, jóvenes y adultos.',
    accion: 'Consultar por WhatsApp',
    href: wa('Hola, me interesan las clases presenciales en Santa Marta'),
    destacada: false,
  },
];

export default function ClasesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ---------------------------------------------------------- HEADER */}
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
        <Container size="lg">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-3">
              <span className="relative block h-9 w-9 overflow-hidden rounded-full">
                <Image
                  src="/uploads/logo.png"
                  alt="Empíricamente"
                  fill
                  className="object-contain"
                />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                Empíricamente
              </span>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/tienda"
                className="flex items-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors duration-fast hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">Tienda</span>
              </Link>
              <Button asChild size="sm">
                <a href={empezarHref} target={REGISTRO_ACTIVO ? undefined : '_blank'} rel="noopener">
                  Empezar gratis
                </a>
              </Button>
            </nav>
          </div>
        </Container>
      </header>

      {/* ------------------------------------------------------------ HERO */}
      <section className="border-b bg-primary text-primary-foreground">
        <Container size="lg">
          <div className="max-w-3xl py-16 sm:py-20">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary">
              Escuela de música · Santa Marta, Colombia
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Aprende a tocar tocando.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-primary-foreground/80">
              Enseñamos empíricamente: sales tocando algo desde la primera clase, no
              después de tres meses de teoría. Elige tu instrumento y llévate tres
              clases gratis.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <a
                  href={empezarHref}
                  target={REGISTRO_ACTIVO ? undefined : '_blank'}
                  rel="noopener"
                >
                  Ver las clases gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <a href="#instrumentos">Elegir instrumento</a>
              </Button>
            </div>

            <p className="mt-6 flex items-center gap-2 font-mono text-xs text-primary-foreground/60">
              <Clock className="h-3.5 w-3.5" />
              3 clases · 10 minutos cada una · sin costo
            </p>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------- INSTRUMENTOS */}
      <Section id="instrumentos">
        <Container size="lg">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Elige tu instrumento
            </h2>
            <p className="mt-3 text-muted-foreground">
              Cada uno tiene tres clases gratis grabadas por un músico que lo toca en
              vivo. Puedes probar más de uno.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DISCIPLINAS.map((d) => (
              <li key={d.slug}>
                <a
                  href={
                    REGISTRO_ACTIVO
                      ? `/clases/registro?d=${d.slug}`
                      : wa(`Hola, quiero las 3 clases gratis de ${d.nombre}`)
                  }
                  target={REGISTRO_ACTIVO ? undefined : '_blank'}
                  rel="noopener"
                  className="group flex h-full flex-col justify-between rounded-lg border bg-card p-6 transition-colors duration-fast hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {d.familia}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-card-foreground">
                      {d.nombre}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {d.logro}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <span className="font-mono text-xs text-muted-foreground">
                      3 clases · 30 min
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                      Empezar
                      <ArrowRight className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-1" />
                    </span>
                  </div>
                </a>
              </li>
            ))}

            {/* Octava tarjeta: cierra la retícula y captura demanda que no listamos */}
            <li>
              <a
                href={wa('Hola, quiero clases de otro instrumento')}
                target="_blank"
                rel="noopener"
                className="flex h-full flex-col justify-center rounded-lg border border-dashed bg-muted/40 p-6 text-center transition-colors duration-fast hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <h3 className="font-display text-lg font-bold tracking-tight">
                  ¿Otro instrumento?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Escríbenos y te decimos si lo tenemos o cuándo lo abrimos.
                </p>
              </a>
            </li>
          </ul>
        </Container>
      </Section>

      {/* --------------------------------------------------- CÓMO FUNCIONA */}
      <Section className="border-y bg-muted/40">
        <Container size="lg">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Cómo funciona
          </h2>

          <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
            {PASOS.map((p) => (
              <li key={p.n} className="border-t-2 border-secondary pt-5">
                <span className="font-mono text-sm font-medium text-secondary">
                  {p.n}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold tracking-tight">
                  {p.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.texto}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ------------------------------------------------------ MODALIDADES */}
      <Section id="modalidades">
        <Container size="lg">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Formas de estudiar con nosotros
            </h2>
            <p className="mt-3 text-muted-foreground">
              Empieza por lo gratis. Si quieres ir más rápido, tenemos dos caminos más.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {MODALIDADES.map((m) => {
              const Icono = m.icono;
              return (
                <div
                  key={m.titulo}
                  className={`flex flex-col rounded-lg border bg-card p-6 ${
                    m.destacada ? 'border-primary shadow-md' : ''
                  }`}
                >
                  <Icono
                    className={`h-6 w-6 ${
                      m.destacada ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
                    {m.titulo}
                  </h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {m.precio}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {m.texto}
                  </p>

                  <Button
                    asChild
                    className="mt-6 w-full"
                    variant={m.destacada ? 'default' : 'outline'}
                  >
                    <a
                      href={m.href}
                      target={m.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener"
                    >
                      {m.accion}
                    </a>
                  </Button>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------- CIERRE */}
      <Section className="border-t bg-primary text-primary-foreground">
        <Container size="md">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              La primera clase es hoy
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              No necesitas comprar nada todavía ni saber leer música. Solo elegir qué
              quieres tocar.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8 font-semibold">
              <a
                href={empezarHref}
                target={REGISTRO_ACTIVO ? undefined : '_blank'}
                rel="noopener"
              >
                Empezar gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------- FOOTER */}
      <footer className="border-t py-10">
        <Container size="lg">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
            <p>Empíricamente · Santa Marta, Colombia</p>
            <div className="flex items-center gap-5">
              <Link
                href="/"
                className="transition-colors duration-fast hover:text-primary"
              >
                Inicio
              </Link>
              <Link
                href="/tienda"
                className="transition-colors duration-fast hover:text-primary"
              >
                Tienda
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener"
                className="transition-colors duration-fast hover:text-primary"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
