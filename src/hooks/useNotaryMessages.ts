import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface NotaryMessage {
  id: string;
  buyer_id: string;
  dossier_id: string;
  sender_id: string;
  content: string;
  attachments: any[];
  read_at?: string;
  created_at: string;
  sender?: any;
}

export function useNotaryMessages(dossierId: string) {
  const [messages, setMessages] = useState<NotaryMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (dossierId) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [dossierId]);

  async function fetchMessages() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notary_messages')
        .select(`
          *,
          sender:users(*)
        `)
        .eq('dossier_id', dossierId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  function subscribeToMessages() {
    const channel = supabase
      .channel(`notary_messages:${dossierId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notary_messages',
          filter: `dossier_id=eq.${dossierId}`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  async function sendMessage(buyerId: string, content: string, attachments: any[] = []) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('notary_messages')
        .insert({
          buyer_id: buyerId,
          dossier_id: dossierId,
          sender_id: user.id,
          content,
          attachments
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  }

  async function markAsRead(messageId: string) {
    try {
      const { error } = await supabase
        .from('notary_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) throw error;
      await fetchMessages();
    } catch (err) {
      throw err;
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    refresh: fetchMessages
  };
}
