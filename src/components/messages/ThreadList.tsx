import { Link } from 'react-router-dom';
import { MessageThread } from '../../hooks/useThreads';
import { MessageSquare, User, Package, FileText, Wrench } from 'lucide-react';
import { Card } from '../ui/Card';

interface ThreadListProps {
  threads: MessageThread[];
  currentThreadId?: string;
}

export function ThreadList({ threads, currentThreadId }: ThreadListProps) {
  const getContextIcon = (thread: MessageThread) => {
    if (thread.lot_id) return <Package className="w-4 h-4" />;
    if (thread.buyer_id) return <User className="w-4 h-4" />;
    if (thread.submission_id) return <FileText className="w-4 h-4" />;
    if (thread.sav_ticket_id) return <Wrench className="w-4 h-4" />;
    return <MessageSquare className="w-4 h-4" />;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-CH', {
      day: 'numeric',
      month: 'short',
    });
  };

  if (threads.length === 0) {
    return (
      <Card className="p-8 text-center">
        <MessageSquare className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
        <p className="text-neutral-600 mb-1">Aucune conversation</p>
        <p className="text-sm text-neutral-500">
          Commencez une nouvelle discussion
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {threads.map((thread) => {
        const isActive = thread.id === currentThreadId;

        return (
          <Link key={thread.id} to={`?thread=${thread.id}`}>
            <Card
              className={`p-4 hover:shadow-md transition cursor-pointer ${
                isActive
                  ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800'
                  : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive
                        ? 'bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-300'
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {getContextIcon(thread)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">
                      {thread.title}
                    </h3>
                    {thread.last_message && (
                      <span className="text-xs text-neutral-500 flex-shrink-0">
                        {formatTimestamp(thread.last_message.created_at)}
                      </span>
                    )}
                  </div>

                  {thread.last_message && (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                      <span className="font-medium">
                        {thread.last_message.author.first_name}
                      </span>
                      : {thread.last_message.content}
                    </div>
                  )}

                  {thread.unread_count && thread.unread_count > 0 && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-brand-600 text-white rounded-full">
                        {thread.unread_count}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
