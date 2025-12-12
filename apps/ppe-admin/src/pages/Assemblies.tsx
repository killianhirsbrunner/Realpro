import { useState } from 'react';
import {
  Button,
  SearchInput,
  Badge,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  Skeleton,
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
  Calendar,
  Building,
  Users,
  Clock,
  FileText,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const mockAssemblies = [
  {
    id: '1',
    title: 'Assemblée générale ordinaire 2025',
    property: 'Résidence Les Alpes',
    date: '2025-01-15T18:00:00',
    location: 'Salle communale, Rue du Lac 12',
    status: 'scheduled',
    attendees: 18,
    totalOwners: 24,
    agendaItems: 8,
  },
  {
    id: '2',
    title: 'AG extraordinaire - Travaux toiture',
    property: 'Copropriété du Parc',
    date: '2025-01-08T19:00:00',
    location: 'En ligne (Zoom)',
    status: 'in_progress',
    attendees: 22,
    totalOwners: 32,
    agendaItems: 3,
  },
  {
    id: '3',
    title: 'Assemblée générale ordinaire 2024',
    property: 'Résidence Les Alpes',
    date: '2024-06-20T18:00:00',
    location: 'Salle communale, Rue du Lac 12',
    status: 'completed',
    attendees: 20,
    totalOwners: 24,
    agendaItems: 12,
  },
  {
    id: '4',
    title: 'AG extraordinaire - Ascenseur',
    property: 'Immeuble Lac-Léman',
    date: '2024-03-15T17:30:00',
    location: 'Local technique, sous-sol',
    status: 'completed',
    attendees: 14,
    totalOwners: 16,
    agendaItems: 4,
  },
];

const statusConfig = {
  scheduled: { label: 'Planifiée', variant: 'info' as const, icon: Clock },
  in_progress: { label: 'En cours', variant: 'warning' as const, icon: PlayCircle },
  completed: { label: 'Terminée', variant: 'success' as const, icon: CheckCircle2 },
  cancelled: { label: 'Annulée', variant: 'error' as const, icon: AlertCircle },
};

export function AssembliesPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading] = useState(false);

  const filteredAssemblies = mockAssemblies.filter((assembly) => {
    const matchesSearch =
      assembly.title.toLowerCase().includes(search.toLowerCase()) ||
      assembly.property.toLowerCase().includes(search.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'upcoming')
      return matchesSearch && (assembly.status === 'scheduled' || assembly.status === 'in_progress');
    if (activeTab === 'completed') return matchesSearch && assembly.status === 'completed';
    return matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('fr-CH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('fr-CH', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  return (
    <PageShell
      title="Assemblées générales"
      subtitle="Planification et suivi des AG"
      actions={
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
          Nouvelle assemblée
        </Button>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="completed">Terminées</TabsTrigger>
          </TabsList>
          <SearchInput
            placeholder="Rechercher..."
            onSearch={setSearch}
            className="sm:w-64"
          />
        </div>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <ContentCard key={i}>
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </ContentCard>
              ))}
            </div>
          ) : filteredAssemblies.length === 0 ? (
            <EmptyState
              icon={<Calendar className="h-8 w-8" />}
              title="Aucune assemblée trouvée"
              description={
                search
                  ? "Aucun résultat ne correspond à votre recherche"
                  : "Planifiez votre première assemblée générale"
              }
              action={
                !search
                  ? {
                      label: "Planifier une AG",
                      onClick: () => {},
                    }
                  : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAssemblies.map((assembly) => {
                const status = statusConfig[assembly.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                const { date, time } = formatDate(assembly.date);

                return (
                  <ContentCard key={assembly.id} className="group">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant={status.variant} size="sm">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                      <Dropdown
                        align="right"
                        trigger={
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      >
                        <DropdownItem icon={<Eye className="h-4 w-4" />}>
                          <Link to={`/meetings/${assembly.id}`}>Voir le détail</Link>
                        </DropdownItem>
                        <DropdownItem icon={<Edit className="h-4 w-4" />}>
                          Modifier
                        </DropdownItem>
                        <DropdownItem icon={<FileText className="h-4 w-4" />}>
                          Télécharger le PV
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem icon={<Trash2 className="h-4 w-4" />} destructive>
                          Supprimer
                        </DropdownItem>
                      </Dropdown>
                    </div>

                    <Link to={`/meetings/${assembly.id}`}>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-brand-500 transition-colors mb-3">
                        {assembly.title}
                      </h3>
                    </Link>

                    <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>{assembly.property}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{date} à {time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {assembly.attendees}/{assembly.totalOwners} présents
                          <span className="text-neutral-400 ml-1">
                            ({Math.round((assembly.attendees / assembly.totalOwners) * 100)}%)
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                      <span className="text-xs text-neutral-500">
                        {assembly.agendaItems} points à l'ordre du jour
                      </span>
                      {assembly.status === 'scheduled' && (
                        <Button variant="ghost" size="sm">
                          Convoquer
                        </Button>
                      )}
                      {assembly.status === 'completed' && (
                        <Button variant="ghost" size="sm" leftIcon={<FileText className="h-3.5 w-3.5" />}>
                          Voir le PV
                        </Button>
                      )}
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
