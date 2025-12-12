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
import { StatCard } from '@realpro/ui';
import {
  Plus,
  MoreHorizontal,
  LogIn,
  LogOut,
  Calendar,
  FileText,
  Edit,
  Eye,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
  ClipboardList,
  Home,
} from 'lucide-react';

// Mock data - États des lieux
const mockMoveEvents = [
  {
    id: '1',
    type: 'move_in',
    property: 'Résidence Lac-Léman',
    unit: 'Appartement 3.5 pièces - 2ème',
    tenant: { name: 'Marie Dupont', email: 'marie.dupont@email.ch' },
    scheduledDate: '2025-01-15',
    scheduledTime: '14:00',
    status: 'scheduled',
    inspector: 'Jean-Pierre Rochat',
    previousTenant: null,
  },
  {
    id: '2',
    type: 'move_out',
    property: 'Immeuble Centre-Ville',
    unit: 'Studio - 4ème',
    tenant: { name: 'Pierre Martin', email: 'pierre.martin@email.ch' },
    scheduledDate: '2025-01-10',
    scheduledTime: '10:00',
    status: 'completed',
    inspector: 'Jean-Pierre Rochat',
    damages: [
      { location: 'Cuisine', description: 'Traces sur mur', cost: 150 },
      { location: 'Salle de bain', description: 'Joint silicone usé', cost: 80 },
    ],
  },
  {
    id: '3',
    type: 'move_in',
    property: 'Immeuble Centre-Ville',
    unit: 'Studio - 4ème',
    tenant: { name: 'Sophie Bernard', email: 'sophie.bernard@email.ch' },
    scheduledDate: '2025-01-18',
    scheduledTime: '09:00',
    status: 'pending_confirmation',
    inspector: null,
    previousTenant: 'Pierre Martin',
  },
  {
    id: '4',
    type: 'move_out',
    property: 'Villa des Roses',
    unit: 'Maison 6 pièces',
    tenant: { name: 'Jean Müller', email: 'jean.muller@email.ch' },
    scheduledDate: '2025-01-20',
    scheduledTime: '14:00',
    status: 'in_progress',
    inspector: 'Marie Blanc',
    damages: [],
  },
  {
    id: '5',
    type: 'move_out',
    property: 'Résidence Lac-Léman',
    unit: '4.5 pièces - RDC',
    tenant: { name: 'Lisa Weber', email: 'lisa.weber@email.ch' },
    scheduledDate: '2025-02-01',
    scheduledTime: '11:00',
    status: 'scheduled',
    inspector: 'Jean-Pierre Rochat',
    damages: [],
  },
];

const mockStats = {
  scheduledThisMonth: 8,
  completedThisMonth: 5,
  pendingConfirmation: 2,
  totalDamagesCost: 1250,
};

const statusConfig = {
  scheduled: { label: 'Planifié', variant: 'info' as const, icon: Calendar },
  pending_confirmation: { label: 'À confirmer', variant: 'warning' as const, icon: Clock },
  in_progress: { label: 'En cours', variant: 'info' as const, icon: ClipboardList },
  completed: { label: 'Terminé', variant: 'success' as const, icon: CheckCircle2 },
  cancelled: { label: 'Annulé', variant: 'neutral' as const, icon: AlertCircle },
};

const typeConfig = {
  move_in: { label: 'Entrée', variant: 'success' as const, icon: LogIn },
  move_out: { label: 'Sortie', variant: 'warning' as const, icon: LogOut },
};

