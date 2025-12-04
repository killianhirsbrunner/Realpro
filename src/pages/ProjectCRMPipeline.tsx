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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Pipeline Commercial
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {totalContacts} contact{totalContacts !== 1 ? 's' : ''} au total
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <Link
            to={`/projects/${projectId}/crm/prospects/new`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter un prospect
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Prospects</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {pipeline.prospect?.length || 0}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Réservés</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
            {pipeline.reserved?.length || 0}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">En cours</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {pipeline.in_progress?.length || 0}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Signés</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {pipeline.signed?.length || 0}
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <CRMKanban pipeline={pipeline} projectId={projectId!} />
    </div>
  );
}
