import { CheckCircle, Clock, Eye, XCircle, Edit } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ValidationStatus = 'draft' | 'pending_review' | 'in_review' | 'approved' | 'rejected';

interface ValidationStatusBadgeProps {
  status: ValidationStatus;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<
  ValidationStatus,
  {
    label: string;
    shortLabel: string;
    bgClass: string;
    textClass: string;
    darkBgClass: string;
    darkTextClass: string;
    icon: typeof CheckCircle;
  }
> = {
  draft: {
    label: 'Brouillon',
    shortLabel: 'Brouillon',
    bgClass: 'bg-neutral-100',
    textClass: 'text-neutral-600',
    darkBgClass: 'dark:bg-neutral-800',
    darkTextClass: 'dark:text-neutral-400',
    icon: Edit,
  },
  pending_review: {
    label: 'En attente de validation',
    shortLabel: 'En attente',
    bgClass: 'bg-amber-100',
    textClass: 'text-amber-700',
    darkBgClass: 'dark:bg-amber-900/30',
    darkTextClass: 'dark:text-amber-400',
    icon: Clock,
  },
  in_review: {
    label: 'En cours de revision',
    shortLabel: 'En revision',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-700',
    darkBgClass: 'dark:bg-blue-900/30',
    darkTextClass: 'dark:text-blue-400',
    icon: Eye,
  },
  approved: {
    label: 'Valide',
    shortLabel: 'Valide',
    bgClass: 'bg-green-100',
    textClass: 'text-green-700',
    darkBgClass: 'dark:bg-green-900/30',
    darkTextClass: 'dark:text-green-400',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Refuse',
    shortLabel: 'Refuse',
    bgClass: 'bg-red-100',
    textClass: 'text-red-700',
    darkBgClass: 'dark:bg-red-900/30',
    darkTextClass: 'dark:text-red-400',
    icon: XCircle,
  },
};

const sizeClasses = {
  xs: 'text-xs px-1.5 py-0.5',
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-2.5 py-1',
};

const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
};

/**
 * Badge affichant le statut de validation d'un document
 *
 * @example
 * <ValidationStatusBadge status="pending_review" />
 * <ValidationStatusBadge status="approved" showIcon size="sm" />
 */
export function ValidationStatusBadge({
  status,
  showIcon = true,
  showLabel = true,
  size = 'sm',
  className,
}: ValidationStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        sizeClasses[size],
        config.bgClass,
        config.textClass,
        config.darkBgClass,
        config.darkTextClass,
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {showLabel && <span>{size === 'xs' ? config.shortLabel : config.label}</span>}
    </span>
  );
}

/**
 * Retourne la configuration d'un statut de validation
 */
export function getValidationStatusConfig(status: ValidationStatus) {
  return statusConfig[status] || statusConfig.draft;
}

/**
 * Liste de tous les statuts de validation pour les filtres
 */
export const validationStatuses: { value: ValidationStatus; label: string }[] = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'pending_review', label: 'En attente' },
  { value: 'in_review', label: 'En revision' },
  { value: 'approved', label: 'Valide' },
  { value: 'rejected', label: 'Refuse' },
];
