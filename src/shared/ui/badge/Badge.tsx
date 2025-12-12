/**
 * RealPro | Badge Component
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@shared/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
} as const;

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs h-5',
  md: 'px-2.5 py-1 text-xs h-6',
  lg: 'px-3 py-1.5 text-sm h-7',
} as const;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap',
          variantStyles[variant],
          sizeStyles[size],
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
