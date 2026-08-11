import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Palette,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import {
  getCategoriasDestacadas,
  getProductosDestacados,
} from '@/lib/api';
import type { Categoria, ProductoConCategoria } from '@/types/catalogo';
import TarjetaProducto from '@/components/TarjetaProducto';
import { Cargando, ErrorEstado } from '@/components/Estados';

function formatearPrecio(n: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
}

export default function Inicio() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<ProductoConCategoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para el índice del carrusel Hero
  const [indiceHero, setIndiceHero] = useState(0);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        setCargando(true);
        setError(null);
        const [cats, prods] = await Promise.all([
          getCategoriasDestacadas(),
          getProductosDestacados(8),
        ]);
        if (!activo) return;
        setCategorias(cats);
        setProductos(prods);
      } catch (e) {
        if (!activo) return;
        setError(e instanceof Error ? e.message : 'No se pudo cargar el catálogo.');
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, []);

  // Timer para cambiar automáticamente las cards del Hero cada 4 segundos
  useEffect(() => {
    if (productos.length === 0) return;
    const interval = setInterval(() => {
      setIndiceHero((prev) => (prev + 1) % Math.min(productos.length, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, [productos]);

  const productosHero = productos.slice(0, 5); // Tomamos máximo 5 productos para el carrusel
  const productoActual = productosHero[indiceHero];

  const siguienteHero = () => {
    setIndiceHero((prev) => (prev + 1) % productosHero.length);
  };

  const anteriorHero = () => {
    setIndiceHero((prev) => (prev - 1 + productosHero.length) % productosHero.length);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-flame-600/30 blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-flame-500/20 blur-3xl" />
        </div>
        <div className="container-page relative grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-flame-400/30 bg-flame-500/10 px-3 py-1 text-xs font-semibold text-flame-300">
              <Sparkles className="h-3.5 w-3.5" />
              Calidad profesional para sublimación
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Tus ideas,
              <br />
              <span className="bg-gradient-to-r from-flame-400 to-flame-600 bg-clip-text text-transparent">
                impresas para siempre
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-300">
              Explora nuestro catálogo de artículos preparados para sublimación:
              tazas, textiles, promocionales y mucho más. Acabados duraderos con
              colores vivos que no se borran.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/articulos" className="btn-primary">
                Ver catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
              >
                Pedir cotización
              </Link>
            </div>
          </div>

          {/* Carrusel Dinámico de Productos de la BD */}
          <div className="relative animate-scale-in lg:justify-self-end w-full max-w-md mx-auto lg:max-w-none">
            {productoActual ? (
              <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-2xl transition-all duration-500">
                {/* Badge de Categoría y Precio */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-900">
                  {productoActual.imagen_url ? (
                    <img
                      key={productoActual.id}
                      src={productoActual.imagen_url}
                      alt={productoActual.nombre}
                      className="h-full w-full object-cover transition-all duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-medium text-ink-400">
                      Sin imagen
                    </div>
                  )}
                  {productoActual.categoria && (
                    <span className="absolute left-3 top-3 rounded-full bg-ink-950/80 backdrop-blur-md px-3 py-1 text-xs font-semibold text-flame-300 border border-white/10">
                      {productoActual.categoria.nombre}
                    </span>
                  )}
                  <span className="absolute right-3 bottom-3 rounded-xl bg-flame-600 px-3 py-1.5 text-sm font-bold text-white shadow-lg">
                    {formatearPrecio(productoActual.precio)}
                  </span>
                </div>

                {/* Info del Producto */}
                <div className="mt-4 flex items-center justify-between px-2">
                  <div>
                    <h3 className="text-lg font-bold text-white line-clamp-1">
                      {productoActual.nombre}
                    </h3>
                    <p className="text-xs text-ink-400 mt-0.5">Artículo destacado del catálogo</p>
                  </div>
                  <Link
                    to={`/articulo/${productoActual.slug}`}
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/10 text-white transition-all hover:bg-flame-600 hover:scale-105"
                    title="Ver detalle"
                  >
                    <ShoppingBag className="h-5 w-5" />
                  </Link>
                </div>

                {/* Flechas de Navegación del Carrusel */}
                {productosHero.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={anteriorHero}
                      className="absolute left-6 top-1/3 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-ink-950/70 text-white backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-flame-600"
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={siguienteHero}
                      className="absolute right-6 top-1/3 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-ink-950/70 text-white backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-flame-600"
                      aria-label="Siguiente"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Puntos Indicadores */}
                {productosHero.length > 1 && (
                  <div className="mt-4 flex justify-center gap-1.5">
                    {productosHero.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setIndiceHero(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === indiceHero ? 'w-6 bg-flame-500' : 'w-1.5 bg-white/20'
                        }`}
                        aria-label={`Ir al producto ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* State Placeholder si está cargando los productos */
              <div className="aspect-[4/3] w-full animate-pulse rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-ink-400">
                Cargando productos destacados...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="border-b border-ink-100 bg-white">
        <div className="container-page grid grid-cols-1 gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Palette, titulo: 'Colores vivos', texto: 'Impresión a todo color con acabado profesional.' },
            { icon: ShieldCheck, titulo: 'Alta durabilidad', texto: 'Diseños que resisten el lavado y el uso diario.' },
            { icon: Truck, titulo: 'Envíos rápidos', texto: 'Preparación ágil y envíos a toda la república.' },
            { icon: Clock, titulo: 'Pedidos express', texto: 'Servicio urgente disponible para fechas especiales.' },
          ].map((b) => (
            <div key={b.titulo} className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-flame-50 text-flame-600">
                <b.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink-900">{b.titulo}</h3>
                <p className="mt-0.5 text-sm text-ink-500">{b.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías destacadas */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-flame-600">
              Categorías
            </span>
            <h2 className="mt-1 text-3xl font-bold sm:text-4xl">Explora por tipo de producto</h2>
          </div>
          <Link
            to="/articulos"
            className="hidden items-center gap-1 text-sm font-semibold text-flame-700 hover:text-flame-800 sm:inline-flex"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {cargando ? (
          <Cargando />
        ) : error ? (
          <ErrorEstado mensaje={error} />
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categorias.map((c) => (
              <Link
                key={c.id}
                to={`/articulos?categoria=${c.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-900 shadow-sm transition-all hover:shadow-xl"
              >
                {c.imagen_url ? (
                  <img
                    src={c.imagen_url}
                    alt={c.nombre}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-950 p-4 text-center">
                    <span className="text-lg font-bold text-white/80">{c.nombre}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-lg font-bold text-white">{c.nombre}</h3>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-flame-300">
                    Ver productos <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Productos destacados */}
      <section className="bg-sand-50 py-16">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-flame-600">
                Destacados
              </span>
              <h2 className="mt-1 text-3xl font-bold sm:text-4xl">Lo más vendido</h2>
            </div>
            <Link
              to="/articulos"
              className="hidden items-center gap-1 text-sm font-semibold text-flame-700 hover:text-flame-800 sm:inline-flex"
            >
              Ver todo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {cargando ? (
            <Cargando />
          ) : error ? (
            <ErrorEstado mensaje={error} />
          ) : productos.length === 0 ? (
            <p className="py-12 text-center text-ink-500">Aún no hay productos destacados.</p>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {productos.map((p) => (
                <TarjetaProducto key={p.id} producto={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-flame-600 to-flame-700 px-6 py-14 text-center shadow-xl sm:px-12">
          <Flame className="absolute -right-8 -top-8 h-40 w-40 text-white/10" strokeWidth={1.5} />
          <h2 className="text-3xl font-bold text-white sm:text-4xl">¿Tienes una idea para personalizar?</h2>
          <p className="mx-auto mt-3 max-w-xl text-flame-100">
            Cuéntanos tu proyecto y te preparamos una cotización a medida a la brevedad.
          </p>
          <Link
            to="/contacto"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-flame-700 shadow-md transition-transform hover:scale-[1.03]"
          >
            Solicitar cotización <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}