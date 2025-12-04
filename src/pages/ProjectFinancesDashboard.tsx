import { useParams, Link } from 'react-router-dom';
import { Plus, FileText, TrendingUp, DollarSign } from 'lucide-react';
import { useFinanceDashboard } from '../hooks/useFinanceDashboard';
import { FinanceKPIs } from '../components/finance/FinanceKPIs';
import { CFCBudgetTable } from '../components/finance/CFCBudgetTable';
import { InvoiceTable } from '../components/finance/InvoiceTable';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { ScrollReveal } from '../components/ui/PageTransition';

export function ProjectFinancesDashboard() {
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
        message="Impossible de charger les données financières"
      />
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Finances du projet
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Vue d'ensemble des budgets, factures et paiements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to={`/projects/${projectId}/finances/cfc`}>
            <Button variant="outline" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Budgets CFC
            </Button>
          </Link>
          <Link to={`/projects/${projectId}/finances/invoices/new`}>
            <Button size="sm" className="bg-brand-600 hover:bg-brand-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle facture
            </Button>
          </Link>
        </div>
      </div>

      <ScrollReveal>
        <FinanceKPIs data={data.kpis} />
      </ScrollReveal>

      <ScrollReveal>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-600/10 dark:bg-brand-600/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Budgets CFC
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Suivi des budgets par compte CFC
                </p>
              </div>
            </div>

            <Link to={`/projects/${projectId}/finances/cfc`}>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </Link>
          </div>

          <CFCBudgetTable cfcs={data.cfcs.slice(0, 5)} />

          {data.cfcs.length > 5 && (
            <div className="mt-4 text-center">
              <Link
                to={`/projects/${projectId}/finances/cfc`}
                className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
              >
                Voir tous les budgets CFC ({data.cfcs.length})
              </Link>
            </div>
          )}
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-600/10 dark:bg-green-600/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Factures acheteurs
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Dernières factures émises
                </p>
              </div>
            </div>

            <Link to={`/projects/${projectId}/finances/invoices`}>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </Link>
          </div>

          <InvoiceTable invoices={data.invoices} projectId={projectId!} />

          {data.invoices.length > 10 && (
            <div className="mt-4 text-center">
              <Link
                to={`/projects/${projectId}/finances/invoices`}
                className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
              >
                Voir toutes les factures
              </Link>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
