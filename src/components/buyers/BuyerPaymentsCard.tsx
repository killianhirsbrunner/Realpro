import { Card } from '../ui/Card';
import { CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatCHF } from '../../lib/utils/format';

interface BuyerPaymentsCardProps {
  buyer: {
    payments: Array<{
      id: string;
      label: string;
      amount: number;
      status: string;
      due_date?: string;
    }>;
  };
}

export function BuyerPaymentsCard({ buyer }: BuyerPaymentsCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-secondary-600" />;
      case 'OVERDUE':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PAID: 'Payé',
      PENDING: 'En attente',
      OVERDUE: 'En retard',
      SCHEDULED: 'Planifié',
    };
    return labels[status] || status;
  };

  const totalAmount = buyer.payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = buyer.payments
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Acomptes & Paiements
        </h2>
        <div className="text-right">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Total</p>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
            {formatCHF(totalAmount)}
          </p>
        </div>
      </div>

      {buyer.payments.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Aucun paiement planifié
        </p>
      ) : (
        <>
          <div className="mb-6 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Payé</span>
              <span className="text-sm font-medium text-green-600">{formatCHF(paidAmount)}</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {buyer.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex items-center gap-3 flex-1">
                  <CreditCard className="h-5 w-5 text-neutral-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {payment.label}
                    </p>
                    {payment.due_date && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Échéance: {new Date(payment.due_date).toLocaleDateString('fr-CH')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {formatCHF(payment.amount)}
                  </span>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(payment.status)}
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      {getStatusLabel(payment.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
