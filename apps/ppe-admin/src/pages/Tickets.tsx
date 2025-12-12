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
  Building,
  Clock,
  User,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle2,
  Circle,
  ArrowUpCircle,
  Wrench,
  MessageSquare,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const mockTickets = [
  {
    id: '1',
    title: 'Fuite robinet cuisine apt 3.01',
    description: 'Le robinet de la cuisine fuit depuis 2 jours',
    property: 'Résidence Les Alpes',
    lot: 'A-301',
    reporter: 'Marie Dupont',
    priority: 'high',
    status: 'open',
    category: 'Plomberie',
    createdAt: '2025-01-12T10:30:00',
    updatedAt: '2025-01-12T14:00:00',
    assignee: 'Plomberie Express SA',
    comments: 3,
  },
  {
    id: '2',
    title: 'Ampoule grillée hall entrée',
    description: "L'ampoule du hall d'entrée principal est grillée",
    property: 'Résidence Les Alpes',
    lot: null,
    reporter: 'Concierge',
    priority: 'low',
    status: 'in_progress',
    category: 'Électricité',
    createdAt: '2025-01-11T08:00:00',
    updatedAt: '2025-01-12T09:00:00',
    assignee: 'Électricien SA',
    comments: 1,
  },
  {
    id: '3',
    title: 'Ascenseur bloqué',
    description: "L'ascenseur est bloqué au 2ème étage",
    property: 'Immeuble Lac-Léman',
    lot: null,
    reporter: 'Pierre Martin',
    priority: 'urgent',
    status: 'open',
    category: 'Ascenseur',
    createdAt: '2025-01-12T16:45:00',
    updatedAt: '2025-01-12T16:45:00',
    assignee: null,
    comments: 0,
  },
  {
    id: '4',
    title: 'Interphone ne fonctionne plus',
    description: "L'interphone de l'appartement ne sonne plus",
    property: 'Copropriété du Parc',
    lot: 'C-102',
    reporter: 'Jean Müller',
    priority: 'medium',
    status: 'resolved',
    category: 'Électricité',
    createdAt: '2025-01-08T11:00:00',
    updatedAt: '2025-01-10T15:30:00',
    assignee: 'Électricien SA',
    comments: 5,
  },
  {
    id: '5',
    title: 'Vitre fissurée cage escalier',
    description: 'Une vitre est fissurée au 4ème étage',
    property: 'Résidence Les Alpes',
    lot: null,
    reporter: 'Sophie Bernard',
    priority: 'medium',
    status: 'pending',
    category: 'Vitrerie',
    createdAt: '2025-01-05T14:20:00',
    updatedAt: '2025-01-06T10:00:00',
    assignee: 'Vitrier SA',
    comments: 2,
  },
];

const priorityConfig = {
  urgent: { label: 'Urgent', variant: 'error' as const, icon: AlertCircle },
  high: { label: 'Élevée', variant: 'warning' as const, icon: ArrowUpCircle },
  medium: { label: 'Moyenne', variant: 'info' as const, icon: Circle },
  low: { label: 'Basse', variant: 'neutral' as const, icon: Circle },
};

const statusConfig = {
  open: { label: 'Ouvert', variant: 'error' as const },
  in_progress: { label: 'En cours', variant: 'warning' as const },
  pending: { label: 'En attente', variant: 'info' as const },
  resolved: { label: 'Résolu', variant: 'success' as const },
  closed: { label: 'Fermé', variant: 'neutral' as const },
};

