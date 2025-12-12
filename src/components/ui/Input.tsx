import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-3 py-2.5 h-10 border rounded-lg text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 bg-white dark:bg-neutral-800',
            'focus:outline-none focus:ring-2 focus:ring-realpro-turquoise/50 focus:border-realpro-turquoise',
            'disabled:bg-neutral-50 disabled:text-neutral-500 dark:disabled:bg-neutral-900 dark:disabled:text-neutral-500 disabled:cursor-not-allowed',
            'transition-colors duration-200',
            {
              'border-neutral-300 dark:border-neutral-600': !error,
              'border-red-500 focus:ring-red-500': error,
            },
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
