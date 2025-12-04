import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Layers } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { usePlanning } from '../hooks/usePlanning';
import { PlanningGanttChart } from '../components/planning/PlanningGanttChart';
import { PlanningToolbar } from '../components/planning/PlanningToolbar';
import { PlanningSummaryCard } from '../components/planning/PlanningSummaryCard';
import { PlanningPhaseCard } from '../components/planning/PlanningPhaseCard';
import { PlanningMilestoneCard } from '../components/planning/PlanningMilestoneCard';
import { PlanningAlerts } from '../components/planning/PlanningAlerts';

export function ProjectPlanning() {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeView, setActiveView] = useState<'gantt' | 'phases' | 'milestones'>('gantt');

  const {
    tasks,
    alerts,
    summary,
    loading,
    error,
    updateTaskProgress,
    resolveAlert,
  } = usePlanning(projectId || '');

  const tasksByPhase = useMemo(() => {
    const phases = ['preparation', 'gros_oeuvre', 'second_oeuvre', 'finitions', 'livraison'];
    return phases.map(phase => ({
      phase,
      tasks: tasks.filter(t => t.phase === phase),
    })).filter(p => p.tasks.length > 0);
  }, [tasks]);

  const milestones = useMemo(() => {
    return tasks.filter(t => t.type === 'milestone');
  }, [tasks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-6 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-brand-600 mb-1">
                Chantier · Planning
              </p>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                Planning du projet
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Vue synthétique des phases du chantier avec diagramme de Gantt professionnel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setActiveView('gantt')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeView === 'gantt'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Vue Gantt
            </button>
            <button
              onClick={() => setActiveView('phases')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeView === 'phases'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 inline mr-2" />
              Phases
            </button>
            <button
              onClick={() => setActiveView('milestones')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeView === 'milestones'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Jalons
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PlanningToolbar
              onAddTask={() => console.log('Add task')}
              onAddMilestone={() => console.log('Add milestone')}
              onAddPhase={() => console.log('Add phase')}
              onExport={() => console.log('Export')}
              onFilterChange={(filter) => console.log('Filter:', filter)}
            />

            {activeView === 'gantt' && (
              <>
                {tasks.length === 0 ? (
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-12 text-center">
                    <Calendar className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                      Planning en préparation
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Les tâches et jalons ne sont pas encore définis pour ce projet
                    </p>
                  </div>
                ) : (
                  <PlanningGanttChart
                    tasks={tasks}
                    onTaskUpdate={(taskId, updates) => {
                      if (updates.progress !== undefined) {
                        updateTaskProgress(taskId, updates.progress);
                      }
                    }}
                  />
                )}
              </>
            )}

            {activeView === 'phases' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasksByPhase.map(({ phase, tasks }) => (
                  <PlanningPhaseCard key={phase} phase={phase} tasks={tasks} />
                ))}
              </div>
            )}

            {activeView === 'milestones' && (
              <div className="space-y-4">
                {milestones.length === 0 ? (
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-12 text-center">
                    <Calendar className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                      Aucun jalon
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Aucun jalon n'a été défini pour ce projet
                    </p>
                  </div>
                ) : (
                  milestones.map((milestone) => (
                    <PlanningMilestoneCard key={milestone.id} milestone={milestone} />
                  ))
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <PlanningSummaryCard summary={summary} />

            {alerts.length > 0 && (
              <PlanningAlerts alerts={alerts} onResolve={resolveAlert} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
