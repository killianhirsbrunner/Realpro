import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Edit, Mail, Phone } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useBuyerDetails } from '../hooks/useBuyerDetails';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { BuyerInfoCard } from '../components/buyers/BuyerInfoCard';
import { BuyerDocumentsCard } from '../components/buyers/BuyerDocumentsCard';
import { BuyerPaymentsCard } from '../components/buyers/BuyerPaymentsCard';
import { BuyerNotaryCard } from '../components/buyers/BuyerNotaryCard';
import { BuyerMessagesCard } from '../components/buyers/BuyerMessagesCard';
import { BuyerHistoryCard } from '../components/buyers/BuyerHistoryCard';

export function BuyerDetail() {
  const { t } = useI18n();
  const { projectId, buyerId } = useParams<{ projectId: string; buyerId: string }>();
  const { buyer, loading, error } = useBuyerDetails(projectId, buyerId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !buyer) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error || 'Acheteur non trouvé'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/buyers`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux acheteurs
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {buyer.name}
            </h1>
            {buyer.lotNumber && (
              <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
                Lot {buyer.lotNumber}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {buyer.email && (
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            )}
            {buyer.phone && (
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Quick Info */}
        <div className="space-y-6">
          <BuyerInfoCard buyer={buyer} />
          <BuyerDocumentsCard buyer={buyer} />
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          <BuyerPaymentsCard buyer={buyer} />
          <BuyerNotaryCard buyer={buyer} />
          <BuyerMessagesCard buyer={buyer} />
          <BuyerHistoryCard buyer={buyer} />
        </div>
      </div>
    </div>
  );
}
