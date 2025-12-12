import { useState } from 'react';
import { Card, CardContent, Button, Input, Badge, EmptyState } from '@realpro/ui';
import { Search, Plus, FileText, Folder, Download, Eye, Upload } from 'lucide-react';

const mockDocuments = [
  { id: '1', name: 'PV AG 2024.pdf', type: 'pdf', category: 'Assemblées', date: '15.06.2024', size: '2.4 MB' },
  { id: '2', name: 'Décompte charges 2023.xlsx', type: 'excel', category: 'Comptabilité', date: '31.03.2024', size: '1.8 MB' },
  { id: '3', name: 'Contrat conciergerie.pdf', type: 'pdf', category: 'Contrats', date: '01.01.2024', size: '520 KB' },
  { id: '4', name: 'Règlement intérieur.pdf', type: 'pdf', category: 'Règlements', date: '15.09.2023', size: '890 KB' },
  { id: '5', name: 'Plans immeuble.dwg', type: 'other', category: 'Technique', date: '01.06.2020', size: '15.2 MB' },
  { id: '6', name: 'Assurance bâtiment 2024.pdf', type: 'pdf', category: 'Assurances', date: '01.01.2024', size: '1.2 MB' },
];

const categories = ['Tous', 'Assemblées', 'Comptabilité', 'Contrats', 'Règlements', 'Technique', 'Assurances'];

const typeIcons: Record<string, string> = {
  pdf: '📄',
  excel: '📊',
  word: '📝',
  image: '🖼️',
  other: '📁',
};

export function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Documents
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            {mockDocuments.length} documents
          </p>
        </div>
        <Button leftIcon={<Upload className="w-4 h-4" />}>
          Télécharger
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Rechercher un document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-12 h-12" />}
          title="Aucun document trouvé"
          description="Modifiez vos critères de recherche ou téléchargez un nouveau document."
          action={
            <Button leftIcon={<Upload className="w-4 h-4" />}>
              Télécharger
            </Button>
          }
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{typeIcons[doc.type]}</span>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {doc.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Badge variant="neutral" size="sm">{doc.category}</Badge>
                        <span>·</span>
                        <span>{doc.date}</span>
                        <span>·</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
