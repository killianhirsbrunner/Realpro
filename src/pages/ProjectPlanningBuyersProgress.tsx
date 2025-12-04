import { useParams, Link } from 'react-router-dom';
import { useBuyerProgress } from '../hooks/useBuyerProgress';
import { BuyerProgressCard } from '../components/planning/BuyerProgressCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';

export default function ProjectPlanningBuyersProgress() {
  const { projectId } = useParams<{ projectId: string }>();
  const { progress, loading, error } = useBuyerProgress(projectId!);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erreur : {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/projects/${projectId}/planning`}
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour au planning
        </Link>
        <h1 className="text-3xl font-bold">Avancement des acheteurs</h1>
        <p className="text-neutral-600 mt-1">
          Suivi de l'avancement par lot et par acquéreur
        </p>
      </div>

      {progress.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          <p>Aucun lot vendu pour ce projet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progress.map((item) => (
            <BuyerProgressCard key={item.id || item.lot_id} progress={item} />
          ))}
        </div>
      )}
    </div>
  );
}
