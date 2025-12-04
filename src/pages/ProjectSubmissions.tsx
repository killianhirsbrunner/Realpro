import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, FileText } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useSubmissions } from '../hooks/useSubmissions';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { SubmissionsTable } from '../components/submissions/SubmissionsTable';
import { Button } from '../components/ui/Button';

export function ProjectSubmissions() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { submissions, loading, error } = useSubmissions(projectId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des soumissions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/overview`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour au projet
        </Link>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900">
            <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Soumissions & Adjudications
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {submissions.length} soumission{submissions.length > 1 ? 's' : ''} au total
            </p>
          </div>
          <Button onClick={() => navigate(`/projects/${projectId}/submissions/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle soumission
          </Button>
        </div>
      </div>

      <SubmissionsTable submissions={submissions} projectId={projectId || ''} />
    </div>
  );
}
