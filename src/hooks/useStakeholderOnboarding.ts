import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  StakeholderOnboarding,
  OnboardingStatus,
  OnboardingStep,
  OnboardingConfig,
  ParticipantRole,
  OnboardingStatusResponse,
} from '../types/stakeholder';

/**
 * Hook pour gérer le workflow d'onboarding des intervenants
 */
export function useStakeholderOnboarding(projectId?: string) {
  const [onboarding, setOnboarding] = useState<StakeholderOnboarding | null>(null);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOnboarding = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('stakeholder_onboarding')
        .select('*')
        .eq('user_id', currentUser.user.id)
        .eq('project_id', projectId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setOnboarding(data || null);

      if (data) {
        const config = getOnboardingConfig(data.role as ParticipantRole);
        setSteps(buildSteps(data, config));
      }
    } catch (err) {
      console.error('Error fetching onboarding:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchOnboarding();
  }, [fetchOnboarding]);

  const startOnboarding = async (): Promise<void> => {
    try {
      if (!onboarding) throw new Error('No onboarding found');

      const { error: updateError } = await supabase
        .from('stakeholder_onboarding')
        .update({
          status: 'IN_PROGRESS',
          started_at: new Date().toISOString(),
          current_step: onboarding.required_steps[0] || 'profile',
        })
        .eq('id', onboarding.id);

      if (updateError) throw updateError;

      await fetchOnboarding();
    } catch (err) {
      console.error('Error starting onboarding:', err);
      throw err;
    }
  };

  const completeStep = async (stepId: string): Promise<void> => {
    try {
      if (!onboarding) throw new Error('No onboarding found');

      const completedSteps = [...(onboarding.steps_completed || [])];
      if (!completedSteps.includes(stepId)) {
        completedSteps.push(stepId);
      }

      // Calculate progress
      const totalRequired = onboarding.required_steps.length;
      const completedRequired = completedSteps.filter((s) =>
        onboarding.required_steps.includes(s)
      ).length;
      const progress = Math.round((completedRequired / totalRequired) * 100);

      // Determine next step
      const remainingSteps = onboarding.required_steps.filter(
        (s) => !completedSteps.includes(s)
      );
      const nextStep = remainingSteps[0] || 'completed';

      // Determine status
      let status: OnboardingStatus = onboarding.status;
      if (remainingSteps.length === 0) {
        status = 'COMPLETED';
      } else if (nextStep.startsWith('kyc')) {
        status = 'PENDING_KYC';
      } else if (nextStep === '2fa') {
        status = 'PENDING_2FA';
      }

      const { error: updateError } = await supabase
        .from('stakeholder_onboarding')
        .update({
          steps_completed: completedSteps,
          current_step: nextStep,
          progress_percentage: progress,
          status,
          last_activity_at: new Date().toISOString(),
          completed_at: status === 'COMPLETED' ? new Date().toISOString() : null,
        })
        .eq('id', onboarding.id);

      if (updateError) throw updateError;

      await fetchOnboarding();
    } catch (err) {
      console.error('Error completing step:', err);
      throw err;
    }
  };

  const goToStep = async (stepId: string): Promise<void> => {
    try {
      if (!onboarding) throw new Error('No onboarding found');

      const { error: updateError } = await supabase
        .from('stakeholder_onboarding')
        .update({
          current_step: stepId,
          last_activity_at: new Date().toISOString(),
        })
        .eq('id', onboarding.id);

      if (updateError) throw updateError;

      await fetchOnboarding();
    } catch (err) {
      console.error('Error going to step:', err);
      throw err;
    }
  };

  const blockOnboarding = async (reason: string): Promise<void> => {
    try {
      if (!onboarding) throw new Error('No onboarding found');

      const { error: updateError } = await supabase
        .from('stakeholder_onboarding')
        .update({
          status: 'BLOCKED',
          blocked_reason: reason,
        })
        .eq('id', onboarding.id);

      if (updateError) throw updateError;

      await fetchOnboarding();
    } catch (err) {
      console.error('Error blocking onboarding:', err);
      throw err;
    }
  };

  const unblockOnboarding = async (): Promise<void> => {
    try {
      if (!onboarding) throw new Error('No onboarding found');

      const { error: updateError } = await supabase
        .from('stakeholder_onboarding')
        .update({
          status: 'IN_PROGRESS',
          blocked_reason: null,
        })
        .eq('id', onboarding.id);

      if (updateError) throw updateError;

      await fetchOnboarding();
    } catch (err) {
      console.error('Error unblocking onboarding:', err);
      throw err;
    }
  };

  const getStatus = (): OnboardingStatusResponse => {
    if (!onboarding) {
      return {
        status: 'NOT_STARTED',
        progress: 0,
        currentStep: 'welcome',
        completedSteps: [],
        remainingSteps: [],
        canAccessPlatform: false,
        blockedReason: 'Onboarding non démarré',
      };
    }

    const remainingSteps = onboarding.required_steps.filter(
      (s) => !(onboarding.steps_completed || []).includes(s)
    );

    return {
      status: onboarding.status,
      progress: onboarding.progress_percentage,
      currentStep: onboarding.current_step,
      completedSteps: onboarding.steps_completed || [],
      remainingSteps,
      canAccessPlatform: onboarding.status === 'COMPLETED',
      blockedReason: onboarding.blocked_reason || undefined,
    };
  };

  return {
    onboarding,
    steps,
    loading,
    error,
    refresh: fetchOnboarding,
    startOnboarding,
    completeStep,
    goToStep,
    blockOnboarding,
    unblockOnboarding,
    getStatus,
  };
}

