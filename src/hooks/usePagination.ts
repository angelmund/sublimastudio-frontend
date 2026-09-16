import { useEffect, useMemo, useState } from 'react';

interface UsePaginationOptions {
  pageSize?: number;
  initialPage?: number;
  /** Cuando cambia este valor, vuelve a la página 1 (ej: búsqueda) */
  resetKey?: unknown;
}

export function usePagination<T>(
  items: T[],
  { pageSize = 5, initialPage = 1, resetKey }: UsePaginationOptions = {},
) {
  const [page, setPage] = useState(initialPage);

  // Resetear a página 1 cuando cambia la búsqueda/filtros
  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  const from = items.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, items.length);

  return {
    page: safePage,
    setPage,
    totalPages,
    pageItems,
    pageSize,
    from,
    to,
    total: items.length,
    canPrev: safePage > 1,
    canNext: safePage < totalPages,
    prev: () => setPage((p) => Math.max(1, p - 1)),
    next: () => setPage((p) => Math.min(totalPages, p + 1)),
  };
}