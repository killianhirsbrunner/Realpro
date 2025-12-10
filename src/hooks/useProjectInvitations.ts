import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  ProjectInvitation,
  ProjectInvitationWithRelations,
  ParticipantRole,
  StakeholderPermissions,
} from '../types/stakeholder';

/**
 * Hook pour gérer les invitations d'intervenants au projet
 */
export function useProjectInvitations(projectId?: string) {
  const [invitations, setInvitations] = useState<ProjectInvitationWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    expired: 0,
    revoked: 0,
  });

  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('project_invitations')
        .select(`
          *,
          project:projects!project_id(id, name, address),
          organization:organizations!organization_id(id, name, logo_url),
          company:companies!company_id(id, name),
          inviter:users!invited_by(id, first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setInvitations(data || []);

      // Calculate stats
      const invites = data || [];
      setStats({
        total: invites.length,
        pending: invites.filter((i) => i.status === 'PENDING').length,
        accepted: invites.filter((i) => i.status === 'ACCEPTED').length,
        expired: invites.filter((i) => i.status === 'EXPIRED').length,
        revoked: invites.filter((i) => i.status === 'REVOKED').length,
      });
    } catch (err) {
      console.error('Error fetching project invitations:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const sendInvitation = async (data: {
    email: string;
    role: ParticipantRole;
    firstName?: string;
    lastName?: string;
    companyId?: string;
    message?: string;
    permissions?: Partial<StakeholderPermissions>;
    expiresInDays?: number;
  }): Promise<ProjectInvitation> => {
    try {
      if (!projectId) throw new Error('Project ID required');

      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('User not authenticated');

      // Get organization_id from project
      const { data: project } = await supabase
        .from('projects')
        .select('organization_id')
        .eq('id', projectId)
        .single();

      if (!project) throw new Error('Project not found');

      // Generate secure token
      const token = generateSecureToken();

      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (data.expiresInDays || 7));

      // Create invitation
      const { data: invitation, error: insertError } = await supabase
        .from('project_invitations')
        .insert({
          project_id: projectId,
          organization_id: project.organization_id,
          role: data.role,
          email: data.email.toLowerCase().trim(),
          first_name: data.firstName,
          last_name: data.lastName,
          company_id: data.companyId || null,
          token,
          expires_at: expiresAt.toISOString(),
          invited_by: currentUser.user.id,
          message: data.message,
          permissions: data.permissions || getDefaultPermissions(data.role),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Log activity
      await supabase.rpc('log_stakeholder_activity', {
        p_user_id: currentUser.user.id,
        p_organization_id: project.organization_id,
        p_project_id: projectId,
        p_action_type: 'INVITATION_SENT',
        p_action_details: {
          invitation_id: invitation.id,
          email: data.email,
          role: data.role,
        },
        p_resource_type: 'project_invitation',
        p_resource_id: invitation.id,
      });

      // In production, send email with invitation link
      console.log('Invitation created:', invitation);
      console.log('Invitation link:', `/invitation/${token}`);

      await fetchInvitations();
      return invitation;
    } catch (err) {
      console.error('Error sending invitation:', err);
      throw err;
    }
  };

  const resendInvitation = async (invitationId: string): Promise<void> => {
    try {
      // Generate new token and extend expiration
      const token = generateSecureToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error: updateError } = await supabase
        .from('project_invitations')
        .update({
          token,
          expires_at: expiresAt.toISOString(),
          status: 'PENDING',
        })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      // In production, resend email
      console.log('Invitation resent with new token');

      await fetchInvitations();
    } catch (err) {
      console.error('Error resending invitation:', err);
      throw err;
    }
  };

  const revokeInvitation = async (invitationId: string): Promise<void> => {
    try {
      const { error: updateError } = await supabase
        .from('project_invitations')
        .update({ status: 'REVOKED' })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      await fetchInvitations();
    } catch (err) {
      console.error('Error revoking invitation:', err);
      throw err;
    }
  };

  const updateInvitationPermissions = async (
    invitationId: string,
    permissions: Partial<StakeholderPermissions>
  ): Promise<void> => {
    try {
      const { error: updateError } = await supabase
        .from('project_invitations')
        .update({ permissions })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      await fetchInvitations();
    } catch (err) {
      console.error('Error updating invitation permissions:', err);
      throw err;
    }
  };

  return {
    invitations,
    stats,
    loading,
    error,
    refresh: fetchInvitations,
    sendInvitation,
    resendInvitation,
    revokeInvitation,
    updateInvitationPermissions,
  };
}

/**
 * Hook pour accepter une invitation (utilisé par l'invité)
 */
export function useAcceptInvitation() {
  const [invitation, setInvitation] = useState<ProjectInvitationWithRelations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInvitationByToken = async (token: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('project_invitations')
        .select(`
          *,
          project:projects!project_id(id, name, address),
          organization:organizations!organization_id(id, name, logo_url),
          company:companies!company_id(id, name),
          inviter:users!invited_by(id, first_name, last_name, email)
        `)
        .eq('token', token)
        .single();

      if (fetchError) throw new Error('Invitation non trouvée');

      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        // Mark as expired
        await supabase
          .from('project_invitations')
          .update({ status: 'EXPIRED' })
          .eq('id', data.id);
        throw new Error('Cette invitation a expiré');
      }

      // Check if already used
      if (data.status !== 'PENDING') {
        throw new Error('Cette invitation a déjà été utilisée ou révoquée');
      }

      setInvitation(data);
    } catch (err) {
      console.error('Error fetching invitation:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async (token: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Veuillez vous connecter pour accepter cette invitation');

      // Update invitation status
      const { data: invite, error: updateError } = await supabase
        .from('project_invitations')
        .update({
          status: 'ACCEPTED',
          accepted_by: currentUser.user.id,
          accepted_at: new Date().toISOString(),
        })
        .eq('token', token)
        .eq('status', 'PENDING')
        .select()
        .single();

      if (updateError) throw updateError;

      // Create project participant
      const { error: participantError } = await supabase
        .from('project_participants')
        .insert({
          project_id: invite.project_id,
          role: invite.role,
          user_id: currentUser.user.id,
          invitation_id: invite.id,
          company_id: invite.company_id,
          permissions: invite.permissions,
          access_level: 'FULL',
        });

      if (participantError && participantError.code !== '23505') {
        // Ignore duplicate error
        throw participantError;
      }

      // Create stakeholder permissions
      if (invite.permissions) {
        const { error: permError } = await supabase
          .from('stakeholder_permissions')
          .upsert({
            user_id: currentUser.user.id,
            organization_id: invite.organization_id,
            project_id: invite.project_id,
            ...invite.permissions,
            granted_by: invite.invited_by,
          });

        if (permError) {
          console.warn('Error creating permissions:', permError);
        }
      }

      // Update user type if external
      await supabase
        .from('users')
        .update({
          user_type: 'EXTERNAL',
          primary_project_id: invite.project_id,
        })
        .eq('id', currentUser.user.id);

      // Add user to organization
      const { error: orgError } = await supabase
        .from('user_organizations')
        .upsert({
          user_id: currentUser.user.id,
          organization_id: invite.organization_id,
          is_default: false,
        });

      if (orgError && orgError.code !== '23505') {
        console.warn('Error adding to organization:', orgError);
      }

      // Assign role
      const { data: role } = await supabase
        .from('roles')
        .select('id')
        .eq('name', invite.role.toLowerCase())
        .single();

      if (role) {
        await supabase
          .from('user_roles')
          .upsert({
            user_id: currentUser.user.id,
            organization_id: invite.organization_id,
            role_id: role.id,
            assigned_by: invite.invited_by,
          });
      }

      // Log activity
      await supabase.rpc('log_stakeholder_activity', {
        p_user_id: currentUser.user.id,
        p_organization_id: invite.organization_id,
        p_project_id: invite.project_id,
        p_action_type: 'INVITATION_ACCEPTED',
        p_action_details: {
          invitation_id: invite.id,
          role: invite.role,
        },
        p_resource_type: 'project_invitation',
        p_resource_id: invite.id,
      });

      setInvitation(null);
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    invitation,
    loading,
    error,
    fetchInvitationByToken,
    acceptInvitation,
  };
}

/**
 * Hook pour les invitations reçues par l'utilisateur connecté
 */
export function useMyInvitations() {
  const [invitations, setInvitations] = useState<ProjectInvitationWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMyInvitations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('project_invitations')
        .select(`
          *,
          project:projects!project_id(id, name, address),
          organization:organizations!organization_id(id, name, logo_url),
          inviter:users!invited_by(id, first_name, last_name, email)
        `)
        .eq('email', currentUser.user.email)
        .eq('status', 'PENDING')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setInvitations(data || []);
    } catch (err) {
      console.error('Error fetching my invitations:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyInvitations();
  }, [fetchMyInvitations]);

  return {
    invitations,
    loading,
    error,
    refresh: fetchMyInvitations,
  };
}

// Helper functions

function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function getDefaultPermissions(role: ParticipantRole): Partial<StakeholderPermissions> {
  const permissions: Record<ParticipantRole, Partial<StakeholderPermissions>> = {
    BROKER: {
      can_view_clients: true,
      can_edit_clients: true,
      can_upload_documents: true,
      can_validate_documents: false,
      can_view_financial: false,
      can_view_all_lots: true,
      can_reserve_lots: true,
      can_view_plans: true,
      can_download_plans: true,
      can_view_other_stakeholders: false,
      can_communicate: true,
      can_export_data: true,
    },
    ARCHITECT: {
      can_view_clients: false,
      can_edit_clients: false,
      can_upload_documents: true,
      can_validate_documents: false,
      can_view_financial: false,
      can_view_all_lots: true,
      can_reserve_lots: false,
      can_view_plans: true,
      can_download_plans: true,
      can_view_other_stakeholders: true,
      can_communicate: true,
      can_export_data: true,
    },
    NOTARY: {
      can_view_clients: true,
      can_edit_clients: false,
      can_upload_documents: true,
      can_validate_documents: true,
      can_view_financial: true,
      can_view_all_lots: true,
      can_reserve_lots: false,
      can_view_plans: true,
      can_download_plans: true,
      can_view_other_stakeholders: true,
      can_communicate: true,
      can_export_data: true,
    },
    ENGINEER: {
      can_view_clients: false,
      can_edit_clients: false,
      can_upload_documents: true,
      can_validate_documents: false,
      can_view_financial: false,
      can_view_all_lots: true,
      can_reserve_lots: false,
      can_view_plans: true,
      can_download_plans: true,
      can_view_other_stakeholders: true,
      can_communicate: true,
      can_export_data: false,
    },
    GENERAL_CONTRACTOR: {
      can_view_clients: false,
      can_edit_clients: false,
      can_upload_documents: true,
      can_validate_documents: false,
      can_view_financial: true,
      can_view_all_lots: true,
      can_reserve_lots: false,
      can_view_plans: true,
      can_download_plans: true,
      can_view_other_stakeholders: true,
      can_communicate: true,
      can_export_data: true,
    },
    SUPPLIER: {
      can_view_clients: false,
      can_edit_clients: false,
      can_upload_documents: true,
      can_validate_documents: false,
      can_view_financial: false,
      can_view_all_lots: false,
      can_reserve_lots: false,
      can_view_plans: false,
      can_download_plans: false,
      can_view_other_stakeholders: false,
      can_communicate: true,
      can_export_data: false,
    },
    BUYER: {
      can_view_clients: false,
      can_edit_clients: false,
      can_upload_documents: true,
      can_validate_documents: false,
      can_view_financial: true,
      can_view_all_lots: false,
      can_reserve_lots: false,
      can_view_plans: true,
      can_download_plans: true,
      can_view_other_stakeholders: false,
      can_communicate: true,
      can_export_data: false,
    },
    PROMOTER: {
      can_view_clients: true,
      can_edit_clients: true,
      can_upload_documents: true,
      can_validate_documents: true,
      can_view_financial: true,
      can_view_all_lots: true,
      can_reserve_lots: true,
      can_view_plans: true,
      can_download_plans: true,
      can_view_other_stakeholders: true,
      can_communicate: true,
      can_export_data: true,
    },
  };

  return permissions[role] || permissions.BUYER;
}

/**
 * Labels pour les rôles d'intervenants
 */
export const PARTICIPANT_ROLE_LABELS: Record<ParticipantRole, string> = {
  PROMOTER: 'Promoteur',
  BROKER: 'Courtier',
  ARCHITECT: 'Architecte',
  ENGINEER: 'Ingénieur',
  NOTARY: 'Notaire',
  GENERAL_CONTRACTOR: 'Entreprise Générale',
  SUPPLIER: 'Fournisseur',
  BUYER: 'Acquéreur',
};

/**
 * Couleurs pour les rôles d'intervenants
 */
export const PARTICIPANT_ROLE_COLORS: Record<ParticipantRole, string> = {
  PROMOTER: 'indigo',
  BROKER: 'green',
  ARCHITECT: 'blue',
  ENGINEER: 'cyan',
  NOTARY: 'purple',
  GENERAL_CONTRACTOR: 'orange',
  SUPPLIER: 'pink',
  BUYER: 'teal',
};

/**
 * Icônes pour les rôles d'intervenants
 */
export const PARTICIPANT_ROLE_ICONS: Record<ParticipantRole, string> = {
  PROMOTER: 'Building2',
  BROKER: 'Users',
  ARCHITECT: 'Compass',
  ENGINEER: 'Wrench',
  NOTARY: 'Scale',
  GENERAL_CONTRACTOR: 'HardHat',
  SUPPLIER: 'Package',
  BUYER: 'User',
};
