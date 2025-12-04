import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Edit, Trash2, Eye } from 'lucide-react';
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

export function ProjectLotDetail() {
  const { t } = useI18n();
  const { projectId, lotId } = useParams<{ projectId: string; lotId: string }>();
  const { lot, loading, error } = useLotDetails(projectId, lotId);

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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/lots`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux lots
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Lot {lot.number}
            </h1>
            <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
              {lot.type} • {lot.rooms} pièces • {lot.surface} m²
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <LotOverviewCard lot={lot} />
          <LotSurfacesCard lot={lot} />
          <LotPriceCard lot={lot} />
          <LotBuyerCard lot={lot} projectId={projectId} />
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          <LotDocumentsCard lot={lot} />
          <LotPlansCard lot={lot} />
          <LotMaterialsCard lot={lot} />
          <LotHistoryCard lot={lot} />
        </div>
      </div>
    </div>
  );
}
