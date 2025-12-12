/**
 * RealPro | Project Card Component
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { Building2, MapPin, Calendar } from 'lucide-react';
import { Card } from '@shared/ui';
import { cn, formatDateCH } from '@shared/lib/utils';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import type { Project } from '../model';

export interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  className?: string;
}

export function ProjectCard({ project, onClick, className }: ProjectCardProps) {
  return (
    <Card
      hover
      padding="none"
      onClick={onClick}
      className={cn('cursor-pointer overflow-hidden', className)}
    >
      {/* Image */}
      <div className="h-40 bg-neutral-100 dark:bg-neutral-800 relative">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-12 h-12 text-neutral-300 dark:text-neutral-600" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <ProjectStatusBadge status={project.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
              {project.code}
            </span>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white line-clamp-1">
              {project.name}
            </h3>
          </div>
        </div>

        {project.city && (
          <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 mb-2">
            <MapPin className="w-4 h-4" />
            <span>{project.city}</span>
          </div>
        )}

        {project.start_date && (
          <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDateCH(project.start_date)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
