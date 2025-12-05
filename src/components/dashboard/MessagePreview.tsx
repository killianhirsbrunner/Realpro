import { MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
      promoteur: 'from-brand-500 to-brand-600',
      architect: 'from-brand-500 to-brand-600',
      eg: 'from-green-500 to-green-600',
      courtier: 'from-brand-500 to-brand-600',
      acheteur: 'from-pink-500 to-pink-600',
    };
    return roleMap[role.toLowerCase()] || 'from-neutral-400 to-neutral-500';
  };

  return (
    <Link
      to={projectId ? `/projects/${projectId}/messages` : '/messages'}
      className="block"
    >
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        className="group relative p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-brand-500/0 group-hover:from-primary-500/5 group-hover:to-brand-500/5 transition-all duration-500" />

        {message.unread && (
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-brand-500 rounded-l-xl" />
        )}

        <div className="relative flex items-start gap-3 pl-2">
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.3 }}
            className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor(message.sender_role)} flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white dark:ring-neutral-900`}
          >
            {getInitials(message.sender_name)}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`font-semibold truncate ${message.unread ? 'text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>
                  {message.sender_name || 'Utilisateur'}
                </span>
                {message.sender_role && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium flex-shrink-0">
                    {message.sender_role}
                  </span>
                )}
              </div>
              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium flex-shrink-0">
                {formatDate(message.created_at)}
              </span>
            </div>

            {message.thread_title && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1.5 flex items-center gap-1.5 font-medium">
                <MessageSquare className="w-3 h-3" />
                {message.thread_title}
              </p>
            )}

            <p className={`text-sm ${message.unread ? 'font-medium text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400'} line-clamp-2 leading-relaxed`}>
              {truncateContent(message.content)}
            </p>

            {message.unread && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-2"
              >
                <span className="inline-flex items-center text-xs font-semibold text-primary-600 dark:text-primary-400 gap-1.5">
                  Non lu
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400"
                  />
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
