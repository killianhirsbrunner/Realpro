import { Link } from 'react-router-dom';
import { ExternalLink, Home, CheckCircle2, Clock, AlertCircle, User, FileText } from 'lucide-react';

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
        color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        icon: Clock,
      },
      CONTRACT_SIGNED: {
        label: 'Contrat signé',
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        icon: CheckCircle2,
      },
      NOTARY_IN_PROGRESS: {
        label: 'Chez notaire',
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        icon: AlertCircle,
      },
      COMPLETED: {
        label: 'Finalisé',
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        icon: CheckCircle2,
      },
    };

    return configs[status] || configs.RESERVED;
  };

  if (buyers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
        </div>
        <p className="text-neutral-700 dark:text-neutral-300 font-medium">Aucun acheteur pour le moment</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Les prospects convertis apparaîtront ici
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">
                Acheteur
              </th>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">
                Lot
              </th>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">
                Prix
              </th>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">
                Statut
              </th>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">
                Dossier
              </th>
              <th className="p-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">
                Date
              </th>
              <th className="p-4 text-right font-semibold text-neutral-900 dark:text-neutral-100">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {buyers.map((buyer) => {
              const statusConfig = getStatusConfig(buyer.status);
              const StatusIcon = statusConfig.icon;
              const docsProgress = buyer.completedDocuments && buyer.totalDocuments
                ? (buyer.completedDocuments / buyer.totalDocuments) * 100
                : 0;

              return (
                <tr
                  key={buyer.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">
                        {buyer.name}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        {buyer.email}
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        Lot {buyer.lotNumber}
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {formatCurrency(buyer.salePrice)}
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </td>

                  <td className="p-4">
                    {buyer.completedDocuments !== undefined && buyer.totalDocuments !== undefined ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <FileText className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                          <span className="text-neutral-600 dark:text-neutral-400">
                            {buyer.completedDocuments}/{buyer.totalDocuments}
                          </span>
                        </div>
                        <div className="w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5">
                          <div
                            className={`h-full rounded-full transition-all ${
                              docsProgress === 100
                                ? 'bg-green-600 dark:bg-green-500'
                                : 'bg-brand-600 dark:bg-brand-500'
                            }`}
                            style={{ width: `${docsProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 italic">Non défini</span>
                    )}
                  </td>

                  <td className="p-4 text-neutral-600 dark:text-neutral-400">
                    {formatDate(buyer.contractDate || buyer.reservationDate)}
                  </td>

                  <td className="p-4 text-right">
                    <Link
                      to={`/projects/${projectId}/crm/buyers/${buyer.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg font-medium transition-colors"
                    >
                      Voir
                      <ExternalLink className="w-3.5 h-3.5" />
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
