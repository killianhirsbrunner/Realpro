import { useState } from 'react';
import {
  Button,
  SearchInput,
  Badge,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  Select,
  EmptyState,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@realpro/ui';
import { PageShell, ContentCard } from '@realpro/ui/layouts';
import {
  Plus,
  MoreHorizontal,
  FileText,
  Edit,
  Trash2,
  Eye,
  Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const mockLeases = [
  {
    id: '1',
    reference: 'BAIL-2024-001',
    property: 'Résidence Lac-Léman',
    unit: 'Appartement 3.5 pièces - 2ème',
    tenant: { name: 'Marie Dupont', email: 'marie.dupont@email.ch' },
    owner: 'Immobilière SA',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    rent: 1850,
    charges: 250,
    deposit: 5550,
    status: 'active',
  },
  {
    id: '2',
    reference: 'BAIL-2024-002',
    property: 'Immeuble Centre-Ville',
    unit: 'Studio - 4ème',
    tenant: { name: 'Pierre Martin', email: 'pierre.martin@email.ch' },
    owner: 'Famille Müller',
    startDate: '2024-03-01',
    endDate: null,
    rent: 980,
    charges: 120,
    deposit: 2940,
    status: 'active',
  },
  {
    id: '3',
    reference: 'BAIL-2023-045',
    property: 'Villa des Roses',
    unit: 'Maison 6 pièces',
    tenant: { name: 'Sophie Bernard', email: 'sophie.bernard@email.ch' },
    owner: 'Investment Corp',
    startDate: '2023-06-01',
    endDate: '2025-05-31',
    rent: 3200,
    charges: 400,
    deposit: 9600,
    status: 'ending_soon',
  },
  {
    id: '4',
    reference: 'BAIL-2022-012',
    property: 'Résidence Lac-Léman',
    unit: 'Appartement 4.5 pièces - RDC',
    tenant: { name: 'Jean Müller', email: 'jean.muller@email.ch' },
    owner: 'Immobilière SA',
    startDate: '2022-09-01',
    endDate: '2024-08-31',
    rent: 2100,
    charges: 280,
    deposit: 6300,
    status: 'ended',
  },
];

const statusConfig = {
  active: { label: 'Actif', variant: 'success' as const },
  ending_soon: { label: 'Fin proche', variant: 'warning' as const },
  ended: { label: 'Terminé', variant: 'neutral' as const },
  pending: { label: 'En attente', variant: 'info' as const },
};

export function LeasesPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');

  const filteredLeases = mockLeases.filter((lease) => {
    const matchesSearch =
      lease.reference.toLowerCase().includes(search.toLowerCase()) ||
      lease.tenant.name.toLowerCase().includes(search.toLowerCase()) ||
      lease.property.toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && (lease.status === 'active' || lease.status === 'ending_soon')) ||
      (activeTab === 'ended' && lease.status === 'ended');

    const matchesProperty = propertyFilter === 'all' || lease.property === propertyFilter;

    return matchesSearch && matchesTab && matchesProperty;
  });

  const activeCount = mockLeases.filter((l) => l.status === 'active' || l.status === 'ending_soon').length;
  const endingSoonCount = mockLeases.filter((l) => l.status === 'ending_soon').length;

  return (
    <PageShell
      title="Baux"
      subtitle={`${activeCount} baux actifs${endingSoonCount > 0 ? ` · ${endingSoonCount} à échéance proche` : ''}`}
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>Exporter</Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>Nouveau bail</Button>
        </div>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">Tous ({mockLeases.length})</TabsTrigger>
            <TabsTrigger value="active">Actifs ({activeCount})</TabsTrigger>
            <TabsTrigger value="ended">Terminés</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 flex-wrap">
            <SearchInput placeholder="Rechercher..." onSearch={setSearch} className="w-full sm:w-64" />
            <Select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="w-48">
              <option value="all">Tous les immeubles</option>
              <option value="Résidence Lac-Léman">Résidence Lac-Léman</option>
              <option value="Immeuble Centre-Ville">Immeuble Centre-Ville</option>
              <option value="Villa des Roses">Villa des Roses</option>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab}>
          {filteredLeases.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-8 w-8" />}
              title="Aucun bail trouvé"
              description={search || propertyFilter !== 'all' ? "Aucun résultat ne correspond à vos filtres" : "Créez votre premier bail"}
              action={!search && propertyFilter === 'all' ? { label: "Créer un bail", onClick: () => {} } : undefined}
            />
          ) : (
            <ContentCard padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                      <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">Référence</th>
                      <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">Locataire</th>
                      <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">Objet</th>
                      <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">Durée</th>
                      <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">Loyer mensuel</th>
                      <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">Statut</th>
                      <th className="px-6 py-3 w-12" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {filteredLeases.map((lease) => {
                      const status = statusConfig[lease.status as keyof typeof statusConfig];
                      return (
                        <tr key={lease.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                          <td className="px-6 py-4">
                            <Link to={`/leases/${lease.id}`} className="font-medium text-brand-500 hover:text-brand-600">{lease.reference}</Link>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={lease.tenant.name} size="sm" />
                              <div>
                                <p className="font-medium text-neutral-900 dark:text-white">{lease.tenant.name}</p>
                                <p className="text-xs text-neutral-500">{lease.tenant.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-neutral-900 dark:text-white">{lease.property}</p>
                              <p className="text-xs text-neutral-500">{lease.unit}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                              <p>{new Date(lease.startDate).toLocaleDateString('fr-CH')}</p>
                              <p className="text-xs text-neutral-500">{lease.endDate ? `→ ${new Date(lease.endDate).toLocaleDateString('fr-CH')}` : 'Durée indéterminée'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-neutral-900 dark:text-white">CHF {(lease.rent + lease.charges).toLocaleString('fr-CH')}</p>
                              <p className="text-xs text-neutral-500">Loyer: {lease.rent} + Charges: {lease.charges}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={status.variant} size="sm">{status.label}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Dropdown align="right" trigger={<Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>}>
                              <DropdownItem icon={<Eye className="h-4 w-4" />}>Voir le détail</DropdownItem>
                              <DropdownItem icon={<Edit className="h-4 w-4" />}>Modifier</DropdownItem>
                              <DropdownItem icon={<FileText className="h-4 w-4" />}>Générer avenant</DropdownItem>
                              <DropdownSeparator />
                              <DropdownItem icon={<Trash2 className="h-4 w-4" />} destructive>Résilier</DropdownItem>
                            </Dropdown>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </ContentCard>
          )}
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
