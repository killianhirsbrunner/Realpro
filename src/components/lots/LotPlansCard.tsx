import { Card } from '../ui/Card';
import { File, ExternalLink } from 'lucide-react';

interface LotPlansCardProps {
  lot: {
    plans?: Array<{
      id: string;
      name: string;
      url?: string;
    }>;
  };
}

export function LotPlansCard({ lot }: LotPlansCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Plans PDF
        </h2>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {lot.plans?.length || 0} plan{(lot.plans?.length || 0) > 1 ? 's' : ''}
        </span>
      </div>

      {!lot.plans || lot.plans.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Aucun plan disponible
        </p>
      ) : (
        <div className="space-y-3">
          {lot.plans.map((plan) => (
            <a
              key={plan.id}
              href={plan.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <File className="h-5 w-5 text-primary-600 flex-shrink-0" />
                <span className="text-sm text-neutral-900 dark:text-white truncate">
                  {plan.name}
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 transition-colors ml-2 flex-shrink-0" />
            </a>
          ))}
        </div>
      )}
    </Card>
  );
}
