import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 gap-2',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500':
              variant === 'primary',
            'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500':
              variant === 'secondary',
            'border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:ring-gray-500':
              variant === 'outline',
            'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 focus:ring-gray-500':
              variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500':
              variant === 'danger',
            'px-3 py-2 text-sm h-9': size === 'sm',
            'px-4 py-2.5 text-sm h-10': size === 'md',
            'px-6 py-3 text-base h-12': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
