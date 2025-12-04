import { useState } from 'react';
import { Search, FolderPlus, Upload, LayoutGrid, List } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useDocuments } from '../../hooks/useDocuments';

interface DocumentToolbarProps {
  projectId: string;
  currentFolderId?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onRefresh?: () => void;
}

export function DocumentToolbar({
  projectId,
  currentFolderId,
  searchValue,
  onSearchChange,
  viewMode = 'grid',
  onViewModeChange,
  onRefresh
}: DocumentToolbarProps) {
  const { createFolder } = useDocuments(projectId, currentFolderId);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    try {
      setCreating(true);
      await createFolder(folderName, currentFolderId);
      setFolderName('');
      setShowCreateFolder(false);
      onRefresh?.();
    } catch (err) {
      console.error('Error creating folder:', err);
      alert('Erreur lors de la création du dossier');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Rechercher dans les documents..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {onViewModeChange && (
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-neutral-700 shadow-sm'
                  : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
              title="Vue grille"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-700 shadow-sm'
                  : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
              title="Vue liste"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => setShowCreateFolder(true)}
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          Nouveau dossier
        </Button>
      </div>

      {showCreateFolder && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <Input
            type="text"
            placeholder="Nom du dossier..."
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleCreateFolder();
            }}
            autoFocus
            className="flex-1"
          />
          <Button
            onClick={handleCreateFolder}
            disabled={!folderName.trim() || creating}
          >
            {creating ? 'Création...' : 'Créer'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowCreateFolder(false);
              setFolderName('');
            }}
          >
            Annuler
          </Button>
        </div>
      )}
    </div>
  );
}
