import { FormEvent, ReactNode } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (e: FormEvent) => void;
  submitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl';
}

const widths = { md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' };

export default function FormModal({
  open,
  onClose,
  title,
  onSubmit,
  submitting = false,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  children,
  maxWidth = 'lg',
}: FormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink-950/50 p-4 backdrop-blur-sm">
      <div
        className={`my-8 w-full ${widths[maxWidth]} space-y-4 rounded-3xl bg-white p-6 shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-ink-100 pb-3">
          <h3 className="text-lg font-bold text-ink-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-ink-400 hover:bg-ink-50 cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {children}

          <div className="flex items-center gap-2 pt-3">
            <Button type="submit" loading={submitting} className="flex-1">
              {submitLabel}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              {cancelLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}