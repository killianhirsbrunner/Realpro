import { ReactNode, MouseEventHandler } from 'react';

export interface RealProCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export function RealProCard({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick
}: RealProCardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl
        border
        border-neutral-200
        dark:border-neutral-800
        bg-white
        dark:bg-neutral-900
        shadow-soft
        ${hover ? 'hover:shadow-card transition-shadow duration-200 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
