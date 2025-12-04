import { InputHTMLAttributes, forwardRef } from 'react';

interface RealProInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const RealProInput = forwardRef<HTMLInputElement, RealProInputProps>(
  ({ error = false, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full
          px-4
          py-3
          rounded-xl
          border
          ${error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-neutral-200 dark:border-neutral-800 focus:ring-primary-500 dark:focus:ring-primary-400'
          }
          bg-white
          dark:bg-neutral-900
          text-neutral-900
          dark:text-neutral-100
          placeholder:text-neutral-400
          shadow-soft
          focus:outline-none
          focus:ring-2
          focus:border-transparent
          transition-all
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
    );
  }
);

RealProInput.displayName = 'RealProInput';
