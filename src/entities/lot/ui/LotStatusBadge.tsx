/**
 * RealPro | Lot Status Badge Component
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { cn } from '@shared/lib/utils';
import { LOT_STATUS_LABELS, LOT_STATUS_COLORS } from '@shared/config';
import type { LotStatus } from '../model';

export interface LotStatusBadgeProps {
  status: LotStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
} as const;

export function LotStatusBadge({ status, size = 'md', className }: LotStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        LOT_STATUS_COLORS[status],
        sizeClasses[size],
        className
      )}
    >
      {LOT_STATUS_LABELS[status]}
    </span>
  );
}
