import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon element to display */
  icon: ReactNode;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** Button size */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Accessible label (required for icon-only buttons) */
  'aria-label': string;
  /** Loading state */
  isLoading?: boolean;
  /** Round shape */
  isRound?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      isRound = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = clsx(
      'inline-flex items-center justify-center',
      'font-medium transition-all duration-150',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      isRound ? 'rounded-full' : 'rounded-lg'
    );

    const variantStyles = {
      primary:
        'bg-brand-400 text-white hover:bg-brand-500 active:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600',
      secondary:
        'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700',
      outline:
        'border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800',
      ghost:
        'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
      danger:
        'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 dark:bg-error-600 dark:hover:bg-error-700',
    };

    const sizeStyles = {
      xs: 'h-7 w-7 [&>svg]:h-3.5 [&>svg]:w-3.5',
      sm: 'h-8 w-8 [&>svg]:h-4 [&>svg]:w-4',
      md: 'h-10 w-10 [&>svg]:h-5 [&>svg]:w-5',
      lg: 'h-12 w-12 [&>svg]:h-6 [&>svg]:w-6',
    };

    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          icon
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
