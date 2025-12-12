/**
 * Projects API - Supabase data access layer
 */

import { supabase } from '@/lib/supabase';
import type { Project, ProjectWithStats, CreateProjectInput, UpdateProjectInput } from '@realpro/entities';

export async function fetchProjects(): Promise<ProjectWithStats[]> {
  const { data: projectsData, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Fetch stats for each project
  const projectsWithStats = await Promise.all(
    (projectsData || []).map(async (project) => {
      const { data: lots } = await supabase
        .from('lots')
        .select('id, status, price_total')
        .eq('project_id', project.id);

      const totalLots = lots?.length || 0;
      const soldLots = lots?.filter(l => l.status === 'SOLD').length || 0;
      const reservedLots = lots?.filter(l => l.status === 'RESERVED').length || 0;
      const availableLots = lots?.filter(l => l.status === 'AVAILABLE').length || 0;
      const totalRevenue = lots
        ?.filter(l => l.status === 'SOLD')
        .reduce((sum, l) => sum + (l.price_total || 0), 0) || 0;

      const completionPercent = totalLots > 0
        ? Math.round((soldLots / totalLots) * 100)
        : 0;

      return {
        ...project,
        total_lots: totalLots,
        sold_lots: soldLots,
        reserved_lots: reservedLots,
        available_lots: availableLots,
        total_revenue: totalRevenue,
        completion_percent: completionPercent,
      } as ProjectWithStats;
    })
  );

  return projectsWithStats;
}

export async function fetchProject(projectId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
