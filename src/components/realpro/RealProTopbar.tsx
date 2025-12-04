import { ReactNode } from 'react';

interface RealProTopbarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function RealProTopbar({ title, subtitle, actions }: RealProTopbarProps) {
  return (
    <header className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </h1>
        {subtitle && (
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}
