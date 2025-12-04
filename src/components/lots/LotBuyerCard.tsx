import { Card } from '../ui/Card';
import { User, Mail, Phone, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LotBuyerCardProps {
  lot: {
    buyer?: {
      id: string;
      name: string;
      email?: string;
      phone?: string;
    };
  };
  projectId?: string;
}

export function LotBuyerCard({ lot, projectId }: LotBuyerCardProps) {
  if (!lot.buyer) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Acheteur
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Aucun acheteur assigné
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
        Acheteur
      </h2>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-neutral-400" />
          <div className="flex-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Nom</p>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{lot.buyer.name}</p>
          </div>
        </div>

        {lot.buyer.email && (
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-neutral-400" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Email</p>
              <a
                href={`mailto:${lot.buyer.email}`}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {lot.buyer.email}
              </a>
            </div>
          </div>
        )}

        {lot.buyer.phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-neutral-400" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Téléphone</p>
              <a
                href={`tel:${lot.buyer.phone}`}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {lot.buyer.phone}
              </a>
            </div>
          </div>
        )}

        {projectId && (
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Link
              to={`/projects/${projectId}/buyers`}
              className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Voir le dossier complet
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
