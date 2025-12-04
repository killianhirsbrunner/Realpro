import { useParams, Link } from 'react-router-dom';
import { useSiteDiaryEntries } from '../hooks/useSiteDiaryEntries';
import { SiteDiaryCard } from '../components/planning/SiteDiaryCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function ProjectPlanningReports() {
  const { projectId } = useParams<{ projectId: string }>();
  const { entries, loading, error } = useSiteDiaryEntries(projectId!);

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
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={`/projects/${projectId}/planning`}
            className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour au planning
          </Link>
          <h1 className="text-3xl font-bold">Rapports journaliers</h1>
          <p className="text-neutral-600 mt-1">
            Suivi quotidien du chantier
          </p>
        </div>

        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau rapport
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          <p>Aucun rapport journalier disponible.</p>
          <Button variant="outline" className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Créer le premier rapport
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <SiteDiaryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
