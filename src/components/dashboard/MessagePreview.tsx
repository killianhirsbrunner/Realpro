import { MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_name?: string;
  sender_role?: string;
  thread_title?: string;
  unread?: boolean;
}

interface MessagePreviewProps {
  message: Message;
  projectId?: string;
}

export function MessagePreview({ message, projectId }: MessagePreviewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Il y a quelques minutes';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';

    return new Intl.DateTimeFormat('fr-CH', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  const truncateContent = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role?: string) => {
    if (!role) return 'from-neutral-400 to-neutral-500';
    const roleMap: Record<string, string> = {
      admin: 'from-red-500 to-red-600',
      promoteur: 'from-blue-500 to-blue-600',
      architect: 'from-purple-500 to-purple-600',
      eg: 'from-green-500 to-green-600',
      courtier: 'from-orange-500 to-orange-600',
      acheteur: 'from-pink-500 to-pink-600',
    };
    return roleMap[role.toLowerCase()] || 'from-neutral-400 to-neutral-500';
  };

  return (
    <Link
      to={projectId ? `/projects/${projectId}/messages` : '/messages'}
      className="group block p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor(message.sender_role)} flex items-center justify-center text-white text-sm font-semibold`}>
          {getInitials(message.sender_name)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium text-neutral-900 dark:text-white truncate">
                {message.sender_name || 'Utilisateur'}
              </span>
              {message.sender_role && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex-shrink-0">
                  {message.sender_role}
                </span>
              )}
            </div>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 flex-shrink-0">
              {formatDate(message.created_at)}
            </span>
          </div>

          {message.thread_title && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {message.thread_title}
            </p>
          )}

          <p className={`text-sm ${message.unread ? 'font-medium text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400'} line-clamp-2`}>
            {truncateContent(message.content)}
          </p>

          {message.unread && (
            <div className="mt-2">
              <span className="inline-flex items-center text-xs font-medium text-primary-600 dark:text-primary-400">
                Non lu
                <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400"></span>
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
