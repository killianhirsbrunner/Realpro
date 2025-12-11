/**
 * RealPro | Input Component
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@shared/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2.5 h-10 border rounded-lg text-sm',
            'text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500',
            'bg-white dark:bg-neutral-800',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            'disabled:bg-gray-50 dark:disabled:bg-neutral-900 disabled:text-gray-500 disabled:cursor-not-allowed',
            'transition-colors duration-200',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-neutral-600',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
