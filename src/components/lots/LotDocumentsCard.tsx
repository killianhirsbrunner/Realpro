import { Card } from '../ui/Card';
import { FileText, Download } from 'lucide-react';

interface LotDocumentsCardProps {
  lot: {
    documents?: Array<{
      id: string;
      name: string;
      url?: string;
    }>;
  };
}

export function LotDocumentsCard({ lot }: LotDocumentsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Documents
        </h2>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {lot.documents?.length || 0} document{(lot.documents?.length || 0) > 1 ? 's' : ''}
        </span>
      </div>

      {!lot.documents || lot.documents.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Aucun document disponible
        </p>
      ) : (
        <div className="space-y-3">
          {lot.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="h-5 w-5 text-primary-600 flex-shrink-0" />
                <span className="text-sm text-neutral-900 dark:text-white truncate">
                  {doc.name}
                </span>
              </div>
              {doc.url && (
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg"
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
