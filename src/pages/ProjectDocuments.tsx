import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, FolderTree } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useDocuments } from '../hooks/useDocuments';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { DocumentsExplorer } from '../components/documents/DocumentsExplorer';

export function ProjectDocuments() {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();
  const { documents, tree, loading, error } = useDocuments(projectId);

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
          <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des documents</p>
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
            <FolderTree className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Documents du projet
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {documents.length} document{documents.length > 1 ? 's' : ''} • {tree.length} dossiers
            </p>
          </div>
        </div>
      </div>

      <DocumentsExplorer projectId={projectId || ''} tree={tree} />
    </div>
  );
}
