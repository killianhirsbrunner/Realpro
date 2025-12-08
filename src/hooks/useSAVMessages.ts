import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';

export interface SAVMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: 'BUYER' | 'PROMOTER' | 'COMPANY' | 'SYSTEM';
  content: string;
  attachments?: string[];
  is_internal: boolean;
  created_at: string;
  sender?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface SAVHistory {
  id: string;
  ticket_id: string;
  action_type: 'CREATED' | 'STATUS_CHANGED' | 'ASSIGNED' | 'PRIORITY_CHANGED' | 'COMMENT_ADDED' | 'RESOLVED' | 'REOPENED';
  old_value?: string;
  new_value?: string;
  performed_by: string;
  notes?: string;
  created_at: string;
  performer?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface SAVAttachment {
  id: string;
  ticket_id: string;
  message_id?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export function useSAVMessages(ticketId?: string) {
  const { currentOrganization } = useOrganization();
  const [messages, setMessages] = useState<SAVMessage[]>([]);
  const [history, setHistory] = useState<SAVHistory[]>([]);
  const [attachments, setAttachments] = useState<SAVAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (ticketId && currentOrganization?.id) {
      fetchTicketData();
    }
  }, [ticketId, currentOrganization?.id]);

  useEffect(() => {
    if (!ticketId) return;

    const channel = supabase
      .channel(`sav-messages-${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sav_messages',
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as SAVMessage]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sav_history',
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload) => {
          setHistory((current) => [...current, payload.new as SAVHistory]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId]);

  const fetchTicketData = async () => {
    if (!ticketId) return;

    try {
      setLoading(true);
      await Promise.all([
        fetchMessages(),
        fetchHistory(),
        fetchAttachments(),
      ]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!ticketId) return;

    const { data, error: fetchError } = await supabase
      .from('sav_messages')
      .select(`
        *,
        sender:users(id, email, first_name, last_name)
      `)
      .eq('ticket_id', ticketId)
      .order('created_at');

    if (fetchError) throw fetchError;
    setMessages(data || []);
  };

  const fetchHistory = async () => {
    if (!ticketId) return;

    const { data, error: fetchError } = await supabase
      .from('sav_history')
      .select(`
        *,
        performer:users(id, email, first_name, last_name)
      `)
      .eq('ticket_id', ticketId)
      .order('created_at');

    if (fetchError) throw fetchError;
    setHistory(data || []);
  };

  const fetchAttachments = async () => {
    if (!ticketId) return;

    const { data, error: fetchError } = await supabase
      .from('sav_attachments')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('uploaded_at', { ascending: false });

    if (fetchError) throw fetchError;
    setAttachments(data || []);
  };

  const sendMessage = async (
    content: string,
    senderType: SAVMessage['sender_type'] = 'PROMOTER',
    isInternal = false,
    attachmentUrls?: string[]
  ) => {
    if (!ticketId) throw new Error('No ticket ID provided');

    const { data: currentUser } = await supabase.auth.getUser();

    const { data, error: insertError } = await supabase
      .from('sav_messages')
      .insert({
        ticket_id: ticketId,
        sender_id: currentUser.user?.id,
        sender_type: senderType,
        content,
        is_internal: isInternal,
        attachments: attachmentUrls || [],
      })
      .select(`
        *,
        sender:users(id, email, first_name, last_name)
      `)
      .single();

    if (insertError) throw insertError;

    await logHistory('COMMENT_ADDED', undefined, undefined, 'Nouveau message ajouté');

    return data;
  };

  const uploadAttachment = async (
    file: File,
    messageId?: string
  ): Promise<SAVAttachment> => {
    if (!ticketId) throw new Error('No ticket ID provided');

    const { data: currentUser } = await supabase.auth.getUser();
    const filePath = `sav/${ticketId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    const { data, error: insertError } = await supabase
      .from('sav_attachments')
      .insert({
        ticket_id: ticketId,
        message_id: messageId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: urlData.publicUrl,
        uploaded_by: currentUser.user?.id,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    setAttachments([data, ...attachments]);
    return data;
  };

  const deleteAttachment = async (attachmentId: string) => {
    const attachment = attachments.find((a) => a.id === attachmentId);
    if (!attachment) throw new Error('Attachment not found');

    const filePath = attachment.file_url.split('/').pop();
    if (filePath) {
      await supabase.storage.from('documents').remove([`sav/${ticketId}/${filePath}`]);
    }

    const { error: deleteError } = await supabase
      .from('sav_attachments')
      .delete()
      .eq('id', attachmentId);

    if (deleteError) throw deleteError;
    setAttachments(attachments.filter((a) => a.id !== attachmentId));
  };

  const logHistory = async (
    actionType: SAVHistory['action_type'],
    oldValue?: string,
    newValue?: string,
    notes?: string
  ) => {
    if (!ticketId) throw new Error('No ticket ID provided');

    const { data: currentUser } = await supabase.auth.getUser();

    const { data, error: insertError } = await supabase
      .from('sav_history')
      .insert({
        ticket_id: ticketId,
        action_type: actionType,
        old_value: oldValue,
        new_value: newValue,
        notes,
        performed_by: currentUser.user?.id,
      })
      .select(`
        *,
        performer:users(id, email, first_name, last_name)
      `)
      .single();

    if (insertError) throw insertError;
    return data;
  };

  const getMessagesByType = (senderType: SAVMessage['sender_type']) => {
    return messages.filter((m) => m.sender_type === senderType);
  };

  const getPublicMessages = () => {
    return messages.filter((m) => !m.is_internal);
  };

  const getInternalMessages = () => {
    return messages.filter((m) => m.is_internal);
  };

  const getMessageStats = () => {
    const total = messages.length;
    const byType = messages.reduce((acc, m) => {
      acc[m.sender_type] = (acc[m.sender_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const internalCount = messages.filter((m) => m.is_internal).length;
    const publicCount = total - internalCount;

    const attachmentCount = attachments.length;

    return {
      total,
      byType,
      internalCount,
      publicCount,
      attachmentCount,
    };
  };

  const getHistoryByActionType = (actionType: SAVHistory['action_type']) => {
    return history.filter((h) => h.action_type === actionType);
  };

  const getRecentHistory = (limit = 10) => {
    return history.slice(0, limit);
  };

  return {
    messages,
    history,
    attachments,
    loading,
    error,
    sendMessage,
    uploadAttachment,
    deleteAttachment,
    logHistory,
    getMessagesByType,
    getPublicMessages,
    getInternalMessages,
    getMessageStats,
    getHistoryByActionType,
    getRecentHistory,
    refetch: fetchTicketData,
  };
}
