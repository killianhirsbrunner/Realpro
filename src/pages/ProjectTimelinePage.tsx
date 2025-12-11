import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { Calendar, CheckCircle, Clock, AlertCircle, Target } from 'lucide-react';
import { useProjectTimeline } from '../hooks/useProjectTimeline';

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

      <RealProTopbar
        title="Timeline du Projet"
        subtitle="Vue chronologique des phases et jalons du projet"
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total phases</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {timeline.phases.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900/30">
              <Calendar className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Terminées</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {completedPhases}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">En cours</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {inProgressPhases}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">En retard</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {delayedPhases}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </RealProCard>
      </div>

      {/* Timeline des phases */}
      <RealProCard padding="lg">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-8">Phases du projet</h2>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-700"></div>

          <div className="space-y-8">
            {timeline.phases.map((phase) => {
              const isCompleted = phase.status === 'completed';
              const isInProgress = phase.status === 'in_progress';
              const isDelayed = phase.status === 'delayed';

              return (
                <div key={phase.id} className="relative pl-20">
                  <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white dark:border-neutral-900 ${
                    isCompleted ? 'bg-green-500' :
                    isInProgress ? 'bg-brand-500' :
                    isDelayed ? 'bg-red-500' :
                    'bg-neutral-300 dark:bg-neutral-600'
                  }`}></div>

                  <div className={`p-6 rounded-xl border-2 ${
                    isCompleted ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                    isInProgress ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800' :
                    isDelayed ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                    'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{phase.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isCompleted ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                            isInProgress ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300' :
                            isDelayed ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
                            'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                          }`}>
                            {isCompleted ? 'Terminé' :
                             isInProgress ? 'En cours' :
                             isDelayed ? 'En retard' :
                             'À venir'}
                          </span>
                        </div>

                        {phase.description && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{phase.description}</p>
                        )}

                        <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
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
                              <span className="text-neutral-600 dark:text-neutral-400">Avancement</span>
                              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{phase.progress}%</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isDelayed ? 'bg-red-500' : 'bg-brand-500'
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
      </RealProCard>

      {/* Jalons */}
      {timeline.milestones && timeline.milestones.length > 0 && (
        <RealProCard padding="lg">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">Jalons importants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeline.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="p-4 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-brand-100 dark:bg-brand-900/30">
                    <Target className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">{milestone.name}</p>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{milestone.description}</p>
                <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                  <Calendar className="w-4 h-4" />
                  <span>{milestone.date}</span>
                </div>
              </div>
            ))}
          </div>
        </RealProCard>
      )}
    </div>
  );
}
