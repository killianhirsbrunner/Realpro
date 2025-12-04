import { Card } from '../ui/Card';
import { FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface BuyerDocumentsCardProps {
  buyer: {
    documents: Array<{
      id: string;
      name: string;
      provided: boolean;
      url?: string;
    }>;
  };
}

export function BuyerDocumentsCard({ buyer }: BuyerDocumentsCardProps) {
  const providedCount = buyer.documents.filter(d => d.provided).length;
  const totalCount = buyer.documents.length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Documents requis
        </h2>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {providedCount} / {totalCount}
        </span>
      </div>

      {buyer.documents.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Aucun document requis
        </p>
      ) : (
        <div className="space-y-3">
          {buyer.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 dark:text-white truncate">
                    {doc.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {doc.provided ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">Fourni</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 text-red-600" />
                        <span className="text-xs text-red-600">Manquant</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {doc.provided && doc.url && (
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
