import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
  Progress,
  EmptyState,
  Skeleton,
} from '@realpro/ui';
import { Search, Plus, Building2, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { PROJECT_STATUS_LABELS, type ProjectStatus } from '@realpro/entities';
import { useProjects } from '@/features/projects/hooks/useProjects';

const STATUS_VARIANT: Record<ProjectStatus, 'info' | 'warning' | 'success' | 'neutral'> = {
  PLANNING: 'info',
  CONSTRUCTION: 'warning',
  SELLING: 'success',
  COMPLETED: 'neutral',
  ARCHIVED: 'neutral',
};

export function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | null>(null);

  const { data: projects, isLoading, error } = useProjects();

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.city?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesStatus = !statusFilter || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1 max-w-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-full">
              <Skeleton className="aspect-video rounded-t-xl" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-2 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
          Erreur de chargement
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-md">
          Impossible de charger les projets. Veuillez réessayer ultérieurement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Projets
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Gérez vos projets de promotion immobilière
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Nouveau projet
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Rechercher un projet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === null ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(null)}
          >
            Tous
          </Button>
          {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[])
            .filter((status) => status !== 'ARCHIVED')
            .map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {PROJECT_STATUS_LABELS[status]}
              </Button>
            ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-12 h-12" />}
          title={projects?.length === 0 ? 'Aucun projet' : 'Aucun projet trouvé'}
          description={
            projects?.length === 0
              ? 'Commencez par créer votre premier projet de promotion.'
              : 'Modifiez vos critères de recherche ou créez un nouveau projet.'
          }
          action={
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Nouveau projet
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="aspect-video object-cover rounded-t-xl"
                  />
                ) : (
                  <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-t-xl flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-neutral-300 dark:text-neutral-600" />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {project.name}
                    </h3>
                    <Badge variant={STATUS_VARIANT[project.status]} size="sm">
                      {PROJECT_STATUS_LABELS[project.status]}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {[project.city, project.postal_code].filter(Boolean).join(', ') || 'Adresse non définie'}
                      </span>
                    </div>
                    {project.end_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>
                          Livraison:{' '}
                          {new Date(project.end_date).toLocaleDateString('fr-CH', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        Avancement
                      </span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {project.sold_lots}/{project.total_lots} unités vendues
                      </span>
                    </div>
                    <Progress value={project.completion_percent} size="sm" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
