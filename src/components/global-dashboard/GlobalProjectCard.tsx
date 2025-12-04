import { Link } from 'react-router-dom';
import { MapPin, TrendingUp, Home, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface Project {
  id: string;
  name: string;
  code: string;
  city: string;
  canton: string;
  status: string;
  image_url: string | null;
  salesProgress: number;
  constructionProgress: number;
  lotsTotal: number;
  lotsSold: number;
}

interface GlobalProjectCardProps {
  project: Project;
}

const statusColors: Record<string, string> = {
  PLANNING: 'blue',
  CONSTRUCTION: 'orange',
  SELLING: 'green',
  COMPLETED: 'gray',
  ARCHIVED: 'neutral',
};

const statusLabels: Record<string, string> = {
  PLANNING: 'Planification',
  CONSTRUCTION: 'Construction',
  SELLING: 'Vente',
  COMPLETED: 'Terminé',
  ARCHIVED: 'Archivé',
};

export function GlobalProjectCard({ project }: GlobalProjectCardProps) {
  const statusColor = statusColors[project.status] || 'gray';
  const statusLabel = statusLabels[project.status] || project.status;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="w-16 h-16 text-neutral-300 dark:text-neutral-700" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={statusColor as any}>{statusLabel}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Project Name & Location */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {project.name}
            </h3>
            <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
          <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
            <MapPin className="w-4 h-4" />
            <span>{project.city}, {project.canton}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Ventes
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-neutral-900 dark:text-white">
                {project.salesProgress}%
              </span>
              <span className="text-xs text-neutral-500">
                ({project.lotsSold}/{project.lotsTotal})
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Home className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Chantier
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-neutral-900 dark:text-white">
                {project.constructionProgress}%
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
              <span>Avancement ventes</span>
              <span className="font-medium">{project.salesProgress}%</span>
            </div>
            <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                style={{ width: `${project.salesProgress}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
              <span>Avancement construction</span>
              <span className="font-medium">{project.constructionProgress}%</span>
            </div>
            <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
                style={{ width: `${project.constructionProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
