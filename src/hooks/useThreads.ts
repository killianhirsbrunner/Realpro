import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface MessageThread {
  id: string;
  project_id: string;
  title: string;
  context_type: string | null;
  context_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  priority: string;
  organization_id: string;
  lot_id: string | null;
  buyer_id: string | null;
  submission_id: string | null;
  sav_ticket_id: string | null;
  unread_count?: number;
  last_message?: {
    content: string;
    created_at: string;
    author: {
      first_name: string;
      last_name: string;
    };
  };
}

export function useThreads(projectId: string, context?: { type: string; id: string }) {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchThreads();
  }, [projectId, context]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('message_threads')
        .select(`
          *,
          messages (
            content,
            created_at,
            author:users (
              first_name,
              last_name
            )
          )
        `)
        .eq('project_id', projectId)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false });

      if (context) {
        if (context.type === 'lot') {
          query = query.eq('lot_id', context.id);
        } else if (context.type === 'buyer') {
          query = query.eq('buyer_id', context.id);
        } else if (context.type === 'submission') {
          query = query.eq('submission_id', context.id);
        } else if (context.type === 'sav') {
          query = query.eq('sav_ticket_id', context.id);
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const threadsWithMeta = (data || []).map((thread: any) => {
        const lastMessage = thread.messages?.[thread.messages.length - 1];
        return {
          ...thread,
          last_message: lastMessage || null,
          messages: undefined,
        };
      });

      setThreads(threadsWithMeta);
    } catch (err) {
      console.error('Error fetching threads:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createThread = async (thread: {
    title: string;
    context_type?: string;
    context_id?: string;
    lot_id?: string;
    buyer_id?: string;
    submission_id?: string;
  }) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.user.id)
        .single();

      if (!userOrg) throw new Error('No organization found');

      const { data, error: createError } = await supabase
        .from('message_threads')
        .insert({
          project_id: projectId,
          organization_id: userOrg.organization_id,
          created_by: user.user.id,
          ...thread,
        })
        .select()
        .single();

      if (createError) throw createError;

      await supabase.from('thread_participants').insert({
        thread_id: data.id,
        user_id: user.user.id,
        role: 'OWNER',
      });

      await fetchThreads();
      return data;
    } catch (err) {
      console.error('Error creating thread:', err);
      throw err;
    }
  };

  const archiveThread = async (threadId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('message_threads')
        .update({ is_archived: true })
        .eq('id', threadId);

      if (updateError) throw updateError;

      await fetchThreads();
    } catch (err) {
      console.error('Error archiving thread:', err);
      throw err;
    }
  };

  return {
    threads,
    loading,
    error,
    refresh: fetchThreads,
    createThread,
    archiveThread,
  };
}