export function TicketsPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.property.toLowerCase().includes(search.toLowerCase()) ||
      ticket.category.toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'open' && (ticket.status === 'open' || ticket.status === 'in_progress')) ||
      (activeTab === 'resolved' && (ticket.status === 'resolved' || ticket.status === 'closed'));

    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesProperty = propertyFilter === 'all' || ticket.property === propertyFilter;

    return matchesSearch && matchesTab && matchesPriority && matchesProperty;
  });

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Il y a moins d'une heure";
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-CH');
  };

  const openCount = mockTickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length;
  const urgentCount = mockTickets.filter((t) => t.priority === 'urgent' && t.status !== 'resolved').length;

  return (
    <PageShell
      title="Tickets & Interventions"
      subtitle={`${openCount} tickets ouverts${urgentCount > 0 ? ` · ${urgentCount} urgent${urgentCount > 1 ? 's' : ''}` : ''}`}
      actions={
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
          Nouveau ticket
        </Button>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">Tous ({mockTickets.length})</TabsTrigger>
            <TabsTrigger value="open">Ouverts ({openCount})</TabsTrigger>
            <TabsTrigger value="resolved">Résolus</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 flex-wrap">
            <SearchInput
              placeholder="Rechercher..."
              onSearch={setSearch}
              className="w-full sm:w-64"
            />
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-40"
            >
              <option value="all">Toutes priorités</option>
              <option value="urgent">Urgent</option>
              <option value="high">Élevée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </Select>
            <Select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="w-48"
            >
              <option value="all">Tous les immeubles</option>
              <option value="Résidence Les Alpes">Résidence Les Alpes</option>
              <option value="Immeuble Lac-Léman">Immeuble Lac-Léman</option>
              <option value="Copropriété du Parc">Copropriété du Parc</option>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab}>
          {filteredTickets.length === 0 ? (
            <EmptyState
              icon={<Wrench className="h-8 w-8" />}
              title="Aucun ticket trouvé"
              description={
                search || priorityFilter !== 'all' || propertyFilter !== 'all'
                  ? "Aucun résultat ne correspond à vos filtres"
                  : "Créez votre premier ticket d'intervention"
              }
              action={
                !search && priorityFilter === 'all' && propertyFilter === 'all'
                  ? {
                      label: "Créer un ticket",
                      onClick: () => {},
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => {
                const priority = priorityConfig[ticket.priority as keyof typeof priorityConfig];
                const status = statusConfig[ticket.status as keyof typeof statusConfig];
                const PriorityIcon = priority.icon;

                return (
                  <ContentCard key={ticket.id} className="hover:border-brand-300 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Main content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <PriorityIcon
                              className={`h-5 w-5 ${
                                ticket.priority === 'urgent'
                                  ? 'text-error-500'
                                  : ticket.priority === 'high'
                                  ? 'text-warning-500'
                                  : 'text-neutral-400'
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <Link
                                to={`/tickets/${ticket.id}`}
                                className="font-semibold text-neutral-900 dark:text-white hover:text-brand-500 transition-colors"
                              >
                                {ticket.title}
                              </Link>
                              <Badge variant={status.variant} size="sm">
                                {status.label}
                              </Badge>
                              <Badge variant="outline" size="sm">
                                {ticket.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1 mb-2">
                              {ticket.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-neutral-500 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Building className="h-3.5 w-3.5" />
                                {ticket.property}
                                {ticket.lot && ` · ${ticket.lot}`}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                {ticket.reporter}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {formatTimeAgo(ticket.createdAt)}
                              </span>
                              {ticket.comments > 0 && (
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3.5 w-3.5" />
                                  {ticket.comments}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Assignee & Actions */}
                      <div className="flex items-center gap-3 lg:flex-shrink-0">
                        {ticket.assignee ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <Avatar name={ticket.assignee} size="xs" />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {ticket.assignee}
                            </span>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm">
                            Assigner
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
                          <DropdownItem icon={<Eye className="h-4 w-4" />}>
                            <Link to={`/tickets/${ticket.id}`}>Voir le détail</Link>
                          </DropdownItem>
                          <DropdownItem icon={<Edit className="h-4 w-4" />}>
                            Modifier
                          </DropdownItem>
                          {ticket.status !== 'resolved' && (
                            <DropdownItem icon={<CheckCircle2 className="h-4 w-4" />}>
                              Marquer résolu
                            </DropdownItem>
                          )}
                          <DropdownSeparator />
                          <DropdownItem icon={<Trash2 className="h-4 w-4" />} destructive>
                            Supprimer
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
