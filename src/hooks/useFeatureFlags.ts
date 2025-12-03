import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type FeatureFlags = {
  submissions?: boolean;
  materials?: boolean;
  supplier_appointments?: boolean;
  advanced_reporting?: boolean;
  api_access?: boolean;
  custom_branding?: boolean;
  sav_module?: boolean;
  [key: string]: boolean | undefined;
};

type PlanLimits = {
  max_projects?: number;
  max_users?: number;
  max_storage_gb?: number;
  [key: string]: number | undefined;
};

export function useFeatureFlags(organizationId?: string) {
  const [features, setFeatures] = useState<FeatureFlags>({});
  const [limits, setLimits] = useState<PlanLimits>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeatureFlags = async () => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select(`
          status,
          plan:plans(
            feature_flags,
            limits
          )
        `)
        .eq('organization_id', organizationId)
        .in('status', ['TRIAL', 'ACTIVE'])
        .maybeSingle();

      if (subError) throw subError;

      if (subscription && subscription.plan) {
        setFeatures((subscription.plan as any).feature_flags || {});
        setLimits((subscription.plan as any).limits || {});
      } else {
        setFeatures({});
        setLimits({});
      }
    } catch (err: any) {
      setError(err.message);
      setFeatures({});
      setLimits({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatureFlags();
  }, [organizationId]);

  const isFeatureEnabled = (featureKey: string): boolean => {
    return features[featureKey] === true;
  };

  const getLimit = (limitKey: string): number | undefined => {
    return limits[limitKey];
  };

  const hasReachedLimit = (limitKey: string, currentValue: number): boolean => {
    const limit = limits[limitKey];
    if (limit === undefined || limit === null) return false;
    return currentValue >= limit;
  };

  return {
    features,
    limits,
    loading,
    error,
    isFeatureEnabled,
    getLimit,
    hasReachedLimit,
    reload: loadFeatureFlags,
  };
}

export function useFeatureGate(featureKey: string, organizationId?: string) {
  const { isFeatureEnabled, loading } = useFeatureFlags(organizationId);

  return {
    enabled: isFeatureEnabled(featureKey),
    loading,
  };
}
