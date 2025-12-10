import { HTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'error' | 'secondary' | 'outline';
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
            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': variant === 'default',
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': variant === 'success',
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': variant === 'warning',
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': variant === 'danger' || variant === 'error',
            'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400': variant === 'info',
            'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300': variant === 'secondary',
            'bg-transparent border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300': variant === 'outline',
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
