import { FileText, Calendar, User, DollarSign, CheckCircle, Clock, Download, Send } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '../ui/Button';

interface InvoiceDetailCardProps {
  invoice: {
    id: string;
    invoiceNumber: string;
    buyerName: string;
    amount: number;
    dueDate: string;
    paid: boolean;
    paidDate: string | null;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    createdAt?: string;
    items?: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
  };
}

export function InvoiceDetailCard({ invoice }: InvoiceDetailCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getStatusIcon = () => {
    if (invoice.paid) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    return <Clock className="w-5 h-5 text-orange-600" />;
  };

  const getStatusText = () => {
    if (invoice.paid) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
          <CheckCircle className="w-4 h-4" />
          Payée
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
        <Clock className="w-4 h-4" />
        En attente
        </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 dark:bg-brand-600/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Facture {invoice.invoiceNumber}
                </h3>
                {invoice.createdAt && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Créée le {formatDate(invoice.createdAt)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            {getStatusText()}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              {!invoice.paid && (
                <Button size="sm" className="bg-brand-600 hover:bg-brand-700">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                Acheteur
              </p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {invoice.buyerName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                Échéance
              </p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                Montant total
              </p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {formatCurrency(invoice.amount)}
              </p>
            </div>
          </div>
        </div>

        {invoice.paid && invoice.paidDate && (
          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-400">
              <strong>Payée le {formatDate(invoice.paidDate)}</strong>
            </p>
          </div>
        )}

        {invoice.items && invoice.items.length > 0 && (
          <div className="mt-8">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
              Détail de la facture
            </h4>
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Prix unitaire
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                        {item.description}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-neutral-700 dark:text-neutral-300">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-neutral-700 dark:text-neutral-300">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-neutral-900 dark:text-white">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-neutral-50 dark:bg-neutral-800/50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right text-sm font-semibold text-neutral-900 dark:text-white">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right text-lg font-bold text-brand-600 dark:text-brand-400">
                      {formatCurrency(invoice.amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
