import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Download, Upload, Grid, List, Building2, DollarSign, Home, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { SidePanel } from '../components/ui/SidePanel';
import { StatsGrid } from '../components/ui/StatsGrid';
import { Badge } from '../components/ui/Badge';
import { useLots } from '../hooks/useLots';

export default function ProjectLotsNew() {
  const { projectId } = useParams();
  const { lots, loading } = useLots(projectId);
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const handleRowClick = (lot: any) => {
    setSelectedLot(lot);
    setIsPanelOpen(true);
  };

  const availableLots = lots.filter((l: any) => l.status === 'AVAILABLE').length;
  const reservedLots = lots.filter((l: any) => l.status === 'RESERVED').length;
  const soldLots = lots.filter((l: any) => l.status === 'SOLD').length;
  const totalValue = lots.reduce((sum: number, l: any) => sum + (l.price || 0), 0);
  const soldValue = lots
    .filter((l: any) => l.status === 'SOLD')
    .reduce((sum: number, l: any) => sum + (l.price || 0), 0);

  const stats = [
    {
      label: 'Lots disponibles',
      value: availableLots,
      icon: Home,
      color: 'success' as const,
    },
    {
      label: 'Lots réservés',
      value: reservedLots,
      icon: Building2,
      color: 'warning' as const,
    },
    {
      label: 'Lots vendus',
      value: soldLots,
      icon: CheckCircle2,
      color: 'primary' as const,
    },
    {
      label: 'Valeur vendue',
      value: `CHF ${soldValue.toLocaleString('fr-CH')}`,
      icon: DollarSign,
      color: 'neutral' as const,
    },
  ];

  const columns = [
    {
      key: 'number',
      label: 'N° Lot',
      render: (value: string) => (
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{value}</span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => {
        const typeLabels: Record<string, string> = {
          APPARTEMENT: 'Appartement',
          ATTIQUE: 'Attique',
          DUPLEX: 'Duplex',
          STUDIO: 'Studio',
          COMMERCE: 'Commerce',
          PARKING: 'Parking',
          CAVE: 'Cave',
        };
        return <span>{typeLabels[value] || value}</span>;
      },
    },
    {
      key: 'floor',
      label: 'Étage',
    },
    {
      key: 'surface',
      label: 'Surface',
      render: (value: number) => <span>{value} m²</span>,
    },
    {
      key: 'rooms',
      label: 'Pièces',
      render: (value: number) => value ? `${value}` : '-',
    },
    {
      key: 'price',
      label: 'Prix',
      render: (value: number) => (
        <span className="font-semibold">CHF {value?.toLocaleString('fr-CH') || '0'}</span>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: string) => {
        const variants: Record<string, 'success' | 'warning' | 'primary' | 'secondary'> = {
          AVAILABLE: 'success',
          RESERVED: 'warning',
          SOLD: 'primary',
          UNAVAILABLE: 'secondary',
        };
        const labels: Record<string, string> = {
          AVAILABLE: 'Disponible',
          RESERVED: 'Réservé',
          SOLD: 'Vendu',
          UNAVAILABLE: 'Indisponible',
        };
        return <Badge variant={variants[value] || 'secondary'}>{labels[value] || value}</Badge>;
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Lots & Programme de vente
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Gérez tous les lots du projet
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${
                  viewMode === 'table'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>

            <Button variant="secondary" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </Button>

            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un lot
            </Button>
          </div>
        </div>

        <StatsGrid stats={stats} columns={4} />

        {viewMode === 'table' ? (
          <DataTable
            data={lots}
            columns={columns}
            onRowClick={handleRowClick}
            selectedRow={selectedLot}
            emptyMessage="Aucun lot trouvé"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lots.map((lot: any) => (
              <div
                key={lot.id}
                onClick={() => handleRowClick(lot)}
                className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Lot {lot.number}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {lot.type}
                    </p>
                  </div>
                  <Badge variant={lot.status === 'AVAILABLE' ? 'success' : 'warning'}>
                    {lot.status === 'AVAILABLE' ? 'Disponible' : 'Réservé'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Surface</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {lot.surface} m²
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Étage</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {lot.floor}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Prix</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      CHF {lot.price?.toLocaleString('fr-CH')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={selectedLot ? `Lot ${selectedLot.number}` : 'Détail du lot'}
        width="md"
      >
        {selectedLot && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  selectedLot.status === 'AVAILABLE'
                    ? 'success'
                    : selectedLot.status === 'RESERVED'
                    ? 'warning'
                    : 'primary'
                }
              >
                {selectedLot.status === 'AVAILABLE' && 'Disponible'}
                {selectedLot.status === 'RESERVED' && 'Réservé'}
                {selectedLot.status === 'SOLD' && 'Vendu'}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Type</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {selectedLot.type}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Étage</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {selectedLot.floor}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Surface</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {selectedLot.surface} m²
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Pièces</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {selectedLot.rooms || '-'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <label className="text-xs text-neutral-600 dark:text-neutral-400">Prix de vente</label>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  CHF {selectedLot.price?.toLocaleString('fr-CH')}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button variant="primary" className="flex-1">
                Modifier
              </Button>
              <Button variant="secondary" className="flex-1">
                Dupliquer
              </Button>
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
