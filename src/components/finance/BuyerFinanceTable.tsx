import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ChevronRight, User } from 'lucide-react';
import type { BuyerFinance } from '../../hooks/useFinance';

interface BuyerFinanceTableProps {
  buyers: BuyerFinance[];
  projectId: string;
}

export function BuyerFinanceTable({ buyers, projectId }: BuyerFinanceTableProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'partial':
        return 'orange';
      case 'late':
        return 'red';
      case 'pending':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé';
      case 'partial':
        return 'Partiel';
      case 'late':
        return 'En retard';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
            <th className="text-left py-3 px-4 font-semibold text-neutral-900 dark:text-white">
              Acheteur
            </th>
            <th className="text-left py-3 px-4 font-semibold text-neutral-900 dark:text-white">
              Lot
            </th>
            <th className="text-right py-3 px-4 font-semibold text-neutral-900 dark:text-white">
              Facturé
            </th>
            <th className="text-right py-3 px-4 font-semibold text-neutral-900 dark:text-white">
              Payé
            </th>
            <th className="text-right py-3 px-4 font-semibold text-neutral-900 dark:text-white">
              Restant
            </th>
            <th className="text-center py-3 px-4 font-semibold text-neutral-900 dark:text-white">
              Statut
            </th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {buyers.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-neutral-500 dark:text-neutral-400">
                Aucun acheteur avec facturation
              </td>
            </tr>
          ) : (
            buyers.map((buyer) => {
              const percentPaid = buyer.invoiced > 0
                ? (buyer.paid / buyer.invoiced) * 100
                : 0;

              return (
                <tr
                  key={buyer.id}
                  className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  onClick={() => navigate(`/projects/${projectId}/finance/buyers/${buyer.id}`)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                        <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {buyer.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                    Lot {buyer.lotNumber}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-neutral-900 dark:text-white">
                    CHF {buyer.invoiced.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-700 dark:text-neutral-300">
                    <div>
                      CHF {buyer.paid.toLocaleString()}
                      <div className="text-xs text-neutral-500 mt-1">
                        {percentPaid.toFixed(1)}%
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-orange-600 dark:text-orange-400">
                    CHF {buyer.remaining.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={getStatusColor(buyer.status) as any}>
                      {getStatusLabel(buyer.status)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </Card>
  );
}
