import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'sale' | 'document' | 'task' | 'message' | 'submission' | 'payment';
  user?: string;
}

export function useProjectActivity(projectId: string) {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) return;

    fetchActivity();
  }, [projectId]);

  async function fetchActivity() {
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

      const { data: auditLogs } = await supabase
        .from('audit_logs')
        .select('id, action, entity_type, entity_id, details, created_at, user:users!audit_logs_user_id_fkey(full_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(100);

      const activityItems: ActivityItem[] = (auditLogs || []).map((log: any) => {
        let type: ActivityItem['type'] = 'task';
        let title = log.action;
        let description = log.details || '';

        if (log.entity_type === 'lot' && log.action === 'UPDATE') {
          type = 'sale';
          title = 'Lot mis à jour';
        } else if (log.entity_type === 'document') {
          type = 'document';
          title = 'Document ajouté';
        } else if (log.entity_type === 'message') {
          type = 'message';
          title = 'Nouveau message';
        } else if (log.entity_type === 'submission') {
          type = 'submission';
          title = 'Soumission créée';
        } else if (log.entity_type === 'payment') {
          type = 'payment';
          title = 'Paiement enregistré';
        }

        return {
          id: log.id,
          title,
          description,
          date: format(new Date(log.created_at), 'dd/MM/yyyy HH:mm'),
          type,
          user: log.user?.full_name,
        };
      });

      setActivity(activityItems);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch activity'));
    } finally {
      setLoading(false);
    }
  }

  return { activity, project, loading, error, refetch: fetchActivity };
}
