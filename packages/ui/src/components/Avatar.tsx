import { type ReactNode } from 'react';
import clsx from 'clsx';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  /** Fallback text (usually initials or name) */
  fallback?: string;
  /** Alias for fallback - display name for initials */
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt, fallback, name, size = 'md', className }: AvatarProps) {
  // Support both 'name' and 'fallback' props
  const displayName = name || fallback;
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = displayName
    ? displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={alt || displayName || 'Avatar'}
        className={clsx(
          'rounded-full object-cover',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-medium',
        'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}

// Avatar Group
export interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

export function AvatarGroup({ children, max = 4, size = 'md', className }: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleChildren = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  return (
    <div className={clsx('flex -space-x-2', className)}>
      {visibleChildren}
      {remainingCount > 0 && (
        <Avatar
          size={size}
          fallback={`+${remainingCount}`}
          className="ring-2 ring-white dark:ring-neutral-900"
        />
      )}
    </div>
  );
}
