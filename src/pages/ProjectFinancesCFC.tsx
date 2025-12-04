import { useParams } from 'react-router-dom';
import { DollarSign, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFinanceDashboard } from '../hooks/useFinanceDashboard';
import { CFCBudgetTable } from '../components/finance/CFCBudgetTable';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { ScrollReveal } from '../components/ui/PageTransition';

export function ProjectFinancesCFC() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, loading, error } = useFinanceDashboard(projectId!);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Erreur de chargement"
        message="Impossible de charger les budgets CFC"
      />
    );
  }

  const totalBudget = data.cfcs.reduce((sum, cfc) => sum + cfc.budget, 0);
  const totalEngaged = data.cfcs.reduce((sum, cfc) => sum + cfc.engagedAmount, 0);
  const totalInvoiced = data.cfcs.reduce((sum, cfc) => sum + cfc.invoicedAmount, 0);
  const totalPaid = data.cfcs.reduce((sum, cfc) => sum + cfc.paidAmount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link to={`/projects/${projectId}/finances`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Budgets CFC
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Compte Final de Construction - Suivi détaillé par compte
          </p>
        </div>
      </div>

      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-800/20 border border-brand-200/50 dark:border-brand-800/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
            <p className="text-sm text-brand-700 dark:text-brand-400 font-medium mb-1">
              Budget total
            </p>
            <p className="text-2xl font-bold text-brand-900 dark:text-brand-300">
              {formatCurrency(totalBudget)}
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-3 h-3 rounded-full bg-secondary-600"></div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Engagé
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {formatCurrency(totalEngaged)}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              {totalBudget > 0 ? ((totalEngaged / totalBudget) * 100).toFixed(1) : 0}% du budget
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Facturé
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {formatCurrency(totalInvoiced)}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              {totalBudget > 0 ? ((totalInvoiced / totalBudget) * 100).toFixed(1) : 0}% du budget
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Payé
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {formatCurrency(totalPaid)}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              {totalBudget > 0 ? ((totalPaid / totalBudget) * 100).toFixed(1) : 0}% du budget
            </p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              Détail des comptes CFC
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {data.cfcs.length} compte{data.cfcs.length > 1 ? 's' : ''} configuré{data.cfcs.length > 1 ? 's' : ''}
            </p>
          </div>

          <CFCBudgetTable cfcs={data.cfcs} />
        </div>
      </ScrollReveal>
    </div>
  );
}
