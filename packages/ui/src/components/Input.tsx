import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'block w-full rounded-lg border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500',
              'focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors',
              error
                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                : 'border-neutral-300 dark:border-neutral-700 focus:border-brand-400 focus:ring-brand-400/20',
              leftIcon ? 'pl-10' : 'pl-3',
              rightIcon ? 'pr-10' : 'pr-3',
              'py-2 text-sm',
              props.disabled && 'bg-neutral-50 dark:bg-neutral-800 cursor-not-allowed opacity-60',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>
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

Input.displayName = 'Input';
