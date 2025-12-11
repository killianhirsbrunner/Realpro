/**
 * RealPro | User API
 * © 2024-2025 Realpro SA. Tous droits réservés.
 */

import { supabase } from '@shared/lib/supabase';
import type { User, UpdateUserInput } from '../model';

export const userApi = {
  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update user profile
   */
  async update(id: string, input: UpdateUserInput): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get users by organization
   */
  async getByOrganization(organizationId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        user_organizations!inner(role, organization_id)
      `)
      .eq('user_organizations.organization_id', organizationId);

    if (error) throw error;
    return data || [];
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update user record
    await userApi.update(userId, { avatar_url: publicUrl });

    return publicUrl;
  },
};
