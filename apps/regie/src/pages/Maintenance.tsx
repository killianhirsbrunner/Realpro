import { Card, CardHeader, CardContent, Button, Badge } from '@realpro/ui';
import { Wrench, Plus, AlertTriangle, Clock, CheckCircle2, User } from 'lucide-react';

const mockTickets = [
  {
    id: '1',
    title: 'Fuite robinet cuisine',
    property: 'Résidence du Lac',
    unit: 'Apt 3.2',
    tenant: 'Martin Dupont',
    priority: 'high',
    status: 'in_progress',
    createdAt: '10.12.2024',
    assignedTo: 'Plomberie Express SA',
  },
  {
    id: '2',
    title: 'Chauffage défectueux',
    property: 'Immeuble Central',
    unit: 'Apt 1.1',
    tenant: 'Sophie Weber',
    priority: 'urgent',
    status: 'assigned',
    createdAt: '11.12.2024',
    assignedTo: 'Chauffage Pro Sàrl',
  },
  {
    id: '3',
    title: 'Volet roulant bloqué',
    property: 'Résidence du Lac',
    unit: 'Apt 2.1',
    tenant: 'Pierre Favre',
    priority: 'low',
    status: 'open',
    createdAt: '09.12.2024',
    assignedTo: null,
  },
  {
    id: '4',
    title: 'Serrure porte entrée',
    property: 'Commerce Place Neuve',
    unit: 'Local A',
    tenant: 'Marie Rochat',
    priority: 'medium',
    status: 'completed',
    createdAt: '05.12.2024',
    assignedTo: 'Serrurier Rapide',
    completedAt: '08.12.2024',
  },
  {
    id: '5',
    title: 'Infiltration plafond',
    property: 'Immeuble Central',
    unit: 'Apt 2.3',
    tenant: 'Jean Müller',
    priority: 'high',
    status: 'in_progress',
    createdAt: '07.12.2024',
    assignedTo: 'Étanchéité Plus',
  },
];

const priorityConfig = {
  urgent: { label: 'Urgent', variant: 'error' as const },
  high: { label: 'Haute', variant: 'warning' as const },
  medium: { label: 'Moyenne', variant: 'info' as const },
  low: { label: 'Basse', variant: 'default' as const },
};

const statusConfig = {
  open: { label: 'Ouvert', variant: 'default' as const, icon: Clock },
  assigned: { label: 'Assigné', variant: 'info' as const, icon: User },
  in_progress: { label: 'En cours', variant: 'warning' as const, icon: Wrench },
  completed: { label: 'Terminé', variant: 'success' as const, icon: CheckCircle2 },
};

export function MaintenancePage() {
  const openTickets = mockTickets.filter((t) => t.status !== 'completed').length;
  const urgentTickets = mockTickets.filter((t) => t.priority === 'urgent' && t.status !== 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Interventions
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Gestion des demandes de maintenance
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Nouvelle demande
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{openTickets}</p>
                <p className="text-sm text-neutral-500">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{urgentTickets}</p>
                <p className="text-sm text-neutral-500">Urgents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Wrench className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {mockTickets.filter((t) => t.status === 'in_progress').length}
                </p>
                <p className="text-sm text-neutral-500">En intervention</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  {mockTickets.filter((t) => t.status === 'completed').length}
                </p>
                <p className="text-sm text-neutral-500">Terminés ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Demandes récentes
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {mockTickets.map((ticket) => {
              const StatusIcon = statusConfig[ticket.status as keyof typeof statusConfig].icon;
              return (
                <div
                  key={ticket.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      ticket.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                      ticket.status === 'in_progress' ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      <StatusIcon className={`w-5 h-5 ${
                        ticket.status === 'completed' ? 'text-emerald-600' :
                        ticket.status === 'in_progress' ? 'text-orange-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          {ticket.title}
                        </h3>
                        <Badge
                          variant={priorityConfig[ticket.priority as keyof typeof priorityConfig].variant}
                          size="sm"
                        >
                          {priorityConfig[ticket.priority as keyof typeof priorityConfig].label}
                        </Badge>
                        <Badge
                          variant={statusConfig[ticket.status as keyof typeof statusConfig].variant}
                          size="sm"
                        >
                          {statusConfig[ticket.status as keyof typeof statusConfig].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-500 mt-1">
                        {ticket.property} - {ticket.unit} · {ticket.tenant}
                      </p>
                      {ticket.assignedTo && (
                        <p className="text-sm text-neutral-400 mt-1">
                          Assigné à: {ticket.assignedTo}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm text-neutral-500">
                      <p>Créé le {ticket.createdAt}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {ticket.status === 'open' ? 'Assigner' : 'Détails'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
