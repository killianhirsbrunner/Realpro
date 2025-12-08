import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';

export interface ProjectMilestone {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  milestone_type: 'START' | 'PERMIT' | 'FOUNDATION' | 'STRUCTURE' | 'CLOSURE' | 'FINISH' | 'DELIVERY' | 'WARRANTY' | 'CUSTOM';
  planned_date: string;
  actual_date?: string;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
  completion_percentage: number;
  dependencies?: string[];
  responsible_user_id?: string;
  notes?: string;
  documents?: string[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
  responsible_user?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface MilestoneProgress {
  milestone_id: string;
  date: string;
  completion_percentage: number;
  notes?: string;
  updated_by: string;
}

export function useProjectMilestones(projectId?: string) {
  const { currentOrganization } = useOrganization();
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (projectId && currentOrganization?.id) {
      fetchMilestones();
    }
  }, [projectId, currentOrganization?.id]);

  const fetchMilestones = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('project_milestones')
        .select(`
          *,
          responsible_user:users(id, email, first_name, last_name)
        `)
        .eq('project_id', projectId)
        .order('planned_date');

      if (fetchError) throw fetchError;
      setMilestones(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createMilestone = async (milestone: Partial<ProjectMilestone>) => {
    if (!projectId) throw new Error('No project ID provided');

    const { data, error: insertError } = await supabase
      .from('project_milestones')
      .insert({
        ...milestone,
        project_id: projectId,
        status: milestone.status || 'UPCOMING',
        completion_percentage: milestone.completion_percentage || 0,
      })
      .select(`
        *,
        responsible_user:users(id, email, first_name, last_name)
      `)
      .single();

    if (insertError) throw insertError;
    setMilestones([...milestones, data]);
    return data;
  };

  const updateMilestone = async (
    milestoneId: string,
    updates: Partial<ProjectMilestone>
  ) => {
    const { data, error: updateError } = await supabase
      .from('project_milestones')
      .update(updates)
      .eq('id', milestoneId)
      .select(`
        *,
        responsible_user:users(id, email, first_name, last_name)
      `)
      .single();

    if (updateError) throw updateError;
    setMilestones(
      milestones.map((m) => (m.id === milestoneId ? data : m))
    );
    return data;
  };

  const completeMilestone = async (milestoneId: string, actualDate: string) => {
    return updateMilestone(milestoneId, {
      status: 'COMPLETED',
      actual_date: actualDate,
      completion_percentage: 100,
      completed_at: new Date().toISOString(),
    });
  };

  const updateMilestoneProgress = async (
    milestoneId: string,
    percentage: number,
    notes?: string
  ) => {
    const { data: currentUser } = await supabase.auth.getUser();

    const updates: Partial<ProjectMilestone> = {
      completion_percentage: percentage,
    };

    if (percentage === 100) {
      updates.status = 'COMPLETED';
      updates.completed_at = new Date().toISOString();
      if (!milestones.find((m) => m.id === milestoneId)?.actual_date) {
        updates.actual_date = new Date().toISOString();
      }
    } else if (percentage > 0) {
      updates.status = 'IN_PROGRESS';
    }

    return updateMilestone(milestoneId, updates);
  };

  const deleteMilestone = async (milestoneId: string) => {
    const { error: deleteError } = await supabase
      .from('project_milestones')
      .delete()
      .eq('id', milestoneId);

    if (deleteError) throw deleteError;
    setMilestones(milestones.filter((m) => m.id !== milestoneId));
  };

  const getUpcomingMilestones = (daysAhead = 30) => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return milestones.filter((m) => {
      const plannedDate = new Date(m.planned_date);
      return (
        m.status === 'UPCOMING' &&
        plannedDate >= now &&
        plannedDate <= futureDate
      );
    });
  };

  const getDelayedMilestones = () => {
    const now = new Date();
    return milestones.filter((m) => {
      const plannedDate = new Date(m.planned_date);
      return (
        (m.status === 'UPCOMING' || m.status === 'IN_PROGRESS') &&
        plannedDate < now
      );
    });
  };

  const getCompletedMilestones = () => {
    return milestones.filter((m) => m.status === 'COMPLETED');
  };

  const getMilestoneStats = () => {
    const total = milestones.length;
    const completed = milestones.filter((m) => m.status === 'COMPLETED').length;
    const inProgress = milestones.filter((m) => m.status === 'IN_PROGRESS').length;
    const delayed = getDelayedMilestones().length;
    const upcoming = milestones.filter((m) => m.status === 'UPCOMING').length;

    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const averageCompletion =
      total > 0
        ? milestones.reduce((sum, m) => sum + m.completion_percentage, 0) / total
        : 0;

    return {
      total,
      completed,
      inProgress,
      delayed,
      upcoming,
      completionRate,
      averageCompletion,
    };
  };

  const checkDependencies = (milestoneId: string) => {
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (!milestone || !milestone.dependencies) return true;

    return milestone.dependencies.every((depId) => {
      const dep = milestones.find((m) => m.id === depId);
      return dep?.status === 'COMPLETED';
    });
  };

  const getCriticalPath = () => {
    const incompleteMilestones = milestones.filter(
      (m) => m.status !== 'COMPLETED' && m.status !== 'CANCELLED'
    );

    return incompleteMilestones
      .sort((a, b) => {
        const dateA = new Date(a.planned_date).getTime();
        const dateB = new Date(b.planned_date).getTime();
        return dateA - dateB;
      })
      .map((m) => ({
        ...m,
        daysUntilDue: Math.ceil(
          (new Date(m.planned_date).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        isOverdue:
          new Date(m.planned_date) < new Date() && m.status !== 'COMPLETED',
      }));
  };

  return {
    milestones,
    loading,
    error,
    createMilestone,
    updateMilestone,
    completeMilestone,
    updateMilestoneProgress,
    deleteMilestone,
    getUpcomingMilestones,
    getDelayedMilestones,
    getCompletedMilestones,
    getMilestoneStats,
    checkDependencies,
    getCriticalPath,
    refetch: fetchMilestones,
  };
}
