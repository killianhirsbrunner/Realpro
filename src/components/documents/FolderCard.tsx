import { Card } from '../ui/Card';
import { Folder, FileText } from 'lucide-react';

interface FolderCardProps {
  folder: {
    name: string;
    count: number;
  };
  selected: boolean;
  onClick: () => void;
}

export function FolderCard({ folder, selected, onClick }: FolderCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        selected
          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
          : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-lg ${
            selected
              ? 'bg-primary-100 dark:bg-primary-800'
              : 'bg-neutral-100 dark:bg-neutral-700'
          }`}>
            <Folder className={`h-5 w-5 ${
              selected
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-neutral-600 dark:text-neutral-400'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${
              selected
                ? 'text-primary-900 dark:text-primary-100'
                : 'text-neutral-900 dark:text-white'
            }`}>
              {folder.name}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <FileText className="h-3 w-3 text-neutral-400" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {folder.count} document{folder.count > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
