import { useState } from 'react';
import {
  Button,
  SearchInput,
  Badge,
  Avatar,
  Select,
  EmptyState,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@realpro/ui';
import { PageShell, ContentCard } from '@realpro/ui/layouts';
import { StatCard } from '@realpro/ui';
import {
  Plus,
  Download,
  TrendingUp,
  Users,
  Calendar,
  Mail,
  DollarSign,
  Target,
  Percent,
} from 'lucide-react';
import { formatCurrency } from '@realpro/shared-utils';

const mockPipelineStages = [
  { id: 'lead', name: 'Prospect', count: 24, value: 8500000, color: 'bg-neutral-400' },
  { id: 'visit', name: 'Visite', count: 12, value: 4200000, color: 'bg-blue-500' },
  { id: 'offer', name: 'Offre', count: 8, value: 3100000, color: 'bg-warning-500' },
  { id: 'reserved', name: 'Réservé', count: 5, value: 1950000, color: 'bg-success-500' },
  { id: 'signed', name: 'Signé', count: 3, value: 1150000, color: 'bg-brand-500' },
];

const mockSalesLeads = [
  { id: '1', contact: { name: 'Jean Dupont', email: 'jean.dupont@email.ch' }, project: 'Résidence du Lac', unit: 'Lot A-301', price: 890000, stage: 'reserved', assignedTo: 'Marie Martin', nextAction: 'Signature notaire', nextActionDate: '2025-01-20' },
  { id: '2', contact: { name: 'Sophie Bernard', email: 'sophie.bernard@email.ch' }, project: 'Les Jardins', unit: 'Lot B-102', price: 650000, stage: 'offer', assignedTo: 'Pierre Blanc', nextAction: 'Contre-offre', nextActionDate: '2025-01-14' },
  { id: '3', contact: { name: 'Thomas Müller', email: 'thomas.muller@email.ch' }, project: 'Résidence du Lac', unit: 'Lot A-205', price: 580000, stage: 'visit', assignedTo: 'Marie Martin', nextAction: 'Visite', nextActionDate: '2025-01-15' },
  { id: '4', contact: { name: 'Claire Weber', email: 'claire.weber@email.ch' }, project: 'Villa Park', unit: 'Lot C-01', price: 1450000, stage: 'lead', assignedTo: 'Pierre Blanc', nextAction: 'Premier appel', nextActionDate: '2025-01-13' },
];

const stageConfig: Record<string, { label: string; variant: 'neutral' | 'info' | 'warning' | 'success' }> = {
  lead: { label: 'Prospect', variant: 'neutral' },
  visit: { label: 'Visite', variant: 'info' },
  offer: { label: 'Offre', variant: 'warning' },
  reserved: { label: 'Réservé', variant: 'success' },
  signed: { label: 'Signé', variant: 'success' },
};

export function SalesPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('pipeline');
  const [stageFilter, setStageFilter] = useState('all');

  const filteredLeads = mockSalesLeads.filter((lead) => {
    const matchesSearch = lead.contact.name.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <PageShell
      title="Ventes"
      subtitle="Pipeline commercial"
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>Exporter</Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>Nouveau prospect</Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Pipeline total" value="CHF 18.9M" icon={<DollarSign className="h-5 w-5" />} iconBgClass="bg-brand-100" iconColorClass="text-brand-600" />
        <StatCard label="Prospects" value="52" icon={<Users className="h-5 w-5" />} iconBgClass="bg-info-100" iconColorClass="text-info-600" />
        <StatCard label="Ventes ce mois" value="3" icon={<Target className="h-5 w-5" />} iconBgClass="bg-success-100" iconColorClass="text-success-600" />
        <StatCard label="Taux conversion" value="12.5%" icon={<Percent className="h-5 w-5" />} iconBgClass="bg-warning-100" iconColorClass="text-warning-600" />
        <StatCard label="Prix moyen" value="CHF 780K" icon={<TrendingUp className="h-5 w-5" />} iconBgClass="bg-neutral-100" iconColorClass="text-neutral-600" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
          </TabsList>
          {activeTab === 'list' && (
            <div className="flex items-center gap-3">
              <SearchInput placeholder="Rechercher..." onSearch={setSearch} className="w-64" />
              <Select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="w-36">
                <option value="all">Tous</option>
                <option value="lead">Prospect</option>
                <option value="visit">Visite</option>
                <option value="offer">Offre</option>
                <option value="reserved">Réservé</option>
              </Select>
            </div>
          )}
        </div>

        <TabsContent value="pipeline">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {mockPipelineStages.map((stage) => (
              <ContentCard key={stage.id} className="text-center">
                <div className={`h-2 ${stage.color} rounded-full mb-4`} />
                <h3 className="font-semibold text-neutral-900 dark:text-white">{stage.name}</h3>
                <p className="text-2xl font-bold">{stage.count}</p>
                <p className="text-sm text-neutral-500">{formatCurrency(stage.value)}</p>
              </ContentCard>
            ))}
          </div>
          <ContentCard>
            <h3 className="font-semibold mb-6">Entonnoir de conversion</h3>
            <div className="space-y-3">
              {mockPipelineStages.map((stage) => {
                const width = (stage.count / mockPipelineStages[0].count) * 100;
                return (
                  <div key={stage.id} className="flex items-center gap-4">
                    <div className="w-28 text-sm text-neutral-600">{stage.name}</div>
                    <div className="flex-1"><div className={`h-10 ${stage.color} rounded-lg flex items-center justify-center`} style={{ width: `${width}%` }}><span className="text-white font-semibold text-sm">{stage.count}</span></div></div>
                    <div className="w-28 text-right text-sm font-medium">{formatCurrency(stage.value)}</div>
                  </div>
                );
              })}
            </div>
          </ContentCard>
        </TabsContent>

        <TabsContent value="list">
          {filteredLeads.length === 0 ? (
            <EmptyState icon={<Users className="h-8 w-8" />} title="Aucun prospect" description="Ajoutez votre premier prospect" action={{ label: "Nouveau prospect", onClick: () => {} }} />
          ) : (
            <ContentCard padding="none">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-neutral-50 dark:bg-neutral-800/50">
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase px-6 py-3">Contact</th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase px-6 py-3">Projet</th>
                    <th className="text-right text-xs font-semibold text-neutral-500 uppercase px-6 py-3">Prix</th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase px-6 py-3">Stade</th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><Avatar name={lead.contact.name} size="sm" /><div><p className="font-medium">{lead.contact.name}</p><p className="text-xs text-neutral-500 flex items-center gap-1"><Mail className="h-3 w-3" />{lead.contact.email}</p></div></div></td>
                      <td className="px-6 py-4"><p className="font-medium">{lead.project}</p><p className="text-xs text-neutral-500">{lead.unit}</p></td>
                      <td className="px-6 py-4 text-right font-semibold">{formatCurrency(lead.price)}</td>
                      <td className="px-6 py-4"><Badge variant={stageConfig[lead.stage].variant} size="sm">{stageConfig[lead.stage].label}</Badge></td>
                      <td className="px-6 py-4"><p className="text-sm">{lead.nextAction}</p><p className="text-xs text-neutral-500">{new Date(lead.nextActionDate).toLocaleDateString('fr-CH')}</p></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ContentCard>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <ContentCard>
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Agenda commercial</h3>
              <p className="text-neutral-500 mb-6">Visualisez les rendez-vous et échéances.</p>
              <Button variant="primary">Vue mensuelle</Button>
            </div>
          </ContentCard>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
