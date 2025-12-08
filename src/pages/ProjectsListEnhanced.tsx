import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Grid3x3,
  List,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Package,
  DollarSign,
  Activity
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { ProjectCard } from '../components/project/ProjectCard';
import { useProjects } from '../hooks/useProjects';
import { formatCHF } from '../lib/utils/format';

type ViewMode = 'grid' | 'list';

const STATUS_LABELS: Record<string, string> = {
  PLANNING: 'Planification',
  CONSTRUCTION: 'Construction',
  SELLING: 'Commercialisation',
  COMPLETED: 'Terminé',
  ARCHIVED: 'Archivé',
};

const TYPE_LABELS: Record<string, string> = {
  PPE: 'PPE',
  LOCATIF: 'Locatif',
  MIXTE: 'Mixte',
  TO_DEFINE: 'À définir',
};

export function ProjectsListEnhanced() {
  const navigate = useNavigate();
  const { projects, loading } = useProjects();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [cantonFilter, setCantonFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const globalStats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p =>
      ['PLANNING', 'CONSTRUCTION', 'SELLING'].includes(p.status)
    ).length;
    const completed = projects.filter(p => p.status === 'COMPLETED').length;
    const totalRevenue = projects.reduce((sum, p) => sum + (p.total_revenue || 0), 0);
    const totalLots = projects.reduce((sum, p) => sum + (p.total_lots || 0), 0);
    const soldLots = projects.reduce((sum, p) => sum + (p.sold_lots || 0), 0);

    return { total, active, completed, totalRevenue, totalLots, soldLots };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = !searchQuery ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.city?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
      const matchesCanton = cantonFilter === 'ALL' || project.canton === cantonFilter;
      const matchesType = typeFilter === 'ALL' || project.type === typeFilter;

      return matchesSearch && matchesStatus && matchesCanton && matchesType;
    });
  }, [projects, searchQuery, statusFilter, cantonFilter, typeFilter]);

  const cantons = useMemo(() => {
    const uniqueCantons = Array.from(new Set(projects.map(p => p.canton).filter(Boolean)));
    return uniqueCantons.sort();
  }, [projects]);

  if (loading) {
    return <LoadingState message="Chargement des projets..." />;
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Projets
          </h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'projet' : 'projets'}
            {searchQuery || statusFilter !== 'ALL' || cantonFilter !== 'ALL' || typeFilter !== 'ALL'
              ? ` (filtré${filteredProjects.length > 1 ? 's' : ''})`
              : ''}
          </p>
        </div>
        <Link to="/projects/wizard">
          <Button variant="primary" size="lg" className="gap-2 shadow-lg shadow-brand-600/20">
            <Plus className="w-5 h-5" />
            Nouveau projet
          </Button>
        </Link>
      </div>

      {/* Statistiques globales */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Total projets
                  </p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                    {globalStats.total}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    {globalStats.active} en cours
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 dark:bg-blue-400/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Chiffre d'affaires
                  </p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
                    {formatCHF(globalStats.totalRevenue, 0)}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Lots vendus
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/20 dark:bg-green-400/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    Lots totaux
                  </p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                    {globalStats.totalLots}
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                    {globalStats.soldLots} vendus ({globalStats.totalLots > 0 ? Math.round((globalStats.soldLots / globalStats.totalLots) * 100) : 0}%)
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 dark:bg-purple-400/20 flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Projets actifs
                  </p>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">
                    {globalStats.active}
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    {globalStats.completed} terminés
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 dark:bg-orange-400/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <Input
                type="text"
                placeholder="Rechercher un projet, une ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-w-[180px]"
              >
                <option value="ALL">Tous les statuts</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>

              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="min-w-[150px]"
              >
                <option value="ALL">Tous les types</option>
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>

              <Select
                value={cantonFilter}
                onChange={(e) => setCantonFilter(e.target.value)}
                className="min-w-[140px]"
              >
                <option value="ALL">Tous les cantons</option>
                {cantons.map(canton => (
                  <option key={canton} value={canton}>{canton}</option>
                ))}
              </Select>

              <div className="flex items-center gap-1 border border-neutral-200 dark:border-neutral-700 rounded-lg p-1 bg-white dark:bg-neutral-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                      : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
                  }`}
                  title="Vue grille"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                      : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
                  }`}
                  title="Vue liste"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filtres actifs */}
          {(searchQuery || statusFilter !== 'ALL' || cantonFilter !== 'ALL' || typeFilter !== 'ALL') && (
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Filtres actifs:</span>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="info" size="sm">
                      Recherche: {searchQuery}
                    </Badge>
                  )}
                  {statusFilter !== 'ALL' && (
                    <Badge variant="info" size="sm">
                      Statut: {STATUS_LABELS[statusFilter]}
                    </Badge>
                  )}
                  {typeFilter !== 'ALL' && (
                    <Badge variant="info" size="sm">
                      Type: {TYPE_LABELS[typeFilter]}
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
                      setTypeFilter('ALL');
                    }}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des projets */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={searchQuery || statusFilter !== 'ALL' || cantonFilter !== 'ALL' || typeFilter !== 'ALL'
            ? "Aucun projet trouvé"
            : "Aucun projet"}
          description={searchQuery || statusFilter !== 'ALL' || cantonFilter !== 'ALL' || typeFilter !== 'ALL'
            ? "Essayez de modifier vos critères de recherche"
            : "Commencez par créer votre premier projet immobilier"}
          action={
            searchQuery || statusFilter !== 'ALL' || cantonFilter !== 'ALL' || typeFilter !== 'ALL' ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setCantonFilter('ALL');
                  setTypeFilter('ALL');
                }}
              >
                Réinitialiser les filtres
              </Button>
            ) : (
              <Link to="/projects/wizard">
                <Button variant="primary" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Créer mon premier projet
                </Button>
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
