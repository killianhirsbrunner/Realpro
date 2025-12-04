import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useProjectTimeline } from '../hooks/useProjectTimeline';
import { format } from 'date-fns';

export default function ProjectTimelinePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { timeline, project, loading, error, refetch } = useProjectTimeline(projectId!);

  if (loading) return <LoadingState message="Chargement de la timeline..." />;
  if (error) return <ErrorState message={error.message} retry={refetch} />;
  if (!timeline || !project) return <ErrorState message="Timeline introuvable" />;

  const completedPhases = timeline.phases.filter(p => p.status === 'completed').length;
  const inProgressPhases = timeline.phases.filter(p => p.status === 'in_progress').length;
  const delayedPhases = timeline.phases.filter(p => p.status === 'delayed').length;

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: project.name, href: `/projects/${projectId}` },
          { label: 'Planning' },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Timeline du Projet</h1>
        <p className="text-gray-600 mt-2">
          Vue chronologique des phases et jalons du projet
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <p className="text-sm font-medium text-gray-600">Total phases</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{timeline.phases.length}</p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="text-sm font-medium text-gray-600">Terminées</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{completedPhases}</p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <p className="text-sm font-medium text-gray-600">En cours</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{inProgressPhases}</p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <p className="text-sm font-medium text-gray-600">En retard</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{delayedPhases}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-8">Phases du projet</h2>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-8">
            {timeline.phases.map((phase, index) => {
              const isCompleted = phase.status === 'completed';
              const isInProgress = phase.status === 'in_progress';
              const isDelayed = phase.status === 'delayed';

              return (
                <div key={phase.id} className="relative pl-20">
                  <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white ${
                    isCompleted ? 'bg-green-500' :
                    isInProgress ? 'bg-blue-500' :
                    isDelayed ? 'bg-red-500' :
                    'bg-gray-300'
                  }`}></div>

                  <div className={`p-6 rounded-xl border-2 ${
                    isCompleted ? 'bg-green-50 border-green-200' :
                    isInProgress ? 'bg-blue-50 border-blue-200' :
                    isDelayed ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{phase.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isCompleted ? 'bg-green-100 text-green-700' :
                            isInProgress ? 'bg-blue-100 text-blue-700' :
                            isDelayed ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {isCompleted ? 'Terminé' :
                             isInProgress ? 'En cours' :
                             isDelayed ? 'En retard' :
                             'À venir'}
                          </span>
                        </div>

                        {phase.description && (
                          <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                        )}

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Début: {phase.startDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Fin prévue: {phase.endDate}</span>
                          </div>
                        </div>

                        {phase.progress !== undefined && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">Avancement</span>
                              <span className="font-semibold text-gray-900">{phase.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isDelayed ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${phase.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {timeline.milestones && timeline.milestones.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Jalons importants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeline.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="p-4 bg-brand-50 border border-brand-200 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎯</span>
                  <p className="font-semibold text-gray-900">{milestone.name}</p>
                </div>
                <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{milestone.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
