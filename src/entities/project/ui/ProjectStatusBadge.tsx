/**
 * RealPro | Project Status Badge Component
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { cn } from '@shared/lib/utils';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@shared/config';
import type { ProjectStatus } from '../model';

export interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
} as const;

export function ProjectStatusBadge({ status, size = 'md', className }: ProjectStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        PROJECT_STATUS_COLORS[status],
        sizeClasses[size],
        className
      )}
    >
      {PROJECT_STATUS_LABELS[status]}
    </span>
  );
}
