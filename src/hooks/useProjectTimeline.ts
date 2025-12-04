import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface Phase {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  progress?: number;
}

interface Milestone {
  id: string;
  name: string;
  description?: string;
  date: string;
  completed: boolean;
}

interface ProjectTimeline {
  phases: Phase[];
  milestones: Milestone[];
}

export function useProjectTimeline(projectId: string) {
  const [timeline, setTimeline] = useState<ProjectTimeline | null>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) return;

    fetchTimeline();
  }, [projectId]);

  async function fetchTimeline() {
    try {
      setLoading(true);
      setError(null);

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, name, city, canton, start_date, end_date')
        .eq('id', projectId)
        .maybeSingle();

      if (projectError) throw projectError;
      if (!projectData) throw new Error('Project not found');

      setProject(projectData);

      const { data: phasesData, error: phasesError } = await supabase
        .from('project_phases')
        .select('id, name, description, planned_start_date, planned_end_date, actual_end_date, status, progress_percent')
        .eq('project_id', projectId)
        .order('order_index');

      if (phasesError) throw phasesError;

      const phases: Phase[] = (phasesData || []).map((phase: any) => ({
        id: phase.id,
        name: phase.name,
        description: phase.description,
        startDate: phase.planned_start_date ? format(new Date(phase.planned_start_date), 'dd/MM/yyyy') : '',
        endDate: phase.planned_end_date ? format(new Date(phase.planned_end_date), 'dd/MM/yyyy') : '',
        status: phase.status || 'not_started',
        progress: phase.progress_percent,
      }));

      const { data: milestonesData } = await supabase
        .from('project_milestones')
        .select('id, name, description, target_date, completed')
        .eq('project_id', projectId)
        .order('target_date');

      const milestones: Milestone[] = (milestonesData || []).map((milestone: any) => ({
        id: milestone.id,
        name: milestone.name,
        description: milestone.description,
        date: milestone.target_date ? format(new Date(milestone.target_date), 'dd/MM/yyyy') : '',
        completed: milestone.completed || false,
      }));

      setTimeline({ phases, milestones });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch timeline'));
    } finally {
      setLoading(false);
    }
  }

  return { timeline, project, loading, error, refetch: fetchTimeline };
}
