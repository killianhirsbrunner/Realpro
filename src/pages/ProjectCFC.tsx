import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, DollarSign } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useCFC } from '../hooks/useCFC';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CFCTable } from '../components/cfc/CFCTable';

export function ProjectCFC() {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();
  const { cfcData, loading, error } = useCFC(projectId);

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
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des données CFC</p>
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
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary-600" />
              CFC / Budget
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Gestion des codes CFC et budgets
            </p>
          </div>
        </div>
      </div>

      <CFCTable data={cfcData} />
    </div>
  );
}
