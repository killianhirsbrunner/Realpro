import { type ReactNode } from 'react';
import clsx from 'clsx';

export interface PageShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageShell({
  title,
  subtitle,
  actions,
  breadcrumbs,
  children,
  className,
}: PageShellProps) {
  return (
    <div className={clsx('space-y-6', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && <div className="text-sm">{breadcrumbs}</div>}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
