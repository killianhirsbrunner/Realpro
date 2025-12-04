import { MapPin, CalendarDays, Building2, Users } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { formatDateCH, formatPercent } from '../../lib/utils/format';
import { getStatusLabel } from '../../lib/constants/status-labels';

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    city: string;
    canton: string;
    postal_code?: string;
    address?: string | null;
    status: string;
    type?: string;
    start_date?: string | null;
    end_date?: string | null;
    description?: string | null;
  };
  progress?: number;
  teamSize?: number;
}

export function ProjectHeader({ project, progress = 0, teamSize }: ProjectHeaderProps) {
  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    const map: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      PLANNING: 'info',
      CONSTRUCTION: 'warning',
      SELLING: 'success',
      COMPLETED: 'default',
      ARCHIVED: 'default',
    };
    return map[status] || 'default';
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-950 dark:to-indigo-950 p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="h-8 w-8 text-brand-600" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                {project.name}
              </h1>
            </div>

            {project.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl">
                {project.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {project.address || `${project.city}, ${project.canton}`}
                  {project.postal_code && ` (${project.postal_code})`}
                </span>
              </div>

              {(project.start_date || project.end_date) && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {project.start_date && `Début: ${formatDateCH(project.start_date)}`}
                    {project.start_date && project.end_date && ' • '}
                    {project.end_date && `Fin: ${formatDateCH(project.end_date)}`}
                  </span>
                </div>
              )}

              {teamSize && teamSize > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{teamSize} membre{teamSize > 1 ? 's' : ''} d'équipe</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <Badge variant={getStatusVariant(project.status)} className="text-sm px-4 py-1.5">
              {getStatusLabel('project', project.status)}
            </Badge>
            {project.type && (
              <Badge variant="default" className="text-sm px-4 py-1.5">
                {project.type}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              Avancement global du projet
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {formatPercent(progress)}
            </span>
          </div>

          <div className="relative w-full bg-white/50 dark:bg-gray-800/50 h-4 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500 to-indigo-600 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
