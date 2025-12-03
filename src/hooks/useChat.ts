import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface MessageThread {
  id: string;
  organization_id: string;
  context_type: 'PROJECT' | 'LOT' | 'BUYER' | 'SUBMISSION' | 'SAV' | 'GENERIC';
  project_id?: string;
  lot_id?: string;
  buyer_id?: string;
  submission_id?: string;
  sav_ticket_id?: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  thread_id: string;
  author_id: string;
  body: string;
  body_lang: string;
  created_at: string;
  author?: {
    id: string;
    email: string;
  };
}

interface CreateThreadParams {
  contextType: 'PROJECT' | 'LOT' | 'BUYER' | 'SUBMISSION' | 'SAV' | 'GENERIC';
  projectId?: string;
  lotId?: string;
  buyerId?: string;
  submissionId?: string;
  savTicketId?: string;
  title?: string;
}

export function useChat(threadId?: string) {
  const [thread, setThread] = useState<MessageThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/messages`;

  const fetchThread = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${apiUrl}/threads/${id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch thread: ${response.status}`);
      }

      const data = await response.json();
      setThread(data.thread);
      setMessages(data.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const fetchThreads = async (filters?: {
    contextType?: string;
    projectId?: string;
    lotId?: string;
    buyerId?: string;
  }): Promise<MessageThread[]> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const params = new URLSearchParams();
      if (filters?.contextType) params.append('contextType', filters.contextType);
      if (filters?.projectId) params.append('projectId', filters.projectId);
      if (filters?.lotId) params.append('lotId', filters.lotId);
      if (filters?.buyerId) params.append('buyerId', filters.buyerId);

      const response = await fetch(`${apiUrl}/threads?${params}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch threads: ${response.status}`);
      }

      const data = await response.json();
      return data.threads;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    }
  };

  const createThread = async (params: CreateThreadParams): Promise<MessageThread | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${apiUrl}/threads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.status}`);
      }

      const newThread = await response.json();
      setThread(newThread);
      return newThread;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (body: string, bodyLang?: string): Promise<Message | null> => {
    if (!thread) {
      setError('No active thread');
      return null;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${apiUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId: thread.id,
          body,
          bodyLang,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const newMessage = await response.json();
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const translateMessage = async (text: string, fromLang: string, toLang: string): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${apiUrl}/translate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, fromLang, toLang }),
      });

      if (!response.ok) {
        throw new Error(`Failed to translate: ${response.status}`);
      }

      const data = await response.json();
      return data.translatedText;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  useEffect(() => {
    if (threadId) {
      fetchThread(threadId);

      const channel = supabase
        .channel(`thread-${threadId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `thread_id=eq.${threadId}`,
          },
          (payload) => {
            setMessages(prev => {
              if (prev.some(m => m.id === payload.new.id)) {
                return prev;
              }
              return [...prev, payload.new as Message];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [threadId, fetchThread]);

  return {
    thread,
    messages,
    loading,
    error,
    createThread,
    fetchThread,
    fetchThreads,
    sendMessage,
    translateMessage,
  };
}
