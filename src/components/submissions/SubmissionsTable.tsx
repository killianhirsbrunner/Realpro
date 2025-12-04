import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { FileText, Calendar, Users } from 'lucide-react';
import { formatDate } from '../../lib/utils/format';

interface Submission {
  id: string;
  label: string;
  description?: string;
  deadline: string;
  status: string;
  offers_count?: number;
}

interface SubmissionsTableProps {
  submissions: Submission[];
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
      active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
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
          <Card key={submission.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  {submission.label}
                </h3>
                {submission.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
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
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
