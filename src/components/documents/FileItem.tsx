import { Document } from '../../hooks/useDocuments';
import {
  FileText,
  Image as ImageIcon,
  File,
  Download,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
} from 'lucide-react';
import { useState } from 'react';
import { Card } from '../ui/Card';

interface FileItemProps {
  file: Document;
  onView?: (file: Document) => void;
  onEdit?: (file: Document) => void;
  onDelete?: (file: Document) => void;
}

export function FileItem({ file, onView, onEdit, onDelete }: FileItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getFileIcon = () => {
    if (!file.file_type) return <File className="w-8 h-8 text-neutral-400" />;

    if (file.file_type.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8 text-blue-500" />;
    }

    if (file.file_type.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-500" />;
    }

    return <File className="w-8 h-8 text-neutral-400" />;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';

    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;

    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-CH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card className="p-4 hover:shadow-lg transition relative group">
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 py-1 z-10">
            {onView && (
              <button
                onClick={() => {
                  onView(file);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Prévisualiser
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(file);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
            )}
            {file.file_url && (
              <a
                href={file.file_url}
                download
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </a>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(file);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            )}
          </div>
        )}
      </div>

      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => onView?.(file)}
      >
        {file.file_type?.startsWith('image/') && file.file_url ? (
          <img
            src={file.file_url}
            alt={file.name}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-3">
            {getFileIcon()}
          </div>
        )}

        <div className="w-full">
          <h3 className="font-medium text-sm truncate mb-1">{file.name}</h3>

          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>{formatFileSize(file.file_size)}</span>
            <span>v{file.version_number}</span>
          </div>

          {file.uploaded_by_name && (
            <p className="text-xs text-neutral-500 mt-1">
              Par {file.uploaded_by_name}
            </p>
          )}

          <p className="text-xs text-neutral-500 mt-1">
            {formatDate(file.created_at)}
          </p>

          {file.tags && Object.keys(file.tags).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.keys(file.tags).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
