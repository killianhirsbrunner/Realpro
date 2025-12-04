import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Folder,
  File,
  FileText,
  Image,
  FileSpreadsheet,
  Upload,
  Download,
  Trash2,
  MoreVertical,
  FolderPlus,
  Search,
  Grid,
  List,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SidePanel } from '../components/ui/SidePanel';
import { useDocuments } from '../hooks/useDocuments';

export default function ProjectDocumentsNew() {
  const { projectId } = useParams();
  const { folders, documents, loading } = useDocuments(projectId);
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const currentFolderDocs = documents.filter(
    (doc: any) => doc.folder_id === selectedFolder?.id || (!selectedFolder && !doc.folder_id)
  );

  const filteredDocs = currentFolderDocs.filter((doc: any) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return Image;
    if (type.includes('pdf')) return FileText;
    if (type.includes('sheet') || type.includes('excel')) return FileSpreadsheet;
    return File;
  };

  const handleDocumentClick = (doc: any) => {
    setSelectedDocument(doc);
    setIsPanelOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex">
      <div className="w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 p-4">
        <div className="mb-4">
          <Button variant="primary" size="sm" className="w-full">
            <FolderPlus className="w-4 h-4 mr-2" />
            Nouveau dossier
          </Button>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedFolder
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>Tous les documents</span>
          </button>

          {folders.map((folder: any) => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedFolder?.id === folder.id
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span className="flex-1 text-left truncate">{folder.name}</span>
              <span className="text-xs text-neutral-400">
                {documents.filter((d: any) => d.folder_id === folder.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {selectedFolder ? selectedFolder.name : 'Tous les documents'}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <Button variant="secondary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>

              <Button variant="primary" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Importer
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Folder className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Aucun document
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Commencez par importer vos premiers documents
              </p>
              <Button variant="primary">
                <Upload className="w-4 h-4 mr-2" />
                Importer des documents
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredDocs.map((doc: any) => {
                const IconComponent = getFileIcon(doc.mime_type || '');
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleDocumentClick(doc)}
                    className="group bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center mb-3 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-800 transition-colors">
                      <IconComponent className="w-12 h-12 text-neutral-400 dark:text-neutral-600" />
                    </div>
                    <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate mb-1">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {doc.size ? `${(doc.size / 1024).toFixed(0)} KB` : '-'}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredDocs.map((doc: any) => {
                const IconComponent = getFileIcon(doc.mime_type || '');
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleDocumentClick(doc)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
                  >
                    <IconComponent className="w-5 h-5 text-neutral-400 dark:text-neutral-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {doc.size ? `${(doc.size / 1024).toFixed(0)} KB` : '-'} • {' '}
                        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString('fr-CH') : '-'}
                      </p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800">
                      <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={selectedDocument?.name || 'Document'}
        width="md"
      >
        {selectedDocument && (
          <div className="p-6 space-y-6">
            <div className="aspect-video bg-neutral-100 dark:bg-neutral-900 rounded-xl flex items-center justify-center">
              {selectedDocument.mime_type?.includes('image') ? (
                <img
                  src={selectedDocument.url}
                  alt={selectedDocument.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <FileText className="w-16 h-16 text-neutral-400 dark:text-neutral-600" />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-600 dark:text-neutral-400">Nom</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedDocument.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Taille</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {selectedDocument.size ? `${(selectedDocument.size / 1024).toFixed(0)} KB` : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Type</label>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {selectedDocument.mime_type?.split('/')[1]?.toUpperCase() || 'Document'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-600 dark:text-neutral-400">Ajouté le</label>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedDocument.uploaded_at
                    ? new Date(selectedDocument.uploaded_at).toLocaleDateString('fr-CH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '-'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button variant="primary" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
              <Button variant="danger" className="flex-1">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
