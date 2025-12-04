import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../ui/Card';
import { UserCircle, Mail, Phone, Building2 } from 'lucide-react';

interface Buyer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  lotNumber?: string;
  lotType?: string;
}

interface BuyerPipelineProps {
  buyers: Buyer[];
}

export function BuyerPipeline({ buyers }: BuyerPipelineProps) {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const stages = [
    { id: 'PROSPECT', label: 'Prospects', color: 'bg-blue-100 dark:bg-blue-900' },
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
                  <Card
                    key={buyer.id}
                    onClick={() => navigate(`/projects/${projectId}/buyers/${buyer.id}`)}
                    className="p-4 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary-600"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                          <UserCircle className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                            {buyer.name}
                          </h4>
                          {buyer.lotNumber && (
                            <div className="flex items-center gap-1 mt-1">
                              <Building2 className="h-3 w-3 text-neutral-400" />
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                Lot {buyer.lotNumber}
                                {buyer.lotType && ` • ${buyer.lotType}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {(buyer.email || buyer.phone) && (
                        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700 space-y-1">
                          {buyer.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-neutral-400" />
                              <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                                {buyer.email}
                              </span>
                            </div>
                          )}
                          {buyer.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-neutral-400" />
                              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                                {buyer.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
