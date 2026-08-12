import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronRight,
  Check,
  X,
  ArrowLeft,
  Ruler,
  Layers,
  Tag,
  ShoppingBag,
} from 'lucide-react';
import { getProductoBySlug, getProductosByCategoria } from '@/lib/api';
import type { ProductoConCategoria } from '@/types/catalogo';
import TarjetaProducto from '@/components/TarjetaProducto';
import { Cargando, ErrorEstado } from '@/components/Estados';

function formatearPrecio(n: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
}

export default function ArticuloDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const [producto, setProducto] = useState<ProductoConCategoria | null>(null);
  const [relacionados, setRelacionados] = useState<ProductoConCategoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let activo = true;
    (async () => {
      try {
        setCargando(true);
        setError(null);
        setProducto(null);
        setRelacionados([]);
        const p = await getProductoBySlug(slug);
        if (!activo) return;
        if (!p) {
          setError('Producto no encontrado.');
          return;
        }
        setProducto(p);
        if (p.categoria?.slug) {
          const rels = await getProductosByCategoria(p.categoria.slug);
          if (!activo) return;
          setRelacionados(rels.filter((r) => r.id !== p.id).slice(0, 4));
        }
      } catch (e) {
        if (!activo) return;
        setError(e instanceof Error ? e.message : 'No se pudo cargar el producto.');
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, [slug]);

  if (cargando) {
    return (
      <div className="container-page py-16">
        <Cargando />
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="container-page py-16">
        <ErrorEstado mensaje={error ?? 'Producto no encontrado.'} />
        <div className="mt-6 text-center">
          <Link to="/articulos" className="btn-secundario">
            <ArrowLeft className="h-4 w-4" /> Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const enOferta = producto.precio_oferta != null && producto.precio_oferta < producto.precio;
  const precioFinal = producto.precio_oferta ?? producto.precio;

  return (
    <div className="container-page py-10">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-ink-400">
        <Link to="/" className="hover:text-flame-600">Inicio</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/articulos" className="hover:text-flame-600">Artículos</Link>
        {producto.categoria && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link
              to={`/articulos?categoria=${producto.categoria.slug}`}
              className="hover:text-flame-600"
            >
              {producto.categoria.nombre}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-ink-700">{producto.nombre}</span>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Imagen */}
        <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-ink-50 shadow-sm">
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-ink-300">
              Sin imagen
            </div>
          )}
          {enOferta && (
            <span className="absolute left-4 top-4 rounded-full bg-flame-600 px-3 py-1 text-sm font-semibold text-white shadow-md">
              Oferta
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {producto.categoria && (
            <Link
              to={`/articulos?categoria=${producto.categoria.slug}`}
              className="text-sm font-semibold uppercase tracking-wide text-flame-600 hover:text-flame-700"
            >
              {producto.categoria.nombre}
            </Link>
          )}
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{producto.nombre}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-ink-900">{formatearPrecio(precioFinal)}</span>
            {enOferta && (
              <span className="text-lg text-ink-400 line-through">{formatearPrecio(producto.precio)}</span>
            )}
          </div>

          <div className="mt-4">
            {producto.disponible ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-100 px-3 py-1 text-sm font-semibold text-success-700">
                <Check className="h-4 w-4" /> Disponible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1 text-sm font-semibold text-ink-600">
                <X className="h-4 w-4" /> Agotado
              </span>
            )}
          </div>

          {producto.descripcion && (
            <p className="mt-6 leading-relaxed text-ink-600">{producto.descripcion}</p>
          )}

          {/* Atributos dinámicos de Django */}
          {producto.atributos && producto.atributos.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {producto.atributos.map((at) => (
                <span
                  key={at.id}
                  className="rounded-lg border border-ink-200 bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700"
                >
                  {at.atributo_nombre}: {at.valor}
                </span>
              ))}
            </div>
          )}

          {/* Especificaciones */}
          <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {producto.material && (
              <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-3">
                <Layers className="h-5 w-5 flex-none text-flame-600" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Material</dt>
                  <dd className="text-sm font-semibold text-ink-900">{producto.material}</dd>
                </div>
              </div>
            )}
            {producto.medidas && (
              <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-3">
                <Ruler className="h-5 w-5 flex-none text-flame-600" />
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Medidas</dt>
                  <dd className="text-sm font-semibold text-ink-900">{producto.medidas}</dd>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-3">
              <Tag className="h-5 w-5 flex-none text-flame-600" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Referencia</dt>
                <dd className="text-sm font-semibold text-ink-900">
                  #{producto.slug.slice(0, 8).toUpperCase()}
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/contacto" className="btn-primary">
              <ShoppingBag className="h-4 w-4" /> Solicitar este artículo
            </Link>
            <Link to="/articulos" className="btn-secundario">
              <ArrowLeft className="h-4 w-4" /> Volver al catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold">Artículos relacionados</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {relacionados.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}