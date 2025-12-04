import { Calendar, Flag, AlertTriangle, Clock } from 'lucide-react';
import { format, isPast, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface Deadline {
  id: string;
  title: string;
  date: string;
  project_name: string;
  project_id: string;
  type: 'milestone' | 'task' | 'notary' | 'payment';
}

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  const getDeadlineIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Flag className="w-4 h-4" />;
      case 'notary':
        return <Calendar className="w-4 h-4" />;
      case 'payment':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getDeadlineColor = (dateStr: string) => {
    const date = new Date(dateStr);
    const daysUntil = differenceInDays(date, new Date());

    if (isPast(date)) return 'text-red-600 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30';
    if (daysUntil <= 7) return 'text-brand-600 bg-brand-50 dark:bg-brand-950/20 border-brand-200 dark:border-brand-900/30';
    return 'text-brand-600 bg-brand-50 dark:bg-brand-950/20 border-brand-200 dark:border-brand-900/30';
  };

  const getUrgencyLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const daysUntil = differenceInDays(date, new Date());

    if (isPast(date)) return 'En retard';
    if (daysUntil === 0) return "Aujourd'hui";
    if (daysUntil === 1) return 'Demain';
    if (daysUntil <= 7) return `Dans ${daysUntil} jours`;
    return format(date, 'dd MMM yyyy', { locale: fr });
  };

  if (deadlines.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Échéances à venir
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Aucune échéance urgente
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
            <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Échéances à venir
          </h3>
        </div>
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {deadlines.length} échéance{deadlines.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {deadlines.slice(0, 5).map((deadline) => {
          const colorClass = getDeadlineColor(deadline.date);

          return (
            <Link
              key={deadline.id}
              to={`/projects/${deadline.project_id}/planning`}
              className="block"
            >
              <div className={`
                rounded-xl border p-4 transition-all hover:shadow-md
                ${colorClass}
              `}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5">
                      {getDeadlineIcon(deadline.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1 truncate">
                        {deadline.title}
                      </h4>
                      <p className="text-xs opacity-80">
                        {deadline.project_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-medium whitespace-nowrap">
                      {getUrgencyLabel(deadline.date)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {deadlines.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            Voir toutes les échéances ({deadlines.length})
          </button>
        </div>
      )}
    </div>
  );
}
