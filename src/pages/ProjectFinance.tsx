import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Wallet, Plus, Download } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useFinance } from '../hooks/useFinance';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { FinanceOverviewCard } from '../components/finance/FinanceOverviewCard';
import { BuyerFinanceTable } from '../components/finance/BuyerFinanceTable';
import { Button } from '../components/ui/Button';

export function ProjectFinance() {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();
  const { summary, buyers, loading, error } = useFinance(projectId);

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
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des finances</p>
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
          <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900">
            <Wallet className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Finances & Acomptes
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Gestion des paiements acheteurs et suivi des encaissements
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export comptable
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle facture
            </Button>
          </div>
        </div>
      </div>

      {summary && <FinanceOverviewCard summary={summary} />}

      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Finances par acheteur
        </h2>
        <BuyerFinanceTable buyers={buyers} projectId={projectId || ''} />
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-neutral-900 dark:text-white mb-1">
              QR-factures suisses
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Génération automatique de QR-factures conformes aux normes bancaires suisses avec IBAN QR.
            </p>
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white mb-1">
              Paiement en ligne
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Intégration Datatrans pour encaissement immédiat par carte bancaire avec sécurité 3D Secure.
            </p>
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white mb-1">
              Export comptable
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Exportation vers Winbiz, Crésus, Bexio, FIDES pour intégration automatique en comptabilité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
