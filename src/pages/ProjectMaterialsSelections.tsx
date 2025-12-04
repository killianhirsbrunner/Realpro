import { useParams, Link } from 'react-router-dom';
import { Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProBadge } from '../components/realpro/RealProBadge';
import { useLots } from '../hooks/useLots';
import { useMaterialSelections } from '../hooks/useMaterialSelections';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';

export default function ProjectMaterialsSelections() {
  const { projectId } = useParams<{ projectId: string }>();
  const { lots, loading: lotsLoading } = useLots(projectId!);
  const { status, loading: statusLoading } = useMaterialSelections(projectId!);

  const loading = lotsLoading || statusLoading;

  if (loading) {
    return <LoadingSpinner />;
  }

  const getStatusIcon = (lotStatus: string) => {
    switch (lotStatus) {
      case 'Validé':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />;
      case 'En cours':
        return <Clock className="w-5 h-5 text-blue-600 dark:text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getStatusVariant = (lotStatus: string): 'success' | 'warning' | 'default' => {
    switch (lotStatus) {
      case 'Validé':
        return 'success';
      case 'En cours':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="px-10 py-8 space-y-10">
      <RealProTopbar
        title="Choix matériaux & Modifications"
        subtitle="Gérez les choix de matériaux et les demandes de modifications pour chaque lot"
        actions={
          <Link to={`/dashboard/projects/${projectId}/materials/catalogue`}>
            <RealProButton variant="primary">
              <Package className="w-4 h-4 mr-2" />
              Gérer le catalogue
            </RealProButton>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lots.map((lot) => {
          const lotStatus = status[lot.id] || 'À faire';

          return (
            <Link
              key={lot.id}
              to={`/dashboard/projects/${projectId}/materials/lots/${lot.id}`}
            >
              <RealProCard className="h-full hover:shadow-card transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                      Lot {lot.number}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {lot.type}
                    </p>
                  </div>
                  {getStatusIcon(lotStatus)}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-2">
                      Statut des choix
                    </p>
                    <RealProBadge variant={getStatusVariant(lotStatus)}>
                      {lotStatus}
                    </RealProBadge>
                  </div>

                  {lot.floor && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Étage {lot.floor}
                    </p>
                  )}

                  {lot.surface_total && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {lot.surface_total} m²
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm text-blue-600 dark:text-blue-500 font-medium group-hover:underline">
                    Voir les choix →
                  </p>
                </div>
              </RealProCard>
            </Link>
          );
        })}
      </div>

      {lots.length === 0 && (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Aucun lot disponible
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Créez des lots pour commencer à gérer les choix de matériaux
          </p>
        </div>
      )}
    </div>
  );
}
