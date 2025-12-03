import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface OfflineAction {
  id?: string;
  user_id: string;
  action_type: string;
  entity_type: string;
  payload: any;
  created_at?: string;
  synced_at?: string;
  error_message?: string;
}

const QUEUE_KEY = 'offline_queue';

export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queue, setQueue] = useState<OfflineAction[]>([]);
  const [syncing, setSyncing] = useState(false);

  const loadQueue = useCallback(() => {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      if (stored) {
        setQueue(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }, []);

  const saveQueue = useCallback((newQueue: OfflineAction[]) => {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
      setQueue(newQueue);
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }, []);

  const addToQueue = useCallback(async (action: Omit<OfflineAction, 'id' | 'user_id' | 'created_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const newAction: OfflineAction = {
      user_id: user.id,
      action_type: action.action_type,
      entity_type: action.entity_type,
      payload: action.payload,
      created_at: new Date().toISOString(),
    };

    const newQueue = [...queue, newAction];
    saveQueue(newQueue);

    if (isOnline) {
      syncQueue();
    }
  }, [queue, isOnline, saveQueue]);

  const syncQueue = useCallback(async () => {
    if (!isOnline || queue.length === 0 || syncing) {
      return;
    }

    setSyncing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: userOrgs } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1);

      if (!userOrgs || userOrgs.length === 0) {
        throw new Error('No organization found');
      }

      const successfulActions: number[] = [];
      const failedActions: Array<{ index: number; error: string }> = [];

      for (let i = 0; i < queue.length; i++) {
        const action = queue[i];

        try {
          const { error } = await supabase
            .from('offline_actions')
            .insert({
              organization_id: userOrgs[0].organization_id,
              user_id: action.user_id,
              action_type: action.action_type,
              entity_type: action.entity_type,
              payload: action.payload,
              synced_at: new Date().toISOString(),
            });

          if (error) throw error;

          switch (action.entity_type) {
            case 'sav_ticket': {
              if (action.action_type === 'CREATE') {
                await supabase
                  .from('sav_tickets')
                  .insert(action.payload);
              }
              break;
            }
            case 'site_diary_entry': {
              if (action.action_type === 'CREATE') {
                await supabase
                  .from('site_diary_entries')
                  .insert(action.payload);
              }
              break;
            }
            case 'message': {
              if (action.action_type === 'CREATE') {
                await supabase
                  .from('messages')
                  .insert(action.payload);
              }
              break;
            }
            default:
              console.warn(`Unknown entity type: ${action.entity_type}`);
          }

          successfulActions.push(i);
        } catch (error) {
          console.error(`Failed to sync action ${i}:`, error);
          failedActions.push({
            index: i,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      const remainingQueue = queue.filter((_, index) => !successfulActions.includes(index));
      saveQueue(remainingQueue);

      if (failedActions.length > 0) {
        console.warn(`${failedActions.length} actions failed to sync`, failedActions);
      }
    } catch (error) {
      console.error('Failed to sync queue:', error);
    } finally {
      setSyncing(false);
    }
  }, [isOnline, queue, syncing, saveQueue]);

  const clearQueue = useCallback(() => {
    localStorage.removeItem(QUEUE_KEY);
    setQueue([]);
  }, []);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncQueue]);

  return {
    isOnline,
    queue,
    queueLength: queue.length,
    syncing,
    addToQueue,
    syncQueue,
    clearQueue,
  };
}
