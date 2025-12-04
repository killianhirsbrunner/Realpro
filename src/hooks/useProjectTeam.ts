import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  company?: string;
  avatar?: string;
}

export function useProjectTeam(projectId: string) {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) return;

    fetchTeam();
  }, [projectId]);

  async function fetchTeam() {
    try {
      setLoading(true);
      setError(null);

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, name, city, canton')
        .eq('id', projectId)
        .maybeSingle();

      if (projectError) throw projectError;
      if (!projectData) throw new Error('Project not found');

      setProject(projectData);

      const { data: participants, error: participantsError } = await supabase
        .from('project_participants')
        .select(`
          id,
          role,
          user:users!project_participants_user_id_fkey (
            id,
            email,
            full_name,
            phone
          )
        `)
        .eq('project_id', projectId);

      if (participantsError) throw participantsError;

      const teamMembers: TeamMember[] = (participants || []).map((p: any) => ({
        id: p.id,
        name: p.user?.full_name || p.user?.email || 'Utilisateur',
        email: p.user?.email || '',
        phone: p.user?.phone,
        role: p.role || 'MEMBER',
        company: undefined,
      }));

      setTeam(teamMembers);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch team'));
    } finally {
      setLoading(false);
    }
  }

  return { team, project, loading, error, refetch: fetchTeam };
}
