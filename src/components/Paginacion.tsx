import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginacionProps {
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPage: (page: number) => void;
}

export default function Paginacion({
  page,
  totalPages,
  from,
  to,
  total,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onPage,
}: PaginacionProps) {
  if (totalPages <= 1) return null;

  /** Genera la lista de botones: 1 … 4 5 [6] 7 8 … 20 */
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-ink-100 px-6 py-4 sm:flex-row">
      <p className="text-xs text-ink-500">
        Mostrando <span className="font-semibold text-ink-700">{from}</span>–
        <span className="font-semibold text-ink-700">{to}</span> de{' '}
        <span className="font-semibold text-ink-700">{total}</span> registros
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-ink-200 px-3 text-xs font-semibold text-ink-700 transition-colors hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>

        {/* Botones numéricos (ocultos en móvil) */}
        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((p, i) =>
            p === '...' ? (
              <span
                key={`gap-${i}`}
                className="px-2 text-xs text-ink-400"
                aria-hidden="true"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPage(p)}
                aria-current={p === page ? 'page' : undefined}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                  p === page
                    ? 'bg-slate-900 text-white'
                    : 'text-ink-700 hover:bg-ink-100'
                }`}
              >
                {p}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-ink-200 px-3 text-xs font-semibold text-ink-700 transition-colors hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Helper: genera la secuencia con elipsis
   Ej: page=6, total=20 → [1, '...', 5, 6, 7, '...', 20]
   ============================================================ */
function getPageNumbers(
  current: number,
  total: number,
  siblings = 1,
): (number | '...')[] {
  const pages: (number | '...')[] = [];
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  // Caso simple: caben todos
  if (total <= 7) return range(1, total);

  const left = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);

  pages.push(1);
  if (left > 2) pages.push('...');
  pages.push(...range(left, right));
  if (right < total - 1) pages.push('...');
  pages.push(total);

  return pages;
}