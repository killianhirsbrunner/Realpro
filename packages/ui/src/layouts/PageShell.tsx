import { type ReactNode } from 'react';
import clsx from 'clsx';

export interface PageShellProps {
  /** Page title */
  title: string;
  /** Page subtitle/description */
  subtitle?: string;
  /** Action buttons */
  actions?: ReactNode;
  /** Breadcrumbs component */
  breadcrumbs?: ReactNode;
  /** Tabs or secondary navigation */
  tabs?: ReactNode;
  /** Filters/search section */
  filters?: ReactNode;
  /** Main content */
  children: ReactNode;
  /** Content max width */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Content padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Loading state */
  isLoading?: boolean;
  /** Additional classes */
  className?: string;
}

export function PageShell({
  title,
  subtitle,
  actions,
  breadcrumbs,
  tabs,
  filters,
  children,
  maxWidth = 'full',
  padding = 'md',
  isLoading = false,
  className,
}: PageShellProps) {
  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-4 lg:px-6 lg:py-5',
    md: 'px-4 py-5 lg:px-6 lg:py-6',
    lg: 'px-6 py-6 lg:px-8 lg:py-8',
  };

  return (
    <div
      className={clsx(
        'min-h-full',
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className={clsx(paddingClasses[padding], 'pb-0')}>
          {breadcrumbs}
        </div>
      )}

      {/* Header */}
      <header
        className={clsx(
          paddingClasses[padding],
          breadcrumbs && 'pt-3',
          (tabs || filters) && 'pb-0'
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex flex-shrink-0 items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      {tabs && (
        <div
          className={clsx(
            paddingClasses[padding],
            'pt-4 pb-0',
            'border-b border-neutral-200 dark:border-neutral-800'
          )}
        >
          {tabs}
        </div>
      )}

      {/* Filters */}
      {filters && (
        <div
          className={clsx(
            paddingClasses[padding],
            'py-4',
            'border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50'
          )}
        >
          {filters}
        </div>
      )}

      {/* Content */}
      <main className={clsx(paddingClasses[padding], 'flex-1')}>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4" />
            <div className="h-64 bg-neutral-200 dark:bg-neutral-700 rounded" />
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE SECTION
// ═══════════════════════════════════════════════════════════════════════════

export interface PageSectionProps {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Section actions */
  actions?: ReactNode;
  /** Section content */
  children: ReactNode;
  /** Collapsible section */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Additional classes */
  className?: string;
}

export function PageSection({
  title,
  description,
  actions,
  children,
  className,
}: PageSectionProps) {
  return (
    <section className={clsx('space-y-4', className)}>
      {(title || description || actions) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT CARD
// ═══════════════════════════════════════════════════════════════════════════

export interface ContentCardProps {
  /** Card title */
  title?: string;
  /** Card description */
  description?: string;
  /** Card actions (top right) */
  actions?: ReactNode;
  /** Card footer */
  footer?: ReactNode;
  /** Card content */
  children: ReactNode;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Click handler */
  onClick?: () => void;
  /** Additional classes */
  className?: string;
}

export function ContentCard({
  title,
  description,
  actions,
  footer,
  children,
  padding = 'md',
  onClick,
  className,
}: ContentCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white dark:bg-neutral-900 rounded-xl',
        'border border-neutral-200 dark:border-neutral-800',
        'shadow-sm',
        onClick && 'cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors',
        className
      )}
    >
      {(title || description || actions) && (
        <div
          className={clsx(
            'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between',
            paddingClasses[padding],
            'border-b border-neutral-200 dark:border-neutral-800'
          )}
        >
          <div>
            {title && (
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className={paddingClasses[padding]}>{children}</div>

      {footer && (
        <div
          className={clsx(
            paddingClasses[padding],
            'border-t border-neutral-200 dark:border-neutral-800',
            'bg-neutral-50 dark:bg-neutral-800/50 rounded-b-xl'
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
