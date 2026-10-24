import { Link } from 'react-router-dom';
import type { Producto } from '@/types/catalogo';

// Ajustado para aceptar números directamente (ya que nuestro normalizador devuelve floats)
function formatearPrecio(precio: string | number): string {
  const numero = typeof precio === 'string' ? parseFloat(precio) : precio;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(numero || 0);
}

export default function TarjetaProducto({ producto }: { producto: any }) {
  // Evaluamos de forma segura si el producto está activo (soporta 1, true, o la variable disponible)
  const estaDisponible = producto.activo === 1 || producto.activo === true || producto.disponible === true;

  return (
    <Link
      to={`/articulo/${producto.slug || producto.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-50">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-ink-300">
            Sin imagen disponible
          </div>
        )}
        
        {/* Renderizado condicional de las etiquetas */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {estaDisponible ? (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 shadow-sm border border-emerald-200">
              Disponible
            </span>
          ) : (
            <span className="rounded-full bg-ink-700 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
              Agotado
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {(producto.categoria?.nombre || producto.categoria_nombre) && (
          <span className="text-xs font-medium uppercase tracking-wide text-flame-600">
            {producto.categoria?.nombre || producto.categoria_nombre}
          </span>
        )}
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-ink-900 group-hover:text-flame-700">
          {producto.nombre}
        </h3>
        {producto.descripcion && (
          <p className="mt-1 line-clamp-2 text-sm text-ink-500">{producto.descripcion}</p>
        )}

        {/* Mostrar chips de atributos (Ej: Mágica, 11oz) */}
        {producto.atributos && producto.atributos.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {producto.atributos.map((at: any) => (
              <span
                key={at.id}
                className="rounded-md bg-ink-50 px-2 py-0.5 text-[11px] font-medium text-ink-600 border border-ink-100"
              >
                {at.atributo_nombre}: {at.valor}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="text-lg font-bold text-ink-900">
            {formatearPrecio(producto.precio_final || producto.precio || 0)}
          </span>
        </div>
      </div>
    </Link>
  );
}