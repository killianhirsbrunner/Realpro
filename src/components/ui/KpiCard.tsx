import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

export function KpiCard({ title, value, icon: Icon, trend, variant = 'default', className }: KpiCardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border p-6 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.99]',
        'bg-white dark:bg-neutral-900',
        {
          'border-neutral-200 dark:border-neutral-800': variant === 'default',
          'border-primary-200 dark:border-primary-900/30 bg-primary-50/30 dark:bg-primary-950/20': variant === 'primary',
          'border-green-200 dark:border-green-900/30 bg-green-50/30 dark:bg-green-950/20': variant === 'success',
          'border-orange-200 dark:border-orange-900/30 bg-orange-50/30 dark:bg-orange-950/20': variant === 'warning',
        },
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">{value}</p>

          {trend && (
            <div className="mt-3 flex items-center gap-1.5">
              <span
                className={clsx('text-xs font-medium', {
                  'text-green-600 dark:text-green-400': trend.isPositive,
                  'text-red-600 dark:text-red-400': !trend.isPositive,
                })}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">vs dernier mois</span>
            </div>
          )}
        </div>

        <div
          className={clsx(
            'h-11 w-11 rounded-lg flex items-center justify-center',
            {
              'bg-neutral-100 dark:bg-neutral-800': variant === 'default',
              'bg-primary-100 dark:bg-primary-900/40': variant === 'primary',
              'bg-green-100 dark:bg-green-900/40': variant === 'success',
              'bg-orange-100 dark:bg-orange-900/40': variant === 'warning',
            }
          )}
        >
          <Icon
            className={clsx('h-5 w-5', {
              'text-neutral-600 dark:text-neutral-400': variant === 'default',
              'text-primary-600 dark:text-primary-400': variant === 'primary',
              'text-green-600 dark:text-green-400': variant === 'success',
              'text-orange-600 dark:text-orange-400': variant === 'warning',
            })}
          />
        </div>
      </div>
    </div>
  );
}
