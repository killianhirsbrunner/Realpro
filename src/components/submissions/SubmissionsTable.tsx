import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { FileText, Calendar, Users, DollarSign } from 'lucide-react';
import { formatDate } from '../../lib/utils/format';
import type { Submission } from '../../hooks/useSubmissions';

interface SubmissionsTableProps {
  submissions: Submission[];
  projectId: string;
}

export function SubmissionsTable({ submissions, projectId }: SubmissionsTableProps) {
  const navigate = useNavigate();
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
      active: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
      closed: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      awarded: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[status] || colors.draft;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Brouillon',
      active: 'Active',
      closed: 'Fermée',
      awarded: 'Adjugée',
      cancelled: 'Annulée',
    };
    return labels[status] || status;
  };

  return (
    <div className="grid gap-6">
      {submissions.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">Aucune soumission</p>
        </Card>
      ) : (
        submissions.map((submission) => (
          <Card
            key={submission.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/projects/${projectId}/submissions/${submission.id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {submission.label}
                  </h3>
                  {submission.cfc_code && (
                    <span className="text-xs px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {submission.cfc_code}
                    </span>
                  )}
                </div>
                {submission.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {submission.description}
                  </p>
                )}
              </div>
              <Badge className={getStatusColor(submission.status)}>
                {getStatusLabel(submission.status)}
              </Badge>
            </div>

            <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Échéance: {formatDate(submission.deadline)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{submission.offers_count || 0} offre{(submission.offers_count || 0) > 1 ? 's' : ''}</span>
              </div>
              {submission.budget_estimate && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>CHF {submission.budget_estimate.toLocaleString()}</span>
                </div>
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
