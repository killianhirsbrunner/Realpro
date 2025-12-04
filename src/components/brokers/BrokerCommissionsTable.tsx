import { RealProCard } from '../realpro/RealProCard';
import { RealProBadge } from '../realpro/RealProBadge';
import { Download, Check, Clock, XCircle } from 'lucide-react';
import { RealProButton } from '../realpro/RealProButton';

interface Commission {
  id: string;
  lotCode: string;
  buyer: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  saleDate: string;
  paidDate?: string;
}

interface BrokerCommissionsTableProps {
  commissions: Commission[];
}

export function BrokerCommissionsTable({ commissions }: BrokerCommissionsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <RealProBadge variant="warning">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </RealProBadge>
        );
      case 'approved':
        return (
          <RealProBadge variant="info">
            <Check className="w-3 h-3 mr-1" />
            Approuvée
          </RealProBadge>
        );
      case 'paid':
        return (
          <RealProBadge variant="success">
            <Check className="w-3 h-3 mr-1" />
            Payée
          </RealProBadge>
        );
      default:
        return <RealProBadge>{status}</RealProBadge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0);
  const paidCommissions = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);
  const pendingCommissions = commissions
    .filter(c => c.status === 'pending' || c.status === 'approved')
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <RealProCard className="overflow-hidden">
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Commissions
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Suivi des commissions et paiements
            </p>
          </div>
          <RealProButton variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </RealProButton>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
              Total commissions
            </p>
            <p className="text-xl font-semibold text-neutral-900 dark:text-white">
              {formatCurrency(totalCommissions)}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-xs text-green-700 dark:text-green-400 mb-1">
              Payées
            </p>
            <p className="text-xl font-semibold text-green-900 dark:text-green-300">
              {formatCurrency(paidCommissions)}
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <p className="text-xs text-orange-700 dark:text-orange-400 mb-1">
              En attente
            </p>
            <p className="text-xl font-semibold text-orange-900 dark:text-orange-300">
              {formatCurrency(pendingCommissions)}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Lot
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Acheteur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Date vente
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Commission
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Date paiement
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
            {commissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <XCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Aucune commission pour le moment
                  </p>
                </td>
              </tr>
            ) : (
              commissions.map((commission) => (
                <tr
                  key={commission.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-neutral-900 dark:text-white">
                      {commission.lotCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900 dark:text-white">
                      {commission.buyer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                    {formatDate(commission.saleDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {formatCurrency(commission.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(commission.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                    {commission.paidDate ? formatDate(commission.paidDate) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </RealProCard>
  );
}
