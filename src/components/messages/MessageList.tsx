import { useEffect, useRef } from 'react';
import { Message } from '../../hooks/useMessages';
import { MessageItem } from './MessageItem';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  onReply?: (messageId: string) => void;
}

export function MessageList({ messages, loading, onReply }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
        <p>Aucun message pour le moment</p>
        <p className="text-sm mt-2">Soyez le premier à écrire un message</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 overflow-y-auto max-h-[calc(100vh-300px)] px-4 py-4">
      {messages.map((message, index) => {
        const showAvatar =
          index === 0 || messages[index - 1].author_id !== message.author_id;

        return (
          <MessageItem
            key={message.id}
            message={message}
            showAvatar={showAvatar}
            onReply={onReply}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
