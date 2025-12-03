import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Plus,
  Filter,
  TrendingUp,
  Users,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useAfterSales, SavTicket, SavStatus, SavSeverity, SavStatistics } from '@/hooks/useAfterSales';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Table } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';

interface AfterSalesManagerProps {
  projectId: string;
}

export default function AfterSalesManager({ projectId }: AfterSalesManagerProps) {
  const { t } = useTranslation();
  const {
    loading,
    listTickets,
    getStatistics,
    updateStatus,
    assignTicket,
  } = useAfterSales();

  const [tickets, setTickets] = useState<SavTicket[]>([]);
  const [statistics, setStatistics] = useState<SavStatistics | null>(null);
  const [statusFilter, setStatusFilter] = useState<SavStatus | 'ALL'>('ALL');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const loadData = async () => {
    setLoadingTickets(true);

    const filters: any = { projectId };
    if (statusFilter !== 'ALL') {
      filters.status = statusFilter;
    }

    const [ticketsData, statsData] = await Promise.all([
      listTickets(filters),
      getStatistics(projectId),
    ]);

    setTickets(ticketsData);
    setStatistics(statsData);
    setLoadingTickets(false);
  };

  useEffect(() => {
    loadData();
  }, [projectId, statusFilter]);

  const handleStatusChange = async (ticketId: string, newStatus: SavStatus) => {
    await updateStatus(ticketId, newStatus);
    await loadData();
  };

  const formatDate = (iso?: string) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('fr-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const statusOptions = [
    { value: 'ALL', label: 'Tous les statuts' },
    { value: 'NEW', label: 'Nouveaux' },
    { value: 'ASSIGNED', label: 'Assignés' },
    { value: 'IN_PROGRESS', label: 'En cours' },
    { value: 'FIXED', label: 'Corrigés' },
    { value: 'VALIDATED', label: 'Validés' },
    { value: 'CLOSED', label: 'Clôturés' },
  ];

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              SAV & Réserves
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gestion des tickets service après-vente et interventions post-livraison
          </p>
        </div>
        <Button onClick={() => setShowNewTicketModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau ticket
        </Button>
      </header>

      {statistics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={AlertCircle}
            label="Total tickets"
            value={statistics.total_tickets}
            trend={statistics.new_tickets}
            trendLabel="nouveaux"
            color="blue"
          />
          <StatCard
            icon={Clock}
            label="En cours"
            value={statistics.in_progress}
            color="amber"
          />
          <StatCard
            icon={CheckCircle2}
            label="Corrigés"
            value={statistics.fixed_tickets}
            color="emerald"
          />
          <StatCard
            icon={AlertTriangle}
            label="Critiques"
            value={statistics.critical_tickets}
            color="red"
          />
        </div>
      )}

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Liste des tickets
          </h2>
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SavStatus | 'ALL')}
              className="w-48"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {loadingTickets ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Aucun ticket SAV pour le moment
            </p>
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  N° / Lot
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Titre / Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Sévérité
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Assigné à
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Créé le
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        #{ticket.id.substring(0, 8)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Lot {ticket.lot?.lot_number}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="max-w-xs">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                        {ticket.title}
                      </p>
                      {ticket.location && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          📍 {ticket.location}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <SeverityBadge severity={ticket.severity} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      {ticket.assigned_company ? (
                        <p className="text-gray-900 dark:text-gray-50">
                          {ticket.assigned_company.name}
                        </p>
                      ) : (
                        <p className="text-gray-400">Non assigné</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(ticket.created_at)}
                  </td>
                  <td className="px-4 py-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        window.location.href = `/sav/tickets/${ticket.id}`;
                      }}
                    >
                      Voir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  trend?: number;
  trendLabel?: string;
  color: 'blue' | 'amber' | 'emerald' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className={`rounded-lg p-2 ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{value}</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{label}</p>
        {trend !== undefined && trendLabel && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            {trend} {trendLabel}
          </p>
        )}
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: SavStatus }) {
  const config = {
    NEW: { label: 'Nouveau', variant: 'info' as const, icon: AlertCircle },
    ASSIGNED: { label: 'Assigné', variant: 'secondary' as const, icon: Users },
    IN_PROGRESS: { label: 'En cours', variant: 'warning' as const, icon: Clock },
    FIXED: { label: 'Corrigé', variant: 'success' as const, icon: CheckCircle2 },
    VALIDATED: { label: 'Validé', variant: 'success' as const, icon: CheckCircle2 },
    CLOSED: { label: 'Clôturé', variant: 'secondary' as const, icon: CheckCircle2 },
    REJECTED: { label: 'Rejeté', variant: 'error' as const, icon: XCircle },
    EXPIRED: { label: 'Expiré', variant: 'error' as const, icon: Calendar },
  };

  const { label, variant, icon: Icon } = config[status] || config.NEW;

  return (
    <Badge variant={variant} size="sm" className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

function SeverityBadge({ severity }: { severity: SavSeverity }) {
  const config = {
    MINOR: { label: 'Mineur', variant: 'secondary' as const },
    MAJOR: { label: 'Majeur', variant: 'warning' as const },
    CRITICAL: { label: 'Critique', variant: 'error' as const },
    BLOCKING: { label: 'Bloquant', variant: 'error' as const },
  };

  const { label, variant } = config[severity] || config.MINOR;

  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  );
}
