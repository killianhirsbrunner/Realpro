import { useParams, Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Badge,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Skeleton,
  EmptyState,
} from '@realpro/ui';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Users,
  Edit2,
  AlertCircle,
  Plus,
  Home,
  DollarSign,
  Ruler,
} from 'lucide-react';
import {
  PROJECT_STATUS_LABELS,
  LOT_STATUS_LABELS,
  LOT_TYPE_LABELS,
  type ProjectStatus,
  type LotStatus,
  getProjectFullAddress,
} from '@realpro/entities';
import { useProject } from '@/features/projects/hooks/useProjects';
import { useLots } from '@/features/lots/hooks/useLots';

const STATUS_VARIANT: Record<ProjectStatus, 'info' | 'warning' | 'success' | 'neutral'> = {
  PLANNING: 'info',
  CONSTRUCTION: 'warning',
  SELLING: 'success',
  COMPLETED: 'neutral',
  ARCHIVED: 'neutral',
};

const LOT_STATUS_VARIANT: Record<LotStatus, 'success' | 'info' | 'warning' | 'neutral'> = {
  AVAILABLE: 'success',
  RESERVED: 'info',
  OPTION: 'warning',
  SOLD: 'neutral',
  DELIVERED: 'neutral',
};

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '-';
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSurface(value: number | null | undefined): string {
  if (value == null) return '-';
  return `${value} m²`;
}

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: project, isLoading: projectLoading, error: projectError } = useProject(projectId);
  const { lots, stats, isLoading: lotsLoading } = useLots(projectId);

  // Loading state
  if (projectLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3">
            <Skeleton className="aspect-video rounded-xl" />
          </div>
          <div className="lg:w-2/3 space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  // Error state
  if (projectError || !project) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
          {projectError ? 'Erreur de chargement' : 'Projet introuvable'}
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-md mb-4">
          {projectError
            ? 'Impossible de charger les détails du projet.'
            : 'Ce projet n\'existe pas ou a été supprimé.'}
        </p>
        <Link to="/projects">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Retour aux projets
          </Button>
        </Link>
      </div>
    );
  }

  const completionPercent = stats
    ? Math.round((stats.sold / (stats.total || 1)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux projets
        </Link>
        <Button variant="outline" leftIcon={<Edit2 className="w-4 h-4" />}>
          Modifier
        </Button>
      </div>

      {/* Project Header */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.name}
              className="aspect-video object-cover rounded-xl"
            />
          ) : (
            <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
              <Building2 className="w-20 h-20 text-neutral-300 dark:text-neutral-600" />
            </div>
          )}
        </div>
        <div className="lg:w-2/3">
          <div className="flex items-start gap-3">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {project.name}
            </h1>
            <Badge variant={STATUS_VARIANT[project.status]}>
              {PROJECT_STATUS_LABELS[project.status]}
            </Badge>
          </div>
          {project.description && (
            <p className="mt-2 text-neutral-600 dark:text-neutral-300">
              {project.description}
            </p>
          )}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Localisation</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {project.city || 'Non définie'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Livraison prévue</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {project.end_date
                  ? new Date(project.end_date).toLocaleDateString('fr-CH', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Non définie'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Unités</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {stats?.total || 0} logements
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Vendues</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white flex items-center gap-1">
                <Users className="w-4 h-4" />
                {stats?.sold || 0} ({completionPercent}%)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Avancement commercial
            </h3>
            <span className="text-2xl font-bold text-primary-600">
              {completionPercent}%
            </span>
          </div>
          <Progress value={completionPercent} size="lg" />
          {stats && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                <p className="text-neutral-500">Disponibles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.reserved}</p>
                <p className="text-neutral-500">Réservés</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{stats.option}</p>
                <p className="text-neutral-500">En option</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neutral-600">{stats.sold}</p>
                <p className="text-neutral-500">Vendus</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neutral-400">{stats.delivered}</p>
                <p className="text-neutral-500">Livrés</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="units">
        <TabsList>
          <TabsTrigger value="units">Unités ({stats?.total || 0})</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Planning</TabsTrigger>
          <TabsTrigger value="prospects">Prospects</TabsTrigger>
        </TabsList>

        <TabsContent value="units">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Liste des unités
              </h3>
              <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Ajouter
              </Button>
            </CardHeader>
            <CardContent>
              {lotsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : lots.length === 0 ? (
                <EmptyState
                  icon={<Home className="w-12 h-12" />}
                  title="Aucune unité"
                  description="Ajoutez des unités (appartements, parkings, etc.) à ce projet."
                  action={
                    <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                      Ajouter une unité
                    </Button>
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-700">
                        <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          Code
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          Type
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          Pièces
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          <div className="flex items-center gap-1">
                            <Ruler className="w-3 h-3" />
                            Surface
                          </div>
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            Prix
                          </div>
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lots.map((lot) => (
                        <tr
                          key={lot.id}
                          className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer"
                        >
                          <td className="py-3 px-2 font-medium text-neutral-900 dark:text-white">
                            {lot.code}
                          </td>
                          <td className="py-3 px-2 text-neutral-600 dark:text-neutral-300">
                            {LOT_TYPE_LABELS[lot.type]}
                          </td>
                          <td className="py-3 px-2 text-neutral-600 dark:text-neutral-300">
                            {lot.rooms_count ? `${lot.rooms_count} pcs` : '-'}
                          </td>
                          <td className="py-3 px-2 text-neutral-600 dark:text-neutral-300">
                            {formatSurface(lot.surface_living)}
                          </td>
                          <td className="py-3 px-2 font-medium text-neutral-900 dark:text-white">
                            {formatCurrency(lot.price_total)}
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant={LOT_STATUS_VARIANT[lot.status]} size="sm">
                              {LOT_STATUS_LABELS[lot.status]}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Documents du projet
              </h3>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<Building2 className="w-12 h-12" />}
                title="À venir"
                description="La gestion documentaire sera disponible dans une prochaine version."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Planning du projet
              </h3>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<Calendar className="w-12 h-12" />}
                title="À venir"
                description="Le planning de construction sera disponible dans une prochaine version."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prospects">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Prospects intéressés
              </h3>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<Users className="w-12 h-12" />}
                title="À venir"
                description="La gestion des prospects sera disponible dans une prochaine version."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
