import { useParams, Link } from 'react-router-dom';
import { Plus, Upload, Filter, Search, Users, TrendingUp, UserPlus, Target } from 'lucide-react';
import { useState } from 'react';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { ProspectsTable } from '../components/crm';
import { useProspects } from '../hooks/useProspects';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ExportMenu } from '../components/ui/ExportMenu';
import { prospectExportColumns } from '../lib/utils/export';

export default function ProjectCRMProspects() {
  const { projectId } = useParams<{ projectId: string }>();
  const { prospects, loading, error, refetch, project } = useProspects(projectId!);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (loading) return <LoadingState message="Chargement des prospects..." />;
  if (error) return <ErrorState message={error} retry={refetch} />;
  if (!prospects) return <ErrorState message="Aucune donnée disponible" retry={refetch} />;

  const filteredProspects = prospects.filter((prospect) => {
    const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: prospects.length,
    NEW: prospects.filter(p => p.status === 'NEW').length,
    CONTACTED: prospects.filter(p => p.status === 'CONTACTED').length,
    QUALIFIED: prospects.filter(p => p.status === 'QUALIFIED').length,
    CONVERTED: prospects.filter(p => p.status === 'CONVERTED').length,
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Projets', href: '/projects' },
          { label: project?.name || 'Projet', href: `/projects/${projectId}` },
          { label: 'Prospects' },
        ]}
      />

      <RealProTopbar
        title="Prospects"
        subtitle={`${filteredProspects.length} prospect${filteredProspects.length !== 1 ? 's' : ''} dans ce projet`}
        actions={
          <div className="flex items-center gap-3">
            <ExportMenu
              data={filteredProspects}
              columns={prospectExportColumns}
              filename="prospects-projet"
              title="Liste des prospects"
              subtitle={`${filteredProspects.length} prospects`}
            />
            <RealProButton variant="outline">
              <Upload className="w-4 h-4" />
              Importer
            </RealProButton>
            <Link to={`/projects/${projectId}/crm/prospects/new`}>
              <RealProButton variant="primary">
                <Plus className="w-4 h-4" />
                Nouveau prospect
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
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total prospects</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {prospects.length}
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
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Nouveaux</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {statusCounts.NEW}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Qualifiés</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {statusCounts.QUALIFIED}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Convertis</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {statusCounts.CONVERTED}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </RealProCard>
      </div>

      {/* Filtres par statut */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'Tous', count: statusCounts.all, color: 'brand' },
          { key: 'NEW', label: 'Nouveaux', count: statusCounts.NEW, color: 'blue' },
          { key: 'CONTACTED', label: 'Contactés', count: statusCounts.CONTACTED, color: 'purple' },
          { key: 'QUALIFIED', label: 'Qualifiés', count: statusCounts.QUALIFIED, color: 'amber' },
          { key: 'CONVERTED', label: 'Convertis', count: statusCounts.CONVERTED, color: 'green' },
        ].map((status) => (
          <button
            key={status.key}
            onClick={() => setStatusFilter(status.key)}
            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
              statusFilter === status.key
                ? `bg-${status.color}-600 text-white`
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
              placeholder="Rechercher par nom ou email..."
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

        {/* Table des prospects */}
        {filteredProspects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Aucun prospect trouvé
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Modifiez vos filtres ou créez un nouveau prospect
            </p>
            <Link to={`/projects/${projectId}/crm/prospects/new`}>
              <RealProButton variant="primary">
                <Plus className="w-4 h-4" />
                Créer un prospect
              </RealProButton>
            </Link>
          </div>
        ) : (
          <ProspectsTable prospects={filteredProspects} projectId={projectId!} />
        )}
      </RealProCard>
    </div>
  );
}
