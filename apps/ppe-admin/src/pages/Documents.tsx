import { useState } from 'react';
import {
  Button,
  SearchInput,
  Badge,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  Modal,
  EmptyState,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@realpro/ui';
import { FileUpload } from '@realpro/ui';
import { PageShell, ContentCard } from '@realpro/ui/layouts';
import {
  Plus,
  MoreHorizontal,
  Folder,
  File,
  FileText,
  Image,
  Download,
  Eye,
  Edit,
  Trash2,
  Upload,
  FolderOpen,
  Search,
  Filter,
  ChevronRight,
  Clock,
} from 'lucide-react';

// Mock data
const mockFolders = [
  { id: '1', name: 'Assemblées générales', count: 24, lastModified: '2025-01-10' },
  { id: '2', name: 'Contrats', count: 12, lastModified: '2025-01-05' },
  { id: '3', name: 'Assurances', count: 8, lastModified: '2024-12-20' },
  { id: '4', name: 'Comptabilité', count: 45, lastModified: '2025-01-12' },
  { id: '5', name: 'Plans & Techniques', count: 18, lastModified: '2024-11-15' },
  { id: '6', name: 'Règlements', count: 6, lastModified: '2024-06-10' },
];

const mockDocuments = [
  { id: '1', name: 'PV AG 2024.pdf', folder: 'Assemblées générales', type: 'pdf', size: '2.4 MB', uploadedAt: '2024-06-25', uploadedBy: 'Jean Martin' },
  { id: '2', name: 'Convocation AG 2025.pdf', folder: 'Assemblées générales', type: 'pdf', size: '1.1 MB', uploadedAt: '2025-01-08', uploadedBy: 'Jean Martin' },
  { id: '3', name: 'Contrat conciergerie 2025.pdf', folder: 'Contrats', type: 'pdf', size: '3.2 MB', uploadedAt: '2024-12-15', uploadedBy: 'Marie Dupont' },
  { id: '4', name: 'Police assurance RC.pdf', folder: 'Assurances', type: 'pdf', size: '1.8 MB', uploadedAt: '2024-10-01', uploadedBy: 'Jean Martin' },
  { id: '5', name: 'Plan façade.dwg', folder: 'Plans & Techniques', type: 'dwg', size: '8.5 MB', uploadedAt: '2024-03-20', uploadedBy: 'Architecte SA' },
  { id: '6', name: 'Photo entrée.jpg', folder: 'Plans & Techniques', type: 'image', size: '4.2 MB', uploadedAt: '2024-11-10', uploadedBy: 'Pierre Bernard' },
];

const recentDocuments = mockDocuments.slice(0, 5);

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf': return FileText;
    case 'image': case 'jpg': case 'png': return Image;
    default: return File;
  }
};

export function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('folders');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const filteredDocuments = mockDocuments.filter(
    (doc) => doc.name.toLowerCase().includes(search.toLowerCase()) || doc.folder.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = () => {
    setShowUploadModal(false);
    setUploadFiles([]);
  };

  return (
    <PageShell
      title="Documents"
      subtitle="Gestion électronique des documents (GED)"
      actions={<Button variant="primary" leftIcon={<Upload className="h-4 w-4" />} onClick={() => setShowUploadModal(true)}>Importer des documents</Button>}
      filters={
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Rechercher un document..." onSearch={setSearch} className="w-full sm:w-80" />
          <Button variant="outline" size="sm" leftIcon={<Filter className="h-4 w-4" />}>Filtres</Button>
        </div>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="folders">Dossiers</TabsTrigger>
          <TabsTrigger value="recent">Documents récents</TabsTrigger>
          <TabsTrigger value="all">Tous les documents</TabsTrigger>
        </TabsList>

        <TabsContent value="folders">
          {selectedFolder ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <button onClick={() => setSelectedFolder(null)} className="text-brand-500 hover:text-brand-600">Documents</button>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
                <span className="text-neutral-900 dark:text-white font-medium">{mockFolders.find((f) => f.id === selectedFolder)?.name}</span>
              </div>
              <ContentCard padding="none">
                <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {mockDocuments.filter((doc) => doc.folder === mockFolders.find((f) => f.id === selectedFolder)?.name).map((doc) => {
                    const FileIcon = getFileIcon(doc.type);
                    return (
                      <div key={doc.id} className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                            <FileIcon className="h-5 w-5 text-neutral-500" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">{doc.name}</p>
                            <p className="text-sm text-neutral-500">{doc.size} • Ajouté le {new Date(doc.uploadedAt).toLocaleDateString('fr-CH')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ContentCard>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockFolders.map((folder) => (
                <ContentCard key={folder.id} className="cursor-pointer hover:border-brand-300 transition-colors" onClick={() => setSelectedFolder(folder.id)}>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-brand-100 dark:bg-brand-900 flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-900 dark:text-white truncate">{folder.name}</h3>
                      <p className="text-sm text-neutral-500 mt-1">{folder.count} documents</p>
                      <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1"><Clock className="h-3 w-3" />Modifié le {new Date(folder.lastModified).toLocaleDateString('fr-CH')}</p>
                    </div>
                  </div>
                </ContentCard>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          <ContentCard padding="none">
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {recentDocuments.map((doc) => {
                const FileIcon = getFileIcon(doc.type);
                return (
                  <div key={doc.id} className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                        <FileIcon className="h-5 w-5 text-neutral-500" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{doc.name}</p>
                        <p className="text-sm text-neutral-500">{doc.folder} • {doc.size} • par {doc.uploadedBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-500">{new Date(doc.uploadedAt).toLocaleDateString('fr-CH')}</span>
                      <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ContentCard>
        </TabsContent>

        <TabsContent value="all">
          {filteredDocuments.length === 0 ? (
            <EmptyState icon={<Search className="h-8 w-8" />} title="Aucun document trouvé" description="Aucun document ne correspond à votre recherche" />
          ) : (
            <ContentCard padding="none">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-neutral-50 dark:bg-neutral-800/50">
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase px-6 py-3">Nom</th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase px-6 py-3">Dossier</th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase px-6 py-3">Taille</th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase px-6 py-3">Date</th>
                    <th className="px-6 py-3 w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredDocuments.map((doc) => {
                    const FileIcon = getFileIcon(doc.type);
                    return (
                      <tr key={doc.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><FileIcon className="h-5 w-5 text-neutral-400" /><span className="font-medium">{doc.name}</span></div></td>
                        <td className="px-6 py-4 text-sm text-neutral-600">{doc.folder}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600">{doc.size}</td>
                        <td className="px-6 py-4 text-sm text-neutral-600">{new Date(doc.uploadedAt).toLocaleDateString('fr-CH')}</td>
                        <td className="px-6 py-4"><Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ContentCard>
          )}
        </TabsContent>
      </Tabs>

      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Importer des documents" size="lg"
        footer={<><Button variant="outline" onClick={() => setShowUploadModal(false)}>Annuler</Button><Button variant="primary" onClick={handleUpload} disabled={uploadFiles.length === 0}>Importer {uploadFiles.length > 0 && `(${uploadFiles.length})`}</Button></>}>
        <FileUpload label="Sélectionnez les fichiers à importer" description="PDF, images, documents Office acceptés" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" multiple maxSize={10 * 1024 * 1024} value={uploadFiles} onChange={setUploadFiles} />
      </Modal>
    </PageShell>
  );
}
