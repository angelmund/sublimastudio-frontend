import { ReactNode } from 'react';
import { usePagination } from '@/hooks/usePagination';
import Paginacion from '@/components/Paginacion';
import { Cargando, ErrorEstado, Vacio } from '@/components/Estados';

export interface Column<T> {
  /** Identificador único de la columna */
  key: string;
  /** Texto del header */
  header: string;
  /** Cómo se renderiza la celda para una fila */
  render: (row: T) => ReactNode;
  /** Alineación del contenido */
  align?: 'left' | 'center' | 'right';
  /** Clases extra para <th> y <td> (ej: "w-40") */
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  /** Devuelve una key única por fila */
  getRowKey: (row: T) => string | number;

  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  /** Mensaje cuando no hay datos */
  emptyMessage?: string;

  /** Filas por página (default 10) */
  pageSize?: number;
  /** Resetea a página 1 cuando cambien estos valores (ej: búsqueda) */
  resetKey?: unknown;
}

export default function DataTable<T>({
  data,
  columns,
  getRowKey,
  loading = false,
  error = null,
  onRetry,
  emptyMessage = 'No hay registros para mostrar.',
  pageSize = 5,
  resetKey,
}: DataTableProps<T>) {
  const {
    page, setPage,
    totalPages, pageItems,
    from, to, total,
    canPrev, canNext, prev, next,
  } = usePagination(data, { pageSize, resetKey });

  if (loading) return <Cargando />;
  if (error) return <ErrorEstado mensaje={error} onReintentar={onRetry} />;
  if (data.length === 0) return <Vacio mensaje={emptyMessage} />;

  const alignClass = (a?: Column<T>['align']) =>
    a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left';

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm mr-7 ml-5">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-ink-700">
          <thead className="border-b border-ink-100 bg-ink-50/50 text-xs font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 ${alignClass(col.align)} ${col.className ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-ink-100">
            {pageItems.map((row) => (
              <tr
                key={getRowKey(row)}
                className="hover:bg-ink-50/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 ${alignClass(col.align)} ${col.className ?? ''}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginacion
        page={page}
        totalPages={totalPages}
        from={from}
        to={to}
        total={total}
        canPrev={canPrev}
        canNext={canNext}
        onPrev={prev}
        onNext={next}
        onPage={setPage}
      />
    </div>
  );
}