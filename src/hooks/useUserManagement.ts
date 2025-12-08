import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';

export interface UserOrganization {
  id: string;
  user_id: string;
  organization_id: string;
  is_default: boolean;
  created_at: string;
  user?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  organization_id?: string;
  project_id?: string;
  assigned_by?: string;
  assigned_at: string;
  expires_at?: string;
  role?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface UserInvitation {
  id: string;
  email: string;
  organization_id: string;
  invited_by: string;
  role_id?: string;
  project_id?: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
  expires_at: string;
  created_at: string;
  accepted_at?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
  created_at: string;
  updated_at: string;
}

export function useUserManagement() {
  const { currentOrganization } = useOrganization();
  const [userOrganizations, setUserOrganizations] = useState<UserOrganization[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (currentOrganization?.id) {
      fetchData();
    }
  }, [currentOrganization?.id]);

  const fetchData = async () => {
    if (!currentOrganization) return;

    try {
      setLoading(true);
      await Promise.all([
        fetchUserOrganizations(),
        fetchUserRoles(),
        fetchInvitations(),
        fetchRoles(),
      ]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrganizations = async () => {
    if (!currentOrganization) return;

    const { data, error: fetchError } = await supabase
      .from('user_organizations')
      .select(`
        *,
        user:users(id, email, first_name, last_name)
      `)
      .eq('organization_id', currentOrganization.id);

    if (fetchError) throw fetchError;
    setUserOrganizations(data || []);
  };

  const fetchUserRoles = async () => {
    if (!currentOrganization) return;

    const { data, error: fetchError } = await supabase
      .from('user_roles')
      .select(`
        *,
        role:roles(id, name, description)
      `)
      .eq('organization_id', currentOrganization.id);

    if (fetchError) throw fetchError;
    setUserRoles(data || []);
  };

  const fetchInvitations = async () => {
    if (!currentOrganization) return;

    const { data, error: fetchError } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('organization_id', currentOrganization.id)
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;
    setInvitations(data || []);
  };

  const fetchRoles = async () => {
    const { data, error: fetchError } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    if (fetchError) throw fetchError;
    setRoles(data || []);
  };

  const addUserToOrganization = async (userId: string, isDefault = false) => {
    if (!currentOrganization) throw new Error('No organization selected');

    const { data, error: insertError } = await supabase
      .from('user_organizations')
      .insert({
        user_id: userId,
        organization_id: currentOrganization.id,
        is_default: isDefault,
      })
      .select(`
        *,
        user:users(id, email, first_name, last_name)
      `)
      .single();

    if (insertError) throw insertError;
    setUserOrganizations([...userOrganizations, data]);
    return data;
  };

  const removeUserFromOrganization = async (userOrgId: string) => {
    const { error: deleteError } = await supabase
      .from('user_organizations')
      .delete()
      .eq('id', userOrgId);

    if (deleteError) throw deleteError;
    setUserOrganizations(userOrganizations.filter((uo) => uo.id !== userOrgId));
  };

  const assignRoleToUser = async (
    userId: string,
    roleId: string,
    projectId?: string,
    expiresAt?: string
  ) => {
    if (!currentOrganization) throw new Error('No organization selected');

    const { data: currentUser } = await supabase.auth.getUser();

    const { data, error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: roleId,
        organization_id: currentOrganization.id,
        project_id: projectId,
        assigned_by: currentUser.user?.id,
        expires_at: expiresAt,
      })
      .select(`
        *,
        role:roles(id, name, description)
      `)
      .single();

    if (insertError) throw insertError;
    setUserRoles([...userRoles, data]);
    return data;
  };

  const removeRoleFromUser = async (userRoleId: string) => {
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', userRoleId);

    if (deleteError) throw deleteError;
    setUserRoles(userRoles.filter((ur) => ur.id !== userRoleId));
  };

  const createInvitation = async (
    email: string,
    roleId?: string,
    projectId?: string,
    expiresInDays = 7
  ) => {
    if (!currentOrganization) throw new Error('No organization selected');

    const { data: currentUser } = await supabase.auth.getUser();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const { data, error: insertError } = await supabase
      .from('user_invitations')
      .insert({
        email,
        organization_id: currentOrganization.id,
        invited_by: currentUser.user?.id,
        role_id: roleId,
        project_id: projectId,
        status: 'PENDING',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (insertError) throw insertError;
    setInvitations([data, ...invitations]);
    return data;
  };

  const cancelInvitation = async (invitationId: string) => {
    const { data, error: updateError } = await supabase
      .from('user_invitations')
      .update({ status: 'CANCELLED' })
      .eq('id', invitationId)
      .select()
      .single();

    if (updateError) throw updateError;
    setInvitations(
      invitations.map((inv) => (inv.id === invitationId ? data : inv))
    );
    return data;
  };

  const resendInvitation = async (invitationId: string, expiresInDays = 7) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const { data, error: updateError } = await supabase
      .from('user_invitations')
      .update({
        status: 'PENDING',
        expires_at: expiresAt.toISOString(),
      })
      .eq('id', invitationId)
      .select()
      .single();

    if (updateError) throw updateError;
    setInvitations(
      invitations.map((inv) => (inv.id === invitationId ? data : inv))
    );
    return data;
  };

  const getUserRoles = async (userId: string) => {
    if (!currentOrganization) return [];

    const { data, error: fetchError } = await supabase
      .from('user_roles')
      .select(`
        *,
        role:roles(id, name, description)
      `)
      .eq('user_id', userId)
      .eq('organization_id', currentOrganization.id);

    if (fetchError) throw fetchError;
    return data || [];
  };

  const getUsersByRole = async (roleId: string, projectId?: string) => {
    if (!currentOrganization) return [];

    let query = supabase
      .from('user_roles')
      .select(`
        *,
        user:users(id, email, first_name, last_name)
      `)
      .eq('role_id', roleId)
      .eq('organization_id', currentOrganization.id);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) throw fetchError;
    return data || [];
  };

  return {
    userOrganizations,
    userRoles,
    invitations,
    roles,
    loading,
    error,
    addUserToOrganization,
    removeUserFromOrganization,
    assignRoleToUser,
    removeRoleFromUser,
    createInvitation,
    cancelInvitation,
    resendInvitation,
    getUserRoles,
    getUsersByRole,
    refetch: fetchData,
  };
}
