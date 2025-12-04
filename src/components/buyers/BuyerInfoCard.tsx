import { Card } from '../ui/Card';
import { User, Mail, Phone, MapPin, Tag } from 'lucide-react';

interface BuyerInfoCardProps {
  buyer: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    saleType?: string;
    status: string;
  };
}

export function BuyerInfoCard({ buyer }: BuyerInfoCardProps) {
  const statusLabels: Record<string, string> = {
    PROSPECT: 'Prospect',
    RESERVED: 'Réservé',
    IN_PROGRESS: 'En cours',
    SIGNED: 'Signé',
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
        Informations personnelles
      </h2>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-neutral-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Nom complet</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{buyer.name}</p>
          </div>
        </div>

        {buyer.email && (
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-neutral-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Email</p>
              <a
                href={`mailto:${buyer.email}`}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {buyer.email}
              </a>
            </div>
          </div>
        )}

        {buyer.phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-neutral-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Téléphone</p>
              <a
                href={`tel:${buyer.phone}`}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {buyer.phone}
              </a>
            </div>
          </div>
        )}

        {buyer.address && (
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-neutral-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Adresse</p>
              <p className="text-sm text-neutral-900 dark:text-white">{buyer.address}</p>
            </div>
          </div>
        )}

        {buyer.saleType && (
          <div className="flex items-center gap-3">
            <Tag className="h-5 w-5 text-neutral-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Type de vente</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white uppercase">
                {buyer.saleType}
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Statut</p>
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            {statusLabels[buyer.status] || buyer.status}
          </p>
        </div>
      </div>
    </Card>
  );
}
