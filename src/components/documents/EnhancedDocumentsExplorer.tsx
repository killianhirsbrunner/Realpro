import { useState } from 'react';
import { FolderOpen, LayoutGrid } from 'lucide-react';
import { FolderCard } from './FolderCard';
import { DocumentCard } from './DocumentCard';
import { DocumentToolbar } from './DocumentToolbar';
import { UploadDialog } from './UploadDialog';
import { EmptyState } from '../ui/EmptyState';
import type { Document } from '../../hooks/useDocuments';

interface Folder {
  name: string;
  files: Document[];
  count: number;
}

interface EnhancedDocumentsExplorerProps {
  projectId: string;
  tree: Folder[];
  onRefresh?: () => void;
}

export function EnhancedDocumentsExplorer({
  projectId,
  tree,
  onRefresh
}: EnhancedDocumentsExplorerProps) {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(tree[0] || null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredFiles = selectedFolder
    ? selectedFolder.files.filter((file) =>
        file.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="flex gap-6 h-[calc(100vh-250px)]">
      <aside className="w-64 flex-shrink-0 space-y-3 overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-neutral-950 pb-3 z-10">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white px-1 mb-4">
            Dossiers
          </h3>
        </div>
        {tree.map((folder) => (
          <FolderCard
            key={folder.name}
            folder={folder}
            selected={selectedFolder?.name === folder.name}
            onClick={() => setSelectedFolder(folder)}
          />
        ))}
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="space-y-6">
          <DocumentToolbar
            projectId={projectId}
            searchValue={search}
            onSearchChange={setSearch}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onRefresh={onRefresh}
          />

          {selectedFolder && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900">
                    <FolderOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                      {selectedFolder.name}
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      {filteredFiles.length} document{filteredFiles.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <UploadDialog
                  projectId={projectId}
                  folder={selectedFolder.name}
                  onSuccess={onRefresh}
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredFiles.length === 0 ? (
                  <EmptyState
                    title="Aucun document"
                    description={
                      search
                        ? 'Aucun document ne correspond à votre recherche'
                        : 'Commencez par importer des documents dans ce dossier'
                    }
                  />
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {filteredFiles.map((doc) => (
                      <DocumentCard key={doc.id} doc={doc} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredFiles.map((doc) => (
                      <DocumentCard key={doc.id} doc={doc} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {!selectedFolder && tree.length > 0 && (
            <div className="flex items-center justify-center h-64">
              <EmptyState
                title="Sélectionnez un dossier"
                description="Choisissez un dossier dans la liste pour voir son contenu"
              />
            </div>
          )}

          {tree.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <EmptyState
                title="Aucun dossier"
                description="Commencez par créer un dossier pour organiser vos documents"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
