import { forwardRef, type HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'brand' | 'neutral' | 'white';
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', color = 'brand', className, ...props }, ref) => {
    const sizeStyles = {
      sm: 'h-4 w-4 border-2',
      md: 'h-6 w-6 border-2',
      lg: 'h-8 w-8 border-3',
    };

    const colorStyles = {
      brand: 'border-brand-400 border-t-transparent',
      neutral: 'border-neutral-400 border-t-transparent',
      white: 'border-white border-t-transparent',
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'animate-spin rounded-full',
          sizeStyles[size],
          colorStyles[color],
          className
        )}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
