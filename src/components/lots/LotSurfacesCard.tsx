import { Card } from '../ui/Card';
import { Maximize2, Home, Sun, Warehouse, Car } from 'lucide-react';

interface LotSurfacesCardProps {
  lot: {
    surface: number;
    surface_living?: number;
    surface_balcony?: number;
    cave?: string;
    parkings?: string[];
  };
}

export function LotSurfacesCard({ lot }: LotSurfacesCardProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
        Surfaces
      </h2>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Maximize2 className="h-5 w-5 text-neutral-400" />
          <div className="flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Surface PPE</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{lot.surface} m²</p>
          </div>
        </div>

        {lot.surface_living && (
          <div className="flex items-center gap-3">
            <Home className="h-5 w-5 text-neutral-400" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Surface habitable</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">{lot.surface_living} m²</p>
            </div>
          </div>
        )}

        {lot.surface_balcony && lot.surface_balcony > 0 && (
          <div className="flex items-center gap-3">
            <Sun className="h-5 w-5 text-neutral-400" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Balcon / Terrasse</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">{lot.surface_balcony} m²</p>
            </div>
          </div>
        )}

        {lot.cave && (
          <div className="flex items-center gap-3">
            <Warehouse className="h-5 w-5 text-neutral-400" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Cave</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">{lot.cave}</p>
            </div>
          </div>
        )}

        {lot.parkings && lot.parkings.length > 0 && (
          <div className="flex items-center gap-3">
            <Car className="h-5 w-5 text-neutral-400" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Parkings</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {lot.parkings.join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
