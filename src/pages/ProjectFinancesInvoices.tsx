import { useParams, Link } from 'react-router-dom';
import { Plus, ArrowLeft, FileText, Download } from 'lucide-react';
import { useFinanceDashboard } from '../hooks/useFinanceDashboard';
import { InvoiceTable } from '../components/finance/InvoiceTable';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { ScrollReveal } from '../components/ui/PageTransition';

export function ProjectFinancesInvoices() {
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
        message="Impossible de charger les factures"
      />
    );
  }

  const totalInvoiced = data.invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = data.invoices
    .filter(inv => inv.paid)
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = totalInvoiced - totalPaid;
  const paidCount = data.invoices.filter(inv => inv.paid).length;

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
            Factures acheteurs
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Gestion des factures et paiements
          </p>
        </div>

        <Link to={`/projects/${projectId}/finances/invoices/new`}>
          <Button size="sm" className="bg-brand-600 hover:bg-brand-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle facture
          </Button>
        </Link>
      </div>

      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <FileText className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Total factures
            </p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {data.invoices.length}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border border-brand-200/50 dark:border-brand-800/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-3 h-3 rounded-full bg-brand-600"></div>
            </div>
            <p className="text-sm text-brand-700 dark:text-brand-400 font-medium mb-1">
              Montant facturé
            </p>
            <p className="text-2xl font-bold text-brand-900 dark:text-brand-300">
              {formatCurrency(totalInvoiced)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 border border-green-200/50 dark:border-green-800/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
            </div>
            <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-1">
              Payé
            </p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">
              {formatCurrency(totalPaid)}
            </p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1">
              {paidCount} facture{paidCount > 1 ? 's' : ''}
            </p>
          </div>

          <div className="bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-800/20 border border-brand-200/50 dark:border-brand-800/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-3 h-3 rounded-full bg-brand-600"></div>
            </div>
            <p className="text-sm text-brand-700 dark:text-brand-400 font-medium mb-1">
              En attente
            </p>
            <p className="text-2xl font-bold text-brand-900 dark:text-brand-300">
              {formatCurrency(pendingAmount)}
            </p>
            <p className="text-xs text-brand-600 dark:text-brand-500 mt-1">
              {data.invoices.length - paidCount} facture{data.invoices.length - paidCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                Liste des factures
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Toutes les factures du projet
              </p>
            </div>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>

          <InvoiceTable invoices={data.invoices} projectId={projectId!} />
        </div>
      </ScrollReveal>
    </div>
  );
}
