import { Building2, Maximize2, Euro, Home, MapPin, Layers } from 'lucide-react';
import { RealProBadge } from '../realpro/RealProBadge';

interface LotCardViewProps {
  lot: any;
  onClick: () => void;
}

export default function LotCardView({ lot, onClick }: LotCardViewProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return { type: 'success' as const, label: 'Libre', color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' };
      case 'RESERVED':
        return { type: 'warning' as const, label: 'Réservé', color: 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-800' };
      case 'OPTION':
        return { type: 'info' as const, label: 'Option', color: 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800' };
      case 'SOLD':
        return { type: 'danger' as const, label: 'Vendu', color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' };
      case 'DELIVERED':
        return { type: 'neutral' as const, label: 'Livré', color: 'bg-neutral-50 dark:bg-neutral-900/20 border-neutral-200 dark:border-neutral-800' };
      case 'BLOCKED':
        return { type: 'neutral' as const, label: 'Bloqué', color: 'bg-neutral-50 dark:bg-neutral-900/20 border-neutral-200 dark:border-neutral-800' };
      default:
        return { type: 'neutral' as const, label: status, color: 'bg-neutral-50 dark:bg-neutral-900/20 border-neutral-200 dark:border-neutral-800' };
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      APARTMENT: 'Appartement',
      DUPLEX: 'Duplex',
      PENTHOUSE: 'Attique',
      COMMERCIAL: 'Commerce',
      PARKING: 'Parking',
      STORAGE: 'Cave',
    };
    return labels[type] || type;
  };

  const statusConfig = getStatusConfig(lot.status);
  const typeLabel = getTypeLabel(lot.type);

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-card hover:scale-[1.02] ${statusConfig.color}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">{lot.code}</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
            <Home className="w-4 h-4" />
            {typeLabel}
            {lot.rooms_count && ` • ${lot.rooms_count} pcs`}
          </p>
        </div>
        <RealProBadge type={statusConfig.type}>
          {statusConfig.label}
        </RealProBadge>
      </div>

      {/* Details Grid */}
      <div className="space-y-3 mb-4">
        {/* Surface */}
        {lot.surface_total && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
              <Maximize2 className="w-4 h-4" />
              Surface totale
            </span>
            <span className="font-semibold text-foreground">{lot.surface_total} m²</span>
          </div>
        )}

        {/* Living Surface */}
        {lot.surface_living && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Surface habitable
            </span>
            <span className="font-medium text-foreground">{lot.surface_living} m²</span>
          </div>
        )}

        {/* Building */}
        {lot.building && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Bâtiment
            </span>
            <span className="font-medium text-foreground">{lot.building.name || lot.building.code}</span>
          </div>
        )}

        {/* Floor */}
        {lot.floor && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Étage
            </span>
            <span className="font-medium text-foreground">{lot.floor.name || `Niveau ${lot.floor.level}`}</span>
          </div>
        )}

        {/* Orientation */}
        {lot.orientation && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Orientation</span>
            <span className="font-medium text-foreground">{lot.orientation}</span>
          </div>
        )}
      </div>

      {/* Price */}
      {lot.price_total && (
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
              <Euro className="w-4 h-4" />
              Prix total
            </span>
            <span className="text-xl font-bold text-foreground">
              CHF {Number(lot.price_total).toLocaleString('fr-CH')}
            </span>
          </div>
          {lot.price_base && lot.price_extras && Number(lot.price_extras) > 0 && (
            <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">
              Base: CHF {Number(lot.price_base).toLocaleString('fr-CH')} + Extras: CHF {Number(lot.price_extras).toLocaleString('fr-CH')}
            </div>
          )}
        </div>
      )}

      {/* Hover Effect Indicator */}
      <div className="absolute inset-0 rounded-2xl border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
