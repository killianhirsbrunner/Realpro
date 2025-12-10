import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { OnboardingWizard } from '../components/stakeholder';
import type { ParticipantRole } from '../types/stakeholder';

interface OnboardingContext {
  projectId: string;
  projectName: string;
  organizationId: string;
  organizationName: string;
  organizationLogo: string | null;
  userId: string;
  role: ParticipantRole;
}

export default function StakeholderOnboarding() {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [context, setContext] = useState<OnboardingContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOnboardingContext();
  }, [projectId]);

  const fetchOnboardingContext = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        navigate('/login');
        return;
      }

      // Get stakeholder onboarding info
      const { data: onboarding, error: onboardingError } = await supabase
        .from('stakeholder_onboarding')
        .select(`
          *,
          project:projects!project_id(id, name, organization_id),
          organization:organizations!organization_id(id, name, logo_url)
        `)
        .eq('user_id', currentUser.user.id)
        .eq('project_id', projectId)
        .single();

      if (onboardingError) {
        // Try to get from project_participants
        const { data: participant, error: participantError } = await supabase
          .from('project_participants')
          .select(`
            *,
            project:projects!project_id(id, name, organization_id, organization:organizations!organization_id(id, name, logo_url))
          `)
          .eq('user_id', currentUser.user.id)
          .eq('project_id', projectId)
          .single();

        if (participantError) {
          throw new Error('Vous n\'avez pas accès à ce projet');
        }

        setContext({
          projectId: participant.project_id,
          projectName: participant.project.name,
          organizationId: participant.project.organization_id,
          organizationName: participant.project.organization.name,
          organizationLogo: participant.project.organization.logo_url,
          userId: currentUser.user.id,
          role: participant.role as ParticipantRole,
        });
      } else {
        setContext({
          projectId: onboarding.project_id,
          projectName: onboarding.project?.name,
          organizationId: onboarding.organization_id,
          organizationName: onboarding.organization?.name,
          organizationLogo: onboarding.organization?.logo_url,
          userId: currentUser.user.id,
          role: onboarding.role as ParticipantRole,
        });
      }
    } catch (err) {
      console.error('Error fetching onboarding context:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    // Redirect based on role
    const roleRoutes: Record<ParticipantRole, string> = {
      PROMOTER: `/projects/${projectId}`,
      BROKER: `/broker/project/${projectId}`,
      ARCHITECT: `/architect/project/${projectId}`,
      ENGINEER: `/engineer/project/${projectId}`,
      NOTARY: `/notary/project/${projectId}`,
      GENERAL_CONTRACTOR: `/contractor/project/${projectId}`,
      SUPPLIER: `/supplier`,
      BUYER: `/buyer`,
    };

    navigate(roleRoutes[context?.role || 'BUYER'] || '/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Accès refusé
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (!context) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            {context.organizationLogo ? (
              <img
                src={context.organizationLogo}
                alt={context.organizationName}
                className="h-10 w-auto"
              />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-indigo-600" />
              </div>
            )}
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {context.organizationName}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Projet: {context.projectName}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OnboardingWizard
          projectId={context.projectId}
          userId={context.userId}
          organizationId={context.organizationId}
          role={context.role}
          onComplete={handleComplete}
        />
      </main>
    </div>
  );
}
