import { useState, useEffect } from 'react';

export interface HandoverEvent {
  id: string;
  organization_id: string;
  project_id: string;
  lot_id: string;
  buyer_id: string;
  type: 'PRE_INSPECTION' | 'INSPECTION' | 'HANDOVER' | 'KEY_HANDOVER';
  date: string;
  notes: string | null;
  status: string;
  document_id: string | null;
  created_by_id: string;
  created_at: string;
  lot?: any;
  buyer?: any;
  issues?: any[];
}

export function useHandover(lotId: string) {
  const [events, setEvents] = useState<HandoverEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/construction/handover/lot/${lotId}`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) throw new Error('Failed to load handover events');

      const data = await response.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scheduleEvent = async (eventData: {
    projectId: string;
    buyerId: string;
    type: string;
    date: string;
    notes?: string;
  }) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/construction/handover`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          lotId,
          ...eventData,
        }),
      });

      if (!response.ok) throw new Error('Failed to schedule event');

      await loadEvents();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const addIssue = async (handoverId: string, issueData: {
    description: string;
    severity: string;
    photos?: string[];
    projectId: string;
  }) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/construction/handover/${handoverId}/issue`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...issueData,
          lotId,
        }),
      });

      if (!response.ok) throw new Error('Failed to add issue');

      await loadEvents();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (lotId) {
      loadEvents();
    }
  }, [lotId]);

  return {
    events,
    loading,
    error,
    scheduleEvent,
    addIssue,
    refresh: loadEvents,
  };
}
