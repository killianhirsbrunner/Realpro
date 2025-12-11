import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Grid3x3, List, Plus, Search, Filter, X } from 'lucide-react';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { RealProBadge } from '../components/realpro/RealProBadge';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { ProjectCard } from '../components/project/ProjectCard';
import { useI18n } from '../lib/i18n';
import { useProjects } from '../hooks/useProjects';

type ViewMode = 'grid' | 'list';

export function ProjectsList() {
  const { t } = useI18n();
  const { projects, loading } = useProjects();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [cantonFilter, setCantonFilter] = useState<string>('ALL');

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = !searchQuery ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.city?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
      const matchesCanton = cantonFilter === 'ALL' || project.canton === cantonFilter;

      return matchesSearch && matchesStatus && matchesCanton;
    });
  }, [projects, searchQuery, statusFilter, cantonFilter]);

  const cantons = useMemo(() => {
    const uniqueCantons = Array.from(new Set(projects.map(p => p.canton).filter(Boolean)));
    return uniqueCantons.sort();
  }, [projects]);

  const hasActiveFilters = searchQuery || statusFilter !== 'ALL' || cantonFilter !== 'ALL';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCantonFilter('ALL');
  };

  if (loading) {
    return <LoadingState message={t('common.loading')} />;
  }

  const projectCount = filteredProjects.length;
  const subtitle = `${projectCount} ${projectCount === 1 ? 'projet' : 'projets'}${hasActiveFilters ? ' (filtrés)' : ''}`;

  return (
    <div className="space-y-6">
      {/* Header avec RealProTopbar */}
      <RealProTopbar
        title={t('projects.title')}
        subtitle={subtitle}
        actions={
          <Link to="/projects/new">
            <RealProButton variant="primary">
              <Plus className="w-4 h-4" />
              {t('projects.create')}
            </RealProButton>
          </Link>
        }
      />

      {/* Barre de filtres */}
      <RealProCard padding="md">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher un projet, une ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filtres */}
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-[160px] px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="PLANNING">{t('projects.statuses.PLANNING')}</option>
              <option value="CONSTRUCTION">{t('projects.statuses.CONSTRUCTION')}</option>
              <option value="SELLING">{t('projects.statuses.SELLING')}</option>
              <option value="COMPLETED">{t('projects.statuses.COMPLETED')}</option>
              <option value="ARCHIVED">{t('projects.statuses.ARCHIVED')}</option>
            </select>

            <select
              value={cantonFilter}
              onChange={(e) => setCantonFilter(e.target.value)}
              className="min-w-[140px] px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="ALL">Tous les cantons</option>
              {cantons.map(canton => (
                <option key={canton} value={canton}>{canton}</option>
              ))}
            </select>

            {/* Toggle vue grille/liste */}
            <div className="flex items-center gap-1 border border-neutral-200 dark:border-neutral-700 rounded-xl p-1 bg-neutral-50 dark:bg-neutral-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                title="Vue grille"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                title="Vue liste"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Indicateurs de filtres actifs */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filtres actifs :</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <RealProBadge type="info" size="sm">
                  Recherche : {searchQuery}
                </RealProBadge>
              )}
              {statusFilter !== 'ALL' && (
                <RealProBadge type="info" size="sm">
                  Statut : {t(`projects.statuses.${statusFilter}`)}
                </RealProBadge>
              )}
              {cantonFilter !== 'ALL' && (
                <RealProBadge type="info" size="sm">
                  Canton : {cantonFilter}
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

      {/* Liste des projets */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={hasActiveFilters
            ? 'Aucun projet trouvé'
            : 'Aucun projet'}
          description={hasActiveFilters
            ? 'Essayez de modifier vos critères de recherche'
            : 'Commencez par créer votre premier projet immobilier'}
          action={
            hasActiveFilters ? (
              <RealProButton variant="outline" onClick={clearFilters}>
                Réinitialiser les filtres
              </RealProButton>
            ) : (
              <Link to="/projects/new">
                <RealProButton variant="primary">
                  <Plus className="w-4 h-4" />
                  {t('projects.create')}
                </RealProButton>
              </Link>
            )
          }
        />
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
