import { Card } from '../ui/Card';
import { PlanningSummary } from '../../hooks/usePlanning';

interface ProgressSummaryCardProps {
  summary: PlanningSummary;
}

export function ProgressSummaryCard({ summary }: ProgressSummaryCardProps) {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <p className="text-xs text-neutral-500 mb-1">Avancement global</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold">{summary.globalProgress}%</p>
          </div>
          <div className="mt-2 w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all"
              style={{ width: `${summary.globalProgress}%` }}
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-neutral-500 mb-1">En retard</p>
          <p className="text-2xl font-semibold text-red-600">
            {summary.delayedTasks}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            tâche{summary.delayedTasks > 1 ? 's' : ''}
          </p>
        </div>

        <div>
          <p className="text-xs text-neutral-500 mb-1">En cours</p>
          <p className="text-2xl font-semibold text-brand-600">
            {summary.inProgress}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            tâche{summary.inProgress > 1 ? 's' : ''}
          </p>
        </div>

        <div>
          <p className="text-xs text-neutral-500 mb-1">Terminées</p>
          <p className="text-2xl font-semibold text-green-600">
            {summary.completed}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            / {summary.totalTasks} tâche{summary.totalTasks > 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </Card>
  );
}
