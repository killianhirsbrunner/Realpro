import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Branding = {
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
};

const DEFAULT_BRANDING: Branding = {
  logoUrl: null,
  primaryColor: '#0891b2',
  secondaryColor: '#4b5563',
  accentColor: '#10b981',
};

export function useBranding(organizationId?: string) {
  const [branding, setBranding] = useState<Branding>(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBranding = async () => {
    if (!organizationId) {
      setBranding(DEFAULT_BRANDING);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: brandingError } = await supabase
        .from('organization_branding')
        .select('logo_url, primary_color, secondary_color, accent_color')
        .eq('organization_id', organizationId)
        .maybeSingle();

      if (brandingError) throw brandingError;

      if (data) {
        setBranding({
          logoUrl: data.logo_url || null,
          primaryColor: data.primary_color || DEFAULT_BRANDING.primaryColor,
          secondaryColor: data.secondary_color || DEFAULT_BRANDING.secondaryColor,
          accentColor: data.accent_color || DEFAULT_BRANDING.accentColor,
        });
      } else {
        setBranding(DEFAULT_BRANDING);
      }
    } catch (err: any) {
      setError(err.message);
      setBranding(DEFAULT_BRANDING);
    } finally {
      setLoading(false);
    }
  };

  const updateBranding = async (updates: Partial<Branding>) => {
    if (!organizationId) return false;

    try {
      const { error: updateError } = await supabase
        .from('organization_branding')
        .upsert({
          organization_id: organizationId,
          logo_url: updates.logoUrl !== undefined ? updates.logoUrl : branding.logoUrl,
          primary_color: updates.primaryColor !== undefined ? updates.primaryColor : branding.primaryColor,
          secondary_color: updates.secondaryColor !== undefined ? updates.secondaryColor : branding.secondaryColor,
          accent_color: updates.accentColor !== undefined ? updates.accentColor : branding.accentColor,
        }, {
          onConflict: 'organization_id',
        });

      if (updateError) throw updateError;

      await loadBranding();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    loadBranding();
  }, [organizationId]);

  useEffect(() => {
    if (branding) {
      document.documentElement.style.setProperty('--color-primary', branding.primaryColor || DEFAULT_BRANDING.primaryColor);
      document.documentElement.style.setProperty('--color-secondary', branding.secondaryColor || DEFAULT_BRANDING.secondaryColor);
      document.documentElement.style.setProperty('--color-accent', branding.accentColor || DEFAULT_BRANDING.accentColor);
    }
  }, [branding]);

  return {
    branding,
    loading,
    error,
    updateBranding,
    reload: loadBranding,
  };
}
