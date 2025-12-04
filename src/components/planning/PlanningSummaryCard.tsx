import { TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { PlanningSummary } from '../../hooks/usePlanning';

interface PlanningSummaryCardProps {
  summary: PlanningSummary;
}

export function PlanningSummaryCard({ summary }: PlanningSummaryCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card overflow-hidden">

      <div className="h-2 bg-gradient-to-r from-brand-500 to-brand-600" />

      <div className="p-6 space-y-6">

        <div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Résumé du Planning
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Vue d'ensemble de l'avancement du chantier
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Progression globale</span>
            <span className="text-2xl font-bold text-brand-600">{summary.globalProgress}%</span>
          </div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
              style={{ width: `${summary.globalProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-200 dark:border-green-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {summary.completed}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  Terminées
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand-50 dark:bg-brand-950/20 rounded-xl p-4 border border-brand-200 dark:border-brand-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {summary.inProgress}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  En cours
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border border-red-200 dark:border-red-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {summary.delayedTasks}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  En retard
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <TrendingUp className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {summary.totalTasks}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  Total tâches
                </div>
              </div>
            </div>
          </div>
        </div>

        {summary.delayedTasks > 0 && (
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">
                {summary.delayedTasks} {summary.delayedTasks > 1 ? 'tâches nécessitent' : 'tâche nécessite'} votre attention
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
