import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronRight } from 'lucide-react';
import { getCategorias, getProductos } from '@/lib/api';
import type { Categoria, ProductoConCategoria } from '@/types/catalogo';
import TarjetaProducto from '@/components/TarjetaProducto';
import { Cargando, ErrorEstado, Vacio } from '@/components/Estados';

type Orden = 'recientes' | 'precio-asc' | 'precio-desc' | 'nombre';

export default function Articulos() {
  const [params, setParams] = useSearchParams();
  const categoriaActiva = params.get('categoria') ?? 'todas';

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<ProductoConCategoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState<Orden>('recientes');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        setCargando(true);
        setError(null);
        const [cats, prods] = await Promise.all([getCategorias(), getProductos()]);
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

  function setCategoria(slug: string) {
    const next = new URLSearchParams(params);
    if (slug === 'todas') next.delete('categoria');
    else next.set('categoria', slug);
    setParams(next, { replace: true });
    setFiltrosAbiertos(false);
  }

  const productosFiltrados = useMemo(() => {
    let lista = [...productos];
    if (categoriaActiva !== 'todas') {
      lista = lista.filter((p) => p.categoria?.slug === categoriaActiva);
    }
    if (soloDisponibles) {
      lista = lista.filter((p) => p.disponible);
    }
    const q = busqueda.trim().toLowerCase();
    if (q) {
      lista = lista.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          (p.descripcion?.toLowerCase().includes(q) ?? false) ||
          (p.material?.toLowerCase().includes(q) ?? false)
      );
    }
    switch (orden) {
      case 'precio-asc':
        lista.sort((a, b) => (a.precio_oferta ?? a.precio_base) - (b.precio_oferta ?? b.precio));
        break;
      case 'precio-desc':
        lista.sort((a, b) => (b.precio_oferta ?? b.precio) - (a.precio_oferta ?? a.precio));
        break;
      case 'nombre':
        lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      default:
        lista.sort((a, b) => b.id - a.id);
    }
    return lista;
  }, [productos, categoriaActiva, soloDisponibles, busqueda, orden]);

  const categoriaNombre =
    categoriaActiva === 'todas'
      ? 'Todos los artículos'
      : categorias.find((c) => c.slug === categoriaActiva)?.nombre ?? 'Artículos';

  const PanelFiltros = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
          Categorías
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => setCategoria('todas')}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                categoriaActiva === 'todas'
                  ? 'bg-flame-50 text-flame-700'
                  : 'text-ink-600 hover:bg-ink-50'
              }`}
            >
              Todas
            </button>
          </li>
          {categorias.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setCategoria(c.slug)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  categoriaActiva === c.slug
                    ? 'bg-flame-50 text-flame-700'
                    : 'text-ink-600 hover:bg-ink-50'
                }`}
              >
                {c.nombre}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
          Disponibilidad
        </h3>
        <label className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={soloDisponibles}
            onChange={(e) => setSoloDisponibles(e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-flame-600 focus:ring-flame-500"
          />
          Solo disponibles
        </label>
      </div>
    </div>
  );

  return (
    <div className="container-page py-10">
      {/* Breadcrumb + título */}
      <nav className="flex items-center gap-1 text-sm text-ink-400">
        <Link to="/" className="hover:text-flame-600">Inicio</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-ink-700">{categoriaNombre}</span>
      </nav>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{categoriaNombre}</h1>
      <p className="mt-2 max-w-2xl text-ink-500">
        Explora nuestra selección de artículos listos para personalizar con sublimación.
      </p>

      {/* Barra de herramientas */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, material…"
            className="campo-form pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltrosAbiertos(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filtros
          </button>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            className="campo-form w-auto"
            aria-label="Ordenar por"
          >
            <option value="recientes">Más recientes</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filtros escritorio */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            {PanelFiltros}
          </div>
        </aside>

        {/* Resultados */}
        <div>
          {cargando ? (
            <Cargando />
          ) : error ? (
            <ErrorEstado mensaje={error} />
          ) : productosFiltrados.length === 0 ? (
            <Vacio mensaje="No hay artículos que coincidan con tu búsqueda." />
          ) : (
            <>
              <p className="mb-4 text-sm text-ink-500">
                {productosFiltrados.length}{' '}
                {productosFiltrados.length === 1 ? 'artículo' : 'artículos'}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
                {productosFiltrados.map((p) => (
                  <TarjetaProducto key={p.id} producto={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Drawer de filtros móvil */}
      {filtrosAbiertos && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setFiltrosAbiertos(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white p-5 shadow-2xl animate-fade-up">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filtros</h2>
              <button
                type="button"
                onClick={() => setFiltrosAbiertos(false)}
                className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-50"
                aria-label="Cerrar filtros"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {PanelFiltros}
          </div>
        </div>
      )}
    </div>
  );
}