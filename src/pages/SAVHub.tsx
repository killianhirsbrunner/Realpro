import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useSAV } from '../hooks/useSAV';
import {
  Wrench,
  Shield,
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  TrendingUp,
  AlertTriangle,
  Calendar,
  FileText,
} from 'lucide-react';
import clsx from 'clsx';

export function SAVHub() {
  const navigate = useNavigate();
  const [projectId] = useState<string | null>(null);
  const { tickets, loading } = useSAV(projectId || undefined);

  const quickActions = [
    {
      title: 'Nouveau Ticket',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      path: '/sav/tickets/new',
    },
    {
      title: 'Planifier Intervention',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/sav/interventions/new',
    },
    {
      title: 'Nouvelle Réception',
      icon: ClipboardCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/sav/handovers/new',
    },
    {
      title: 'Rapport SAV',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/sav/reports/new',
    },
  ];

  const modules = [
    {
      id: 'tickets',
      title: 'Tickets SAV',
      description: 'Gestion des demandes et réclamations',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      path: '/sav/tickets',
      stats: {
        open: tickets?.filter((t) => t.status === 'open').length || 0,
        urgent: tickets?.filter((t) => t.priority === 'urgent').length || 0,
      },
    },
    {
      id: 'warranties',
      title: 'Garanties',
      description: 'Suivi des garanties et couvertures',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/sav/warranties',
      stats: { active: 45, expiring: 5 },
    },
    {
      id: 'handovers',
      title: 'Réceptions de Lots',
      description: 'Procès-verbaux de réception',
      icon: ClipboardCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/sav/handovers',
      stats: { completed: 28, pending: 4 },
    },
    {
      id: 'interventions',
      title: 'Interventions',
      description: 'Planning des interventions SAV',
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      path: '/sav/interventions',
      stats: { scheduled: 12, completed: 156 },
    },
    {
      id: 'issues',
      title: 'Problèmes Récurrents',
      description: 'Analyse des problèmes fréquents',
      icon: AlertTriangle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/sav/issues',
      stats: { identified: 8 },
    },
    {
      id: 'reports',
      title: 'Rapports SAV',
      description: 'Analytics et statistiques',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      path: '/sav/reports',
      stats: { reports: 24 },
    },
  ];

  const kpis = [
    {
      title: 'Tickets Ouverts',
      value: tickets?.filter((t) => t.status === 'open').length || 0,
      change: '-3 cette semaine',
      isPositive: true,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Taux de Résolution',
      value: '94%',
      change: '+2% ce mois',
      isPositive: true,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Temps Moyen',
      value: '2.3j',
      change: '-0.5j',
      isPositive: true,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Satisfaction Client',
      value: '4.6/5',
      change: '+0.2 ce mois',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const urgentTickets = tickets?.filter((t) => t.priority === 'urgent').slice(0, 5) || [];

  const upcomingInterventions = [
    {
      id: '1',
      title: 'Réparation fuite salle de bain',
      lot: 'A3.05',
      date: '2024-12-10 09:00',
      technician: 'Jean Dupont',
      status: 'scheduled',
    },
    {
      id: '2',
      title: 'Remplacement fenêtre défectueuse',
      lot: 'B2.12',
      date: '2024-12-10 14:00',
      technician: 'Marie Martin',
      status: 'scheduled',
    },
    {
      id: '3',
      title: 'Inspection garantie toiture',
      lot: 'C1.08',
      date: '2024-12-11 10:00',
      technician: 'Pierre Leclerc',
      status: 'scheduled',
    },
  ];

  return (
    <PageShell
      title="Centre SAV"
      subtitle="Service après-vente et garanties"
      loading={loading}
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/sav/reports')}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Rapports
          </Button>
          <Button onClick={() => navigate('/sav/tickets/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Ticket
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={clsx('p-3 rounded-xl', kpi.bgColor)}>
                    <Icon className={clsx('h-6 w-6', kpi.color)} />
                  </div>
                  <div
                    className={clsx(
                      'text-sm font-medium',
                      kpi.isPositive ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {kpi.change}
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  {kpi.title}
                </p>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {kpi.value}
                </h3>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tickets urgents */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Tickets Urgents
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/sav/tickets?priority=urgent')}
              >
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {urgentTickets.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Aucun ticket urgent
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/10 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    onClick={() => navigate(`/sav/tickets/${ticket.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {ticket.title}
                      </h4>
                      <Badge variant="error" size="sm">
                        Urgent
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 mt-2">
                      <span>Lot {ticket.lot_id}</span>
                      <span>•</span>
                      <span>{new Date(ticket.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Interventions à venir */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Interventions Planifiées
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/sav/interventions')}
              >
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="space-y-3">
              {upcomingInterventions.map((intervention) => (
                <div
                  key={intervention.id}
                  className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {intervention.title}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Lot {intervention.lot} • {intervention.technician}
                      </p>
                    </div>
                    <Badge variant="info" size="sm">
                      Planifié
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-2">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(intervention.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Actions Rapides */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Actions Rapides
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-800 hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all"
                >
                  <div className={clsx('p-3 rounded-xl', action.bgColor)}>
                    <Icon className={clsx('w-5 h-5', action.color)} />
                  </div>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 text-center">
                    {action.title}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Modules */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Modules SAV
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Card
                  key={module.id}
                  className="p-6 hover:shadow-lg-premium transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(module.path)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={clsx('p-3 rounded-xl', module.bgColor)}>
                      <Icon className={clsx('h-6 w-6', module.color)} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-400" />
                  </div>

                  <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    {module.title}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    {module.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {Object.entries(module.stats).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400"
                      >
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          {value}
                        </span>
                        <span>{key}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
