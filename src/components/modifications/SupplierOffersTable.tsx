import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { FileText, Calendar, Building2, DollarSign } from 'lucide-react';
import { formatDate } from '../../lib/utils/format';

interface SupplierOffer {
  id: string;
  lot_number: string;
  supplier_name: string;
  price?: number;
  status: string;
  version: number;
  created_at: string;
  description?: string;
}

interface SupplierOffersTableProps {
  offers: SupplierOffer[];
  projectId: string;
}

export function SupplierOffersTable({ offers, projectId }: SupplierOffersTableProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
      pending_client: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
      client_approved: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
      architect_approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      final: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[status] || colors.draft;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Brouillon',
      pending_client: 'En attente client',
      client_approved: 'Validée client',
      architect_approved: 'Validée architecte',
      final: 'Finalisée',
      rejected: 'Refusée',
    };
    return labels[status] || status;
  };

  return (
    <div className="grid gap-6">
      {offers.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">Aucune offre fournisseur</p>
        </Card>
      ) : (
        offers.map((offer) => (
          <Card
            key={offer.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/projects/${projectId}/modifications/offers/${offer.id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Lot {offer.lot_number}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    v{offer.version}
                  </span>
                </div>
                {offer.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {offer.description}
                  </p>
                )}
              </div>
              <Badge className={getStatusColor(offer.status)}>
                {getStatusLabel(offer.status)}
              </Badge>
            </div>

            <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>{offer.supplier_name}</span>
              </div>
              {offer.price && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>CHF {offer.price.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(offer.created_at)}</span>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
