import { type ReactNode } from 'react';
import clsx from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  /** Stat label/title */
  label: string;
  /** Main value */
  value: string | number;
  /** Value prefix (e.g., "CHF") */
  prefix?: string;
  /** Value suffix (e.g., "%") */
  suffix?: string;
  /** Icon to display */
  icon?: ReactNode;
  /** Icon background color class */
  iconBgClass?: string;
  /** Icon color class */
  iconColorClass?: string;
  /** Trend information */
  trend?: {
    value: number;
    label?: string;
  };
  /** Description text */
  description?: string;
  /** Click handler */
  onClick?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes */
  className?: string;
}

function formatTrendValue(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function StatCard({
  label,
  value,
  prefix,
  suffix,
  icon,
  iconBgClass = 'bg-brand-100 dark:bg-brand-900',
  iconColorClass = 'text-brand-600 dark:text-brand-400',
  trend,
  description,
  onClick,
  isLoading = false,
  size = 'md',
  className,
}: StatCardProps) {
  const sizeStyles = {
    sm: {
      container: 'p-4',
      iconWrapper: 'h-8 w-8',
      icon: '[&>svg]:h-4 [&>svg]:w-4',
      label: 'text-xs',
      value: 'text-xl',
      trend: 'text-xs',
      description: 'text-xs',
    },
    md: {
      container: 'p-5',
      iconWrapper: 'h-10 w-10',
      icon: '[&>svg]:h-5 [&>svg]:w-5',
      label: 'text-sm',
      value: 'text-2xl',
      trend: 'text-sm',
      description: 'text-xs',
    },
    lg: {
      container: 'p-6',
      iconWrapper: 'h-12 w-12',
      icon: '[&>svg]:h-6 [&>svg]:w-6',
      label: 'text-sm',
      value: 'text-3xl',
      trend: 'text-sm',
      description: 'text-sm',
    },
  };

  const styles = sizeStyles[size];

  const trendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
      ? TrendingDown
      : Minus
    : null;

  const trendColorClass = trend
    ? trend.value > 0
      ? 'text-success-600 dark:text-success-400'
      : trend.value < 0
      ? 'text-error-600 dark:text-error-400'
      : 'text-neutral-500 dark:text-neutral-400'
    : '';

  const Component = onClick ? 'button' : 'div';

  if (isLoading) {
    return (
      <div
        className={clsx(
          'rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900',
          styles.container,
          className
        )}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          </div>
          <div
            className={clsx(
              styles.iconWrapper,
              'rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse'
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={clsx(
        'rounded-xl border border-neutral-200 dark:border-neutral-800',
        'bg-white dark:bg-neutral-900',
        'text-left w-full',
        'transition-all duration-200',
        onClick && 'hover:border-brand-300 hover:shadow-md cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
        styles.container,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Label */}
          <p
            className={clsx(
              styles.label,
              'font-medium text-neutral-500 dark:text-neutral-400'
            )}
          >
            {label}
          </p>

          {/* Value */}
          <p
            className={clsx(
              styles.value,
              'font-bold text-neutral-900 dark:text-neutral-100 mt-1 tracking-tight'
            )}
          >
            {prefix && <span className="text-neutral-500 dark:text-neutral-400">{prefix}</span>}
            {value}
            {suffix && <span className="text-neutral-500 dark:text-neutral-400">{suffix}</span>}
          </p>

          {/* Trend */}
          {trend && trendIcon && (
            <div className={clsx('flex items-center gap-1 mt-2', trendColorClass)}>
              {trendIcon && (() => { const TrendIcon = trendIcon; return <TrendIcon className="h-3.5 w-3.5" />; })()}
              <span className={clsx(styles.trend, 'font-medium')}>
                {formatTrendValue(trend.value)}
              </span>
              {trend.label && (
                <span className={clsx(styles.trend, 'text-neutral-500 dark:text-neutral-400')}>
                  {trend.label}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {description && (
            <p
              className={clsx(
                styles.description,
                'text-neutral-500 dark:text-neutral-400 mt-2'
              )}
            >
              {description}
            </p>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div
            className={clsx(
              'flex-shrink-0 rounded-lg flex items-center justify-center',
              styles.iconWrapper,
              iconBgClass
            )}
          >
            <div className={clsx(styles.icon, iconColorClass)}>{icon}</div>
          </div>
        )}
      </div>
    </Component>
  );
}
