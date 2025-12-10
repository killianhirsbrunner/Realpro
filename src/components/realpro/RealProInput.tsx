import { InputHTMLAttributes, forwardRef } from 'react';

export interface RealProInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
  helpText?: string;
}

export const RealProInput = forwardRef<HTMLInputElement, RealProInputProps>(
  ({ error = false, label, helpText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full
            h-10
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
            ${className}
          `}
          {...props}
        />
        {helpText && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{helpText}</p>
        )}
      </div>
    );
  }
);

RealProInput.displayName = 'RealProInput';
