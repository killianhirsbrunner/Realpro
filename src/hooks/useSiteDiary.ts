import { useState, useEffect } from 'react';

export interface SiteDiaryEntry {
  id: string;
  organization_id: string;
  project_id: string;
  entry_date: string;
  weather: string | null;
  notes: string | null;
  workforce: any[];
  issues: any[];
  planning_phase_id: string | null;
  created_by_id: string;
  created_at: string;
  updated_at: string;
  created_by?: {
    id: string;
    email: string;
    raw_user_meta_data: any;
  };
  photos?: any[];
  documents?: any[];
}

export function useSiteDiary(projectId: string) {
  const [entries, setEntries] = useState<SiteDiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/construction/diary/${projectId}`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) throw new Error('Failed to load site diary entries');

      const data = await response.json();
      setEntries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entryData: {
    date: string;
    weather?: string;
    notes?: string;
    workforce?: any[];
    issues?: any[];
    planningPhaseId?: string;
  }) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/construction/diary`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          projectId,
          ...entryData,
        }),
      });

      if (!response.ok) throw new Error('Failed to create entry');

      await loadEntries();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const addPhoto = async (diaryId: string, url: string, caption?: string) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/construction/diary/${diaryId}/photo`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ url, caption }),
      });

      if (!response.ok) throw new Error('Failed to add photo');

      await loadEntries();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (projectId) {
      loadEntries();
    }
  }, [projectId]);

  return {
    entries,
    loading,
    error,
    createEntry,
    addPhoto,
    refresh: loadEntries,
  };
}
