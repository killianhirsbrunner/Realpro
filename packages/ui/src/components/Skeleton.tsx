import clsx from 'clsx';

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}

export function Skeleton({
  className,
  width,
  height,
  variant = 'text',
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-neutral-200 dark:bg-neutral-800',
        variantClasses[variant],
        className
      )}
      style={{
        width: width,
        height: height || (variant === 'text' ? '1em' : undefined),
      }}
    />
  );
}

// Skeleton Text - Multiple lines
export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '60%' : '100%'}
          height="1rem"
        />
      ))}
    </div>
  );
}

// Skeleton Card
export interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={clsx('p-4 space-y-4 rounded-lg border border-neutral-200 dark:border-neutral-800', className)}>
      <Skeleton variant="rounded" height="8rem" />
      <SkeletonText lines={2} />
      <div className="flex gap-2">
        <Skeleton width="5rem" height="2rem" variant="rounded" />
        <Skeleton width="5rem" height="2rem" variant="rounded" />
      </div>
    </div>
  );
}

// Skeleton Table
export interface SkeletonTableProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function SkeletonTable({ rows = 5, cols = 4, className }: SkeletonTableProps) {
  return (
    <div className={clsx('space-y-2', className)}>
      {/* Header */}
      <div className="flex gap-4 p-2">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height="1.5rem" className="flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-2">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} height="2rem" className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Skeleton Avatar
export interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SkeletonAvatar({ size = 'md', className }: SkeletonAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <Skeleton
      variant="circular"
      className={clsx(sizeClasses[size], className)}
    />
  );
}
