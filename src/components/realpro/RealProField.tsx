import { ReactNode } from 'react';

interface RealProFieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
}

export function RealProField({
  label,
  children,
  required = false,
  error,
  hint
}: RealProFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {hint}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
