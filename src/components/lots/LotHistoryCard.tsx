import { Card } from '../ui/Card';
import { Clock } from 'lucide-react';

interface LotHistoryCardProps {
  lot: {
    history?: Array<{
      id: string;
      date: string;
      action: string;
    }>;
  };
}

export function LotHistoryCard({ lot }: LotHistoryCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Historique
        </h2>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {lot.history?.length || 0} événement{(lot.history?.length || 0) > 1 ? 's' : ''}
        </span>
      </div>

      {!lot.history || lot.history.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Aucun historique disponible
        </p>
      ) : (
        <div className="space-y-4">
          {lot.history.map((event) => (
            <div key={event.id} className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <Clock className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="flex-1">
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
