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
} from '@realpro/ui';
import { ArrowLeft, Building2, MapPin, Calendar, Users, Edit2 } from 'lucide-react';

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();

  // Mock data - in real app, fetch from API
  const project = {
    id: projectId,
    name: 'Résidence du Lac',
    location: 'Lausanne, VD',
    address: 'Chemin du Lac 15, 1007 Lausanne',
    description: 'Un projet de standing situé au bord du lac Léman, offrant des appartements lumineux avec vue imprenable sur les Alpes.',
    progress: 75,
    status: 'construction' as const,
    unitsTotal: 24,
    unitsSold: 18,
    startDate: '2023-03-01',
    expectedDelivery: '2025-06-01',
  };

  const statusConfig = {
    planning: { label: 'Planification', variant: 'info' as const },
    construction: { label: 'Construction', variant: 'warning' as const },
    commercialization: { label: 'Commercialisation', variant: 'success' as const },
    delivered: { label: 'Livré', variant: 'neutral' as const },
  };

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
          <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
            <Building2 className="w-20 h-20 text-neutral-300 dark:text-neutral-600" />
          </div>
        </div>
        <div className="lg:w-2/3">
          <div className="flex items-start gap-3">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {project.name}
            </h1>
            <Badge variant={statusConfig[project.status].variant}>
              {statusConfig[project.status].label}
            </Badge>
          </div>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300">
            {project.description}
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Localisation</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {project.location}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Livraison prévue</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(project.expectedDelivery).toLocaleDateString('fr-CH', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Unités</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {project.unitsTotal} logements
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Vendues</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white flex items-center gap-1">
                <Users className="w-4 h-4" />
                {project.unitsSold} ({Math.round((project.unitsSold / project.unitsTotal) * 100)}%)
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
              Avancement du projet
            </h3>
            <span className="text-2xl font-bold text-primary-600">
              {project.progress}%
            </span>
          </div>
          <Progress value={project.progress} size="lg" />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="units">
        <TabsList>
          <TabsTrigger value="units">Unités</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Planning</TabsTrigger>
          <TabsTrigger value="prospects">Prospects</TabsTrigger>
        </TabsList>

        <TabsContent value="units">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                Liste des unités
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-500 dark:text-neutral-400">
                La gestion des unités sera disponible dans une prochaine version.
              </p>
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
              <p className="text-neutral-500 dark:text-neutral-400">
                La gestion documentaire sera disponible dans une prochaine version.
              </p>
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
              <p className="text-neutral-500 dark:text-neutral-400">
                Le planning de construction sera disponible dans une prochaine version.
              </p>
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
              <p className="text-neutral-500 dark:text-neutral-400">
                La gestion des prospects sera disponible dans une prochaine version.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
