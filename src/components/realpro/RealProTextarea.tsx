import { TextareaHTMLAttributes, forwardRef } from 'react';

interface RealProTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const RealProTextarea = forwardRef<HTMLTextAreaElement, RealProTextareaProps>(
  ({ error = false, className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`
          w-full
          min-h-[80px]
          px-4
          py-2.5
          text-sm
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
          resize-none
          ${className}
        `}
        {...props}
      />
    );
  }
);

RealProTextarea.displayName = 'RealProTextarea';
