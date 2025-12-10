import { ReactNode } from 'react';

export interface RealProBadgeProps {
  children: ReactNode;
  type?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'default' | 'secondary' | 'outline' | 'error';
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'default' | 'secondary' | 'outline' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export function RealProBadge({
  children,
  type,
  variant,
  size = 'md',
  className = ''
}: RealProBadgeProps) {
  // Support both 'type' and 'variant' props for flexibility
  const badgeType = variant || type || 'neutral';

  const types: Record<string, string> = {
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-brand-600 text-white',
    neutral: 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200',
    default: 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200',
    secondary: 'bg-neutral-200 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-200',
    outline: 'bg-transparent border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-xl
        font-medium
        ${types[badgeType] || types.neutral}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
