import { ReactNode } from 'react';

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export default function Field({
  label,
  required,
  hint,
  error,
  children,
}: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600">
        {label}
        {required && <span className="ml-1 text-flame-600">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}