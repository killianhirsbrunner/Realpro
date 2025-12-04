import { Link, useParams } from 'react-router-dom';
import { DollarSign, FileText, Users, Receipt, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useCfcTable } from '../hooks/useCfcTable';
import { useContracts } from '../hooks/useContracts';
import { useBuyerInvoices } from '../hooks/useBuyerInvoices';

export default function ProjectFinances() {
  const { projectId } = useParams<{ projectId: string }>();
  const { totals: cfcTotals, loading: cfcLoading } = useCfcTable(projectId!);
  const { contracts, loading: contractsLoading } = useContracts(projectId!);
  const { invoices, loading: invoicesLoading } = useBuyerInvoices(projectId!);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const buyerInvoicesTotal = invoices.reduce((sum, inv) => sum + inv.amount_total_cents / 100, 0);
  const buyerInvoicesPaid = invoices.reduce((sum, inv) => sum + inv.amount_paid_cents / 100, 0);
  const pendingInvoices = invoices.filter(inv => inv.status === 'PENDING').length;

  return (
    <div className="px-6 lg:px-10 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Finances & Comptabilité CFC
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Gestion complète des budgets, contrats et acomptes acheteurs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 rounded-2xl p-6 border border-brand-200 dark:border-brand-800">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-brand-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            {!cfcLoading && cfcTotals.invoiced > cfcTotals.budget && (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            {cfcLoading ? '...' : formatCurrency(cfcTotals.budget)}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Budget Total CFC
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 rounded-2xl p-6 border border-brand-200 dark:border-brand-800">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-brand-500 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            {cfcLoading ? '...' : formatCurrency(cfcTotals.engaged)}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Montant Engagé
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 rounded-2xl p-6 border border-brand-200 dark:border-brand-800">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-brand-500 rounded-lg">
              <Receipt className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            {cfcLoading ? '...' : formatCurrency(cfcTotals.invoiced)}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Montant Facturé
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            {invoicesLoading ? '...' : formatCurrency(buyerInvoicesPaid)}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Acomptes Encaissés
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Link
          to={`/projects/${projectId}/finances/cfc`}
          className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
              <FileText className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Budgets & CFC
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Gérer les budgets par code CFC, suivre les engagements et dépenses
          </p>
          {!cfcLoading && (
            <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <span>{cfcTotals.budget > 0 ? `${((cfcTotals.invoiced / cfcTotals.budget) * 100).toFixed(1)}% utilisé` : '0% utilisé'}</span>
              <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
              <span>{formatCurrency(cfcTotals.budget - cfcTotals.invoiced)} disponible</span>
            </div>
          )}
        </Link>

        <Link
          to={`/projects/${projectId}/finances/contracts`}
          className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
              <Users className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Contrats Entreprises
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Gérer les contrats EG et sous-traitants, ventiler par CFC
          </p>
          {!contractsLoading && (
            <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <span>{contracts.length} contrat{contracts.length > 1 ? 's' : ''}</span>
              <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
              <span>
                {contracts.filter(c => c.status === 'SIGNED').length} signé{contracts.filter(c => c.status === 'SIGNED').length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </Link>

        <Link
          to={`/projects/${projectId}/finances/payments`}
          className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <Receipt className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Acomptes Acheteurs
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Générer et suivre les factures QR suisses, gérer les échéanciers
          </p>
          {!invoicesLoading && (
            <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <span>{invoices.length} facture{invoices.length > 1 ? 's' : ''}</span>
              <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
              <span>{pendingInvoices} en attente</span>
            </div>
          )}
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Aperçu Financier
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">
              Budget CFC vs Dépensé
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-700 dark:text-neutral-300">Budget total</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(cfcTotals.budget)}
                </span>
              </div>
              <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
                  style={{
                    width: `${Math.min((cfcTotals.invoiced / cfcTotals.budget) * 100 || 0, 100)}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-700 dark:text-neutral-300">Dépensé</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(cfcTotals.invoiced)} ({((cfcTotals.invoiced / cfcTotals.budget) * 100 || 0).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">
              Acomptes Acheteurs
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-700 dark:text-neutral-300">Facturé</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(buyerInvoicesTotal)}
                </span>
              </div>
              <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{
                    width: `${Math.min((buyerInvoicesPaid / buyerInvoicesTotal) * 100 || 0, 100)}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-700 dark:text-neutral-300">Encaissé</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(buyerInvoicesPaid)} ({((buyerInvoicesPaid / buyerInvoicesTotal) * 100 || 0).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
