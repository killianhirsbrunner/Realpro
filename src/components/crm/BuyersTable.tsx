import { Link } from 'react-router-dom';
import { ExternalLink, Home, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Buyer {
  id: string;
  name: string;
  email: string;
  lotNumber: string;
  lotId: string;
  status: 'RESERVED' | 'CONTRACT_SIGNED' | 'NOTARY_IN_PROGRESS' | 'COMPLETED';
  salePrice: number;
  reservationDate?: string;
  contractDate?: string;
  completedDocuments?: number;
  totalDocuments?: number;
}

interface BuyersTableProps {
  buyers: Buyer[];
  projectId: string;
}

export default function BuyersTable({ buyers, projectId }: BuyersTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; icon: any }> = {
      RESERVED: {
        label: 'Réservé',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        icon: Clock,
      },
      CONTRACT_SIGNED: {
        label: 'Contrat signé',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        icon: CheckCircle2,
      },
      NOTARY_IN_PROGRESS: {
        label: 'Chez notaire',
        color: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
        icon: AlertCircle,
      },
      COMPLETED: {
        label: 'Finalisé',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: CheckCircle2,
      },
    };

    return configs[status] || configs.RESERVED;
  };

  if (buyers.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">Aucun acheteur pour le moment</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Les prospects convertis apparaîtront ici
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden bg-white dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-900 dark:text-white">
                Acheteur
              </th>
              <th className="p-4 text-left font-semibold text-gray-900 dark:text-white">
                Lot
              </th>
              <th className="p-4 text-left font-semibold text-gray-900 dark:text-white">
                Prix
              </th>
              <th className="p-4 text-left font-semibold text-gray-900 dark:text-white">
                Statut
              </th>
              <th className="p-4 text-left font-semibold text-gray-900 dark:text-white">
                Dossier
              </th>
              <th className="p-4 text-left font-semibold text-gray-900 dark:text-white">
                Date
              </th>
              <th className="p-4 text-right font-semibold text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {buyers.map((buyer) => {
              const statusConfig = getStatusConfig(buyer.status);
              const StatusIcon = statusConfig.icon;
              const docsProgress = buyer.completedDocuments && buyer.totalDocuments
                ? (buyer.completedDocuments / buyer.totalDocuments) * 100
                : 0;

              return (
                <tr
                  key={buyer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {buyer.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {buyer.email}
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        Lot {buyer.lotNumber}
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(buyer.salePrice)}
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </td>

                  <td className="p-4">
                    {buyer.completedDocuments !== undefined && buyer.totalDocuments !== undefined ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            {buyer.completedDocuments}/{buyer.totalDocuments}
                          </span>
                        </div>
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${docsProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {formatDate(buyer.contractDate || buyer.reservationDate)}
                  </td>

                  <td className="p-4 text-right">
                    <Link
                      to={`/projects/${projectId}/buyers/${buyer.id}`}
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      Ouvrir
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
