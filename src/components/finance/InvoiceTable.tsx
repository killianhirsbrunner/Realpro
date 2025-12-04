import { Link } from 'react-router-dom';
import { FileText, ExternalLink, Calendar, AlertCircle } from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvoiceTableProps {
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    buyerName: string;
    amount: number;
    dueDate: string;
    paid: boolean;
    paidDate: string | null;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
  }>;
  projectId: string;
}

export function InvoiceTable({ invoices, projectId }: InvoiceTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd MMM yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (invoice: InvoiceTableProps['invoices'][0]) => {
    if (invoice.paid) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
          Payé
        </span>
      );
    }

    const isOverdue = isAfter(new Date(), parseISO(invoice.dueDate));

    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
          <AlertCircle className="w-3 h-3" />
          En retard
        </span>
      );
    }

    if (invoice.status === 'sent') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400">
          En attente
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400">
        Brouillon
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                N° Facture
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                Acheteur
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                Échéance
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neutral-400" />
                    <span className="font-mono text-sm font-medium text-neutral-900 dark:text-white">
                      {invoice.invoiceNumber}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {invoice.buyerName}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {formatCurrency(invoice.amount)}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(invoice.dueDate)}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(invoice)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
                    to={`/projects/${projectId}/finances/invoices/${invoice.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                  >
                    Ouvrir
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invoices.length === 0 && (
        <div className="py-12 text-center">
          <FileText className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Aucune facture pour ce projet
          </p>
        </div>
      )}
    </div>
  );
}
