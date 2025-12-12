import { HTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-medium rounded-full',
          {
            'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200': variant === 'default',
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': variant === 'success',
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': variant === 'warning',
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': variant === 'danger',
            'bg-realpro-turquoise/10 text-realpro-turquoise': variant === 'info',
            'px-2 py-0.5 text-xs h-5': size === 'sm',
            'px-2.5 py-1 text-xs h-6': size === 'md',
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
