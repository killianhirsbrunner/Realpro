import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, FileText, Building2, Package, MessageSquare } from 'lucide-react';
import { useSubmissionDetail } from '../hooks/useSubmissions';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { SubmissionInfoCard } from '../components/submissions/SubmissionInfoCard';
import { SubmissionDocumentsCard } from '../components/submissions/SubmissionDocumentsCard';
import { SubmissionCompaniesCard } from '../components/submissions/SubmissionCompaniesCard';
import { SubmissionOffersCard } from '../components/submissions/SubmissionOffersCard';

export function SubmissionDetail() {
  const { projectId, submissionId } = useParams<{ projectId: string; submissionId: string }>();
  const { submission, loading, error } = useSubmissionDetail(submissionId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error || 'Soumission non trouvée'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <Link
          to={`/projects/${projectId}/submissions`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux soumissions
        </Link>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900">
            <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              {submission.label}
            </h1>
            {submission.description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {submission.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <SubmissionInfoCard submission={submission} />
          <SubmissionCompaniesCard
            companies={submission.companies || []}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <SubmissionDocumentsCard
            documents={submission.documents || []}
          />

          {projectId && submissionId && (
            <SubmissionOffersCard
              submissionId={submissionId}
              projectId={projectId}
              offers={submission.offers || []}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to={`/projects/${projectId}/submissions/${submissionId}/compare`}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-primary-600 dark:hover:border-primary-400 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Comparatif
                </h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Comparer les offres reçues
              </p>
            </Link>

            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 opacity-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Questions
                </h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Clarifications avec entreprises
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
