import { useToast } from '@/context/ToastContext';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function ToastContainer() {
  // Consumimos el arreglo de alertas y la función para borrarlas
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg transition-all animate-in slide-in-from-bottom-5 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          <p className="font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}