import { Card } from '../ui/Card';
import { FileText, Download, Upload } from 'lucide-react';
import { Button } from '../ui/Button';

interface Document {
  id: string;
  name: string;
  size?: number;
  url?: string;
  created_at: string;
}

interface SubmissionDocumentsCardProps {
  documents: Document[];
  onUpload?: () => void;
}

export function SubmissionDocumentsCard({ documents = [], onUpload }: SubmissionDocumentsCardProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Pièces de soumission
          </h3>
          {onUpload && (
            <Button size="sm" onClick={onUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Aucun document de soumission
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Plans, métrés, descriptifs, cahier des charges...
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatFileSize(doc.size)} • {new Date(doc.created_at).toLocaleDateString('fr-CH')}
                    </p>
                  </div>
                </div>
                {doc.url && (
                  <a
                    href={doc.url}
                    download
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-all"
                  >
                    <Download className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
