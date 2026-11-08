import { useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { CheckCircle, XCircle, X } from 'lucide-react';


function ToastItem({ toast, removeToast }: { toast: any; removeToast: (id: string | number) => void }) {
  useEffect(() => {
   
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 5000);

    
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-2xl transition-all animate-in zoom-in-95 ${
        toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
      }`}
    >
      {toast.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
      <p className="font-medium text-sm flex-1">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="opacity-70 transition-opacity hover:opacity-100 shrink-0 cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>

      {/* LA BARRITA DE TIEMPO (Progreso) */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-white/40"
        style={{
          animation: 'toast-progress 5s linear forwards',
        }}
      />
    </div>
  );
}

// Contenedor principal
export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <>
      {/* Definimos los Keyframes de CSS aquí para que funcione sin tocar tailwind.config */}
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      {/* 
        CENTRO PERFECTO DE LA PANTALLA: 
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
      */}
      <div className="fixed top-1/2 left-1/2 z-[9999] flex -translate-x-1/2 -translate-y-1/2 flex-col gap-2 pointer-events-none w-full max-w-sm px-4">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </div>
    </>
  );
}