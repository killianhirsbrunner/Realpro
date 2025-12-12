import { useParams, Link } from 'react-router-dom';
import { Plus, Upload, Filter, Search, X, Users, Phone, Mail, Calendar } from 'lucide-react';
import { useState } from 'react';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { RealProBadge } from '../components/realpro/RealProBadge';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { ProspectsTable } from '../components/crm';
import { useProspects } from '../hooks/useProspects';
import { useI18n } from '../lib/i18n';

export default function ProjectCRMProspects() {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();
  const { prospects, loading, error, refetch } = useProspects(projectId!);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  if (loading) return <LoadingState message="Chargement des prospects..." />;
  if (error) return <ErrorState message={error} retry={refetch} />;
  if (!prospects) return <ErrorState message="Aucune donnée disponible" retry={refetch} />;

  const filteredProspects = prospects.filter((prospect) => {
    const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === 'all' || prospect.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const hasActiveFilters = searchTerm || sourceFilter !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setSourceFilter('all');
  };

  // Compter par source
  const sourceCounts = prospects.reduce((acc, p) => {
    acc[p.source] = (acc[p.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sources = Object.keys(sourceCounts);

  const subtitle = `${filteredProspects.length} prospect${filteredProspects.length !== 1 ? 's' : ''}${hasActiveFilters ? ' (filtrés)' : ''}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <RealProTopbar
        title={t('crm.prospects')}
        subtitle={subtitle}
        actions={
          <div className="flex items-center gap-3">
            <RealProButton variant="outline">
              <Upload className="w-4 h-4" />
              Importer
            </RealProButton>
            <Link to={`/projects/${projectId}/crm/prospects/new`}>
              <RealProButton variant="primary">
                <Plus className="w-4 h-4" />
                {t('crm.newProspect')}
              </RealProButton>
            </Link>
          </div>
        }
      />

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Total prospects</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{prospects.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900/30">
              <Users className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Contactés cette semaine</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {prospects.filter(p => {
                  if (!p.lastContact) return false;
                  const lastWeek = new Date();
                  lastWeek.setDate(lastWeek.getDate() - 7);
                  return new Date(p.lastContact) > lastWeek;
                }).length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Avec email</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {prospects.filter(p => p.email).length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </RealProCard>

        <RealProCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Avec lot cible</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {prospects.filter(p => p.targetLotId).length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </RealProCard>
      </div>

      {/* Filtres et recherche */}
      <RealProCard padding="md">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filtre par source */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="min-w-[180px] px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
          >
            <option value="all">Toutes les sources</option>
            {sources.map(source => (
              <option key={source} value={source}>
                {source} ({sourceCounts[source]})
              </option>
            ))}
          </select>

          <RealProButton variant="outline">
            <Filter className="w-4 h-4" />
            Plus de filtres
          </RealProButton>
        </div>

        {/* Filtres actifs */}
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
              {sourceFilter !== 'all' && (
                <RealProBadge type="info" size="sm">
                  Source : {sourceFilter}
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

      {/* Table ou état vide */}
      {filteredProspects.length === 0 ? (
        <EmptyState
          icon={Users}
          title={hasActiveFilters ? 'Aucun prospect trouvé' : 'Aucun prospect'}
          description={hasActiveFilters
            ? 'Essayez de modifier vos critères de recherche'
            : 'Ajoutez votre premier prospect pour commencer'}
          action={
            hasActiveFilters ? (
              <RealProButton variant="outline" onClick={clearFilters}>
                Réinitialiser les filtres
              </RealProButton>
            ) : (
              <Link to={`/projects/${projectId}/crm/prospects/new`}>
                <RealProButton variant="primary">
                  <Plus className="w-4 h-4" />
                  {t('crm.newProspect')}
                </RealProButton>
              </Link>
            )
          }
        />
      ) : (
        <ProspectsTable prospects={filteredProspects} projectId={projectId!} />
      )}
    </div>
  );
}
