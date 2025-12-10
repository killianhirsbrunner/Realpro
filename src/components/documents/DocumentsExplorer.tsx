import { useState } from 'react';
import { Search, FolderOpen } from 'lucide-react';
import { Input } from '../ui/Input';
import { FolderCard } from './FolderCard';
import { DocumentCard } from './DocumentCard';
import { UploadDialog } from './UploadDialog';
import { EmptyState } from '../ui/EmptyState';
import type { Document } from '../../hooks/useDocuments';

interface DocumentsExplorerProps {
  projectId: string;
  tree: Document[];
  onRefresh?: () => void;
}

export function DocumentsExplorer({ projectId, tree, onRefresh }: DocumentsExplorerProps) {
  const [selectedFolder, setSelectedFolder] = useState<Document | null>(tree[0] || null);
  const [search, setSearch] = useState('');

  const filteredFiles = selectedFolder
    ? selectedFolder.files.filter((file) =>
        file.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Rechercher dans les documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {selectedFolder && (
          <UploadDialog
            projectId={projectId}
            folder={selectedFolder.name}
            onSuccess={onRefresh}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white px-1 mb-4">
            Dossiers
          </h3>
          {tree.map((folder) => (
            <FolderCard
              key={folder.name}
              folder={folder}
              selected={selectedFolder?.name === folder.name}
              onClick={() => setSelectedFolder(folder)}
            />
          ))}
        </div>

        <div className="lg:col-span-3">
          {selectedFolder && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-6 w-6 text-primary-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                      {selectedFolder.name}
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      {filteredFiles.length} document{filteredFiles.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {filteredFiles.length === 0 ? (
                <EmptyState
                  title="Aucun document"
                  description={
                    search
                      ? 'Aucun document ne correspond à votre recherche'
                      : 'Commencez par importer des documents dans ce dossier'
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredFiles.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>
              )}
            </>
          )}

          {!selectedFolder && tree.length > 0 && (
            <EmptyState
              title="Sélectionnez un dossier"
              description="Choisissez un dossier dans la liste pour voir son contenu"
            />
          )}
        </div>
      </div>
    </div>
  );
}
