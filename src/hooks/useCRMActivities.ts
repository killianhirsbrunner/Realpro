import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface CRMActivity {
  id: string;
  project_id?: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'visit' | 'demo';
  subject: string;
  description?: string;
  prospect_id?: string;
  contact_id?: string;
  buyer_id?: string;
  campaign_id?: string;
  assigned_to?: string;
  due_date?: string;
  completed_at?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  duration_minutes?: number;
  outcome?: string;
  outcome_notes?: string;
  is_logged: boolean;
  reminder_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export function useCRMActivities(params?: {
  projectId?: string;
  prospectId?: string;
  contactId?: string;
  buyerId?: string;
  assignedTo?: string;
}) {
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('crm_activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (params?.projectId) {
        query = query.eq('project_id', params.projectId);
      }
      if (params?.prospectId) {
        query = query.eq('prospect_id', params.prospectId);
      }
      if (params?.contactId) {
        query = query.eq('contact_id', params.contactId);
      }
      if (params?.buyerId) {
        query = query.eq('buyer_id', params.buyerId);
      }
      if (params?.assignedTo) {
        query = query.eq('assigned_to', params.assignedTo);
      }

      const { data, error } = await query;

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Erreur lors du chargement des activités');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [params?.projectId, params?.prospectId, params?.contactId, params?.buyerId, params?.assignedTo]);

  const createActivity = async (activityData: Partial<CRMActivity>) => {
    try {
      const { data, error } = await supabase
        .from('crm_activities')
        .insert([{
          ...activityData,
          status: activityData.status || 'pending',
          priority: activityData.priority || 'medium',
          is_logged: activityData.is_logged || false,
        }])
        .select()
        .single();

      if (error) throw error;

      setActivities((prev) => [data, ...prev]);
      toast.success('Activité créée avec succès');
      return data;
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('Erreur lors de la création de l\'activité');
      throw error;
    }
  };

  const updateActivity = async (id: string, updates: Partial<CRMActivity>) => {
    try {
      const { data, error } = await supabase
        .from('crm_activities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setActivities((prev) =>
        prev.map((activity) => (activity.id === id ? data : activity))
      );
      toast.success('Activité mise à jour');
      return data;
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Erreur lors de la mise à jour');
      throw error;
    }
  };

  const completeActivity = async (id: string, outcome?: string, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('crm_activities')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          outcome,
          outcome_notes: notes,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setActivities((prev) =>
        prev.map((activity) => (activity.id === id ? data : activity))
      );
      toast.success('Activité complétée');
      return data;
    } catch (error) {
      console.error('Error completing activity:', error);
      toast.error('Erreur lors de la complétion');
      throw error;
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crm_activities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setActivities((prev) => prev.filter((activity) => activity.id !== id));
      toast.success('Activité supprimée');
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Erreur lors de la suppression');
      throw error;
    }
  };

  return {
    activities,
    loading,
    createActivity,
    updateActivity,
    completeActivity,
    deleteActivity,
    refetch: fetchActivities,
  };
}
