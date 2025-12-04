import { AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';
import clsx from 'clsx';

interface BuyerInvoice {
  id: string;
  label: string | null;
  type: string | null;
  amount_total_cents: number;
  amount_paid_cents: number;
  status: string;
  due_date: string | null;
  qr_pdf_url: string | null;
  buyer?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  lot?: {
    code: string;
  };
}

interface PaymentPlanTableProps {
  invoices: BuyerInvoice[];
  onDownloadQR?: (invoice: BuyerInvoice) => void;
  onMarkAsPaid?: (invoiceId: string, amount: number) => void;
}

export function PaymentPlanTable({ invoices, onDownloadQR, onMarkAsPaid }: PaymentPlanTableProps) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(cents / 100);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('fr-CH');
  };

  const getStatusBadge = (status: string, dueDate: string | null) => {
    const isOverdue = dueDate && new Date(dueDate) < new Date() && status === 'PENDING';

    if (status === 'PAID') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="w-3.5 h-3.5" />
          Payé
        </span>
      );
    }

    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="w-3.5 h-3.5" />
          En retard
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
        <Clock className="w-3.5 h-3.5" />
        En attente
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Lot
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Acheteur
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Libellé
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Payé
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Échéance
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-neutral-500 dark:text-neutral-400">
                  Aucune facture trouvée
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                    {invoice.lot?.code || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                    {invoice.buyer ? (
                      <div>
                        <div className="font-medium">
                          {invoice.buyer.first_name} {invoice.buyer.last_name}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {invoice.buyer.email}
                        </div>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                    {invoice.label || invoice.type || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(invoice.amount_total_cents)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-700 dark:text-neutral-300">
                    {formatCurrency(invoice.amount_paid_cents)}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                    {formatDate(invoice.due_date)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(invoice.status, invoice.due_date)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {invoice.qr_pdf_url && onDownloadQR && (
                        <button
                          onClick={() => onDownloadQR(invoice)}
                          className="p-2 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                          title="Télécharger QR-facture"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      {invoice.status !== 'PAID' && onMarkAsPaid && (
                        <button
                          onClick={() => onMarkAsPaid(invoice.id, invoice.amount_total_cents)}
                          className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        >
                          Marquer payé
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
