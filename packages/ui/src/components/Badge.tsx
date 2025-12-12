import { forwardRef, type HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'brand' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full';

    const variantStyles = {
      default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      success: 'bg-success-50 text-success-700 dark:bg-success-700/20 dark:text-success-500',
      warning: 'bg-warning-50 text-warning-700 dark:bg-warning-700/20 dark:text-warning-500',
      error: 'bg-error-50 text-error-700 dark:bg-error-700/20 dark:text-error-500',
      info: 'bg-info-50 text-info-700 dark:bg-info-700/20 dark:text-info-500',
      brand: 'bg-brand-100 text-brand-700 dark:bg-brand-700/20 dark:text-brand-400',
      outline: 'border border-neutral-300 text-neutral-700 dark:border-neutral-600 dark:text-neutral-300',
    };

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
