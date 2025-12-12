/**
 * RealPro | Loading Spinner Components
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { cn } from '@shared/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
} as const;

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-neutral-300 dark:border-neutral-600 border-t-brand-600',
        sizeClasses[size],
        className
      )}
    />
  );
}

export interface LoadingStateProps {
  message?: string;
  size?: LoadingSpinnerProps['size'];
}

export function LoadingState({ message = 'Chargement...', size = 'lg' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <LoadingSpinner size={size} />
      <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">{message}</p>
    </div>
  );
}

export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
      <LoadingState message={message} />
    </div>
  );
}
