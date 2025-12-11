/**
 * RealPro | Project Entity Public API
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

// Types
export type {
  Project,
  ProjectStatus,
  ProjectWithStats,
  CreateProjectInput,
  UpdateProjectInput,
} from './model';

// API
export { projectApi } from './api';

// UI Components
export { ProjectCard, ProjectStatusBadge } from './ui';
export type { ProjectCardProps, ProjectStatusBadgeProps } from './ui';
