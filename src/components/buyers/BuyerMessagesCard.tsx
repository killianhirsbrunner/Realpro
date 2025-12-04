import { Card } from '../ui/Card';
import { MessageSquare, Send } from 'lucide-react';

interface BuyerMessagesCardProps {
  buyer: {
    messages: Array<{
      id: string;
      author: string;
      content: string;
      created_at: string;
    }>;
  };
}

export function BuyerMessagesCard({ buyer }: BuyerMessagesCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Messages
          </h2>
        </div>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {buyer.messages.length} message{buyer.messages.length > 1 ? 's' : ''}
        </span>
      </div>

      {buyer.messages.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Aucun message
        </p>
      ) : (
        <div className="space-y-4">
          {buyer.messages.map((msg) => (
            <div
              key={msg.id}
              className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {msg.author}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {new Date(msg.created_at).toLocaleDateString('fr-CH')}
                </span>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {msg.content}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Send className="h-4 w-4" />
          Nouveau message
        </button>
      </div>
    </Card>
  );
}