export function MoveInOutPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEvents = mockMoveEvents.filter((event) => {
    const matchesSearch =
      event.tenant.name.toLowerCase().includes(search.toLowerCase()) ||
      event.property.toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'move_in' && event.type === 'move_in') ||
      (activeTab === 'move_out' && event.type === 'move_out');

    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;

    return matchesSearch && matchesTab && matchesStatus;
  });

  const moveInCount = mockMoveEvents.filter((e) => e.type === 'move_in').length;
  const moveOutCount = mockMoveEvents.filter((e) => e.type === 'move_out').length;

  return (
    <PageShell
      title="États des lieux"
      subtitle="Entrées et sorties de locataires"
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Exporter
          </Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Planifier un état des lieux
          </Button>
        </div>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Planifiés ce mois"
          value={mockStats.scheduledThisMonth.toString()}
          icon={<Calendar className="h-5 w-5" />}
          iconBgClass="bg-brand-100 dark:bg-brand-900"
          iconColorClass="text-brand-600 dark:text-brand-400"
        />
        <StatCard
          label="Réalisés ce mois"
          value={mockStats.completedThisMonth.toString()}
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconBgClass="bg-success-100 dark:bg-success-900"
          iconColorClass="text-success-600 dark:text-success-400"
        />
        <StatCard
          label="À confirmer"
          value={mockStats.pendingConfirmation.toString()}
          icon={<Clock className="h-5 w-5" />}
          iconBgClass="bg-warning-100 dark:bg-warning-900"
          iconColorClass="text-warning-600 dark:text-warning-400"
        />
        <StatCard
          label="Dégâts facturés"
          value={`CHF ${mockStats.totalDamagesCost.toLocaleString('fr-CH')}`}
          icon={<AlertCircle className="h-5 w-5" />}
          iconBgClass="bg-error-100 dark:bg-error-900"
          iconColorClass="text-error-600 dark:text-error-400"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">Tous ({mockMoveEvents.length})</TabsTrigger>
            <TabsTrigger value="move_in">
              <LogIn className="h-4 w-4 mr-1" />
              Entrées ({moveInCount})
            </TabsTrigger>
            <TabsTrigger value="move_out">
              <LogOut className="h-4 w-4 mr-1" />
              Sorties ({moveOutCount})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 flex-wrap">
            <SearchInput
              placeholder="Rechercher..."
              onSearch={setSearch}
              className="w-full sm:w-64"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            >
              <option value="all">Tous les statuts</option>
              <option value="scheduled">Planifiés</option>
              <option value="pending_confirmation">À confirmer</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminés</option>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab}>
          {filteredEvents.length === 0 ? (
            <EmptyState
              icon={<Home className="h-8 w-8" />}
              title="Aucun état des lieux trouvé"
              description={
                search || statusFilter !== 'all'
                  ? "Aucun résultat ne correspond à vos filtres"
                  : "Planifiez votre premier état des lieux"
              }
              action={
                !search && statusFilter === 'all'
                  ? {
                      label: "Planifier un état des lieux",
                      onClick: () => {},
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const status = statusConfig[event.status as keyof typeof statusConfig];
                const type = typeConfig[event.type as keyof typeof typeConfig];
                const StatusIcon = status.icon;
                const TypeIcon = type.icon;

                return (
                  <ContentCard key={event.id} className="hover:border-brand-300 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Left section */}
                      <div className="flex items-start gap-4">
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                            event.type === 'move_in'
                              ? 'bg-success-100 dark:bg-success-900'
                              : 'bg-warning-100 dark:bg-warning-900'
                          }`}
                        >
                          <TypeIcon
                            className={`h-6 w-6 ${
                              event.type === 'move_in'
                                ? 'text-success-600 dark:text-success-400'
                                : 'text-warning-600 dark:text-warning-400'
                            }`}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={type.variant} size="sm">
                              {type.label}
                            </Badge>
                            <Badge variant={status.variant} size="sm">
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>

                          <h3 className="font-semibold text-neutral-900 dark:text-white">
                            {event.property}
                          </h3>
                          <p className="text-sm text-neutral-500">{event.unit}</p>

                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-2">
                              <Avatar name={event.tenant.name} size="xs" />
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                {event.tenant.name}
                              </span>
                            </div>
                            {event.previousTenant && (
                              <span className="text-xs text-neutral-400">
                                (suite à {event.previousTenant})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Center section - Date and Inspector */}
                      <div className="flex items-center gap-6 lg:gap-8">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-neutral-500 text-xs mb-1">
                            <Calendar className="h-3 w-3" />
                            Date prévue
                          </div>
                          <p className="font-semibold text-neutral-900 dark:text-white">
                            {new Date(event.scheduledDate).toLocaleDateString('fr-CH')}
                          </p>
                          <p className="text-xs text-neutral-500">{event.scheduledTime}</p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center gap-1 text-neutral-500 text-xs mb-1">
                            <ClipboardList className="h-3 w-3" />
                            Inspecteur
                          </div>
                          <p className="text-sm text-neutral-900 dark:text-white">
                            {event.inspector || '-'}
                          </p>
                        </div>

                        {event.status === 'completed' && event.damages && event.damages.length > 0 && (
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-neutral-500 text-xs mb-1">
                              <AlertCircle className="h-3 w-3" />
                              Dégâts
                            </div>
                            <p className="font-semibold text-error-600 dark:text-error-400">
                              CHF{' '}
                              {event.damages
                                .reduce((sum, d) => sum + d.cost, 0)
                                .toLocaleString('fr-CH')}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {event.damages.length} élément(s)
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right section - Actions */}
                      <div className="flex items-center gap-2">
                        {event.status === 'pending_confirmation' && (
                          <Button variant="primary" size="sm">
                            Confirmer
                          </Button>
                        )}
                        {event.status === 'scheduled' && (
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Camera className="h-3.5 w-3.5" />}
                          >
                            Démarrer
                          </Button>
                        )}
                        {event.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<FileText className="h-3.5 w-3.5" />}
                          >
                            Voir PV
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
                            Télécharger le PV
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
      </Tabs>
    </PageShell>
  );
}
