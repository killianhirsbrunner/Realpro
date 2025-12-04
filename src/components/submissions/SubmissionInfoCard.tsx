import { Card } from '../ui/Card';
import { Calendar, Clock, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { SubmissionDetail } from '../../hooks/useSubmissions';

interface SubmissionInfoCardProps {
  submission: SubmissionDetail;
}

export function SubmissionInfoCard({ submission }: SubmissionInfoCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'neutral';
      case 'open':
        return 'blue';
      case 'closed':
        return 'orange';
      case 'awarded':
        return 'green';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'open':
        return 'Ouvert';
      case 'closed':
        return 'Clôturé';
      case 'awarded':
        return 'Adjugé';
      default:
        return status;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Informations générales
            </h3>
            <Badge variant={getStatusColor(submission.status) as any}>
              {getStatusLabel(submission.status)}
            </Badge>
          </div>

          {submission.description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {submission.description}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {submission.cfc_code && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                <FileText className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">CFC</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {submission.cfc_code}
                </p>
              </div>
            </div>
          )}

          {submission.budget_estimate && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Budget estimé</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  CHF {submission.budget_estimate.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900">
              <Calendar className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Dépôt des offres</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {new Date(submission.deadline).toLocaleDateString('fr-CH')}
              </p>
            </div>
          </div>

          {submission.deadline_questions && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900">
                <Clock className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Questions / clarifications</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {new Date(submission.deadline_questions).toLocaleDateString('fr-CH')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
