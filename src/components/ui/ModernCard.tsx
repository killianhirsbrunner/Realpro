import { ReactNode } from 'react';
import clsx from 'clsx';

interface ModernCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  gradient?: boolean;
  hover?: boolean;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function ModernCard({
  children,
  title,
  subtitle,
  icon,
  actions,
  gradient = false,
  hover = false,
  className = '',
  padding = 'lg'
}: ModernCardProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-2xl',
        'bg-white dark:bg-gray-900',
        'border border-gray-200 dark:border-gray-800',
        'transition-all duration-200',
        {
          'hover:shadow-2xl hover:border-realpro-turquoise hover:-translate-y-1': hover,
          'shadow-sm': !hover,
        },
        className
      )}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-realpro-turquoise/5 via-transparent to-blue-500/5 pointer-events-none" />
      )}

      <div className={clsx('relative z-10', paddingClasses[padding])}>
        {(title || subtitle || icon || actions) && (
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              {icon && (
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-realpro-turquoise to-blue-500 shadow-lg flex-shrink-0">
                  <div className="text-white">{icon}</div>
                </div>
              )}
              <div>
                {title && (
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
