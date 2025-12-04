import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Wrench, Plus } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useSAV } from '../hooks/useSAV';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { SAVTable } from '../components/sav/SAVTable';
import { Button } from '../components/ui/Button';

export function ProjectSAV() {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();
  const { tickets, loading, error } = useSAV(projectId);

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
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des tickets SAV</p>
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
              <Wrench className="h-8 w-8 text-primary-600" />
              SAV / Après-vente
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {tickets.length} ticket{tickets.length > 1 ? 's' : ''} au total
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau ticket
          </Button>
        </div>
      </div>

      <SAVTable tickets={tickets} />
    </div>
  );
}
