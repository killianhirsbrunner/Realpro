/**
 * RealPro | Lot Card Component
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { Home, Maximize2, DoorOpen } from 'lucide-react';
import { Card } from '@shared/ui';
import { cn, formatCHF, formatSurface } from '@shared/lib/utils';
import { LOT_TYPE_LABELS } from '@shared/config';
import { LotStatusBadge } from './LotStatusBadge';
import type { Lot } from '../model';

export interface LotCardProps {
  lot: Lot;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export function LotCard({ lot, onClick, selected, className }: LotCardProps) {
  return (
    <Card
      hover
      padding="sm"
      onClick={onClick}
      className={cn(
        'cursor-pointer',
        selected && 'ring-2 ring-brand-500',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {LOT_TYPE_LABELS[lot.type]}
          </span>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {lot.code}
          </h3>
        </div>
        <LotStatusBadge status={lot.status} size="sm" />
      </div>

      <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
        {lot.rooms_count && (
          <div className="flex items-center gap-2">
            <DoorOpen className="w-4 h-4" />
            <span>{lot.rooms_count} pièces</span>
          </div>
        )}

        {lot.surface_living && (
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4" />
            <span>{formatSurface(lot.surface_living)}</span>
          </div>
        )}

        {lot.floor_level !== null && (
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>Étage {lot.floor_level}</span>
          </div>
        )}
      </div>

      {lot.price_total && (
        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
            {formatCHF(lot.price_total)}
          </span>
        </div>
      )}
    </Card>
  );
}
