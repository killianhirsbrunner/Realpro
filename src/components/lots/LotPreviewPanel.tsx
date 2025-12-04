import { X, Edit2, Building2, Maximize2, Home, MapPin, Layers, Euro, Calendar, ArrowUpRight } from 'lucide-react';
import { RealProBadge } from '../realpro/RealProBadge';
import { RealProPanel } from '../realpro/RealProPanel';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface LotPreviewPanelProps {
  lot: any;
  onClose: () => void;
  onEdit: () => void;
}

export default function LotPreviewPanel({ lot, onClose, onEdit }: LotPreviewPanelProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return { type: 'success' as const, label: 'Libre' };
      case 'RESERVED':
        return { type: 'warning' as const, label: 'Réservé' };
      case 'OPTION':
        return { type: 'info' as const, label: 'Option' };
      case 'SOLD':
        return { type: 'danger' as const, label: 'Vendu' };
      case 'DELIVERED':
        return { type: 'neutral' as const, label: 'Livré' };
      case 'BLOCKED':
        return { type: 'neutral' as const, label: 'Bloqué' };
      default:
        return { type: 'neutral' as const, label: status };
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
    <RealProPanel
      isOpen={true}
      onClose={onClose}
      title={`Lot ${lot.code}`}
      width="large"
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{lot.code}</h2>
            <p className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
              <Home className="w-5 h-5" />
              {typeLabel}
              {lot.rooms_count && ` • ${lot.rooms_count} pièces`}
            </p>
          </div>
          <RealProBadge type={statusConfig.type} size="lg">
            {statusConfig.label}
          </RealProBadge>
        </div>

        {/* Price Card */}
        {lot.price_total && (
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Prix total</p>
                <p className="text-3xl font-bold text-foreground">
                  CHF {Number(lot.price_total).toLocaleString('fr-CH')}
                </p>
              </div>
              <Euro className="w-12 h-12 text-primary opacity-20" />
            </div>
            {lot.price_base && (
              <div className="mt-4 pt-4 border-t border-primary/10 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-600 dark:text-neutral-400">Prix de base</p>
                  <p className="font-semibold text-foreground">CHF {Number(lot.price_base).toLocaleString('fr-CH')}</p>
                </div>
                {lot.price_extras && Number(lot.price_extras) > 0 && (
                  <div>
                    <p className="text-neutral-600 dark:text-neutral-400">Extras</p>
                    <p className="font-semibold text-foreground">CHF {Number(lot.price_extras).toLocaleString('fr-CH')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Surfaces Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Maximize2 className="w-5 h-5" />
            Surfaces
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {lot.surface_total && (
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Surface totale</p>
                <p className="text-xl font-bold text-foreground">{lot.surface_total} m²</p>
              </div>
            )}
            {lot.surface_living && (
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Surface habitable</p>
                <p className="text-xl font-bold text-foreground">{lot.surface_living} m²</p>
              </div>
            )}
            {lot.surface_terrace && Number(lot.surface_terrace) > 0 && (
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Terrasse</p>
                <p className="text-xl font-bold text-foreground">{lot.surface_terrace} m²</p>
              </div>
            )}
            {lot.surface_balcony && Number(lot.surface_balcony) > 0 && (
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Balcon</p>
                <p className="text-xl font-bold text-foreground">{lot.surface_balcony} m²</p>
              </div>
            )}
            {lot.surface_garden && Number(lot.surface_garden) > 0 && (
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Jardin</p>
                <p className="text-xl font-bold text-foreground">{lot.surface_garden} m²</p>
              </div>
            )}
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Localisation
          </h3>
          <div className="space-y-2">
            {lot.building && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Bâtiment
                </span>
                <span className="font-medium text-foreground">{lot.building.name || lot.building.code}</span>
              </div>
            )}
            {lot.floor && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Étage
                </span>
                <span className="font-medium text-foreground">
                  {lot.floor.name || `Niveau ${lot.floor.level}`}
                  {lot.floor_level !== null && lot.floor_level !== undefined && ` (${lot.floor_level})`}
                </span>
              </div>
            )}
            {lot.orientation && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Orientation</span>
                <span className="font-medium text-foreground">{lot.orientation}</span>
              </div>
            )}
            {lot.has_elevator !== null && lot.has_elevator !== undefined && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Ascenseur</span>
                <span className="font-medium text-foreground">{lot.has_elevator ? 'Oui' : 'Non'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        {lot.created_at && (
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500">
              <Calendar className="w-4 h-4" />
              Créé le {format(new Date(lot.created_at), 'dd MMMM yyyy', { locale: fr })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onEdit}
            className="flex-1 px-6 py-3 bg-primary text-background rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Modifier
          </button>
          <button
            onClick={() => {}}
            className="px-6 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            Détails
          </button>
        </div>
      </div>
    </RealProPanel>
  );
}
