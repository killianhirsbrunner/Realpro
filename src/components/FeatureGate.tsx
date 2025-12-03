import React from 'react';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Lock } from 'lucide-react';

type FeatureGateProps = {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  organizationId?: string;
};

export function FeatureGate({ feature, children, fallback, organizationId }: FeatureGateProps) {
  const { user } = useCurrentUser();
  const orgId = organizationId || user?.user_organizations?.[0]?.organization_id;
  const { isFeatureEnabled, loading } = useFeatureFlags(orgId);

  if (loading) {
    return null;
  }

  if (!isFeatureEnabled(feature)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800">
        <Lock className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
        <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-50">
          Fonctionnalité non disponible
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Cette fonctionnalité n'est pas incluse dans votre plan actuel.
          Contactez-nous pour mettre à niveau.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

type FeatureToggleProps = {
  feature: string;
  children: React.ReactNode;
  organizationId?: string;
};

export function FeatureToggle({ feature, children, organizationId }: FeatureToggleProps) {
  const { user } = useCurrentUser();
  const orgId = organizationId || user?.user_organizations?.[0]?.organization_id;
  const { isFeatureEnabled, loading } = useFeatureFlags(orgId);

  if (loading || !isFeatureEnabled(feature)) {
    return null;
  }

  return <>{children}</>;
}
