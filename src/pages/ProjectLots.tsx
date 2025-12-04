import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Grid3x3, List, Download, TrendingUp, Home } from 'lucide-react';
import { useLots } from '../hooks/useLots';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import LotsFilters from '../components/lots/LotsFilters';
import LotsTable from '../components/lots/LotsTable';
import LotCardView from '../components/lots/LotCardView';
import LotPreviewPanel from '../components/lots/LotPreviewPanel';
import LotEditPanel from '../components/lots/LotEditPanel';
import ImportLotsModal from '../components/lots/ImportLotsModal';

export function ProjectLots() {
  const { projectId } = useParams<{ projectId: string }>();
  const [filters, setFilters] = useState<any>({});
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [editingLot, setEditingLot] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);

  const { lots, loading, error, statusCounts, totalValue, soldValue, createLot, updateLot, deleteLot, refresh } = useLots(projectId, filters);

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectData = async () => {
      const { data: buildingsData } = await supabase
        .from('buildings')
        .select('id, name, code')
        .eq('project_id', projectId)
        .order('code');

      const { data: floorsData } = await supabase
        .from('floors')
        .select('id, name, level, building_id')
        .in('building_id', buildingsData?.map((b) => b.id) || [])
        .order('level');

      setBuildings(buildingsData || []);
      setFloors(floorsData || []);
    };

    fetchProjectData();
  }, [projectId]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleLotClick = (lot: any) => {
    setSelectedLot(lot);
  };

  const handleEdit = (lot?: any) => {
    setSelectedLot(null);
    if (lot) {
      setEditingLot(lot);
    } else {
      setIsCreating(true);
    }
  };

  const handleSave = async (data: any) => {
    if (editingLot) {
      const { error } = await updateLot(editingLot.id, data);
      if (!error) {
        setEditingLot(null);
        refresh();
      }
    } else {
      const { error } = await createLot({ ...data, project_id: projectId });
      if (!error) {
        setIsCreating(false);
        refresh();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement des lots...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des lots</p>
        </div>
      </div>
    );
  }

  const salesRate = totalValue > 0 ? ((soldValue / totalValue) * 100).toFixed(1) : 0;

  return (
    <div className="px-10 py-8 space-y-8">
      {/* TOPBAR */}
      <RealProTopbar
        title="Lots & Programme de vente"
        subtitle={`${lots.length} lot${lots.length > 1 ? 's' : ''} au total`}
        actions={
          <div className="flex items-center gap-3">
            <ImportLotsModal projectId={projectId!} onSuccess={refresh} />
            <button
              onClick={() => handleEdit()}
              className="px-5 py-3 bg-primary text-background rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-soft"
            >
              <Plus className="w-5 h-5" />
              Nouveau lot
            </button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Lots</p>
            <Home className="w-8 h-8 text-blue-600 dark:text-blue-400 opacity-50" />
          </div>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{statusCounts.total}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-900 dark:text-green-100">Disponibles</p>
            <div className="w-8 h-8 rounded-full bg-green-600 dark:bg-green-400 opacity-50 flex items-center justify-center">
              <span className="text-white dark:text-green-900 font-bold text-sm">{statusCounts.available}</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100">{statusCounts.available}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-red-900 dark:text-red-100">Vendus</p>
            <TrendingUp className="w-8 h-8 text-red-600 dark:text-red-400 opacity-50" />
          </div>
          <p className="text-3xl font-bold text-red-900 dark:text-red-100">{statusCounts.sold}</p>
          <p className="text-xs text-red-700 dark:text-red-300 mt-1">Taux: {salesRate}%</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Valeur Totale</p>
            <Download className="w-8 h-8 text-purple-600 dark:text-purple-400 opacity-50" />
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            CHF {(totalValue / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
            Vendu: CHF {(soldValue / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <LotsFilters
        onFilterChange={handleFilterChange}
        buildings={buildings}
        statusCounts={statusCounts}
      />

      {/* VIEW MODE TOGGLE */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              viewMode === 'table'
                ? 'bg-background text-foreground shadow-soft'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-foreground'
            }`}
          >
            <List className="w-4 h-4 inline mr-2" />
            Tableau
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              viewMode === 'cards'
                ? 'bg-background text-foreground shadow-soft'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-foreground'
            }`}
          >
            <Grid3x3 className="w-4 h-4 inline mr-2" />
            Cartes
          </button>
        </div>

        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          {lots.length} résultat{lots.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <LotsTable
          lots={lots}
          onRowClick={handleLotClick}
        />
      )}

      {/* CARD VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lots.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-4">
                <Home className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Aucun lot trouvé
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                Ajustez vos filtres ou ajoutez de nouveaux lots
              </p>
            </div>
          ) : (
            lots.map((lot) => (
              <LotCardView
                key={lot.id}
                lot={lot}
                onClick={() => handleLotClick(lot)}
              />
            ))
          )}
        </div>
      )}

      {/* PREVIEW PANEL */}
      {selectedLot && (
        <LotPreviewPanel
          lot={selectedLot}
          onClose={() => setSelectedLot(null)}
          onEdit={() => handleEdit(selectedLot)}
        />
      )}

      {/* EDIT PANEL */}
      {(editingLot || isCreating) && (
        <LotEditPanel
          lot={editingLot}
          buildings={buildings}
          floors={floors}
          onClose={() => {
            setEditingLot(null);
            setIsCreating(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
