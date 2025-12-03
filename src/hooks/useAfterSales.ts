import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type SavStatus =
  | 'NEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'FIXED'
  | 'VALIDATED'
  | 'CLOSED'
  | 'REJECTED'
  | 'EXPIRED';

export type SavSeverity = 'MINOR' | 'MAJOR' | 'CRITICAL' | 'BLOCKING';

export interface SavTicket {
  id: string;
  organization_id: string;
  project_id: string;
  lot_id: string;
  buyer_id?: string;
  title: string;
  description: string;
  location?: string;
  severity: SavSeverity;
  status: SavStatus;
  reported_by_id?: string;
  assigned_to_company_id?: string;
  assigned_to_user_id?: string;
  due_date?: string;
  fixed_at?: string;
  validated_at?: string;
  closed_at?: string;
  category?: string;
  warranty_type?: string;
  warranty_end_date?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
  project?: any;
  lot?: any;
  buyer?: any;
  assigned_company?: any;
  reported_by?: any;
  messages?: SavMessage[];
  attachments?: SavAttachment[];
}

export interface SavMessage {
  id: string;
  ticket_id: string;
  author_id: string;
  body: string;
  is_internal: boolean;
  created_at: string;
  author?: any;
  attachments?: SavAttachment[];
}

export interface SavAttachment {
  id: string;
  ticket_id?: string;
  message_id?: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  created_at: string;
}

export interface SavHistory {
  id: string;
  ticket_id: string;
  action: string;
  details?: string;
  old_value?: string;
  new_value?: string;
  created_by_id?: string;
  created_at: string;
  created_by?: any;
}

export interface SavStatistics {
  total_tickets: number;
  new_tickets: number;
  in_progress: number;
  fixed_tickets: number;
  closed_tickets: number;
  critical_tickets: number;
  avg_resolution_days: number;
}

export function useAfterSales() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const listTickets = useCallback(async (filters: {
    projectId?: string;
    status?: SavStatus;
    lotId?: string;
    buyerId?: string;
  }): Promise<SavTicket[]> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const params = new URLSearchParams();

      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.status) params.append('status', filters.status);
      if (filters.lotId) params.append('lotId', filters.lotId);
      if (filters.buyerId) params.append('buyerId', filters.buyerId);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sav/tickets?${params}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createTicket = useCallback(async (params: {
    projectId: string;
    lotId: string;
    buyerId?: string;
    title: string;
    description: string;
    location?: string;
    severity?: SavSeverity;
    category?: string;
    warrantyType?: string;
    warrantyEndDate?: string;
    dueDate?: string;
  }): Promise<SavTicket | null> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sav/tickets`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(params),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTicket = useCallback(async (ticketId: string): Promise<SavTicket | null> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sav/tickets/${ticketId}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch ticket');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTicket = useCallback(async (
    ticketId: string,
    updates: {
      title?: string;
      description?: string;
      location?: string;
      severity?: SavSeverity;
      status?: SavStatus;
      category?: string;
      warrantyEndDate?: string;
      dueDate?: string;
      internalNotes?: string;
    }
  ): Promise<SavTicket | null> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sav/tickets/${ticketId}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update ticket');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const assignTicket = useCallback(async (
    ticketId: string,
    companyId: string,
    userId?: string
  ): Promise<SavTicket | null> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sav/tickets/${ticketId}/assign`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ companyId, userId }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to assign ticket');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (
    ticketId: string,
    status: SavStatus,
    note?: string
  ): Promise<SavTicket | null> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sav/tickets/${ticketId}/status`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ status, note }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addMessage = useCallback(async (
    ticketId: string,
    body: string,
    isInternal?: boolean
  ): Promise<SavMessage | null> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sav/tickets/${ticketId}/messages`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ body, isInternal }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add message');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMessages = useCallback(async (ticketId: string): Promise<SavMessage[]> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sav/tickets/${ticketId}/messages`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getHistory = useCallback(async (ticketId: string): Promise<SavHistory[]> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sav/tickets/${ticketId}/history`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatistics = useCallback(async (projectId: string): Promise<SavStatistics | null> => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sav/projects/${projectId}/statistics`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      return data[0] || null;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    listTickets,
    createTicket,
    getTicket,
    updateTicket,
    assignTicket,
    updateStatus,
    addMessage,
    getMessages,
    getHistory,
    getStatistics,
  };
}
