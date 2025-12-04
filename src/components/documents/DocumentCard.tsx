import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../ui/Card';
import { FileText, Download, Eye, Calendar, Hash } from 'lucide-react';

interface DocumentCardProps {
  doc: {
    id: string;
    name: string;
    type?: string;
    size?: number;
    version?: number;
    created_at: string;
    storage_path?: string;
  };
}

export function DocumentCard({ doc }: DocumentCardProps) {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const getFileIcon = () => {
    if (doc.type?.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-600" />;
    }
    return <FileText className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />;
  };

  const handleView = () => {
    navigate(`/projects/${projectId}/documents/${doc.id}`);
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all group">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
              {getFileIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                {doc.name}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {formatFileSize(doc.size)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
            {doc.version && (
              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                <span>v{doc.version}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(doc.created_at).toLocaleDateString('fr-CH')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleView}
              className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
              title="Visualiser"
            >
              <Eye className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </button>
            {doc.storage_path && (
              <a
                href={doc.storage_path}
                download
                className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
                title="Télécharger"
              >
                <Download className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
