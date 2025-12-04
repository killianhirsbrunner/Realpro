import { ReactNode } from 'react';

interface RealProBadgeProps {
  children: ReactNode;
  type?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export function RealProBadge({
  children,
  type = 'neutral',
  size = 'md',
  className = ''
}: RealProBadgeProps) {
  const types = {
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-600 text-white',
    info: 'bg-brand-600 text-white',
    neutral: 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200',
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
        ${types[type]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
