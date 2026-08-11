import { Loader2 } from 'lucide-react';

export function Cargando({ mensaje = 'Cargando…' }: { mensaje?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink-500">
      <Loader2 className="h-7 w-7 animate-spin text-flame-500" />
      <p className="text-sm">{mensaje}</p>
    </div>
  );
}

export function ErrorEstado({
  mensaje,
  onReintentar,
}: {
  mensaje: string;
  onReintentar?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-200 bg-red-50 py-16 px-6 text-center">
      <p className="text-base font-medium text-red-800">{mensaje}</p>
      {onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

export function Vacio({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-200 bg-ink-50 py-16 px-6 text-center">
      <p className="text-base font-medium text-ink-600">{mensaje}</p>
    </div>
  );
}