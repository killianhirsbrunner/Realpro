/**
 * RealPro | Project API
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { supabase } from '@shared/lib/supabase';
import type { Project, CreateProjectInput, UpdateProjectInput } from '../model';

export const projectApi = {
  /**
   * Get all projects for an organization
   */
  async getAll(organizationId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get a project by ID
   */
  async getById(id: string): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new project
   */
  async create(organizationId: string, input: CreateProjectInput): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('projects')
      .insert({
        organization_id: organizationId,
        ...input,
        country: input.country || 'CH',
        status: input.status || 'PLANNING',
        created_by: user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update a project
   */
  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a project
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Upload project image
   */
  async uploadImage(projectId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${projectId}/cover.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('projects')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('projects')
      .getPublicUrl(fileName);

    // Update project record
    await projectApi.update(projectId, { image_url: publicUrl });

    return publicUrl;
  },
};
