import clsx from 'clsx';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-brand-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
  };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-neutral-600 dark:text-neutral-400">Progress</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300 ease-out',
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
