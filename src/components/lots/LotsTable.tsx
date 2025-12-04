import { useState } from 'react';
import { RealProTable } from '../realpro/RealProTable';
import { RealProBadge } from '../realpro/RealProBadge';
import { Building2, Maximize2, Euro, Home, MoreVertical } from 'lucide-react';

interface LotsTableProps {
  lots: any[];
  onRowClick: (lot: any) => void;
  onEdit?: (lot: any) => void;
  onDelete?: (lot: any) => void;
}

export default function LotsTable({ lots, onRowClick, onEdit, onDelete }: LotsTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

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

  const columns = [
    {
      key: 'code',
      label: 'Lot',
      sortable: true,
      render: (lot: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Home className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{lot.code}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">{getTypeLabel(lot.type)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'building',
      label: 'Bâtiment',
      sortable: true,
      render: (lot: any) => (
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Building2 className="w-4 h-4" />
          {lot.building?.name || lot.building?.code || '-'}
        </div>
      ),
    },
    {
      key: 'rooms_count',
      label: 'Pièces',
      sortable: true,
      render: (lot: any) => (
        <span className="text-sm font-medium text-foreground">
          {lot.rooms_count ? `${lot.rooms_count} pcs` : '-'}
        </span>
      ),
    },
    {
      key: 'surface_total',
      label: 'Surface',
      sortable: true,
      render: (lot: any) => (
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Maximize2 className="w-4 h-4" />
            {lot.surface_total ? `${lot.surface_total} m²` : '-'}
          </div>
          {lot.surface_living && (
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
              Hab: {lot.surface_living} m²
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'price_total',
      label: 'Prix',
      sortable: true,
      render: (lot: any) => (
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Euro className="w-4 h-4" />
            {lot.price_total ? `CHF ${Number(lot.price_total).toLocaleString('fr-CH')}` : '-'}
          </div>
          {lot.price_base && lot.price_extras && Number(lot.price_extras) > 0 && (
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
              Base: CHF {Number(lot.price_base).toLocaleString('fr-CH')}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (lot: any) => {
        const config = getStatusConfig(lot.status);
        return <RealProBadge type={config.type}>{config.label}</RealProBadge>;
      },
    },
    {
      key: 'actions',
      label: '',
      render: (lot: any) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-neutral-500" />
        </button>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-background overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {lots.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                      <Home className="w-8 h-8 text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Aucun lot trouvé
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        Commencez par ajouter des lots au projet
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              lots.map((lot) => (
                <tr
                  key={lot.id}
                  onClick={() => onRowClick(lot)}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(lot) : lot[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {lots.length > 0 && (
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-sm">
            <p className="text-neutral-600 dark:text-neutral-400">
              {lots.length} lot{lots.length > 1 ? 's' : ''} au total
            </p>
            {selectedRows.length > 0 && (
              <p className="text-primary font-medium">
                {selectedRows.length} sélectionné{selectedRows.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
