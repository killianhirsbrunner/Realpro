import { Flag, Calendar, CheckCircle2 } from 'lucide-react';
import { format, isPast, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PlanningTask } from '../../hooks/usePlanning';

interface PlanningMilestoneCardProps {
  milestone: PlanningTask;
}

export function PlanningMilestoneCard({ milestone }: PlanningMilestoneCardProps) {
  const milestoneDate = new Date(milestone.start_date);
  const isCompleted = milestone.status === 'completed';
  const isOverdue = !isCompleted && isPast(milestoneDate);
  const isUpcoming = !isCompleted && isFuture(milestoneDate);

  const getStatusColor = () => {
    if (isCompleted) return 'border-green-500 bg-green-50 dark:bg-green-950/20';
    if (isOverdue) return 'border-red-500 bg-red-50 dark:bg-red-950/20';
    return 'border-brand-500 bg-brand-50 dark:bg-brand-950/20';
  };

  const getIconColor = () => {
    if (isCompleted) return 'text-green-500';
    if (isOverdue) return 'text-red-500';
    return 'text-brand-500';
  };

  const getStatusLabel = () => {
    if (isCompleted) return 'Atteint';
    if (isOverdue) return 'En retard';
    if (isUpcoming) return 'À venir';
    return "Aujourd'hui";
  };

  return (
    <div className={`
      rounded-2xl border-2 p-6 transition-all
      ${getStatusColor()}
      hover:shadow-lg
    `}>
      <div className="flex items-start gap-4">
        <div className={`
          p-3 rounded-xl
          ${isCompleted ? 'bg-green-100 dark:bg-green-900/30' : ''}
          ${isOverdue ? 'bg-red-100 dark:bg-red-900/30' : ''}
          ${isUpcoming ? 'bg-brand-100 dark:bg-brand-900/30' : ''}
        `}>
          {isCompleted ? (
            <CheckCircle2 className={`w-6 h-6 ${getIconColor()}`} />
          ) : (
            <Flag className={`w-6 h-6 ${getIconColor()}`} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white truncate">
              {milestone.name}
            </h3>
            <span className={`
              px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap
              ${isCompleted ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : ''}
              ${isOverdue ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : ''}
              ${isUpcoming ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300' : ''}
            `}>
              {getStatusLabel()}
            </span>
          </div>

          {milestone.description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              {milestone.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Calendar className={`w-4 h-4 ${getIconColor()}`} />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {format(milestoneDate, 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
