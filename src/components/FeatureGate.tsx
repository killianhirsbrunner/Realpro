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
      <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
        <Lock className="mx-auto h-8 w-8 text-neutral-400 dark:text-neutral-500" />
        <p className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-50">
          Fonctionnalité non disponible
        </p>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
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
