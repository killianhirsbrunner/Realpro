import { useParams, Link } from 'react-router-dom';
import { Plus, ChevronLeft } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useLots } from '../hooks/useLots';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { LotsTable } from '../components/lots/LotsTable';
import { Button } from '../components/ui/Button';

export function ProjectLots() {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();
  const { lots, loading, error, statusCounts } = useLots(projectId);

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
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des lots</p>
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
              Lots du projet
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {statusCounts.total} lots au total • {statusCounts.sold} vendus • {statusCounts.available} disponibles
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un lot
          </Button>
        </div>
      </div>

      <LotsTable lots={lots} />
    </div>
  );
}
