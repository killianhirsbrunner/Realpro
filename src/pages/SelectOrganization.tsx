import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Building2, ArrowRight, Check } from 'lucide-react';
import { RealProLogo } from '../components/branding/RealProLogo';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_default: boolean;
}

export function SelectOrganization() {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useCurrentUser();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && user) {
      fetchOrganizations();
    }
  }, [user, userLoading]);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('user_organizations')
        .select(`
          is_default,
          organization:organizations (
            id,
            name,
            slug,
            logo_url
          )
        `)
        .eq('user_id', user!.id);

      if (error) throw error;

      const orgs = data.map(item => ({
        id: item.organization.id,
        name: item.organization.name,
        slug: item.organization.slug,
        logo_url: item.organization.logo_url,
        is_default: item.is_default
      }));

      setOrganizations(orgs);

      if (orgs.length === 1) {
        selectOrganization(orgs[0].id);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectOrganization = async (organizationId: string) => {
    localStorage.setItem('currentOrganizationId', organizationId);
    navigate('/dashboard');
  };

  const setDefaultOrganization = async (organizationId: string) => {
    try {
      await supabase
        .from('user_organizations')
        .update({ is_default: false })
        .eq('user_id', user!.id);

      await supabase
        .from('user_organizations')
        .update({ is_default: true })
        .eq('user_id', user!.id)
        .eq('organization_id', organizationId);

      setOrganizations(orgs =>
        orgs.map(org => ({
          ...org,
          is_default: org.id === organizationId
        }))
      );
    } catch (error) {
      console.error('Error setting default organization:', error);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
            Aucune organisation
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Vous n'êtes associé à aucune organisation pour le moment.
          </p>
          <button
            onClick={() => navigate('/auth/register')}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-colors"
          >
            Créer une organisation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-brand-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-brand-950/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <RealProLogo size="xl" />
            </div>
            <h1 className="text-4xl font-semibold text-neutral-900 dark:text-white mb-3">
              Choisissez votre organisation
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Vous appartenez à plusieurs organisations. Sélectionnez celle avec laquelle vous souhaitez travailler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => selectOrganization(org.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setDefaultOrganization(org.id);
                }}
                className="relative group p-8 bg-white dark:bg-neutral-900 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-brand-400 dark:hover:border-brand-600 shadow-card hover:shadow-lg transition-all text-left"
              >
                {org.is_default && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-medium rounded-lg flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Par défaut
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  {org.logo_url ? (
                    <img
                      src={org.logo_url}
                      alt={org.name}
                      className="w-16 h-16 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1 truncate">
                      {org.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      @{org.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-brand-600 dark:text-brand-400 font-medium group-hover:gap-2 transition-all">
                  Accéder à cette organisation
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Vous pouvez changer d'organisation à tout moment depuis les paramètres.
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Astuce : Clic droit sur une organisation pour la définir par défaut
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
