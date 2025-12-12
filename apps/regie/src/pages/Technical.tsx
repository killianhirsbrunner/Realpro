import { useState } from 'react';
import {
  Button,
  SearchInput,
  Badge,
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
import { StatCard } from '@realpro/ui';
import {
  Plus,
  MoreHorizontal,
  Wrench,
  Calendar,
  FileText,
  Edit,
  Eye,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Phone,
  MapPin,
  Building,
  Hammer,
  Thermometer,
  Droplets,
  Zap,
  ShieldAlert,
} from 'lucide-react';

// Mock data - Interventions techniques
const mockInterventions = [
  {
    id: '1',
    reference: 'INT-2025-001',
    title: 'Fuite robinet cuisine',
    category: 'plumbing',
    property: 'Résidence Lac-Léman',
    unit: 'Appartement 3.5 pièces - 2ème',
    tenant: { name: 'Marie Dupont', phone: '+41 79 123 45 67' },
    reportedDate: '2025-01-08',
    scheduledDate: '2025-01-12',
    status: 'scheduled',
    priority: 'medium',
    assignedTo: 'Plomberie Rapide SA',
    estimatedCost: 250,
    description: 'Fuite au niveau du robinet de la cuisine, eau qui goutte en continu.',
  },
  {
    id: '2',
    reference: 'INT-2025-002',
    title: 'Panne chauffage',
    category: 'heating',
    property: 'Immeuble Centre-Ville',
    unit: 'Communs - Chaufferie',
    tenant: null,
    reportedDate: '2025-01-10',
    scheduledDate: '2025-01-10',
    status: 'in_progress',
    priority: 'urgent',
    assignedTo: 'Chauffage Plus SA',
    estimatedCost: 800,
    description: 'Chaudière en panne, plus de chauffage dans l\'immeuble.',
  },
  {
    id: '3',
    reference: 'INT-2024-089',
    title: 'Réparation store',
    category: 'other',
    property: 'Villa des Roses',
    unit: 'Maison 6 pièces',
    tenant: { name: 'Sophie Bernard', phone: '+41 79 234 56 78' },
    reportedDate: '2024-12-20',
    scheduledDate: '2024-12-28',
    status: 'completed',
    priority: 'low',
    assignedTo: 'Stores & Volets Sàrl',
    estimatedCost: 180,
    actualCost: 195,
    description: 'Store du salon bloqué, ne descend plus.',
    completedDate: '2024-12-28',
  },
  {
    id: '4',
    reference: 'INT-2025-003',
    title: 'Court-circuit prise',
    category: 'electrical',
    property: 'Résidence Lac-Léman',
    unit: '4.5 pièces - RDC',
    tenant: { name: 'Jean Müller', phone: '+41 79 345 67 89' },
    reportedDate: '2025-01-11',
    scheduledDate: null,
    status: 'pending',
    priority: 'high',
    assignedTo: null,
    estimatedCost: null,
    description: 'Prise électrique de la chambre fait des étincelles.',
  },
  {
    id: '5',
    reference: 'INT-2025-004',
    title: 'Infiltration d\'eau',
    category: 'plumbing',
    property: 'Immeuble Centre-Ville',
    unit: 'Studio - 4ème',
    tenant: { name: 'Pierre Martin', phone: '+41 79 456 78 90' },
    reportedDate: '2025-01-12',
    scheduledDate: '2025-01-15',
    status: 'scheduled',
    priority: 'high',
    assignedTo: 'Étanchéité Pro SA',
    estimatedCost: 1500,
    description: 'Traces d\'humidité au plafond de la salle de bain.',
  },
];

const mockProviders = [
  { id: '1', name: 'Plomberie Rapide SA', specialty: 'Plomberie', phone: '+41 22 123 45 67' },
  { id: '2', name: 'Chauffage Plus SA', specialty: 'Chauffage', phone: '+41 22 234 56 78' },
  { id: '3', name: 'Électricité Moderne', specialty: 'Électricité', phone: '+41 22 345 67 89' },
  { id: '4', name: 'Stores & Volets Sàrl', specialty: 'Menuiserie', phone: '+41 22 456 78 90' },
];

const mockStats = {
  openTickets: 4,
  urgentTickets: 2,
  completedThisMonth: 12,
  avgResolutionDays: 3.2,
};

const statusConfig = {
  pending: { label: 'En attente', variant: 'warning' as const, icon: Clock },
  scheduled: { label: 'Planifié', variant: 'info' as const, icon: Calendar },
  in_progress: { label: 'En cours', variant: 'info' as const, icon: Wrench },
  completed: { label: 'Terminé', variant: 'success' as const, icon: CheckCircle2 },
  cancelled: { label: 'Annulé', variant: 'neutral' as const, icon: AlertCircle },
};

const priorityConfig = {
  low: { label: 'Basse', variant: 'neutral' as const },
  medium: { label: 'Moyenne', variant: 'info' as const },
  high: { label: 'Haute', variant: 'warning' as const },
  urgent: { label: 'Urgente', variant: 'error' as const },
};

const categoryConfig = {
  plumbing: { label: 'Plomberie', icon: Droplets, color: 'text-blue-500' },
  heating: { label: 'Chauffage', icon: Thermometer, color: 'text-orange-500' },
  electrical: { label: 'Électricité', icon: Zap, color: 'text-yellow-500' },
  security: { label: 'Sécurité', icon: ShieldAlert, color: 'text-red-500' },
  other: { label: 'Autre', icon: Hammer, color: 'text-neutral-500' },
};

export function TechnicalPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('interventions');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredInterventions = mockInterventions.filter((intervention) => {
    const matchesSearch =
      intervention.reference.toLowerCase().includes(search.toLowerCase()) ||
      intervention.title.toLowerCase().includes(search.toLowerCase()) ||
      intervention.property.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || intervention.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || intervention.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openCount = mockInterventions.filter(
    (i) => i.status !== 'completed' && i.status !== 'cancelled'
  ).length;

  return (
    <PageShell
      title="Gestion technique"
      subtitle="Interventions et maintenance"
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Exporter
          </Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Nouvelle intervention
          </Button>
        </div>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Tickets ouverts"
          value={mockStats.openTickets.toString()}
          icon={<Wrench className="h-5 w-5" />}
          iconBgClass="bg-brand-100 dark:bg-brand-900"
          iconColorClass="text-brand-600 dark:text-brand-400"
        />
        <StatCard
          label="Urgents"
          value={mockStats.urgentTickets.toString()}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconBgClass="bg-error-100 dark:bg-error-900"
          iconColorClass="text-error-600 dark:text-error-400"
        />
        <StatCard
          label="Résolus ce mois"
          value={mockStats.completedThisMonth.toString()}
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconBgClass="bg-success-100 dark:bg-success-900"
          iconColorClass="text-success-600 dark:text-success-400"
        />
        <StatCard
          label="Délai moyen"
          value={`${mockStats.avgResolutionDays} jours`}
          icon={<Clock className="h-5 w-5" />}
          iconBgClass="bg-warning-100 dark:bg-warning-900"
          iconColorClass="text-warning-600 dark:text-warning-400"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="interventions">Interventions ({openCount})</TabsTrigger>
            <TabsTrigger value="providers">Prestataires ({mockProviders.length})</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          {activeTab === 'interventions' && (
            <div className="flex items-center gap-3 flex-wrap">
              <SearchInput
                placeholder="Rechercher..."
                onSearch={setSearch}
                className="w-full sm:w-64"
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-36"
              >
                <option value="all">Tous statuts</option>
                <option value="pending">En attente</option>
                <option value="scheduled">Planifiés</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminés</option>
              </Select>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-36"
              >
                <option value="all">Priorité</option>
                <option value="urgent">Urgente</option>
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </Select>
            </div>
          )}
        </div>

        <TabsContent value="interventions">
          {filteredInterventions.length === 0 ? (
            <EmptyState
              icon={<Wrench className="h-8 w-8" />}
              title="Aucune intervention trouvée"
              description={
                search || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? "Aucun résultat ne correspond à vos filtres"
                  : "Créez votre première intervention"
              }
              action={
                !search && statusFilter === 'all' && priorityFilter === 'all'
                  ? {
                      label: "Nouvelle intervention",
                      onClick: () => {},
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredInterventions.map((intervention) => {
                const status = statusConfig[intervention.status as keyof typeof statusConfig];
                const priority = priorityConfig[intervention.priority as keyof typeof priorityConfig];
                const category = categoryConfig[intervention.category as keyof typeof categoryConfig];
                const StatusIcon = status.icon;
                const CategoryIcon = category.icon;

                return (
                  <ContentCard key={intervention.id} className="hover:border-brand-300 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Left section - Icon and main info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                          <CategoryIcon className={`h-6 w-6 ${category.color}`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-mono text-neutral-500">
                              {intervention.reference}
                            </span>
                            <Badge variant={priority.variant} size="sm">
                              {priority.label}
                            </Badge>
                            <Badge variant={status.variant} size="sm">
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>

                          <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                            {intervention.title}
                          </h3>

                          <p className="text-sm text-neutral-500 mb-2 line-clamp-2">
                            {intervention.description}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                            <div className="flex items-center gap-1">
                              <Building className="h-3.5 w-3.5" />
                              <span>{intervention.property}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{intervention.unit}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Center section - Details */}
                      <div className="flex items-center gap-6 lg:gap-8">
                        <div className="text-center">
                          <div className="text-xs text-neutral-500 mb-1">Signalé le</div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            {new Date(intervention.reportedDate).toLocaleDateString('fr-CH')}
                          </p>
                        </div>

                        {intervention.scheduledDate && (
                          <div className="text-center">
                            <div className="text-xs text-neutral-500 mb-1">Intervention</div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {new Date(intervention.scheduledDate).toLocaleDateString('fr-CH')}
                            </p>
                          </div>
                        )}

                        <div className="text-center">
                          <div className="text-xs text-neutral-500 mb-1">Prestataire</div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            {intervention.assignedTo || '-'}
                          </p>
                        </div>

                        {intervention.estimatedCost && (
                          <div className="text-center">
                            <div className="text-xs text-neutral-500 mb-1">Coût estimé</div>
                            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                              CHF {intervention.estimatedCost.toLocaleString('fr-CH')}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right section - Actions */}
                      <div className="flex items-center gap-2">
                        {intervention.status === 'pending' && (
                          <Button variant="primary" size="sm">
                            Assigner
                          </Button>
                        )}
                        {intervention.status === 'in_progress' && (
                          <Button variant="outline" size="sm" leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                            Clôturer
                          </Button>
                        )}
                        {intervention.tenant && (
                          <Button variant="ghost" size="sm" leftIcon={<Phone className="h-3.5 w-3.5" />}>
                            Appeler
                          </Button>
                        )}
                        <Dropdown
                          align="right"
                          trigger={
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          }
                        >
                          <DropdownItem icon={<Eye className="h-4 w-4" />}>Voir le détail</DropdownItem>
                          <DropdownItem icon={<Edit className="h-4 w-4" />}>Modifier</DropdownItem>
                          <DropdownItem icon={<FileText className="h-4 w-4" />}>
                            Générer rapport
                          </DropdownItem>
                          <DropdownSeparator />
                          <DropdownItem icon={<AlertCircle className="h-4 w-4" />} destructive>
                            Annuler
                          </DropdownItem>
                        </Dropdown>
                      </div>
                    </div>
                  </ContentCard>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="providers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProviders.map((provider) => (
              <ContentCard key={provider.id} className="hover:border-brand-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        {provider.name}
                      </h3>
                      <Badge variant="info" size="sm">
                        {provider.specialty}
                      </Badge>
                    </div>
                  </div>
                  <Dropdown
                    align="right"
                    trigger={
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    }
                  >
                    <DropdownItem icon={<Eye className="h-4 w-4" />}>Voir le détail</DropdownItem>
                    <DropdownItem icon={<Edit className="h-4 w-4" />}>Modifier</DropdownItem>
                    <DropdownItem icon={<FileText className="h-4 w-4" />}>Historique</DropdownItem>
                  </Dropdown>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Phone className="h-4 w-4" />
                    <span>{provider.phone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Interventions ce mois</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">3</span>
                  </div>
                </div>
              </ContentCard>
            ))}

            {/* Add provider card */}
            <ContentCard className="border-dashed border-2 hover:border-brand-300 transition-colors cursor-pointer">
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-neutral-400" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                  Ajouter un prestataire
                </h3>
                <p className="text-sm text-neutral-500">
                  Référencez un nouveau prestataire
                </p>
              </div>
            </ContentCard>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <ContentCard>
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Historique des interventions
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                Consultez l'historique complet des interventions techniques par immeuble ou par période.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Select className="w-48">
                  <option value="">Tous les immeubles</option>
                  <option value="1">Résidence Lac-Léman</option>
                  <option value="2">Immeuble Centre-Ville</option>
                  <option value="3">Villa des Roses</option>
                </Select>
                <Select className="w-40">
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </Select>
                <Button variant="primary">Afficher</Button>
              </div>
            </div>
          </ContentCard>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
