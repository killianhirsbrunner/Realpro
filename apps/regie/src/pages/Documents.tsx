import { useState } from 'react';
import { Card, CardContent, Button, Input, Badge, EmptyState } from '@realpro/ui';
import { Search, Upload, FileText, Download, Eye, Folder } from 'lucide-react';

const mockDocuments = [
  { id: '1', name: 'Bail - Martin Dupont.pdf', type: 'pdf', category: 'Baux', property: 'Résidence du Lac', date: '01.04.2023', size: '1.2 MB' },
  { id: '2', name: 'État des lieux entrée - Apt 3.2.pdf', type: 'pdf', category: 'États des lieux', property: 'Résidence du Lac', date: '01.04.2023', size: '3.5 MB' },
  { id: '3', name: 'Décompte charges 2023.pdf', type: 'pdf', category: 'Décomptes', property: 'Immeuble Central', date: '31.03.2024', size: '890 KB' },
  { id: '4', name: 'Facture plomberie - Dec 2024.pdf', type: 'pdf', category: 'Factures', property: 'Résidence du Lac', date: '10.12.2024', size: '245 KB' },
  { id: '5', name: 'Contrat concierge.pdf', type: 'pdf', category: 'Contrats', property: 'Immeuble Central', date: '01.01.2024', size: '1.8 MB' },
  { id: '6', name: 'Attestation assurance RC.pdf', type: 'pdf', category: 'Assurances', property: 'Commerce Place Neuve', date: '01.01.2024', size: '520 KB' },
];

const categories = ['Tous', 'Baux', 'États des lieux', 'Décomptes', 'Factures', 'Contrats', 'Assurances'];

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
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.property.toLowerCase().includes(searchQuery.toLowerCase());
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
                        <span>{doc.property}</span>
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
