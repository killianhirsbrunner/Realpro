import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useOrganizationContext } from '../contexts/OrganizationContext';
import { SystemRole, getUserTypeFromRole, UserType } from '../lib/permissions';

export interface TeamMember {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  language: string | null;
  last_login: string | null;
  created_at: string;
  role: SystemRole | null;
  user_type: UserType;
  joined_at: string;
}

export interface PendingInvitation {
  id: string;
  email: string;
  role: SystemRole;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  expires_at: string;
  invited_by: string;
  invited_by_name: string;
  created_at: string;
}

export interface TeamStats {
  total_members: number;
  active_members: number;
  internal_count: number;
  external_count: number;
  buyer_count: number;
  pending_invitations: number;
}

export function useTeamManagement() {
  const { currentOrganization } = useOrganizationContext();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTeamData = useCallback(async () => {
    if (!currentOrganization) {
      setMembers([]);
      setInvitations([]);
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Charger les membres avec leurs roles
      const { data: membersData, error: membersError } = await supabase
        .from('user_organizations')
        .select(`
          user_id,
          joined_at,
          users (
            id,
            email,
            first_name,
            last_name,
            avatar_url,
            is_active,
            language,
            last_login,
            created_at
          )
        `)
        .eq('organization_id', currentOrganization.id);

      if (membersError) throw membersError;

      // Charger les roles des utilisateurs
      const userIds = membersData?.map((m) => m.user_id) || [];
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role:role_id (
            name
          )
        `)
        .eq('organization_id', currentOrganization.id)
        .in('user_id', userIds);

      if (rolesError) throw rolesError;

      // Mapper les roles aux utilisateurs
      const roleMap = new Map<string, string>();
      rolesData?.forEach((r: any) => {
        if (r.role?.name) {
          roleMap.set(r.user_id, r.role.name);
        }
      });

      // Construire la liste des membres
      const teamMembers: TeamMember[] =
        membersData?.map((m: any) => {
          const user = m.users;
          const role = (roleMap.get(m.user_id) as SystemRole) || null;
          return {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar_url: user.avatar_url,
            is_active: user.is_active,
            language: user.language,
            last_login: user.last_login,
            created_at: user.created_at,
            role,
            user_type: role ? getUserTypeFromRole(role) : 'INTERNAL',
            joined_at: m.joined_at,
          };
        }) || [];

      setMembers(teamMembers);

      // Charger les invitations en attente
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('user_invitations')
        .select(`
          id,
          email,
          role,
          status,
          expires_at,
          invited_by,
          created_at,
          inviter:invited_by (
            first_name,
            last_name
          )
        `)
        .eq('organization_id', currentOrganization.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (invitationsError) throw invitationsError;

      const pendingInvitations: PendingInvitation[] =
        invitationsData?.map((i: any) => ({
          id: i.id,
          email: i.email,
          role: i.role as SystemRole,
          status: i.status,
          expires_at: i.expires_at,
          invited_by: i.invited_by,
          invited_by_name: i.inviter
            ? `${i.inviter.first_name || ''} ${i.inviter.last_name || ''}`.trim()
            : 'Inconnu',
          created_at: i.created_at,
        })) || [];

      setInvitations(pendingInvitations);

      // Calculer les stats
      const internalCount = teamMembers.filter((m) => m.user_type === 'INTERNAL').length;
      const externalCount = teamMembers.filter((m) => m.user_type === 'EXTERNAL').length;
      const buyerCount = teamMembers.filter((m) => m.user_type === 'BUYER').length;

      setStats({
        total_members: teamMembers.length,
        active_members: teamMembers.filter((m) => m.is_active).length,
        internal_count: internalCount,
        external_count: externalCount,
        buyer_count: buyerCount,
        pending_invitations: pendingInvitations.length,
      });
    } catch (err) {
      console.error('Error loading team data:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [currentOrganization]);

  useEffect(() => {
    loadTeamData();
  }, [loadTeamData]);

  /**
   * Change le role d'un membre
   */
  const changeUserRole = useCallback(
    async (userId: string, newRole: SystemRole) => {
      if (!currentOrganization) return;

      try {
        // Trouver l'ID du role
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('id')
          .eq('name', newRole)
          .single();

        if (roleError) throw roleError;

        // Supprimer les anciens roles
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('organization_id', currentOrganization.id);

        // Ajouter le nouveau role
        const { error: insertError } = await supabase.from('user_roles').insert({
          user_id: userId,
          role_id: roleData.id,
          organization_id: currentOrganization.id,
        });

        if (insertError) throw insertError;

        // Recharger les donnees
        await loadTeamData();
      } catch (err) {
        console.error('Error changing role:', err);
        throw err;
      }
    },
    [currentOrganization, loadTeamData]
  );

  /**
   * Retire un membre de l'organisation
   */
  const removeMember = useCallback(
    async (userId: string) => {
      if (!currentOrganization) return;

      try {
        // Supprimer de user_organizations
        const { error: removeError } = await supabase
          .from('user_organizations')
          .delete()
          .eq('user_id', userId)
          .eq('organization_id', currentOrganization.id);

        if (removeError) throw removeError;

        // Supprimer les roles
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('organization_id', currentOrganization.id);

        // Recharger les donnees
        await loadTeamData();
      } catch (err) {
        console.error('Error removing member:', err);
        throw err;
      }
    },
    [currentOrganization, loadTeamData]
  );

  /**
   * Desactive/active un membre
   */
  const toggleMemberStatus = useCallback(
    async (userId: string, isActive: boolean) => {
      try {
        const { error: updateError } = await supabase
          .from('users')
          .update({ is_active: isActive })
          .eq('id', userId);

        if (updateError) throw updateError;

        await loadTeamData();
      } catch (err) {
        console.error('Error toggling status:', err);
        throw err;
      }
    },
    [loadTeamData]
  );

  /**
   * Annule une invitation
   */
  const cancelInvitation = useCallback(
    async (invitationId: string) => {
      try {
        const { error: updateError } = await supabase
          .from('user_invitations')
          .update({ status: 'cancelled' })
          .eq('id', invitationId);

        if (updateError) throw updateError;

        await loadTeamData();
      } catch (err) {
        console.error('Error cancelling invitation:', err);
        throw err;
      }
    },
    [loadTeamData]
  );

  /**
   * Renvoie une invitation
   */
  const resendInvitation = useCallback(
    async (invitationId: string) => {
      try {
        // Prolonger l'expiration de 7 jours
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const { error: updateError } = await supabase
          .from('user_invitations')
          .update({
            expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', invitationId);

        if (updateError) throw updateError;

        // TODO: Renvoyer l'email d'invitation

        await loadTeamData();
      } catch (err) {
        console.error('Error resending invitation:', err);
        throw err;
      }
    },
    [loadTeamData]
  );

  return {
    members,
    invitations,
    stats,
    loading,
    error,
    refresh: loadTeamData,
    changeUserRole,
    removeMember,
    toggleMemberStatus,
    cancelInvitation,
    resendInvitation,
  };
}
