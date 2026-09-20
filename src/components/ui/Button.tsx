import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  loading?: boolean;
  children?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-flame-600 text-white hover:bg-flame-700 focus-visible:ring-flame-500',
  secondary: 'border border-ink-200 bg-white text-ink-700 hover:bg-ink-50 focus-visible:ring-ink-400',
  ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-900 focus-visible:ring-ink-400',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-xs gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center rounded-xl font-semibold
        transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        cursor-pointer
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}