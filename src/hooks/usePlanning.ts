import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface PlanningTask {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  type: 'milestone' | 'task' | 'phase';
  phase: string | null;
  cfc_line_id: string | null;
  start_date: string;
  end_date: string;
  actual_start_date: string | null;
  actual_end_date: string | null;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed' | 'blocked';
  responsible_user_id: string | null;
  parent_task_id: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

export interface PlanningAlert {
  id: string;
  project_id: string;
  task_id: string | null;
  alert_type: 'delay' | 'dependency_blocked' | 'milestone_missed' | 'resource_conflict';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  resolved: boolean;
  resolved_at: string | null;
  created_at: string;
}

export interface PlanningSummary {
  globalProgress: number;
  delayedTasks: number;
  inProgress: number;
  completed: number;
  totalTasks: number;
}

export function usePlanning(projectId: string) {
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [alerts, setAlerts] = useState<PlanningAlert[]>([]);
  const [summary, setSummary] = useState<PlanningSummary>({
    globalProgress: 0,
    delayedTasks: 0,
    inProgress: 0,
    completed: 0,
    totalTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPlanning();
  }, [projectId]);

  const fetchPlanning = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tasksResult, alertsResult] = await Promise.all([
        supabase
          .from('planning_tasks')
          .select('*')
          .eq('project_id', projectId)
          .order('start_date', { ascending: true }),

        supabase
          .from('planning_alerts')
          .select('*')
          .eq('project_id', projectId)
          .eq('resolved', false)
          .order('created_at', { ascending: false }),
      ]);

      if (tasksResult.error) throw tasksResult.error;
      if (alertsResult.error) throw alertsResult.error;

      const fetchedTasks = tasksResult.data || [];
      const fetchedAlerts = alertsResult.data || [];

      setTasks(fetchedTasks);
      setAlerts(fetchedAlerts);

      const totalTasks = fetchedTasks.length;
      const completedTasks = fetchedTasks.filter(t => t.status === 'completed').length;
      const inProgressTasks = fetchedTasks.filter(t => t.status === 'in_progress').length;
      const delayedTasks = fetchedTasks.filter(t => t.status === 'delayed').length;
      const avgProgress = totalTasks > 0
        ? Math.round(fetchedTasks.reduce((sum, t) => sum + t.progress, 0) / totalTasks)
        : 0;

      setSummary({
        globalProgress: avgProgress,
        delayedTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
        totalTasks,
      });
    } catch (err) {
      console.error('Error fetching planning:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskProgress = async (taskId: string, progress: number) => {
    try {
      const { error } = await supabase
        .from('planning_tasks')
        .update({ progress })
        .eq('id', taskId);

      if (error) throw error;

      await fetchPlanning();
    } catch (err) {
      console.error('Error updating task progress:', err);
      throw err;
    }
  };

  const createTask = async (task: Partial<PlanningTask>) => {
    try {
      const { data, error } = await supabase
        .from('planning_tasks')
        .insert({
          project_id: projectId,
          ...task,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchPlanning();
      return data;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('planning_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      await fetchPlanning();
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('planning_alerts')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;

      await fetchPlanning();
    } catch (err) {
      console.error('Error resolving alert:', err);
      throw err;
    }
  };

  return {
    tasks,
    alerts,
    summary,
    loading,
    error,
    refresh: fetchPlanning,
    updateTaskProgress,
    createTask,
    deleteTask,
    resolveAlert,
  };
}
