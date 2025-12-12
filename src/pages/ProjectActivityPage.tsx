import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import ProjectActivity from '../components/project/ProjectActivity';
import { Activity } from 'lucide-react';
import { useProjectActivity } from '../hooks/useProjectActivity';

export default function ProjectActivityPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { activity, project, loading, error, refetch } = useProjectActivity(projectId!);
  const [selectedType, setSelectedType] = useState<string>('all');

  if (loading) return <LoadingState message="Chargement de l'activité..." />;
  if (error) return <ErrorState message={error.message} retry={refetch} />;
  if (!activity || !project) return <ErrorState message="Activité introuvable" />;

  const filteredActivity = selectedType === 'all'
    ? activity
    : activity.filter(a => a.type === selectedType);

  const types = ['all', 'sale', 'document', 'task', 'message', 'submission', 'payment'];
  const typeLabels: Record<string, string> = {
    all: 'Toutes',
    sale: 'Ventes',
    document: 'Documents',
    task: 'Tâches',
    message: 'Messages',
    submission: 'Soumissions',
    payment: 'Paiements',
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: project.name, href: `/projects/${projectId}` },
          { label: 'Activité' },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Activité du Projet</h1>
          <p className="text-neutral-600 mt-2">
            Suivez toutes les actions effectuées sur le projet
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-brand-600" />
          <span className="text-2xl font-bold text-neutral-900">{activity.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === type
                  ? 'bg-brand-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>

        <ProjectActivity activity={filteredActivity} />

        {filteredActivity.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600">Aucune activité trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
