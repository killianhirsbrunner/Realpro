import { Card } from '../ui/Card';
import { FileText, Calendar, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { CFCInvoice } from '../../hooks/useCFC';

interface CfcInvoicesCardProps {
  invoices: CFCInvoice[];
}

export function CfcInvoicesCard({ invoices }: CfcInvoicesCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'orange';
      case 'overdue':
        return 'red';
      case 'draft':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'Payé';
      case 'pending':
        return 'En attente';
      case 'overdue':
        return 'En retard';
      case 'draft':
        return 'Brouillon';
      default:
        return status;
    }
  };

  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalPaid = invoices
    .filter(inv => inv.status.toLowerCase() === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Factures
          </h3>
          <div className="text-right">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Total facturé</p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              CHF {totalInvoiced.toLocaleString()}
            </p>
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Aucune facture pour ce poste CFC
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {invoices.map((invoice) => (
              <li
                key={invoice.id}
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-600 dark:hover:border-primary-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {invoice.label}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                        {invoice.date_issued && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(invoice.date_issued).toLocaleDateString('fr-CH')}</span>
                          </div>
                        )}
                        {invoice.date_due && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Échéance: {new Date(invoice.date_due).toLocaleDateString('fr-CH')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(invoice.status) as any}>
                    {getStatusLabel(invoice.status)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">Montant</span>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                    CHF {invoice.amount.toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {totalInvoiced > 0 && (
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Payé / Total facturé</span>
              <span className="font-semibold text-neutral-900 dark:text-white">
                CHF {totalPaid.toLocaleString()} / CHF {totalInvoiced.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all"
                style={{ width: `${(totalPaid / totalInvoiced) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
