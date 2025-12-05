import { useState, useEffect } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useNotifications } from '../hooks/useNotifications';
import { supabase } from '../lib/supabase';
import { ModernCard } from '../components/ui/ModernCard';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Archive,
  FileText,
  Users,
  DollarSign,
  Home,
  Calendar
} from 'lucide-react';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

type NotificationFilter = 'all' | 'unread' | 'important';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  important?: boolean;
  link_url?: string;
  created_at: string;
  metadata?: any;
}

export function Notifications() {
  const { user } = useCurrentUser();
  const { notifications: hookNotifications, unreadCount: hookUnreadCount, loading: hookLoading, markAsRead: hookMarkAsRead, markAllAsRead: hookMarkAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (hookNotifications) {
      setNotifications(hookNotifications as any);
      setLoading(hookLoading);
    }
  }, [hookNotifications, hookLoading]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'important') return n.important;
    return true;
  });

  const markAsRead = async (id: string) => {
    await hookMarkAsRead(id);
  };

  const markAllAsRead = async () => {
    await hookMarkAllAsRead();
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (!error) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .in('id', selectedIds);

      if (!error) {
        setNotifications(prev => prev.filter(n => !selectedIds.includes(n.id)));
        setSelectedIds([]);
      }
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'error':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'warning':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      default:
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    }
  };

  const unreadCount = filteredNotifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-realpro-turquoise to-blue-500 shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Tout marquer lu
            </Button>
          )}
          {selectedIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={deleteSelected}
              className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <div className="flex gap-2">
          {(['all', 'unread', 'important'] as NotificationFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === f
                  ? 'bg-realpro-turquoise text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {f === 'all' && 'Toutes'}
              {f === 'unread' && 'Non lues'}
              {f === 'important' && 'Importantes'}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <ModernCard padding="lg">
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Aucune notification
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'unread'
                ? 'Vous avez tout lu !'
                : filter === 'important'
                ? 'Aucune notification importante'
                : 'Vous êtes à jour'}
            </p>
          </div>
        </ModernCard>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => {
            const isSelected = selectedIds.includes(notification.id);

            return (
              <div
                key={notification.id}
                className={clsx(
                  'group relative overflow-hidden rounded-xl border transition-all duration-200',
                  notification.is_read
                    ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                    : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900',
                  'hover:shadow-md hover:border-realpro-turquoise',
                  isSelected && 'ring-2 ring-realpro-turquoise'
                )}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds([...selectedIds, notification.id]);
                        } else {
                          setSelectedIds(selectedIds.filter(id => id !== notification.id));
                        }
                      }}
                      className="mt-1 w-4 h-4 text-realpro-turquoise rounded focus:ring-realpro-turquoise"
                    />

                    {/* Icon */}
                    <div className={clsx(
                      'flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0',
                      getNotificationColor(notification.type)
                    )}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-2">
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-realpro-turquoise hover:underline flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Marquer comme lu
                          </button>
                        )}

                        {notification.link_url && (
                          <Link
                            to={notification.link_url}
                            className="text-xs text-realpro-turquoise hover:underline flex items-center gap-1"
                          >
                            Voir plus
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}

                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="ml-auto text-xs text-red-600 hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unread indicator */}
                {!notification.is_read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-realpro-turquoise" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
