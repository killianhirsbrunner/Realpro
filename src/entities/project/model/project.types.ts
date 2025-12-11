/**
 * RealPro | Project Entity Types
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import type { Json, ProjectStatus } from '@shared/lib/supabase';

export type { ProjectStatus } from '@shared/lib/supabase';

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  description: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string;
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  total_surface: number | null;
  image_url: string | null;
  settings: Json;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithStats extends Project {
  total_lots: number;
  sold_lots: number;
  available_lots: number;
  reserved_lots: number;
  total_revenue: number;
  completion_percent: number;
}

export interface CreateProjectInput {
  name: string;
  code: string;
  description?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  status?: ProjectStatus;
  start_date?: string;
  end_date?: string;
  total_surface?: number;
}

export interface UpdateProjectInput {
  name?: string;
  code?: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string;
  status?: ProjectStatus;
  start_date?: string | null;
  end_date?: string | null;
  total_surface?: number | null;
  image_url?: string | null;
  settings?: Json;
}
