import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  thread_id: string;
  content: string;
  author_id: string;
  mentions: any[];
  attachments: any[];
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  is_read?: boolean;
}

export function useMessages(threadId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (threadId) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [threadId]);

  const fetchMessages = async () => {
    if (!threadId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select(`
          *,
          author:users (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!threadId) return;

    const subscription = supabase
      .channel(`messages:${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${threadId}`,
        },
        async (payload) => {
          const { data: author } = await supabase
            .from('users')
            .select('id, first_name, last_name, avatar_url')
            .eq('id', (payload.new as any).author_id)
            .single();

          setMessages((prev) => [
            ...prev,
            {
              ...(payload.new as any),
              author: author || {
                id: '',
                first_name: 'Unknown',
                last_name: 'User',
                avatar_url: null,
              },
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async (content: string, attachments?: File[]) => {
    if (!threadId) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          thread_id: threadId,
          content,
          author_id: user.user.id,
          mentions: [],
          attachments: [],
        })
        .select()
        .single();

      if (messageError) throw messageError;

      if (attachments && attachments.length > 0) {
        for (const file of attachments) {
          const filePath = `messages/${threadId}/${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            continue;
          }

          const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

          await supabase.from('message_attachments').insert({
            message_id: message.id,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_url: urlData.publicUrl,
            uploaded_by: user.user.id,
          });
        }
      }

      await fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  const markAsRead = async () => {
    if (!threadId) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      await supabase.rpc('mark_thread_read', {
        p_user_id: user.user.id,
        p_thread_id: threadId,
      });
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  return {
    messages,
    loading,
    error,
    refresh: fetchMessages,
    sendMessage,
    markAsRead,
  };
}
