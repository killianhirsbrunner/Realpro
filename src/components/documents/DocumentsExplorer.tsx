import { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { FileText, Folder, Download, Eye, Search } from 'lucide-react';
import { formatDate } from '../../lib/utils/format';

interface Document {
  id: string;
  name: string;
  type?: string;
  size?: number;
  created_at: string;
  folder?: string;
}

interface DocumentsExplorerProps {
  documents: Document[];
}

export function DocumentsExplorer({ documents }: DocumentsExplorerProps) {
  const [search, setSearch] = useState('');

  const filtered = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.folder?.toLowerCase().includes(search.toLowerCase())
  );

  const groupedByFolder = filtered.reduce((acc, doc) => {
    const folder = doc.folder || 'Autres';
    if (!acc[folder]) {
      acc[folder] = [];
    }
    acc[folder].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Rechercher un document..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {Object.entries(groupedByFolder).map(([folderName, docs]) => (
        <Card key={folderName} className="overflow-hidden">
          <div className="bg-neutral-50 dark:bg-neutral-800 px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <Folder className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {folderName}
              </h3>
              <span className="text-sm text-neutral-500">
                ({docs.length})
              </span>
            </div>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {doc.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                        <span>{formatSize(doc.size)}</span>
                        <span>•</span>
                        <span>{formatDate(doc.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                      <Eye className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                    </button>
                    <button className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                      <Download className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {filtered.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">Aucun document trouvé</p>
        </Card>
      )}
    </div>
  );
}
