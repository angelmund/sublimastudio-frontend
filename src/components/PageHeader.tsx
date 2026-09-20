

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center mt-9">
      <div>
        <h1 className="text-2xl font-black text-ink-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-ink-500">{subtitle}</p>}
      </div>
    </div>
  );
}