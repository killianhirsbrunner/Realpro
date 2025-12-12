import { useState } from 'react';
import { Button, SearchInput, Badge, Select, EmptyState } from '@realpro/ui';
import { PageShell, ContentCard } from '@realpro/ui/layouts';
import { Plus, Download, Folder, FileText, Image, File, MoreHorizontal, Eye, Trash2, Upload, FolderOpen } from 'lucide-react';

const mockFolders = [
  { id: '1', name: 'Plans & Permis', count: 24, icon: Folder },
  { id: '2', name: 'Contrats', count: 18, icon: FileText },
  { id: '3', name: 'Marketing', count: 32, icon: Image },
  { id: '4', name: 'Finances', count: 15, icon: File },
];

const mockDocuments = [
  { id: '1', name: 'Permis de construire.pdf', folder: 'Plans & Permis', project: 'Résidence du Lac', size: '2.4 MB', date: '2025-01-10', type: 'pdf' },
  { id: '2', name: 'Contrat réservation - Dupont.pdf', folder: 'Contrats', project: 'Résidence du Lac', size: '1.2 MB', date: '2025-01-08', type: 'pdf' },
  { id: '3', name: 'Brochure commerciale.pdf', folder: 'Marketing', project: 'Les Jardins', size: '8.5 MB', date: '2025-01-05', type: 'pdf' },
  { id: '4', name: 'Plan masse.dwg', folder: 'Plans & Permis', project: 'Villa Park', size: '15.2 MB', date: '2025-01-03', type: 'cad' },
  { id: '5', name: 'Budget prévisionnel.xlsx', folder: 'Finances', project: 'Résidence du Lac', size: '0.8 MB', date: '2024-12-20', type: 'excel' },
];

const typeConfig: Record<string, { color: string; icon: typeof FileText }> = {
  pdf: { color: 'text-error-500', icon: FileText },
  cad: { color: 'text-blue-500', icon: File },
  excel: { color: 'text-success-500', icon: FileText },
  image: { color: 'text-warning-500', icon: Image },
};

export function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState('all');

  const filteredDocs = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = !selectedFolder || doc.folder === selectedFolder;
    const matchesProject = projectFilter === 'all' || doc.project === projectFilter;
    return matchesSearch && matchesFolder && matchesProject;
  });

  return (
    <PageShell
      title="Documents"
      subtitle="GED projets"
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>Exporter</Button>
          <Button variant="primary" leftIcon={<Upload className="h-4 w-4" />}>Importer</Button>
        </div>
      }
      filters={
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Rechercher..." onSearch={setSearch} className="w-80" />
          <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="w-48">
            <option value="all">Tous les projets</option>
            <option value="Résidence du Lac">Résidence du Lac</option>
            <option value="Les Jardins">Les Jardins</option>
            <option value="Villa Park">Villa Park</option>
          </Select>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folders sidebar */}
        <div className="space-y-2">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${!selectedFolder ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
          >
            <FolderOpen className="h-5 w-5" />
            <span className="font-medium">Tous les documents</span>
            <Badge variant="neutral" size="sm" className="ml-auto">{mockDocuments.length}</Badge>
          </button>
          {mockFolders.map((folder) => {
            const Icon = folder.icon;
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${selectedFolder === folder.name ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{folder.name}</span>
                <Badge variant="neutral" size="sm" className="ml-auto">{folder.count}</Badge>
              </button>
            );
          })}
          <Button variant="outline" className="w-full mt-4" leftIcon={<Plus className="h-4 w-4" />}>
            Nouveau dossier
          </Button>
        </div>

        {/* Documents list */}
        <div className="lg:col-span-3">
          {filteredDocs.length === 0 ? (
            <EmptyState icon={<FileText className="h-8 w-8" />} title="Aucun document" description="Importez votre premier document" action={{ label: "Importer", onClick: () => {} }} />
          ) : (
            <ContentCard padding="none">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-neutral-50 dark:bg-neutral-800/50">
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase px-6 py-3">Nom</th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase px-6 py-3">Projet</th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase px-6 py-3">Taille</th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase px-6 py-3">Date</th>
                    <th className="px-6 py-3 w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredDocs.map((doc) => {
                    const type = typeConfig[doc.type] || typeConfig.pdf;
                    const Icon = type.icon;
                    return (
                      <tr key={doc.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${type.color}`} />
                            <span className="font-medium">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600">{doc.project}</td>
                        <td className="px-6 py-4 text-sm text-neutral-500">{doc.size}</td>
                        <td className="px-6 py-4 text-sm text-neutral-500">{new Date(doc.date).toLocaleDateString('fr-CH')}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ContentCard>
          )}
        </div>
      </div>
    </PageShell>
  );
}
