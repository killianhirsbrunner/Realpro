import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Project = Database['public']['Tables']['projects']['Row'] & {
  total_lots?: number;
  sold_lots?: number;
  reserved_lots?: number;
  available_lots?: number;
  total_revenue?: number;
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      try {
        const { data: projectsData, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const projectsWithStats = await Promise.all(
          (projectsData || []).map(async (project) => {
            const { data: lots } = await supabase
              .from('lots')
              .select('id, status, price_vat')
              .eq('project_id', project.id);

            const totalLots = lots?.length || 0;
            const soldLots = lots?.filter(l => l.status === 'SOLD').length || 0;
            const reservedLots = lots?.filter(l => l.status === 'RESERVED').length || 0;
            const availableLots = lots?.filter(l => l.status === 'AVAILABLE').length || 0;
            const totalRevenue = lots
              ?.filter(l => l.status === 'SOLD')
              .reduce((sum, l) => sum + (l.price_vat || 0), 0) || 0;

            return {
              ...project,
              total_lots: totalLots,
              sold_lots: soldLots,
              reserved_lots: reservedLots,
              available_lots: availableLots,
              total_revenue: totalRevenue,
            };
          })
        );

        if (isMounted) {
          setProjects(projectsWithStats);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
          setLoading(false);
        }
      }
    }

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return { projects, loading, error, refetch: () => setLoading(true) };
}

export function useProject(projectId: string | undefined) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchProject() {
      try {
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (isMounted) {
          setProject(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch project'));
          setLoading(false);
        }
      }
    }

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  return { project, loading, error };
}
