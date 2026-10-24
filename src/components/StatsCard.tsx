import { ReactNode } from 'react';

/* ============================================================
   Tipos
   ============================================================ */

export type CardColor =
  | 'slate'
  | 'blue'
  | 'green'
  | 'indigo'
  | 'violet'
  | 'fuchsia'
  | 'rose'
  | 'orange'
  | 'amber'
  | 'lime'
  | 'emerald'
  | 'teal'
  | 'cyan';

interface StatsCardProps {
  label: string;
  value: number | string;
  color?: CardColor;
  icon?: ReactNode;
  hint?: string;
  loading?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

interface ColorStyle {
  /* Card */
  cardBg: string;
  cardBorder: string;
  hoverBorder: string;
  /* Icono */
  iconBg: string;
  iconRing: string;
  /* Textos */
  labelText: string;
  valueText: string;
  hintText: string;
  /* Acento */
  accent: string;
}

/* ============================================================
   Estilos por color (vivos: fondo tintado + borde del color)
   ============================================================ */

const colorStyles: Record<CardColor, ColorStyle> = {
  slate: {
    cardBg: 'bg-slate-50',
    cardBorder: 'border-slate-200',
    hoverBorder: 'hover:border-slate-400',
    iconBg: 'bg-slate-900 text-white',
    iconRing: 'group-hover:ring-slate-200',
    labelText: 'text-slate-600',
    valueText: 'text-slate-900',
    hintText: 'text-slate-500',
    accent: 'bg-slate-900',
  },
  blue: {
    cardBg: 'bg-blue-50',
    cardBorder: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
    iconBg: 'bg-blue-500 text-white',
    iconRing: 'group-hover:ring-blue-200',
    labelText: 'text-blue-700',
    valueText: 'text-blue-900',
    hintText: 'text-blue-600',
    accent: 'bg-blue-500',
  },
  green: {
    cardBg: 'bg-green-50',
    cardBorder: 'border-green-200',
    hoverBorder: 'hover:border-green-400',
    iconBg: 'bg-green-500 text-white',
    iconRing: 'group-hover:ring-green-200',
    labelText: 'text-green-700',
    valueText: 'text-green-900',
    hintText: 'text-green-600',
    accent: 'bg-green-500',
  },
  indigo: {
    cardBg: 'bg-indigo-50',
    cardBorder: 'border-indigo-200',
    hoverBorder: 'hover:border-indigo-400',
    iconBg: 'bg-indigo-500 text-white',
    iconRing: 'group-hover:ring-indigo-200',
    labelText: 'text-indigo-700',
    valueText: 'text-indigo-900',
    hintText: 'text-indigo-600',
    accent: 'bg-indigo-500',
  },
  violet: {
    cardBg: 'bg-violet-50',
    cardBorder: 'border-violet-200',
    hoverBorder: 'hover:border-violet-400',
    iconBg: 'bg-violet-500 text-white',
    iconRing: 'group-hover:ring-violet-200',
    labelText: 'text-violet-700',
    valueText: 'text-violet-900',
    hintText: 'text-violet-600',
    accent: 'bg-violet-500',
  },
  fuchsia: {
    cardBg: 'bg-fuchsia-50',
    cardBorder: 'border-fuchsia-200',
    hoverBorder: 'hover:border-fuchsia-400',
    iconBg: 'bg-fuchsia-500 text-white',
    iconRing: 'group-hover:ring-fuchsia-200',
    labelText: 'text-fuchsia-700',
    valueText: 'text-fuchsia-900',
    hintText: 'text-fuchsia-600',
    accent: 'bg-fuchsia-500',
  },
  rose: {
    cardBg: 'bg-rose-50',
    cardBorder: 'border-rose-200',
    hoverBorder: 'hover:border-rose-400',
    iconBg: 'bg-rose-500 text-white',
    iconRing: 'group-hover:ring-rose-200',
    labelText: 'text-rose-700',
    valueText: 'text-rose-900',
    hintText: 'text-rose-600',
    accent: 'bg-rose-500',
  },
  orange: {
    cardBg: 'bg-orange-50',
    cardBorder: 'border-orange-200',
    hoverBorder: 'hover:border-orange-400',
    iconBg: 'bg-orange-500 text-white',
    iconRing: 'group-hover:ring-orange-200',
    labelText: 'text-orange-700',
    valueText: 'text-orange-900',
    hintText: 'text-orange-600',
    accent: 'bg-orange-500',
  },
  amber: {
    cardBg: 'bg-amber-50',
    cardBorder: 'border-amber-200',
    hoverBorder: 'hover:border-amber-400',
    iconBg: 'bg-amber-500 text-white',
    iconRing: 'group-hover:ring-amber-200',
    labelText: 'text-amber-700',
    valueText: 'text-amber-900',
    hintText: 'text-amber-600',
    accent: 'bg-amber-500',
  },
  lime: {
    cardBg: 'bg-lime-50',
    cardBorder: 'border-lime-200',
    hoverBorder: 'hover:border-lime-400',
    iconBg: 'bg-lime-500 text-white',
    iconRing: 'group-hover:ring-lime-200',
    labelText: 'text-lime-700',
    valueText: 'text-lime-900',
    hintText: 'text-lime-600',
    accent: 'bg-lime-500',
  },
  emerald: {
    cardBg: 'bg-emerald-50',
    cardBorder: 'border-emerald-200',
    hoverBorder: 'hover:border-emerald-400',
    iconBg: 'bg-emerald-500 text-white',
    iconRing: 'group-hover:ring-emerald-200',
    labelText: 'text-emerald-700',
    valueText: 'text-emerald-900',
    hintText: 'text-emerald-600',
    accent: 'bg-emerald-500',
  },
  teal: {
    cardBg: 'bg-teal-50',
    cardBorder: 'border-teal-200',
    hoverBorder: 'hover:border-teal-400',
    iconBg: 'bg-teal-500 text-white',
    iconRing: 'group-hover:ring-teal-200',
    labelText: 'text-teal-700',
    valueText: 'text-teal-900',
    hintText: 'text-teal-600',
    accent: 'bg-teal-500',
  },
  cyan: {
    cardBg: 'bg-cyan-50',
    cardBorder: 'border-cyan-200',
    hoverBorder: 'hover:border-cyan-400',
    iconBg: 'bg-cyan-500 text-white',
    iconRing: 'group-hover:ring-cyan-200',
    labelText: 'text-cyan-700',
    valueText: 'text-cyan-900',
    hintText: 'text-cyan-600',
    accent: 'bg-cyan-500',
  },
};

/* ============================================================
   Skeleton interno
   ============================================================ */

function SkeletonCard({ color }: { color: CardColor }) {
  const s = colorStyles[color];
  return (
    <div
      className={`animate-pulse rounded-2xl border p-6 shadow-sm ${s.cardBorder} ${s.cardBg}`}
    >
      <div className="flex items-start justify-between">
        <div className="h-3 w-24 rounded bg-white/70" />
        <div className="h-10 w-10 rounded-xl bg-white/70" />
      </div>
      <div className="mt-3 h-8 w-20 rounded bg-white/70" />
      <div className="mt-2 h-3 w-32 rounded bg-white/50" />
    </div>
  );
}

/* ============================================================
   Componente principal
   ============================================================ */

export default function StatsCard({
  label,
  value,
  color = 'slate',
  icon,
  hint,
  loading = false,
  onClick,
  ariaLabel,
}: StatsCardProps) {
  if (loading) return <SkeletonCard color={color} />;

  const s = colorStyles[color];
  const isClickable = typeof onClick === 'function';

  const baseClasses = `
    group relative w-full overflow-hidden rounded-2xl border p-6 text-left
    shadow-sm transition-all duration-200
    ${s.cardBorder} ${s.cardBg}
    ${
      isClickable
        ? `cursor-pointer hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 ${s.hoverBorder}`
        : ''
    }
  `;

  const content = (
    <>
      {/* Barra de acento superior: siempre visible, refuerza el color */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${s.accent}`}
      />

      <div className="flex items-start justify-between gap-3">
        <p
          className={`text-xs font-bold uppercase tracking-wider ${s.labelText}`}
        >
          {label}
        </p>

        {icon && (
          <span
            className={`
              flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm
              ring-4 ring-transparent transition-all duration-200
              group-hover:scale-105 group-hover:shadow-md
              ${s.iconBg} ${s.iconRing}
            `}
          >
            {icon}
          </span>
        )}
      </div>

      <p
        className={`mt-3 text-3xl font-black tabular-nums ${s.valueText}`}
      >
        {value}
      </p>

      {hint && (
        <p className={`mt-1 text-xs font-medium ${s.hintText}`}>{hint}</p>
      )}
    </>
  );

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel || `${label}: ${value}`}
        className={baseClasses}
      >
        {content}
      </button>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}