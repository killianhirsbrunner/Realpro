import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type User = Database['public']['Tables']['users']['Row'];

interface Organization {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
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
            setUser(null);
            setOrganization(null);
            setLoading(false);
          }
          return;
        }

        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (isMounted) {
          setUser(userData);
        }

        if (userData?.id) {
          const { data: userOrg } = await supabase
            .from('user_organizations')
            .select('organization_id')
            .eq('user_id', userData.id)
            .limit(1)
            .maybeSingle();

          if (userOrg?.organization_id) {
            const { data: orgData } = await supabase
              .from('organizations')
              .select('id, name, slug, is_active')
              .eq('id', userOrg.organization_id)
              .maybeSingle();

            if (isMounted && orgData) {
              setOrganization(orgData);
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

  return { user, organization, loading, error };
}