/**
 * Hook pour les administrateurs - Vue globale des onboardings
 */
export function useOnboardingAdmin(organizationId: string, projectId?: string) {
  const [onboardings, setOnboardings] = useState<StakeholderOnboarding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    notStarted: 0,
    inProgress: 0,
    pendingKYC: 0,
    pending2FA: 0,
    completed: 0,
    blocked: 0,
  });

  const fetchOnboardings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('stakeholder_onboarding')
        .select(`
          *,
          user:users!user_id(id, first_name, last_name, email),
          project:projects!project_id(id, name)
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setOnboardings(data || []);

      // Calculate stats
      const total = data?.length || 0;
      setStats({
        total,
        notStarted: data?.filter((o) => o.status === 'NOT_STARTED').length || 0,
        inProgress: data?.filter((o) => o.status === 'IN_PROGRESS').length || 0,
        pendingKYC: data?.filter((o) => o.status === 'PENDING_KYC').length || 0,
        pending2FA: data?.filter((o) => o.status === 'PENDING_2FA').length || 0,
        completed: data?.filter((o) => o.status === 'COMPLETED').length || 0,
        blocked: data?.filter((o) => o.status === 'BLOCKED').length || 0,
      });
    } catch (err) {
      console.error('Error fetching onboardings:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [organizationId, projectId]);

  useEffect(() => {
    fetchOnboardings();
  }, [fetchOnboardings]);

  const sendReminder = async (onboardingId: string): Promise<void> => {
    try {
      // Log the reminder activity
      const onboarding = onboardings.find((o) => o.id === onboardingId);
      if (!onboarding) throw new Error('Onboarding not found');

      await supabase.rpc('log_stakeholder_activity', {
        p_user_id: onboarding.user_id,
        p_organization_id: organizationId,
        p_project_id: onboarding.project_id,
        p_action_type: 'ONBOARDING_REMINDER_SENT',
        p_action_details: { onboarding_id: onboardingId },
      });

      // In production, send email notification
      console.log('Reminder sent for onboarding:', onboardingId);
    } catch (err) {
      console.error('Error sending reminder:', err);
      throw err;
    }
  };

  return {
    onboardings,
    stats,
    loading,
    error,
    refresh: fetchOnboardings,
    sendReminder,
  };
}

// Helper functions

function getOnboardingConfig(role: ParticipantRole): OnboardingConfig {
  const configs: Record<ParticipantRole, OnboardingConfig> = {
    BROKER: {
      required: ['profile', 'company', 'kyc_identity', 'kyc_company', '2fa', 'documents'],
      optional: ['preferences'],
      labels: {
        profile: 'Compléter votre profil',
        company: 'Informations de votre agence',
        kyc_identity: "Vérification d'identité",
        kyc_company: "Documents de l'entreprise",
        '2fa': 'Sécuriser votre compte (2FA)',
        documents: 'Documents requis',
        preferences: 'Préférences',
      },
    },
    ARCHITECT: {
      required: ['profile', 'company', 'kyc_identity', 'kyc_company', '2fa'],
      optional: ['portfolio'],
      labels: {
        profile: 'Compléter votre profil',
        company: 'Informations du bureau',
        kyc_identity: "Vérification d'identité",
        kyc_company: "Documents de l'entreprise",
        '2fa': 'Sécuriser votre compte (2FA)',
        portfolio: 'Portfolio',
      },
    },
    NOTARY: {
      required: ['profile', 'company', 'kyc_identity', 'kyc_professional', '2fa'],
      optional: [],
      labels: {
        profile: 'Compléter votre profil',
        company: "Informations de l'étude",
        kyc_identity: "Vérification d'identité",
        kyc_professional: 'Licence professionnelle',
        '2fa': 'Sécuriser votre compte (2FA)',
      },
    },
    ENGINEER: {
      required: ['profile', 'company', 'kyc_identity', '2fa'],
      optional: [],
      labels: {
        profile: 'Compléter votre profil',
        company: 'Informations du bureau',
        kyc_identity: "Vérification d'identité",
        '2fa': 'Sécuriser votre compte (2FA)',
      },
    },
    GENERAL_CONTRACTOR: {
      required: ['profile', 'company', 'kyc_identity', 'kyc_company', '2fa'],
      optional: [],
      labels: {
        profile: 'Compléter votre profil',
        company: "Informations de l'entreprise",
        kyc_identity: "Vérification d'identité",
        kyc_company: "Documents de l'entreprise",
        '2fa': 'Sécuriser votre compte (2FA)',
      },
    },
    SUPPLIER: {
      required: ['profile', 'company', 'kyc_company'],
      optional: ['catalog'],
      labels: {
        profile: 'Compléter votre profil',
        company: "Informations de l'entreprise",
        kyc_company: "Documents de l'entreprise",
        catalog: 'Catalogue produits',
      },
    },
    BUYER: {
      required: ['profile', 'kyc_identity', '2fa'],
      optional: ['financing'],
      labels: {
        profile: 'Compléter votre profil',
        kyc_identity: "Vérification d'identité",
        '2fa': 'Sécuriser votre compte (2FA)',
        financing: 'Informations financement',
      },
    },
    PROMOTER: {
      required: ['profile', 'company', 'kyc_identity', 'kyc_company', '2fa'],
      optional: [],
      labels: {
        profile: 'Compléter votre profil',
        company: "Informations de l'entreprise",
        kyc_identity: "Vérification d'identité",
        kyc_company: "Documents de l'entreprise",
        '2fa': 'Sécuriser votre compte (2FA)',
      },
    },
  };

  return configs[role] || configs.BUYER;
}

function buildSteps(onboarding: StakeholderOnboarding, config: OnboardingConfig): OnboardingStep[] {
  const completedSteps = onboarding.steps_completed || [];

  const stepIcons: Record<string, string> = {
    profile: 'User',
    company: 'Building2',
    kyc_identity: 'CreditCard',
    kyc_company: 'FileCheck',
    kyc_professional: 'Award',
    '2fa': 'Shield',
    documents: 'FileText',
    preferences: 'Settings',
    portfolio: 'Image',
    catalog: 'Package',
    financing: 'Wallet',
  };

  return config.required.map((stepId) => ({
    id: stepId,
    label: config.labels[stepId] || stepId,
    description: getStepDescription(stepId),
    icon: stepIcons[stepId] || 'CheckCircle',
    isCompleted: completedSteps.includes(stepId),
    isRequired: true,
    isCurrent: onboarding.current_step === stepId,
  }));
}

function getStepDescription(stepId: string): string {
  const descriptions: Record<string, string> = {
    profile: 'Renseignez vos informations personnelles et de contact',
    company: "Ajoutez les détails de votre société ou bureau",
    kyc_identity: 'Téléchargez une copie de votre pièce d\'identité',
    kyc_company: 'Fournissez les documents légaux de votre entreprise',
    kyc_professional: 'Téléchargez votre licence professionnelle',
    '2fa': 'Activez la double authentification par SMS',
    documents: 'Téléchargez les documents requis pour ce projet',
    preferences: 'Configurez vos préférences de notification',
    portfolio: 'Ajoutez des exemples de vos réalisations',
    catalog: 'Importez votre catalogue de produits',
    financing: 'Renseignez vos informations de financement',
  };

  return descriptions[stepId] || '';
}

/**
 * Labels pour les statuts d'onboarding
 */
export const ONBOARDING_STATUS_LABELS: Record<OnboardingStatus, string> = {
  NOT_STARTED: 'Non démarré',
  IN_PROGRESS: 'En cours',
  PENDING_KYC: 'En attente KYC',
  PENDING_2FA: 'En attente 2FA',
  COMPLETED: 'Terminé',
  BLOCKED: 'Bloqué',
};

/**
 * Couleurs pour les statuts d'onboarding
 */
export const ONBOARDING_STATUS_COLORS: Record<OnboardingStatus, string> = {
  NOT_STARTED: 'gray',
  IN_PROGRESS: 'blue',
  PENDING_KYC: 'yellow',
  PENDING_2FA: 'purple',
  COMPLETED: 'green',
  BLOCKED: 'red',
};
