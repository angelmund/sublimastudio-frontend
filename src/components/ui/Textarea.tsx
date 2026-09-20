import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export default function Textarea({
  invalid,
  className = '',
  ...rest
}: TextareaProps) {
  return (
    <textarea
      className={`
        w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-900
        shadow-sm transition-colors placeholder:text-ink-400
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
    />
  );
}