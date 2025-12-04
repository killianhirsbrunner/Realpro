import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Edit, Trash2, Eye, FileText, DollarSign } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useLotDetails } from '../hooks/useLotDetails';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { LotOverviewCard } from '../components/lots/LotOverviewCard';
import { LotSurfacesCard } from '../components/lots/LotSurfacesCard';
import { LotPriceCard } from '../components/lots/LotPriceCard';
import { LotBuyerCard } from '../components/lots/LotBuyerCard';
import { LotDocumentsCard } from '../components/lots/LotDocumentsCard';
import { LotPlansCard } from '../components/lots/LotPlansCard';
import { LotHistoryCard } from '../components/lots/LotHistoryCard';
import { LotMaterialsCard } from '../components/lots/LotMaterialsCard';
import { LotCRMCard } from '../components/lots/LotCRMCard';
import { LotFinanceCard } from '../components/lots/LotFinanceCard';
import { LotModificationsCard } from '../components/lots/LotModificationsCard';
import LotQuickActions from '../components/lots/LotQuickActions';
import { RealProTabs } from '../components/realpro/RealProTabs';

export function ProjectLotDetail() {
  const { t } = useI18n();
  const { projectId, lotId } = useParams<{ projectId: string; lotId: string }>();
  const { lot, loading, error, refresh } = useLotDetails(projectId, lotId);

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

  if (error || !lot) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error || 'Lot non trouvé'}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: <Eye className="w-4 h-4" />,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <LotOverviewCard lot={lot} />
            <LotSurfacesCard lot={lot} />
            <LotPriceCard lot={lot} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <LotBuyerCard lot={lot} projectId={projectId} />
            <LotCRMCard lot={lot} projectId={projectId!} />
            <LotPlansCard lot={lot} />
          </div>
        </div>
      )
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <LotDocumentsCard lot={lot} />
          <LotHistoryCard lot={lot} />
        </div>
      )
    },
    {
      id: 'finance',
      label: 'Finances',
      icon: <DollarSign className="w-4 h-4" />,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LotPriceCard lot={lot} />
          <LotFinanceCard lot={lot} projectId={projectId!} />
        </div>
      )
    },
    {
      id: 'modifications',
      label: 'Modifications',
      icon: <Edit className="w-4 h-4" />,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LotMaterialsCard lot={lot} />
          <LotModificationsCard lot={lot} projectId={projectId!} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 px-10 py-8">
      <div>
        <Link
          to={`/projects/${projectId}/lots`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux lots
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Lot {lot.code}
            </h1>
            <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
              {lot.type} • {lot.rooms_count} pièces • {lot.surface_total} m²
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <LotQuickActions
              lot={lot}
              projectId={projectId!}
              onStatusChange={refresh}
            />
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-brand-50 to-brand-50 dark:from-brand-900/20 dark:to-brand-900/20 rounded-2xl p-6 border border-brand-200 dark:border-brand-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Prix total</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                CHF {lot.price_total?.toLocaleString('fr-CH')}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Surface</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {lot.surface_total} m²
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Étage</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {lot.floor_level ?? '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Statut</p>
              <p className={`text-2xl font-bold ${
                lot.status === 'AVAILABLE' ? 'text-green-600' :
                lot.status === 'SOLD' ? 'text-blue-600' :
                'text-amber-600'
              }`}>
                {lot.status === 'AVAILABLE' ? 'Libre' :
                 lot.status === 'SOLD' ? 'Vendu' :
                 lot.status === 'RESERVED' ? 'Réservé' : lot.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      <RealProTabs tabs={tabs} defaultTab="overview" />
    </div>
  );
}
