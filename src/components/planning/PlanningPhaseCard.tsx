import { Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PlanningTask } from '../../hooks/usePlanning';

interface PlanningPhaseCardProps {
  phase: string;
  tasks: PlanningTask[];
}

const phaseLabels: Record<string, string> = {
  preparation: 'Préparation',
  gros_oeuvre: 'Gros Œuvre',
  second_oeuvre: 'Second Œuvre',
  finitions: 'Finitions',
  livraison: 'Livraison',
};

const phaseColors: Record<string, string> = {
  preparation: 'from-neutral-500 to-neutral-600',
  gros_oeuvre: 'from-brand-500 to-brand-600',
  second_oeuvre: 'from-blue-500 to-blue-600',
  finitions: 'from-green-500 to-green-600',
  livraison: 'from-orange-500 to-orange-600',
};

export function PlanningPhaseCard({ phase, tasks }: PlanningPhaseCardProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const delayedTasks = tasks.filter(t => t.status === 'delayed').length;

  const avgProgress = totalTasks > 0
    ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / totalTasks)
    : 0;

  const startDate = tasks.length > 0
    ? new Date(Math.min(...tasks.map(t => new Date(t.start_date).getTime())))
    : null;

  const endDate = tasks.length > 0
    ? new Date(Math.max(...tasks.map(t => new Date(t.end_date).getTime())))
    : null;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card overflow-hidden">

      <div className={`h-2 bg-gradient-to-r ${phaseColors[phase] || 'from-neutral-400 to-neutral-500'}`} />

      <div className="p-6 space-y-6">

        <div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            {phaseLabels[phase] || phase}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {totalTasks} {totalTasks > 1 ? 'tâches' : 'tâche'}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Progression globale</span>
            <span className="font-semibold text-brand-600">{avgProgress}%</span>
          </div>
          <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-300"
              style={{ width: `${avgProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <div>
              <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                {completedTasks}
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                Terminées
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500" />
            <div>
              <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                {inProgressTasks}
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                En cours
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <div>
              <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                {delayedTasks}
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                En retard
              </div>
            </div>
          </div>
        </div>

        {startDate && endDate && (
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Calendar className="w-4 h-4" />
                <span>Début</span>
              </div>
              <span className="font-medium text-neutral-900 dark:text-white">
                {format(startDate, 'dd MMM yyyy', { locale: fr })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Calendar className="w-4 h-4" />
                <span>Fin</span>
              </div>
              <span className="font-medium text-neutral-900 dark:text-white">
                {format(endDate, 'dd MMM yyyy', { locale: fr })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
