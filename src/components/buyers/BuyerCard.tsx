import { useState } from 'react';
import { Card } from '../ui/Card';
import { UserCircle, Mail, Phone, Building2 } from 'lucide-react';
import { BuyerPreviewPanel } from './BuyerPreviewPanel';

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

interface BuyerCardProps {
  buyer: Buyer;
  projectId: string;
}

export function BuyerCard({ buyer, projectId }: BuyerCardProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <Card
        onClick={() => setIsPanelOpen(true)}
        className="p-4 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary-600"
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
              <UserCircle className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                {buyer.first_name} {buyer.last_name}
              </h4>
              {buyer.lot_number && (
                <div className="flex items-center gap-1 mt-1">
                  <Building2 className="h-3 w-3 text-neutral-400" />
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Lot {buyer.lot_number}
                    {buyer.lot_type && ` • ${buyer.lot_type}`}
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

      {isPanelOpen && (
        <BuyerPreviewPanel
          buyer={buyer}
          projectId={projectId}
          onClose={() => setIsPanelOpen(false)}
        />
      )}
    </>
  );
}
