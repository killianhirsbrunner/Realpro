import { Card } from '../ui/Card';
import { Package, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface Offer {
  id: string;
  company_name: string;
  total_price?: number;
  delivery_delay?: number;
  submitted_at?: string;
  status: string;
}

interface SubmissionOffersCardProps {
  submissionId: string;
  projectId: string;
  offers: Offer[];
}

export function SubmissionOffersCard({ submissionId, projectId, offers = [] }: SubmissionOffersCardProps) {
  const navigate = useNavigate();

  const sortedOffers = [...offers].sort((a, b) =>
    (a.total_price || 0) - (b.total_price || 0)
  );

  const lowestPrice = sortedOffers[0]?.total_price;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Offres reçues
          </h3>
          {offers.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/projects/${projectId}/submissions/${submissionId}/compare`)}
            >
              Comparer
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {offers.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Aucune offre reçue pour le moment
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {sortedOffers.map((offer, index) => {
              const isLowest = offer.total_price === lowestPrice;

              return (
                <li
                  key={offer.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    isLowest
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {offer.company_name}
                        </p>
                        {index === 0 && (
                          <TrendingDown className="h-4 w-4 text-green-600" title="Offre la plus basse" />
                        )}
                        {index === sortedOffers.length - 1 && sortedOffers.length > 1 && (
                          <TrendingUp className="h-4 w-4 text-red-600" title="Offre la plus haute" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {offer.delivery_delay && (
                          <span>Délai: {offer.delivery_delay} jours</span>
                        )}
                        {offer.submitted_at && (
                          <span>{new Date(offer.submitted_at).toLocaleDateString('fr-CH')}</span>
                        )}
                      </div>
                    </div>
                    {offer.total_price && (
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${
                          isLowest
                            ? 'text-green-700 dark:text-green-400'
                            : 'text-neutral-900 dark:text-white'
                        }`}>
                          CHF {offer.total_price.toLocaleString()}
                        </p>
                        {lowestPrice && offer.total_price > lowestPrice && (
                          <p className="text-xs text-red-600 mt-1">
                            +{(((offer.total_price - lowestPrice) / lowestPrice) * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
