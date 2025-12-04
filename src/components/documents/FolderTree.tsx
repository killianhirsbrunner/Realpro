import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { Document } from '../../hooks/useDocuments';
import { useState } from 'react';

interface FolderTreeProps {
  folders: Document[];
}

export function FolderTree({ folders }: FolderTreeProps) {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const currentFolderId = searchParams.get('folder');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const rootFolders = folders.filter((f) => f.is_folder && !f.parent_folder_id);

  return (
    <div className="space-y-1">
      <Link
        to={`/projects/${projectId}/documents`}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
          !currentFolderId
            ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
        }`}
      >
        <Folder className="w-4 h-4" />
        <span className="text-sm font-medium">Racine</span>
      </Link>

      {rootFolders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          currentFolderId={currentFolderId}
          expandedFolders={expandedFolders}
          onToggle={toggleFolder}
        />
      ))}
    </div>
  );
}

interface FolderItemProps {
  folder: Document;
  currentFolderId: string | null;
  expandedFolders: Set<string>;
  onToggle: (folderId: string) => void;
  level?: number;
}

function FolderItem({
  folder,
  currentFolderId,
  expandedFolders,
  onToggle,
  level = 0,
}: FolderItemProps) {
  const { projectId } = useParams();
  const isExpanded = expandedFolders.has(folder.id);
  const isActive = currentFolderId === folder.id;
  const hasChildren = (folder.child_count || 0) > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition cursor-pointer ${
          isActive
            ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
        }`}
        style={{ paddingLeft: `${12 + level * 16}px` }}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggle(folder.id);
            }}
            className="flex items-center justify-center w-4 h-4"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}

        <Link
          to={`/projects/${projectId}/documents?folder=${folder.id}`}
          className="flex items-center gap-2 flex-1"
        >
          {isActive || isExpanded ? (
            <FolderOpen className="w-4 h-4" />
          ) : (
            <Folder className="w-4 h-4" />
          )}
          <span className="text-sm font-medium truncate">{folder.name}</span>
          {hasChildren && (
            <span className="text-xs text-neutral-500 ml-auto">
              {folder.child_count}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
