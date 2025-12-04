import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, DollarSign, Plus } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useCFC } from '../hooks/useCFC';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CfcSummaryCard } from '../components/cfc/CfcSummaryCard';
import { CfcTable } from '../components/cfc/CfcTable';
import { Button } from '../components/ui/Button';

export function ProjectCFC() {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();
  const { cfcLines, summary, loading, error } = useCFC(projectId);

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

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900">
            <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Budget CFC
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Suivi budgétaire, engagements, facturations et paiements
            </p>
          </div>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle ligne CFC
          </Button>
        </div>
      </div>

      {summary && <CfcSummaryCard summary={summary} />}

      <CfcTable cfcLines={cfcLines} projectId={projectId || ''} />

      <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-neutral-900 dark:text-white mb-1">
              Intégration automatique
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Les adjudications de soumissions créent automatiquement des engagements dans le CFC correspondant.
            </p>
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white mb-1">
              QR-factures suisses
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Support des QR-factures pour EG, sous-traitants et acomptes acheteurs.
            </p>
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white mb-1">
              Export comptable
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Exportation vers Winbiz, Crésus, Bexio, FIDES pour intégration comptable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
