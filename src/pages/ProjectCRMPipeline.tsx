import { useParams, Link } from 'react-router-dom';
import { Plus, Filter, Download } from 'lucide-react';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { CRMKanban } from '../components/crm';
import { useCRMPipeline } from '../hooks/useCRMPipeline';

export default function ProjectCRMPipeline() {
  const { projectId } = useParams<{ projectId: string }>();
  const { pipeline, loading, error, refetch } = useCRMPipeline(projectId!);

  if (loading) return <LoadingState message="Chargement du pipeline commercial..." />;
  if (error) return <ErrorState message={error} retry={refetch} />;
  if (!pipeline) return <ErrorState message="Aucune donnée disponible" retry={refetch} />;

  const totalContacts = Object.values(pipeline).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Pipeline Commercial
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {totalContacts} contact{totalContacts !== 1 ? 's' : ''} au total
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-sm hover:shadow">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-sm hover:shadow">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <Link
            to={`/projects/${projectId}/crm/prospects/new`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl hover:from-brand-700 hover:to-brand-800 transition-all shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40"
          >
            <Plus className="w-4 h-4" />
            Ajouter un prospect
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Prospects</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">
            {pipeline.prospect?.length || 0}
          </p>
        </div>
        <div className="p-5 bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-800/20 rounded-xl border border-brand-200 dark:border-brand-800 shadow-sm hover:shadow-md transition-all">
          <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Réservés</p>
          <p className="text-3xl font-bold text-brand-900 dark:text-brand-300 mt-2">
            {pipeline.reserved?.length || 0}
          </p>
        </div>
        <div className="p-5 bg-gradient-to-br from-secondary-50 to-secondary-100/50 dark:from-secondary-900/20 dark:to-secondary-800/20 rounded-xl border border-secondary-200 dark:border-secondary-800 shadow-sm hover:shadow-md transition-all">
          <p className="text-sm font-medium text-secondary-700 dark:text-secondary-400">En cours</p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-300 mt-2">
            {pipeline.in_progress?.length || 0}
          </p>
        </div>
        <div className="p-5 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-all">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">Signés</p>
          <p className="text-3xl font-bold text-green-900 dark:text-green-300 mt-2">
            {pipeline.signed?.length || 0}
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <CRMKanban pipeline={pipeline} projectId={projectId!} />
    </div>
  );
}
