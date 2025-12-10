import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type User = Database['public']['Tables']['users']['Row'];

export interface Organization {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

export interface UserOrganization {
  organization_id: string;
  role: string;
  is_primary: boolean;
}

export interface UserProfile extends User {
  preferred_language?: string;
  role?: string | null;
  user_organizations?: UserOrganization[];
  is_super_admin?: boolean;
}

export function useCurrentUser() {
  const [baseUser, setBaseUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userOrganizations, setUserOrganizations] = useState<UserOrganization[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          if (isMounted) {
            setBaseUser(null);
            setOrganization(null);
            setUserOrganizations([]);
            setRole(null);
            setLoading(false);
          }
          return;
        }

        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('email', authUser.email)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (isMounted && userData) {
          setBaseUser(userData);
        }

        if (userData?.id) {
          // Fetch all user organizations with roles
          const { data: userOrgsData } = await supabase
            .from('user_organizations')
            .select('organization_id, role, is_primary')
            .eq('user_id', userData.id);

          if (isMounted && userOrgsData) {
            const orgs = userOrgsData.map(uo => ({
              organization_id: uo.organization_id,
              role: uo.role || 'member',
              is_primary: uo.is_primary || false,
            }));
            setUserOrganizations(orgs);

            // Get primary organization or first one
            const primaryOrg = userOrgsData.find(uo => uo.is_primary) || userOrgsData[0];

            if (primaryOrg) {
              // Set the role from the user_organizations table
              setRole(primaryOrg.role || 'member');

              const { data: orgData } = await supabase
                .from('organizations')
                .select('id, name, slug, is_active')
                .eq('id', primaryOrg.organization_id)
                .maybeSingle();

              if (isMounted && orgData) {
                setOrganization(orgData);
              }
            }
          }
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch user'));
          setLoading(false);
        }
      }
    }

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Create the user object with all extended properties
  const user = useMemo<UserProfile | null>(() => {
    if (!baseUser) return null;
    return {
      ...baseUser,
      preferred_language: baseUser.language,
      role,
      user_organizations: userOrganizations,
    };
  }, [baseUser, role, userOrganizations]);

  // Create a profile object for backward compatibility
  const profile = user;

  return {
    user,
    organization,
    loading,
    error,
    role,
    profile,
    user_organizations: userOrganizations,
  };
}
