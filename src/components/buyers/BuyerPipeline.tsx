import { useParams } from 'react-router-dom';
import { Card } from '../ui/Card';
import { BuyerCard } from './BuyerCard';

interface Buyer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  status: string;
  lot_number?: string;
  lot_type?: string;
}

interface BuyerPipelineProps {
  buyers: Buyer[];
}

export function BuyerPipeline({ buyers }: BuyerPipelineProps) {
  const { projectId } = useParams<{ projectId: string }>();

  const stages = [
    { id: 'PROSPECT', label: 'Prospects', color: 'bg-brand-100 dark:bg-brand-900' },
    { id: 'RESERVED', label: 'Réservés', color: 'bg-orange-100 dark:bg-orange-900' },
    { id: 'IN_PROGRESS', label: 'En cours', color: 'bg-purple-100 dark:bg-purple-900' },
    { id: 'SIGNED', label: 'Signés', color: 'bg-green-100 dark:bg-green-900' },
  ];

  const groupedBuyers = buyers.reduce((acc, buyer) => {
    if (!acc[buyer.status]) {
      acc[buyer.status] = [];
    }
    acc[buyer.status].push(buyer);
    return acc;
  }, {} as Record<string, Buyer[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stages.map((stage) => {
        const stageBuyers = groupedBuyers[stage.id] || [];

        return (
          <div key={stage.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                {stage.label}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                {stageBuyers.length}
              </span>
            </div>

            <div className="space-y-3">
              {stageBuyers.length === 0 ? (
                <Card className="p-4">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                    Aucun acheteur
                  </p>
                </Card>
              ) : (
                stageBuyers.map((buyer) => (
                  <BuyerCard
                    key={buyer.id}
                    buyer={buyer}
                    projectId={projectId || ''}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
