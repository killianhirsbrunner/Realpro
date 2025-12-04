import { FileText, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Document {
  id: string;
  name: string;
  type: string;
  size?: string;
  uploaded_at: string;
  uploaded_by?: string;
}

interface DocumentPreviewCardProps {
  document: Document;
}

export function DocumentPreviewCard({ document }: DocumentPreviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-CH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('doc')) return '📝';
    if (type.includes('xls') || type.includes('sheet')) return '📊';
    return '📎';
  };

  return (
    <div className="group relative p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center text-2xl">
          {getFileIcon(document.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-neutral-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {document.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {formatDate(document.uploaded_at)}
                </span>
                {document.size && (
                  <>
                    <span className="text-xs text-neutral-300 dark:text-neutral-600">•</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {document.size}
                    </span>
                  </>
                )}
              </div>
              {document.uploaded_by && (
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                  Par {document.uploaded_by}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <Download className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
