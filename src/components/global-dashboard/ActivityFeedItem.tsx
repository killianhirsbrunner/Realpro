import { FileText, Home, TrendingUp, Users, Wrench, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Activity {
  id: string;
  title: string;
  description: string;
  created_at: string;
  activity_type: string;
  project_name?: string;
  user_name?: string;
}

interface ActivityFeedItemProps {
  activity: Activity;
}

const activityIcons: Record<string, typeof FileText> = {
  LOT_SOLD: TrendingUp,
  DOC_SIGNED: FileText,
  ISSUE_CREATED: AlertCircle,
  ISSUE_RESOLVED: CheckCircle,
  MATERIAL_CHOSEN: Home,
  USER_ADDED: Users,
  WORK_COMPLETED: Wrench,
};

const activityColors: Record<string, string> = {
  LOT_SOLD: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
  DOC_SIGNED: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
  ISSUE_CREATED: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
  ISSUE_RESOLVED: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
  MATERIAL_CHOSEN: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
  USER_ADDED: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
  WORK_COMPLETED: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
};

export function ActivityFeedItem({ activity }: ActivityFeedItemProps) {
  const Icon = activityIcons[activity.activity_type] || FileText;
  const colorClass = activityColors[activity.activity_type] || 'text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/20';

  const timeAgo = formatDistanceToNow(new Date(activity.created_at), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-medium text-neutral-900 dark:text-white">
            {activity.title}
          </h4>
          <span className="text-xs text-neutral-500 dark:text-neutral-500 whitespace-nowrap">
            {timeAgo}
          </span>
        </div>
        {activity.description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
            {activity.description}
          </p>
        )}
        {activity.project_name && (
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            {activity.project_name}
          </p>
        )}
      </div>
    </div>
  );
}
