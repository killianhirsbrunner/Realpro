import { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Notifications() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const navigate = useNavigate();

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'read') return n.is_read;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'WARNING':
        return '⚠️';
      case 'DEADLINE':
        return '⏰';
      case 'PAYMENT':
        return '💰';
      case 'CHOICE_MATERIAL':
        return '🎨';
      case 'SUBMISSION':
        return '📋';
      case 'DOCUMENT':
        return '📄';
      case 'BUYER':
        return '👤';
      case 'PROJECT':
        return '🏢';
      default:
        return 'ℹ️';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'HIGH':
        return 'border-l-4 border-l-red-500';
      case 'MEDIUM':
        return 'border-l-4 border-l-amber-500';
      case 'LOW':
        return 'border-l-4 border-l-blue-500';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} notification(s) non lue(s)` : 'Toutes vos notifications sont lues'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            className="gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${filter === f
                  ? 'bg-brand-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }
              `}
            >
              {f === 'all' && 'Toutes'}
              {f === 'unread' && 'Non lues'}
              {f === 'read' && 'Lues'}
            </button>
          ))}
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-card p-12 text-center">
          <Bell className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            Aucune notification
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            {filter === 'unread' && 'Vous n\'avez aucune notification non lue.'}
            {filter === 'read' && 'Vous n\'avez aucune notification lue.'}
            {filter === 'all' && 'Vous n\'avez aucune notification pour le moment.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm
                hover:shadow-card transition-all p-5
                ${!notification.is_read ? 'bg-brand-50 dark:bg-brand-950/10' : ''}
                ${getPriorityClass(notification.priority)}
              `}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-0.5">{getTypeIcon(notification.type)}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className={`text-base ${!notification.is_read ? 'font-semibold' : 'font-medium'} text-neutral-900 dark:text-white`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                      {format(new Date(notification.created_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                    </span>
                  </div>

                  {notification.message && (
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                      {notification.message}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    {notification.link_url && (
                      <button
                        onClick={() => navigate(notification.link_url!)}
                        className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium flex items-center gap-1"
                      >
                        Voir détails
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Marquer comme lu"
                    >
                      <Check className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
