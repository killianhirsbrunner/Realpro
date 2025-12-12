import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
  Progress,
  EmptyState,
} from '@realpro/ui';
import { Search, Plus, Building2, MapPin, Calendar } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  location: string;
  address: string;
  progress: number;
  status: 'planning' | 'construction' | 'commercialization' | 'delivered';
  unitsTotal: number;
  unitsSold: number;
  startDate: string;
  expectedDelivery: string;
  imageUrl?: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Résidence du Lac',
    location: 'Lausanne, VD',
    address: 'Chemin du Lac 15',
    progress: 75,
    status: 'construction',
    unitsTotal: 24,
    unitsSold: 18,
    startDate: '2023-03-01',
    expectedDelivery: '2025-06-01',
  },
  {
    id: '2',
    name: 'Les Terrasses de Morges',
    location: 'Morges, VD',
    address: 'Avenue des Alpes 42',
    progress: 30,
    status: 'planning',
    unitsTotal: 16,
    unitsSold: 4,
    startDate: '2024-01-15',
    expectedDelivery: '2026-03-01',
  },
  {
    id: '3',
    name: 'Éco-Quartier Soleil',
    location: 'Nyon, VD',
    address: 'Route de Genève 88',
    progress: 95,
    status: 'commercialization',
    unitsTotal: 32,
    unitsSold: 28,
    startDate: '2022-06-01',
    expectedDelivery: '2024-12-01',
  },
  {
    id: '4',
    name: 'Villa Bella Vista',
    location: 'Montreux, VD',
    address: 'Chemin de la Vue 5',
    progress: 100,
    status: 'delivered',
    unitsTotal: 8,
    unitsSold: 8,
    startDate: '2021-09-01',
    expectedDelivery: '2023-12-01',
  },
];

const statusConfig: Record<string, { label: string; variant: 'info' | 'warning' | 'success' | 'neutral' }> = {
  planning: { label: 'Planification', variant: 'info' },
  construction: { label: 'Construction', variant: 'warning' },
  commercialization: { label: 'Commercialisation', variant: 'success' },
  delivered: { label: 'Livré', variant: 'neutral' },
};

export function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          {Object.entries(statusConfig).map(([key, { label }]) => (
            <Button
              key={key}
              variant={statusFilter === key ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-12 h-12" />}
          title="Aucun projet trouvé"
          description="Modifiez vos critères de recherche ou créez un nouveau projet."
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
                <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-t-xl flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-neutral-300 dark:text-neutral-600" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {project.name}
                    </h3>
                    <Badge variant={statusConfig[project.status].variant} size="sm">
                      {statusConfig[project.status].label}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Livraison: {new Date(project.expectedDelivery).toLocaleDateString('fr-CH', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        Avancement
                      </span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {project.unitsSold}/{project.unitsTotal} unités vendues
                      </span>
                    </div>
                    <Progress value={project.progress} size="sm" />
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
