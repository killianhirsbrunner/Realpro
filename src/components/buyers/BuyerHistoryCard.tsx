import { Card } from '../ui/Card';
import { Clock } from 'lucide-react';

interface BuyerHistoryCardProps {
  buyer: {
    history: Array<{
      id: string;
      date: string;
      action: string;
    }>;
  };
}

export function BuyerHistoryCard({ buyer }: BuyerHistoryCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Historique
        </h2>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {buyer.history.length} événement{buyer.history.length > 1 ? 's' : ''}
        </span>
      </div>

      {buyer.history.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Aucun historique disponible
        </p>
      ) : (
        <div className="space-y-4">
          {buyer.history.map((event, index) => (
            <div key={event.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </div>
                {index < buyer.history.length - 1 && (
                  <div className="w-px h-full bg-neutral-200 dark:bg-neutral-700 mt-2" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                  {event.date}
                </p>
                <p className="text-sm text-neutral-900 dark:text-white">
                  {event.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
