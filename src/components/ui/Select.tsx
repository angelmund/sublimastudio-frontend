import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export default function Select({
  invalid,
  className = '',
  children,
  ...rest
}: SelectProps) {
  return (
    <select
      className={`
        w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-900
        shadow-sm transition-colors
        focus:outline-none focus:ring-2
        ${
          invalid
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-ink-200 focus:border-flame-500 focus:ring-flame-500/20'
        }
        disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400
        ${className}
      `}
      {...rest}
    >
      {children}
    </select>
  );
}