import { Mail, Phone, MapPin, Calendar, Tag, MessageSquare } from 'lucide-react';

interface Prospect {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  source: string;
  createdAt: string;
  lastContact?: string;
  notes?: string;
  budget?: number;
  targetLot?: string;
}

interface ProspectInfoCardProps {
  prospect: Prospect;
}

export default function ProspectInfoCard({ prospect }: ProspectInfoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CH', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact Information */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informations de contact
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <a
                href={`mailto:${prospect.email}`}
                className="text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400"
              >
                {prospect.email}
              </a>
            </div>
          </div>

          {prospect.phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Téléphone</p>
                <a
                  href={`tel:${prospect.phone}`}
                  className="text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400"
                >
                  {prospect.phone}
                </a>
              </div>
            </div>
          )}

          {prospect.address && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Adresse</p>
                <p className="text-gray-900 dark:text-white">{prospect.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Détails supplémentaires
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Source</p>
              <p className="text-gray-900 dark:text-white capitalize">{prospect.source}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date d'ajout</p>
              <p className="text-gray-900 dark:text-white">{formatDate(prospect.createdAt)}</p>
            </div>
          </div>

          {prospect.lastContact && (
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dernier contact</p>
                <p className="text-gray-900 dark:text-white">{formatDate(prospect.lastContact)}</p>
              </div>
            </div>
          )}

          {prospect.budget && (
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
                <p className="text-gray-900 dark:text-white font-semibold">
                  {formatCurrency(prospect.budget)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {prospect.notes && (
        <div className="lg:col-span-2 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {prospect.notes}
          </p>
        </div>
      )}
    </div>
  );
}
