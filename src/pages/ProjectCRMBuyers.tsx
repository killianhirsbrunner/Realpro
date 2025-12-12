import { useParams, Link } from 'react-router-dom';
import { Filter, Search, Download } from 'lucide-react';
import { useState } from 'react';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { BuyersTable } from '../components/crm';
import { useBuyers } from '../hooks/useBuyers';

export default function ProjectCRMBuyers() {
  const { projectId } = useParams<{ projectId: string }>();
  const { buyers, loading, error, refetch } = useBuyers(projectId!);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (loading) return <LoadingState message="Chargement des acheteurs..." />;
  if (error) return <ErrorState message={error} retry={refetch} />;
  if (!buyers) return <ErrorState message="Aucune donnée disponible" retry={refetch} />;

  const filteredBuyers = buyers.filter((buyer) => {
    const matchesSearch = buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.lotNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || buyer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: buyers.length,
    RESERVED: buyers.filter(b => b.status === 'RESERVED').length,
    CONTRACT_SIGNED: buyers.filter(b => b.status === 'CONTRACT_SIGNED').length,
    NOTARY_IN_PROGRESS: buyers.filter(b => b.status === 'NOTARY_IN_PROGRESS').length,
    COMPLETED: buyers.filter(b => b.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Acheteurs
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {filteredBuyers.length} acheteur{filteredBuyers.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <Link
            to={`/projects/${projectId}/crm/pipeline`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors shadow-sm"
          >
            Voir le pipeline
          </Link>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
            statusFilter === 'all'
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
          }`}
        >
          Tous ({statusCounts.all})
        </button>
        <button
          onClick={() => setStatusFilter('RESERVED')}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
            statusFilter === 'RESERVED'
              ? 'bg-yellow-600 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
          }`}
        >
          Réservés ({statusCounts.RESERVED})
        </button>
        <button
          onClick={() => setStatusFilter('CONTRACT_SIGNED')}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
            statusFilter === 'CONTRACT_SIGNED'
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
          }`}
        >
          Contrat signé ({statusCounts.CONTRACT_SIGNED})
        </button>
        <button
          onClick={() => setStatusFilter('NOTARY_IN_PROGRESS')}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
            statusFilter === 'NOTARY_IN_PROGRESS'
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
          }`}
        >
          Chez notaire ({statusCounts.NOTARY_IN_PROGRESS})
        </button>
        <button
          onClick={() => setStatusFilter('COMPLETED')}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
            statusFilter === 'COMPLETED'
              ? 'bg-green-600 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
          }`}
        >
          Finalisés ({statusCounts.COMPLETED})
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou numéro de lot..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-neutral-900 dark:text-white"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
          <Filter className="w-4 h-4" />
          Plus de filtres
        </button>
      </div>

      {/* Buyers Table */}
      <BuyersTable buyers={filteredBuyers} projectId={projectId!} />
    </div>
  );
}
