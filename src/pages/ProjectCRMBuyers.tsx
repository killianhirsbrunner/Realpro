import { useParams, Link } from 'react-router-dom';
import { Filter, Search, Download, Users, FileCheck, Scale, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { BuyersTable } from '../components/crm';
import { useBuyers } from '../hooks/useBuyers';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export default function ProjectCRMBuyers() {
  const { projectId } = useParams<{ projectId: string }>();
  const { buyers, loading, error, refetch, project } = useBuyers(projectId!);
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

  const statusConfig = [
    { key: 'all', label: 'Tous', count: statusCounts.all, activeColor: 'bg-brand-600' },
    { key: 'RESERVED', label: 'Réservés', count: statusCounts.RESERVED, activeColor: 'bg-yellow-600' },
    { key: 'CONTRACT_SIGNED', label: 'Contrat signé', count: statusCounts.CONTRACT_SIGNED, activeColor: 'bg-blue-600' },
    { key: 'NOTARY_IN_PROGRESS', label: 'Chez notaire', count: statusCounts.NOTARY_IN_PROGRESS, activeColor: 'bg-purple-600' },
    { key: 'COMPLETED', label: 'Finalisés', count: statusCounts.COMPLETED, activeColor: 'bg-green-600' },
  ];

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: project?.name || 'Projet', href: `/projects/${projectId}` },
          { label: 'Acheteurs' },
        ]}
      />

      <RealProTopbar
        title="Acheteurs"
        subtitle={`${filteredBuyers.length} acheteur${filteredBuyers.length !== 1 ? 's' : ''} dans ce projet`}
        actions={
          <div className="flex items-center gap-3">
            <RealProButton variant="outline">
              <Download className="w-4 h-4" />
              Exporter
            </RealProButton>
            <Link to={`/projects/${projectId}/crm/pipeline`}>
              <RealProButton variant="primary">
                Voir le pipeline
              </RealProButton>
            </Link>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total acheteurs</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {buyers.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900/30">
              <Users className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Contrats signés</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {statusCounts.CONTRACT_SIGNED}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <FileCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Chez notaire</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {statusCounts.NOTARY_IN_PROGRESS}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Scale className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Ventes finalisées</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {statusCounts.COMPLETED}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </RealProCard>
      </div>

      {/* Filtres par statut */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {statusConfig.map((status) => (
          <button
            key={status.key}
            onClick={() => setStatusFilter(status.key)}
            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
              statusFilter === status.key
                ? `${status.activeColor} text-white`
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            {status.label} ({status.count})
          </button>
        ))}
      </div>

      {/* Recherche et filtres */}
      <RealProCard padding="lg">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou numéro de lot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 transition-colors"
            />
          </div>
          <RealProButton variant="outline">
            <Filter className="w-4 h-4" />
            Plus de filtres
          </RealProButton>
        </div>

        {/* Table des acheteurs */}
        {filteredBuyers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Aucun acheteur trouvé
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Modifiez vos filtres ou créez une nouvelle réservation
            </p>
            <Link to={`/projects/${projectId}/lots`}>
              <RealProButton variant="primary">
                Voir les lots disponibles
              </RealProButton>
            </Link>
          </div>
        ) : (
          <BuyersTable buyers={filteredBuyers} projectId={projectId!} />
        )}
      </RealProCard>
    </div>
  );
}
