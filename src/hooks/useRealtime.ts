import { useEffect, useState } from 'react';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface RealtimeSubscription {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  callback: (payload: RealtimePostgresChangesPayload<any>) => void;
}

// Hook for real-time notifications
export function useRealtimeNotifications(userId: string | null) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    let channel: RealtimeChannel;

    const setupRealtime = async () => {
      // Subscribe to notifications for this user
      channel = supabase
        .channel(`notifications:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const notification = payload.new;

            // Show toast notification
            toast(notification.title, {
              description: notification.message,
              duration: 5000,
              action: notification.action_url ? {
                label: 'Voir',
                onClick: () => window.location.href = notification.action_url,
              } : undefined,
            });

            // Update unread count
            setUnreadCount(prev => prev + 1);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const notification = payload.new;

            // If marked as read, decrease unread count
            if (notification.read_at) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            }
          }
        )
        .subscribe();

      // Get initial unread count
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .is('read_at', null);

      setUnreadCount(count || 0);
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId]);

  return { unreadCount };
}

// Hook for real-time workflow updates
export function useRealtimeWorkflow(workflowInstanceId: string | null) {
  const [workflowStatus, setWorkflowStatus] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  useEffect(() => {
    if (!workflowInstanceId) return;

    let channel: RealtimeChannel;

    const setupRealtime = async () => {
      // Subscribe to workflow instance updates
      channel = supabase
        .channel(`workflow:${workflowInstanceId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'workflow_instances',
            filter: `id=eq.${workflowInstanceId}`,
          },
          (payload) => {
            const instance = payload.new;
            setWorkflowStatus(instance.status);
            setCurrentStep(instance.current_step_key);

            // Show toast for workflow status changes
            if (instance.status === 'completed') {
              toast.success('Workflow terminé', {
                description: 'Le workflow a été complété avec succès',
              });
            } else if (instance.status === 'cancelled') {
              toast.error('Workflow annulé', {
                description: 'Le workflow a été annulé',
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'workflow_steps',
            filter: `workflow_instance_id=eq.${workflowInstanceId}`,
          },
          (payload) => {
            const step = payload.new;

            if (step.status === 'completed') {
              toast.success(`Étape terminée: ${step.step_name}`);
            } else if (step.status === 'failed') {
              toast.error(`Étape échouée: ${step.step_name}`);
            }
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [workflowInstanceId]);

  return { workflowStatus, currentStep };
}

// Hook for real-time project updates
export function useRealtimeProject(projectId: string | null) {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (!projectId) return;

    let channel: RealtimeChannel;

    const setupRealtime = async () => {
      channel = supabase
        .channel(`project:${projectId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'lots',
            filter: `project_id=eq.${projectId}`,
          },
          (payload) => {
            setLastUpdate(new Date());

            if (payload.eventType === 'INSERT') {
              toast.success('Nouveau lot ajouté');
            } else if (payload.eventType === 'UPDATE') {
              const lot = payload.new;
              if (lot.status === 'sold') {
                toast.success(`Lot ${lot.reference} vendu !`);
              }
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'buyers',
            filter: `project_id=eq.${projectId}`,
          },
          () => {
            setLastUpdate(new Date());
            toast.success('Nouvel acheteur ajouté');
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'submissions',
            filter: `project_id=eq.${projectId}`,
          },
          () => {
            setLastUpdate(new Date());
            toast.info('Nouvelle soumission reçue');
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [projectId]);

  return { lastUpdate };
}

// Hook for real-time messages
export function useRealtimeMessages(threadId: string | null) {
  const [newMessageCount, setNewMessageCount] = useState(0);

  useEffect(() => {
    if (!threadId) return;

    let channel: RealtimeChannel;

    const setupRealtime = async () => {
      channel = supabase
        .channel(`messages:${threadId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `thread_id=eq.${threadId}`,
          },
          (payload) => {
            const message = payload.new;
            setNewMessageCount(prev => prev + 1);

            // Don't show toast for own messages
            const userId = supabase.auth.getUser().then(({ data }) => data.user?.id);
            if (message.sender_id !== userId) {
              toast.info('Nouveau message', {
                description: message.content.substring(0, 100),
              });
            }
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [threadId]);

  const resetCount = () => setNewMessageCount(0);

  return { newMessageCount, resetCount };
}

// Hook for presence (who's online)
export function useRealtimePresence(channelName: string) {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupPresence = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase.channel(channelName);

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const users = Object.values(state).flat();
          setOnlineUsers(users);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              user_id: user.id,
              online_at: new Date().toISOString(),
            });
          }
        });
    };

    setupPresence();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [channelName]);

  return { onlineUsers };
}

// Generic hook for custom real-time subscriptions
export function useRealtimeSubscription(subscription: RealtimeSubscription) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupRealtime = async () => {
      const config: any = {
        event: subscription.event,
        schema: 'public',
        table: subscription.table,
      };

      if (subscription.filter) {
        config.filter = subscription.filter;
      }

      channel = supabase
        .channel(`custom:${subscription.table}:${Date.now()}`)
        .on('postgres_changes', config, (payload) => {
          subscription.callback(payload);

          // Update local data based on event type
          if (payload.eventType === 'INSERT') {
            setData(prev => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setData(prev =>
              prev.map(item => item.id === payload.new.id ? payload.new : item)
            );
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter(item => item.id !== payload.old.id));
          }
        })
        .subscribe();

      setLoading(false);
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [subscription.table, subscription.event, subscription.filter]);

  return { data, loading };
}

// Utility: Send broadcast message to channel
export async function broadcastToChannel(channelName: string, event: string, payload: any) {
  const channel = supabase.channel(channelName);

  await channel.subscribe();
  await channel.send({
    type: 'broadcast',
    event,
    payload,
  });

  return channel;
}

// Utility: Check if realtime is connected
export function useRealtimeStatus() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const channel = supabase.channel('realtime-status');

    channel.subscribe((status) => {
      setIsConnected(status === 'SUBSCRIBED');
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { isConnected };
}
