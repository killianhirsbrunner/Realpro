/**
 * RealPro | User Role Badge Component
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { cn } from '@shared/lib/utils';
import { getRoleDisplayName, getRoleColor } from '../lib';
import type { UserRole } from '../model';

export interface UserBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
} as const;

export function UserBadge({ role, size = 'md', className }: UserBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        getRoleColor(role),
        sizeClasses[size],
        className
      )}
    >
      {getRoleDisplayName(role)}
    </span>
  );
}
