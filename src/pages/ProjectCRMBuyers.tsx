import { useParams, Link } from 'react-router-dom';
import { Filter, Search, Download, Users, ArrowRight, CheckCircle, Clock, FileText, X } from 'lucide-react';
import { useState } from 'react';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { RealProBadge } from '../components/realpro/RealProBadge';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { BuyersTable } from '../components/crm';
import { useBuyers } from '../hooks/useBuyers';
import { useI18n } from '../lib/i18n';

export default function ProjectCRMBuyers() {
  const { t } = useI18n();
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

  const hasActiveFilters = searchTerm || statusFilter !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const subtitle = `${filteredBuyers.length} acheteur${filteredBuyers.length !== 1 ? 's' : ''}${hasActiveFilters ? ' (filtrés)' : ''}`;

  const statusTabs = [
    { key: 'all', label: 'Tous', count: statusCounts.all, color: 'brand' },
    { key: 'RESERVED', label: 'Réservés', count: statusCounts.RESERVED, color: 'amber' },
    { key: 'CONTRACT_SIGNED', label: 'Contrat signé', count: statusCounts.CONTRACT_SIGNED, color: 'blue' },
    { key: 'NOTARY_IN_PROGRESS', label: 'Chez notaire', count: statusCounts.NOTARY_IN_PROGRESS, color: 'purple' },
    { key: 'COMPLETED', label: 'Finalisés', count: statusCounts.COMPLETED, color: 'green' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <RealProTopbar
        title={t('crm.buyers')}
        subtitle={subtitle}
        actions={
          <div className="flex items-center gap-3">
            <RealProButton variant="outline">
              <Download className="w-4 h-4" />
              Exporter
            </RealProButton>
            <Link to={`/projects/${projectId}/crm/pipeline`}>
              <RealProButton variant="primary">
                Voir le pipeline
                <ArrowRight className="w-4 h-4" />
              </RealProButton>
            </Link>
          </div>
        }
      />

      {/* Stats KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Total acheteurs</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{buyers.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900/30">
              <Users className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">En réservation</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{statusCounts.RESERVED}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Chez notaire</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{statusCounts.NOTARY_IN_PROGRESS}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Ventes finalisées</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{statusCounts.COMPLETED}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </RealProCard>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.key;
          const baseClasses = 'px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all';

          let activeClasses = '';
          let inactiveClasses = 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700';

          if (tab.color === 'brand') activeClasses = 'bg-brand-600 text-white shadow-lg shadow-brand-600/30';
          else if (tab.color === 'amber') activeClasses = 'bg-amber-500 text-white shadow-lg shadow-amber-500/30';
          else if (tab.color === 'blue') activeClasses = 'bg-blue-600 text-white shadow-lg shadow-blue-600/30';
          else if (tab.color === 'purple') activeClasses = 'bg-purple-600 text-white shadow-lg shadow-purple-600/30';
          else if (tab.color === 'green') activeClasses = 'bg-green-600 text-white shadow-lg shadow-green-600/30';

          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <RealProCard padding="md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou numéro de lot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>
          <RealProButton variant="outline">
            <Filter className="w-4 h-4" />
            Plus de filtres
          </RealProButton>
        </div>

        {/* Active filters */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filtres actifs :</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <RealProBadge type="info" size="sm">
                  Recherche : {searchTerm}
                </RealProBadge>
              )}
              {statusFilter !== 'all' && (
                <RealProBadge type="info" size="sm">
                  Statut : {statusTabs.find(t => t.key === statusFilter)?.label}
                </RealProBadge>
              )}
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Réinitialiser
              </button>
            </div>
          </div>
        )}
      </RealProCard>

      {/* Buyers Table or Empty State */}
      {filteredBuyers.length === 0 ? (
        <EmptyState
          icon={Users}
          title={hasActiveFilters ? 'Aucun acheteur trouvé' : 'Aucun acheteur'}
          description={hasActiveFilters
            ? 'Essayez de modifier vos critères de recherche'
            : 'Les acheteurs apparaîtront ici après conversion des prospects'}
          action={
            hasActiveFilters ? (
              <RealProButton variant="outline" onClick={clearFilters}>
                Réinitialiser les filtres
              </RealProButton>
            ) : (
              <Link to={`/projects/${projectId}/crm/pipeline`}>
                <RealProButton variant="primary">
                  Voir le pipeline
                  <ArrowRight className="w-4 h-4" />
                </RealProButton>
              </Link>
            )
          }
        />
      ) : (
        <BuyersTable buyers={filteredBuyers} projectId={projectId!} />
      )}
    </div>
  );
}
