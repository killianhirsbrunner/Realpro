import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Building2, Layers, Home, Hash } from 'lucide-react';

interface LotOverviewCardProps {
  lot: {
    number: string;
    type: string;
    rooms: number;
    floor: number;
    building?: string;
    status: string;
  };
}

export function LotOverviewCard({ lot }: LotOverviewCardProps) {
  const statusLabels: Record<string, string> = {
    AVAILABLE: 'Libre',
    RESERVED: 'Réservé',
    SOLD: 'Vendu',
    BLOCKED: 'Bloqué',
  };

  const statusColors: Record<string, string> = {
    AVAILABLE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    RESERVED: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
    SOLD: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    BLOCKED: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Informations générales
        </h2>
        <Badge className={statusColors[lot.status] || statusColors.BLOCKED}>
          {statusLabels[lot.status] || lot.status}
        </Badge>
      </div>

      <div className="space-y-4">
        {lot.building && (
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-neutral-400" />
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Bâtiment</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">{lot.building}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Layers className="h-5 w-5 text-neutral-400" />
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Étage</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{lot.floor}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Home className="h-5 w-5 text-neutral-400" />
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Type</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{lot.type}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Hash className="h-5 w-5 text-neutral-400" />
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Pièces</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{lot.rooms}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
