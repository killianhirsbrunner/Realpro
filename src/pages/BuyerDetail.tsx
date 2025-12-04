import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Edit, Mail, Phone, Eye, DollarSign, FileText, Home } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useBuyerDetails } from '../hooks/useBuyerDetails';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { RealProTabs } from '../components/realpro/RealProTabs';
import { BuyerInfoCard } from '../components/buyers/BuyerInfoCard';
import { BuyerLotDetailCard } from '../components/buyers/BuyerLotDetailCard';
import { BuyerDocumentsCard } from '../components/buyers/BuyerDocumentsCard';
import { BuyerFinanceIntegrationCard } from '../components/buyers/BuyerFinanceIntegrationCard';
import { BuyerPaymentsCard } from '../components/buyers/BuyerPaymentsCard';
import { BuyerNotaryCard } from '../components/buyers/BuyerNotaryCard';
import { BuyerMessagesCard } from '../components/buyers/BuyerMessagesCard';
import { BuyerHistoryCard } from '../components/buyers/BuyerHistoryCard';
import { Badge } from '../components/ui/Badge';

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

  const getStatusBadge = () => {
    const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
      PROSPECT: { label: 'Prospect', variant: 'default' },
      RESERVED: { label: 'Réservé', variant: 'warning' },
      CONTRACT_SIGNED: { label: 'Contrat signé', variant: 'success' },
      NOTARY_IN_PROGRESS: { label: 'Chez notaire', variant: 'warning' },
      COMPLETED: { label: 'Finalisé', variant: 'success' },
      IN_PROGRESS: { label: 'En cours', variant: 'default' },
      SIGNED: { label: 'Signé', variant: 'success' },
    };
    return statusMap[buyer.status] || { label: buyer.status, variant: 'default' as const };
  };

  const statusBadge = getStatusBadge();

  const tabs = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: <Eye className="w-4 h-4" />,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <BuyerInfoCard buyer={buyer} />
            <BuyerLotDetailCard buyer={buyer} projectId={projectId!} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <BuyerFinanceIntegrationCard buyer={buyer} projectId={projectId!} />
            <BuyerNotaryCard buyer={buyer} />
          </div>
        </div>
      )
    },
    {
      id: 'finance',
      label: 'Finances',
      icon: <DollarSign className="w-4 h-4" />,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BuyerFinanceIntegrationCard buyer={buyer} projectId={projectId!} />
          <BuyerPaymentsCard buyer={buyer} />
        </div>
      )
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <BuyerDocumentsCard buyer={buyer} />
          <BuyerHistoryCard buyer={buyer} />
        </div>
      )
    },
    {
      id: 'lot',
      label: 'Lot',
      icon: <Home className="w-4 h-4" />,
      content: (
        <BuyerLotDetailCard buyer={buyer} projectId={projectId!} />
      )
    }
  ];

  return (
    <div className="space-y-8 px-10 py-8">
      <div>
        <Link
          to={`/projects/${projectId}/crm/buyers`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux acheteurs
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {buyer.name}
              </h1>
              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            </div>
            {buyer.lotNumber && (
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Lot {buyer.lotNumber}
              </p>
            )}
            {buyer.email && (
              <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                {buyer.email} {buyer.phone && `• ${buyer.phone}`}
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

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Statut</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {statusBadge.label}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Lot</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {buyer.lotNumber || 'Non assigné'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Type de vente</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {buyer.saleType || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Documents</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {buyer.documents?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <RealProTabs tabs={tabs} defaultTab="overview" />
    </div>
  );
}
