import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCHF, formatDate } from '../../lib/utils/format';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface Payment {
  id: string;
  buyer_name: string;
  lot_number: string;
  amount: number;
  due_date: string;
  status: string;
  payment_date?: string;
}

interface FinanceSummary {
  total_expected: number;
  total_paid: number;
  total_pending: number;
  total_overdue: number;
}

interface FinanceTableProps {
  finances: Payment[];
  summary: FinanceSummary;
}

export function FinanceTable({ finances, summary }: FinanceTableProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[status] || colors.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: 'Payé',
      pending: 'En attente',
      overdue: 'En retard',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-brand-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Attendu</p>
          <p className="text-2xl font-semibold mt-2">{formatCHF(summary.total_expected)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Payé</p>
          <p className="text-2xl font-semibold mt-2 text-green-600">{formatCHF(summary.total_paid)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">En attente</p>
          <p className="text-2xl font-semibold mt-2 text-brand-600">{formatCHF(summary.total_pending)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">En retard</p>
          <p className="text-2xl font-semibold mt-2 text-red-600">{formatCHF(summary.total_overdue)}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Acheteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Lot
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Échéance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Payé le
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
              {finances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-neutral-500">
                    Aucun paiement
                  </td>
                </tr>
              ) : (
                finances.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {payment.buyer_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-600 dark:text-neutral-300">
                        {payment.lot_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {formatCHF(payment.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-600 dark:text-neutral-300">
                        {formatDate(payment.due_date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <Badge className={getStatusColor(payment.status)}>
                          {getStatusLabel(payment.status)}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-600 dark:text-neutral-300">
                        {payment.payment_date ? formatDate(payment.payment_date) : '-'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
