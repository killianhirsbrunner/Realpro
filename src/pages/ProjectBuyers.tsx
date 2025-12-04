import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Plus, ChevronLeft, LayoutGrid, Table } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useBuyers } from '../hooks/useBuyers';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { BuyersTable } from '../components/buyers/BuyersTable';
import { BuyerPipeline } from '../components/buyers/BuyerPipeline';
import { Button } from '../components/ui/Button';

export function ProjectBuyers() {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();
  const { buyers, loading, error } = useBuyers(projectId);
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des acheteurs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/overview`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour au projet
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Acheteurs & Prospects
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {buyers.length} acheteur{buyers.length > 1 ? 's' : ''} au total
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <button
                onClick={() => setViewMode('pipeline')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'pipeline'
                    ? 'bg-white dark:bg-neutral-700 shadow-sm'
                    : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-neutral-700 shadow-sm'
                    : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                <Table className="h-4 w-4" />
              </button>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un acheteur
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'pipeline' ? (
        <BuyerPipeline buyers={buyers} />
      ) : (
        <BuyersTable buyers={buyers} />
      )}
    </div>
  );
}
