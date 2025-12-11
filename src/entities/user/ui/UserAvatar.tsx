/**
 * RealPro | User Avatar Component
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { cn, getInitials } from '@shared/lib/utils';

export interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
} as const;

export function UserAvatar({ name, avatarUrl, size = 'md', className }: UserAvatarProps) {
  const initials = getInitials(name);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn(
          'rounded-full object-cover',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
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
