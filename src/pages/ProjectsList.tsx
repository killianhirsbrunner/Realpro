import { useState, useMemo } from 'react';
import { Building2, Grid3x3, List, Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
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

  if (loading) {
    return <LoadingState message={t('common.loading')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('projects.title')}</h1>
          <p className="mt-1 text-gray-500">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'projet' : 'projets'}
            {searchQuery || statusFilter !== 'ALL' || cantonFilter !== 'ALL' ? ` (filtré${filteredProjects.length > 1 ? 's' : ''})` : ''}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          {t('projects.create')}
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un projet, une ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-3">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-w-[150px]"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="PLANNING">Planification</option>
                <option value="CONSTRUCTION">Construction</option>
                <option value="SELLING">Commercialisation</option>
                <option value="COMPLETED">Terminé</option>
                <option value="ARCHIVED">Archivé</option>
              </Select>

              <Select
                value={cantonFilter}
                onChange={(e) => setCantonFilter(e.target.value)}
                className="min-w-[120px]"
              >
                <option value="ALL">Tous les cantons</option>
                {cantons.map(canton => (
                  <option key={canton} value={canton}>{canton}</option>
                ))}
              </Select>

              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Vue grille"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Vue liste"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {(searchQuery || statusFilter !== 'ALL' || cantonFilter !== 'ALL') && (
            <div className="mt-3 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Filtres actifs:</span>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="info" size="sm">
                    Recherche: {searchQuery}
                  </Badge>
                )}
                {statusFilter !== 'ALL' && (
                  <Badge variant="info" size="sm">
                    Statut: {statusFilter}
                  </Badge>
                )}
                {cantonFilter !== 'ALL' && (
                  <Badge variant="info" size="sm">
                    Canton: {cantonFilter}
                  </Badge>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setCantonFilter('ALL');
                  }}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={searchQuery || statusFilter !== 'ALL' || cantonFilter !== 'ALL'
            ? "Aucun projet trouvé"
            : "Aucun projet"}
          description={searchQuery || statusFilter !== 'ALL' || cantonFilter !== 'ALL'
            ? "Essayez de modifier vos critères de recherche"
            : "Commencez par créer votre premier projet immobilier"}
          action={
            searchQuery || statusFilter !== 'ALL' || cantonFilter !== 'ALL' ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setCantonFilter('ALL');
                }}
              >
                Réinitialiser les filtres
              </Button>
            ) : (
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {t('projects.create')}
              </Button>
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
