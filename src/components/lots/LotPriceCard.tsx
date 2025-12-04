import { Card } from '../ui/Card';
import { DollarSign, Tag } from 'lucide-react';
import { formatCHF } from '../../lib/utils/format';

interface LotPriceCardProps {
  lot: {
    price_vat?: number;
    sale_type?: string;
  };
}

export function LotPriceCard({ lot }: LotPriceCardProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
        Prix
      </h2>

      <div className="space-y-4">
        {lot.price_vat && (
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-neutral-400" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Prix TTC</p>
              <p className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                {formatCHF(lot.price_vat)}
              </p>
            </div>
          </div>
        )}

        {lot.sale_type && (
          <div className="flex items-center gap-3">
            <Tag className="h-5 w-5 text-neutral-400" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Type de vente</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white uppercase">
                {lot.sale_type}
              </p>
            </div>
          </div>
        )}

        {!lot.price_vat && (
          <p className="text-sm text-neutral-500">Prix non défini</p>
        )}
      </div>
    </Card>
  );
}
