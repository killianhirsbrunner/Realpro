import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SiteDiaryEntry {
  id: string;
  project_id: string;
  organization_id: string;
  entry_date: string;
  weather: string | null;
  notes: string | null;
  workforce: any[] | null;
  issues: any[] | null;
  planning_phase_id: string | null;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

export function useSiteDiaryEntries(projectId: string) {
  const [entries, setEntries] = useState<SiteDiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchEntries();
  }, [projectId]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('site_diary_entries')
        .select('*')
        .eq('project_id', projectId)
        .order('entry_date', { ascending: false });

      if (fetchError) throw fetchError;

      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching site diary entries:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entry: {
    entry_date: string;
    weather?: string;
    notes?: string;
    workforce?: any[];
    issues?: any[];
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: orgs } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .maybeSingle();

      if (!orgs) throw new Error('No organization found');

      const { data, error: createError } = await supabase
        .from('site_diary_entries')
        .insert({
          project_id: projectId,
          organization_id: orgs.organization_id,
          created_by_id: user.id,
          ...entry,
        })
        .select()
        .single();

      if (createError) throw createError;

      await fetchEntries();
      return data;
    } catch (err) {
      console.error('Error creating site diary entry:', err);
      throw err;
    }
  };

  const updateEntry = async (entryId: string, updates: Partial<SiteDiaryEntry>) => {
    try {
      const { error: updateError } = await supabase
        .from('site_diary_entries')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entryId);

      if (updateError) throw updateError;

      await fetchEntries();
    } catch (err) {
      console.error('Error updating site diary entry:', err);
      throw err;
    }
  };

  const deleteEntry = async (entryId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('site_diary_entries')
        .delete()
        .eq('id', entryId);

      if (deleteError) throw deleteError;

      await fetchEntries();
    } catch (err) {
      console.error('Error deleting site diary entry:', err);
      throw err;
    }
  };

  return {
    entries,
    loading,
    error,
    refresh: fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
