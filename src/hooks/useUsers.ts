import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  company_name: string | null;
  role_name: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface UserPermission {
  id: string;
  module: string;
  permission_level: 'read' | 'write' | 'admin';
  project_id: string | null;
  granted_at: string;
  expires_at: string | null;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc('get_all_users');

      if (fetchError) throw fetchError;

      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_active: isActive })
        .eq('id', userId);

      if (updateError) throw updateError;

      await fetchUsers();
    } catch (err) {
      console.error('Error updating user status:', err);
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    refresh: fetchUsers,
    updateUserStatus,
  };
}

export function useUserPermissions(userId: string) {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (userId) {
      fetchPermissions();
    }
  }, [userId]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId)
        .order('module');

      if (fetchError) throw fetchError;

      setPermissions(data || []);
    } catch (err) {
      console.error('Error fetching permissions:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const grantPermission = async (
    module: string,
    permissionLevel: 'read' | 'write' | 'admin',
    projectId?: string
  ) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();

      const { error: insertError } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: userId,
          module,
          permission_level: permissionLevel,
          project_id: projectId || null,
          granted_by: currentUser.user?.id,
        });

      if (insertError) throw insertError;

      await fetchPermissions();
    } catch (err) {
      console.error('Error granting permission:', err);
      throw err;
    }
  };

  const revokePermission = async (permissionId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('user_permissions')
        .delete()
        .eq('id', permissionId);

      if (deleteError) throw deleteError;

      await fetchPermissions();
    } catch (err) {
      console.error('Error revoking permission:', err);
      throw err;
    }
  };

  return {
    permissions,
    loading,
    error,
    refresh: fetchPermissions,
    grantPermission,
    revokePermission,
  };
}

export function useUserActivity(userId: string) {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (userId) {
      fetchActivity();
    }
  }, [userId]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc('get_user_activity', {
        p_user_id: userId,
        p_limit: 100,
      });

      if (fetchError) throw fetchError;

      setActivity(data || []);
    } catch (err) {
      console.error('Error fetching user activity:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    activity,
    loading,
    error,
    refresh: fetchActivity,
  };
}

export function useUserInvitations() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_invitations')
        .select(`
          *,
          role:roles(name),
          project:projects(name),
          inviter:users!invited_by(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setInvitations(data || []);
    } catch (err) {
      console.error('Error fetching invitations:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createInvitation = async (
    email: string,
    roleId: string,
    projectId?: string
  ) => {
    try {
      const { data, error: inviteError } = await supabase.rpc('create_user_invitation', {
        p_email: email,
        p_role_id: roleId,
        p_project_id: projectId || null,
      });

      if (inviteError) throw inviteError;

      await fetchInvitations();
      return data;
    } catch (err) {
      console.error('Error creating invitation:', err);
      throw err;
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('user_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      await fetchInvitations();
    } catch (err) {
      console.error('Error cancelling invitation:', err);
      throw err;
    }
  };

  return {
    invitations,
    loading,
    error,
    refresh: fetchInvitations,
    createInvitation,
    cancelInvitation,
  };
}
