import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className, children, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={clsx(
            'block w-full h-10 rounded-lg border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors',
            error
              ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
              : 'border-neutral-300 dark:border-neutral-700 focus:border-brand-400 focus:ring-brand-400/20',
            'disabled:bg-neutral-50 dark:disabled:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60',
            'px-3 py-2 text-sm',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {(error || hint) && (
          <p
            className={clsx(
              'mt-1.5 text-sm',
              error ? 'text-error-600 dark:text-error-400' : 'text-neutral-500 dark:text-neutral-400'
            )}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
