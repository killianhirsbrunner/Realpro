import { Card } from '../ui/Card';
import { FileText } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  created_at: string;
}

interface DocumentsRecentProps {
  documents: Document[];
}

export function DocumentsRecent({ documents }: DocumentsRecentProps) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Documents récents</h2>

      {documents.length === 0 ? (
        <p className="text-sm text-neutral-500">Aucun document récent</p>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 p-2 rounded-lg transition-colors">
              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate">{doc.name}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
