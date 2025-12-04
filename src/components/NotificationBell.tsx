import { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

type Notification = {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  linkUrl?: string | null;
  projectId?: string | null;
  readAt?: string | null;
  createdAt: string;
};

type NotifResponse = {
  unreadCount: number;
  notifications: Notification[];
};

export function NotificationBell() {
  const [data, setData] = useState<NotifResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = '20000000-0000-0000-0000-000000000001';

  const load = async () => {
    try {
      setLoading(true);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/notifications`;

      const response = await fetch(`${apiUrl}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Erreur lors du chargement');

      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleMarkAsRead = async (notificationIds: string[]) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/notifications`;

      const response = await fetch(`${apiUrl}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, notificationIds }),
      });

      if (!response.ok) throw new Error('Erreur');

      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/notifications`;

      const response = await fetch(`${apiUrl}/read-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Erreur');

      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const unread = data?.unreadCount ?? 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 min-w-[1.25rem] h-5 rounded-full bg-red-600 px-1.5 flex items-center justify-center text-[11px] font-semibold text-white">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-96 max-h-[32rem] rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Notifications
                </h3>
                {unread > 0 && (
                  <Badge variant="warning" className="text-xs">
                    {unread} non lue{unread > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unread > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Tout marquer comme lu"
                  >
                    <CheckCheck className="w-4 h-4 text-gray-600" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[28rem]">
              {loading ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  Chargement...
                </div>
              ) : !data || data.notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    Aucune notification
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {data.notifications.map((notif) => (
                    <NotificationItem
                      key={notif.id}
                      notification={notif}
                      onMarkAsRead={() => handleMarkAsRead([notif.id])}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: {
  notification: Notification;
  onMarkAsRead: () => void;
}) {
  const isUnread = !notification.readAt;

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
      default:
        return 'ℹ️';
    }
  };

  return (
    <div
      className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
        isUnread ? 'bg-brand-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">{getTypeIcon(notification.type)}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${isUnread ? 'font-semibold' : 'font-medium'} text-gray-900`}>
            {notification.title}
          </p>
          {notification.body && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {notification.body}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(notification.createdAt)}
          </p>
        </div>
        {isUnread && (
          <button
            type="button"
            onClick={onMarkAsRead}
            className="p-1 rounded-lg hover:bg-white transition-colors"
            title="Marquer comme lu"
          >
            <Check className="w-4 h-4 text-brand-600" />
          </button>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;

  return date.toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
