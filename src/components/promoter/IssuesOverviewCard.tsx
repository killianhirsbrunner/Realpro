import { AlertTriangle, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Issue {
  id: string;
  type: 'delay' | 'alert' | 'warning';
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  severity: 'high' | 'medium' | 'low';
  daysOverdue?: number;
}

interface IssuesOverviewCardProps {
  issues: Issue[];
}

export default function IssuesOverviewCard({ issues }: IssuesOverviewCardProps) {
  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'delay':
        return Clock;
      case 'alert':
        return AlertCircle;
      case 'warning':
        return AlertTriangle;
      default:
        return AlertCircle;
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      case 'medium':
        return 'bg-brand-50 dark:bg-brand-950 border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-200';
      case 'low':
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Urgent';
      case 'medium':
        return 'Modéré';
      case 'low':
        return 'Faible';
      default:
        return severity;
    }
  };

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Alertes & Retards
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Nécessitent votre attention
        </p>
      </div>

      {issues.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-gray-900 dark:text-white font-medium">
            Tout est en ordre !
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Aucune alerte pour le moment
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => {
            const Icon = getIssueIcon(issue.type);
            return (
              <Link
                key={issue.id}
                to={`/projects/${issue.projectId}/overview`}
                className="block"
              >
                <div
                  className={`p-4 rounded-lg border ${getSeverityStyles(
                    issue.severity
                  )} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">
                          {issue.title}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 border border-current">
                          {getSeverityLabel(issue.severity)}
                        </span>
                      </div>
                      <p className="text-sm opacity-90 mb-2">
                        {issue.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="opacity-75">{issue.projectName}</span>
                        {issue.daysOverdue && (
                          <>
                            <span className="opacity-50">•</span>
                            <span className="font-medium">
                              {issue.daysOverdue} jours de retard
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
