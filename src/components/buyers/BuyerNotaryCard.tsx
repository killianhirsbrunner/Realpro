import { Card } from '../ui/Card';
import { Scale, FileText, Mail } from 'lucide-react';

interface BuyerNotaryCardProps {
  buyer: {
    notary?: {
      name: string;
      email?: string;
    };
    notaryStatus?: string;
    notaryDocuments: Array<{
      id: string;
      name: string;
    }>;
  };
}

export function BuyerNotaryCard({ buyer }: BuyerNotaryCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Scale className="h-5 w-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Notaire
        </h2>
      </div>

      <div className="space-y-4">
        {buyer.notary ? (
          <>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Notaire désigné</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {buyer.notary.name}
              </p>
              {buyer.notary.email && (
                <a
                  href={`mailto:${buyer.notary.email}`}
                  className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline mt-1"
                >
                  <Mail className="h-3 w-3" />
                  {buyer.notary.email}
                </a>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Statut dossier</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {buyer.notaryStatus || 'En attente'}
              </p>
            </div>

            {buyer.notaryDocuments.length > 0 && (
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                  Documents notaire
                </p>
                <div className="space-y-2">
                  {buyer.notaryDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-neutral-400" />
                      <span className="text-sm text-neutral-900 dark:text-white">
                        {doc.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Aucun notaire désigné
          </p>
        )}
      </div>
    </Card>
  );
}
