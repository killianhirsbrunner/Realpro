import { Message } from '../../hooks/useMessages';
import { User, FileText, Image as ImageIcon } from 'lucide-react';

interface MessageItemProps {
  message: Message;
  showAvatar?: boolean;
  onReply?: (messageId: string) => void;
}

export function MessageItem({ message, showAvatar = true, onReply }: MessageItemProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('fr-CH', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return date.toLocaleDateString('fr-CH', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex gap-3 group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg p-3 -mx-3 transition">
      {showAvatar ? (
        <div className="flex-shrink-0">
          {message.author.avatar_url ? (
            <img
              src={message.author.avatar_url}
              alt={`${message.author.first_name} ${message.author.last_name}`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
              <User className="w-5 h-5 text-brand-600 dark:text-brand-300" />
            </div>
          )}
        </div>
      ) : (
        <div className="w-10 flex-shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        {showAvatar && (
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">
              {message.author.first_name} {message.author.last_name}
            </span>
            <span className="text-xs text-neutral-500">
              {formatTime(message.created_at)}
            </span>
          </div>
        )}

        <div className="text-sm text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((attachment: any, index: number) => (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
              >
                {attachment.type?.startsWith('image/') ? (
                  <ImageIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                ) : (
                  <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                )}
                <span className="text-xs text-neutral-700 dark:text-neutral-300">
                  {attachment.name}
                </span>
              </a>
            ))}
          </div>
        )}

        {message.mentions && message.mentions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {message.mentions.map((mention: any, index: number) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded"
              >
                @{mention.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
