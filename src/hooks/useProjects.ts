import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import { useOrganizationContext } from '../contexts/OrganizationContext';

type Project = Database['public']['Tables']['projects']['Row'] & {
  total_lots?: number;
  sold_lots?: number;
  reserved_lots?: number;
  available_lots?: number;
  total_revenue?: number;
};

export function useProjects() {
  const { currentOrganization } = useOrganizationContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!currentOrganization) {
      setProjects([]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    try {
      // Filtrer par organization_id pour isoler les données
      const { data: projectsData, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const projectsWithStats = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data: lots } = await supabase
            .from('lots')
            .select('id, status, price_total')
            .eq('project_id', project.id);

          const totalLots = lots?.length || 0;
          const soldLots = lots?.filter(l => l.status === 'SOLD').length || 0;
          const reservedLots = lots?.filter(l => l.status === 'RESERVED').length || 0;
          const availableLots = lots?.filter(l => l.status === 'AVAILABLE').length || 0;
          const totalRevenue = lots
            ?.filter(l => l.status === 'SOLD')
            .reduce((sum, l) => sum + (l.price_total || 0), 0) || 0;

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
  }, [currentOrganization]);

  useEffect(() => {
    setLoading(true);
    fetchProjects();
  }, [fetchProjects]);

  const deleteProject = async (projectId: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;

    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  return { projects, loading, error, refetch: fetchProjects, deleteProject };
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
