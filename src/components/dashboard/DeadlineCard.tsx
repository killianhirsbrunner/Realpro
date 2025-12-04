import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Deadline {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: 'submission' | 'payment' | 'notary' | 'construction' | 'meeting';
  status: 'upcoming' | 'urgent' | 'overdue' | 'completed';
  link?: string;
}

interface DeadlineCardProps {
  deadline: Deadline;
}

export function DeadlineCard({ deadline }: DeadlineCardProps) {
  const deadlineDate = new Date(deadline.date);
  const daysUntil = differenceInDays(deadlineDate, new Date());

  const getStatusStyles = () => {
    switch (deadline.status) {
      case 'completed':
        return {
          border: 'border-green-200 dark:border-green-800',
          bg: 'bg-green-50 dark:bg-green-950/30',
          text: 'text-green-700 dark:text-green-400',
          icon: CheckCircle,
        };
      case 'overdue':
        return {
          border: 'border-red-200 dark:border-red-800',
          bg: 'bg-red-50 dark:bg-red-950/30',
          text: 'text-red-700 dark:text-red-400',
          icon: AlertTriangle,
        };
      case 'urgent':
        return {
          border: 'border-brand-200 dark:border-brand-800',
          bg: 'bg-brand-50 dark:bg-brand-950/30',
          text: 'text-brand-700 dark:text-brand-400',
          icon: Clock,
        };
      default:
        return {
          border: 'border-neutral-200 dark:border-neutral-800',
          bg: 'bg-white dark:bg-neutral-900',
          text: 'text-neutral-700 dark:text-neutral-300',
          icon: Calendar,
        };
    }
  };

  const typeLabels = {
    submission: 'Soumission',
    payment: 'Paiement',
    notary: 'Notaire',
    construction: 'Chantier',
    meeting: 'Rendez-vous',
  };

  const styles = getStatusStyles();
  const StatusIcon = styles.icon;

  const content = (
    <>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${styles.bg}`}>
          <StatusIcon className={`w-4 h-4 ${styles.text}`} />
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          {typeLabels[deadline.type]}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1 line-clamp-2">
        {deadline.title}
      </h3>

      {deadline.description && (
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
          {deadline.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-neutral-400" />
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            {format(deadlineDate, 'dd MMM yyyy', { locale: fr })}
          </span>
        </div>
        {deadline.status !== 'completed' && (
          <span className={`text-xs font-medium ${styles.text}`}>
            {daysUntil === 0 ? "Aujourd'hui" : daysUntil > 0 ? `Dans ${daysUntil}j` : `Il y a ${Math.abs(daysUntil)}j`}
          </span>
        )}
      </div>
    </>
  );

  const className = `p-4 rounded-xl border ${styles.border} ${styles.bg} hover:shadow-lg transition-all duration-200`;

  if (deadline.link) {
    return (
      <a href={deadline.link} className={`${className} block`}>
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
