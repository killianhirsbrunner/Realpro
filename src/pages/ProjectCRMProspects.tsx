import { useParams, Link } from 'react-router-dom';
import { Plus, Upload, Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { ProspectsTable } from '../components/crm';
import { useProspects } from '../hooks/useProspects';

export default function ProjectCRMProspects() {
  const { projectId } = useParams<{ projectId: string }>();
  const { prospects, loading, error, refetch } = useProspects(projectId!);
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <LoadingState message="Chargement des prospects..." />;
  if (error) return <ErrorState message={error} retry={refetch} />;
  if (!prospects) return <ErrorState message="Aucune donnée disponible" retry={refetch} />;

  const filteredProspects = prospects.filter((prospect) =>
    prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Prospects
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {filteredProspects.length} prospect{filteredProspects.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Upload className="w-4 h-4" />
            Importer
          </button>
          <Link
            to={`/projects/${projectId}/crm/prospects/new`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouveau prospect
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Filter className="w-4 h-4" />
          Filtres
        </button>
      </div>

      {/* Prospects Table */}
      <ProspectsTable prospects={filteredProspects} projectId={projectId!} />
    </div>
  );
}
