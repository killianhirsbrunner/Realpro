import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, RefreshCw, Download } from 'lucide-react';
import { useBuyerInvoices } from '../hooks/useBuyerInvoices';
import { PaymentPlanTable } from '../components/finance/PaymentPlanTable';

export default function ProjectFinancesPayments() {
  const { projectId } = useParams<{ projectId: string }>();
  const { invoices, loading, error, markAsPaid, refresh } = useBuyerInvoices(projectId!);

  const handleDownloadQR = (invoice: any) => {
    if (invoice.qr_pdf_url) {
      window.open(invoice.qr_pdf_url, '_blank');
    }
  };

  const handleMarkAsPaid = async (invoiceId: string, amountCents: number) => {
    if (confirm('Marquer cette facture comme payée ?')) {
      await markAsPaid(invoiceId, amountCents);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">Chargement des acomptes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 lg:px-10 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-700 dark:text-red-300 font-medium">
            Erreur lors du chargement des acomptes
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount_total_cents, 0) / 100;
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.amount_paid_cents, 0) / 100;
  const pendingInvoices = invoices.filter(inv => inv.status === 'PENDING');
  const overdueInvoices = invoices.filter(inv =>
    inv.status === 'PENDING' && inv.due_date && new Date(inv.due_date) < new Date()
  );

  return (
    <div className="px-6 lg:px-10 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/projects/${projectId}/finances`}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Acomptes Acheteurs
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Gérer les factures QR suisses et les échéanciers de paiement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
            <Plus className="w-4 h-4" />
            Nouvelle facture
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 rounded-xl p-6 border border-brand-200 dark:border-brand-800">
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            {invoices.length}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Factures total
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 rounded-xl p-6 border border-secondary-200 dark:border-secondary-800">
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            {pendingInvoices.length}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            En attente
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {overdueInvoices.length}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            En retard
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            CHF {totalPaid.toLocaleString('fr-CH', { minimumFractionDigits: 0 })}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Encaissé
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">
          Progression des encaissements
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-700 dark:text-neutral-300">Facturé</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              CHF {totalAmount.toLocaleString('fr-CH', { minimumFractionDigits: 0 })}
            </span>
          </div>
          <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
              style={{
                width: `${Math.min((totalPaid / totalAmount) * 100 || 0, 100)}%`
              }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-700 dark:text-neutral-300">Encaissé</span>
            <span className="font-semibold text-green-600">
              CHF {totalPaid.toLocaleString('fr-CH', { minimumFractionDigits: 0 })} ({((totalPaid / totalAmount) * 100 || 0).toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      <PaymentPlanTable
        invoices={invoices}
        onDownloadQR={handleDownloadQR}
        onMarkAsPaid={handleMarkAsPaid}
      />

      <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-brand-900 dark:text-brand-100 mb-2">
          Factures QR suisses
        </h3>
        <p className="text-sm text-brand-800 dark:text-brand-200">
          Les factures QR suisses sont conformes aux exigences de SIX et PostFinance.
          Les acheteurs peuvent scanner le code QR pour effectuer le paiement directement depuis leur e-banking.
        </p>
      </div>
    </div>
  );
}
