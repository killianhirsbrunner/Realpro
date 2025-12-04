import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Search, Filter } from 'lucide-react';
import { formatCHF } from '../../lib/utils/format';

interface Lot {
  id: string;
  number: string;
  type: string;
  surface: number;
  price_vat?: number;
  status: string;
  building?: string;
  floor?: number;
  rooms?: number;
}

interface LotsTableProps {
  lots: Lot[];
}

export function LotsTable({ lots }: LotsTableProps) {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = lots.filter((lot) => {
    const matchesSearch =
      lot.number.toLowerCase().includes(search.toLowerCase()) ||
      lot.type.toLowerCase().includes(search.toLowerCase()) ||
      (lot.building && lot.building.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || lot.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      AVAILABLE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      RESERVED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      SOLD: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      BLOCKED: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
    };
    return colors[status] || colors.BLOCKED;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      AVAILABLE: 'Disponible',
      RESERVED: 'Réservé',
      SOLD: 'Vendu',
      BLOCKED: 'Bloqué'
    };
    return labels[status] || status;
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Rechercher un lot..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="AVAILABLE">Disponible</option>
              <option value="RESERVED">Réservé</option>
              <option value="SOLD">Vendu</option>
              <option value="BLOCKED">Bloqué</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Numéro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Bâtiment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Surface
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Pièces
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-neutral-500">
                  Aucun lot trouvé
                </td>
              </tr>
            ) : (
              filtered.map((lot) => (
                <tr
                  key={lot.id}
                  onClick={() => navigate(`/projects/${projectId}/lots/${lot.id}`)}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {lot.number}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                      {lot.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                      {lot.building || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                      {lot.surface} m²
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                      {lot.rooms || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {lot.price_vat ? formatCHF(lot.price_vat) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(lot.status)}>
                      {getStatusLabel(lot.status)}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
