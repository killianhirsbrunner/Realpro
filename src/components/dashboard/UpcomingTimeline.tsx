import { Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  type: 'deadline' | 'milestone' | 'meeting' | 'task';
  status: 'upcoming' | 'today' | 'overdue' | 'completed';
  description?: string;
  project_name?: string;
  href?: string;
}

interface UpcomingTimelineProps {
  items: TimelineItem[];
}

export function UpcomingTimeline({ items }: UpcomingTimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return "Aujourd'hui";
    if (isTomorrow) return 'Demain';

    return new Intl.DateTimeFormat('fr-CH', {
      day: '2-digit',
      month: 'long',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    }).format(date);
  };

  const getStatusStyles = (status: string) => {
    const styles = {
      upcoming: {
        badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        icon: Clock,
        iconColor: 'text-blue-600 dark:text-blue-400',
      },
      today: {
        badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
        icon: AlertCircle,
        iconColor: 'text-orange-600 dark:text-orange-400',
      },
      overdue: {
        badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        icon: AlertCircle,
        iconColor: 'text-red-600 dark:text-red-400',
      },
      completed: {
        badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        icon: CheckCircle2,
        iconColor: 'text-green-600 dark:text-green-400',
      },
    };
    return styles[status as keyof typeof styles] || styles.upcoming;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      deadline: 'Échéance',
      milestone: 'Jalon',
      meeting: 'Rendez-vous',
      task: 'Tâche',
    };
    return labels[type] || type;
  };

  const sortedItems = [...items].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Prochaines échéances</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {sortedItems.length} événement{sortedItems.length > 1 ? 's' : ''} à venir
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sortedItems.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Aucune échéance prévue</p>
          </div>
        ) : (
          sortedItems.map((item) => {
            const statusStyles = getStatusStyles(item.status);
            const StatusIcon = statusStyles.icon;
            const ItemWrapper = item.href ? Link : 'div';
            const wrapperProps = item.href ? { to: item.href } : {};

            return (
              <ItemWrapper
                key={item.id}
                {...wrapperProps}
                className="group block p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${statusStyles.badge} flex items-center justify-center`}>
                    <StatusIcon className={`w-5 h-5 ${statusStyles.iconColor}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyles.badge} font-medium`}>
                        {getTypeLabel(item.type)}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {formatDate(item.date)}
                      </span>
                    </div>

                    <h3 className="font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {item.project_name && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                        Projet: {item.project_name}
                      </p>
                    )}
                  </div>
                </div>
              </ItemWrapper>
            );
          })
        )}
      </div>
    </div>
  );
}
