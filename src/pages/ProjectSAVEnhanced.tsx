import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Wrench,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Calendar,
  Building2,
  User,
  ChevronRight,
  Zap,
  Droplets,
  Thermometer,
  DoorOpen,
  Paintbrush,
  Square,
  Home,
  MoreHorizontal,
  RefreshCw,
  Archive,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import {
  useSAVManagement,
  SAVTicket,
  SAVStatus,
  SAVSeverity,
  SAVCategory,
  SAV_STATUS_CONFIG,
  SAV_SEVERITY_CONFIG,
  SAV_CATEGORY_CONFIG,
  CreateTicketData,
  getDaysSinceCreation,
  isTicketOverdue,
} from '../hooks/useSAVManagement';
import { formatDate } from '../lib/utils/format';

// ============================================================================
// Tab Configuration
// ============================================================================

type TabId = 'overview' | 'all' | 'urgent' | 'by-status';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: "Vue d'ensemble", icon: <Wrench className="h-4 w-4" /> },
  { id: 'all', label: 'Tous les tickets', icon: <Archive className="h-4 w-4" /> },
  { id: 'urgent', label: 'Urgents', icon: <AlertTriangle className="h-4 w-4" /> },
  { id: 'by-status', label: 'Par statut', icon: <Filter className="h-4 w-4" /> },
];

// ============================================================================
// Icon Mapping
// ============================================================================

const CATEGORY_ICONS: Record<SAVCategory, React.ReactNode> = {
  PLUMBING: <Droplets className="h-4 w-4" />,
  ELECTRICAL: <Zap className="h-4 w-4" />,
  HVAC: <Thermometer className="h-4 w-4" />,
  CARPENTRY: <DoorOpen className="h-4 w-4" />,
  PAINTING: <Paintbrush className="h-4 w-4" />,
  FLOORING: <Square className="h-4 w-4" />,
  FACADE: <Building2 className="h-4 w-4" />,
  ROOF: <Home className="h-4 w-4" />,
  OTHER: <MoreHorizontal className="h-4 w-4" />,
};

const STATUS_ICONS: Record<SAVStatus, React.ReactNode> = {
  NEW: <AlertCircle className="h-4 w-4" />,
  ASSIGNED: <UserCheck className="h-4 w-4" />,
  IN_PROGRESS: <Wrench className="h-4 w-4" />,
  FIXED: <CheckCircle className="h-4 w-4" />,
  VALIDATED: <CheckCircle className="h-4 w-4" />,
  CLOSED: <Archive className="h-4 w-4" />,
  REJECTED: <XCircle className="h-4 w-4" />,
  EXPIRED: <Clock className="h-4 w-4" />,
};

// ============================================================================
// Main Component
// ============================================================================

export function ProjectSAVEnhanced() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<SAVStatus | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<SAVSeverity | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<SAVCategory | 'all'>('all');

  const {
    tickets,
    summary,
    loading,
    error,
    refresh,
    createTicket,
    updateStatus,
    getOpenTickets,
    getUrgentTickets,
    getOverdueTickets,
  } = useSAVManagement(projectId || '');

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    let result = tickets;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.buyer?.first_name?.toLowerCase().includes(query) ||
          t.buyer?.last_name?.toLowerCase().includes(query) ||
          t.lot?.lot_number?.toLowerCase().includes(query)
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter((t) => t.status === filterStatus);
    }

    if (filterSeverity !== 'all') {
      result = result.filter((t) => t.severity === filterSeverity);
    }

    if (filterCategory !== 'all') {
      result = result.filter((t) => t.category === filterCategory);
    }

    return result;
  }, [tickets, searchQuery, filterStatus, filterSeverity, filterCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <RealProButton variant="outline" onClick={refresh} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reessayer
          </RealProButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <Link
          to={`/projects/${projectId}/overview`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour au projet
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white flex items-center gap-3">
              <Wrench className="h-8 w-8 text-primary-600" />
              SAV / Apres-vente
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {summary?.total || 0} ticket{(summary?.total || 0) > 1 ? 's' : ''} au total -{' '}
              {getOpenTickets().length} en cours
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RealProButton variant="outline" onClick={refresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </RealProButton>
            <RealProButton onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau ticket
            </RealProButton>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          label="Tickets ouverts"
          value={getOpenTickets().length}
          icon={<AlertCircle className="h-5 w-5" />}
          color="blue"
        />
        <KPICard
          label="En attente"
          value={summary?.new || 0}
          icon={<Clock className="h-5 w-5" />}
          color="amber"
        />
        <KPICard
          label="Urgents"
          value={getUrgentTickets().length}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="red"
        />
        <KPICard
          label="En retard"
          value={getOverdueTickets().length}
          icon={<XCircle className="h-5 w-5" />}
          color="orange"
        />
        <KPICard
          label="Resolus (7j)"
          value={summary?.thisWeekClosed || 0}
          icon={<CheckCircle className="h-5 w-5" />}
          color="green"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-700">
        <nav className="flex gap-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab
          summary={summary}
          tickets={tickets}
          getUrgentTickets={getUrgentTickets}
          getOverdueTickets={getOverdueTickets}
          onViewTicket={(id) => navigate(`/projects/${projectId}/sav/${id}`)}
        />
      )}

      {activeTab === 'all' && (
        <AllTicketsTab
          tickets={filteredTickets}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterSeverity={filterSeverity}
          setFilterSeverity={setFilterSeverity}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          onViewTicket={(id) => navigate(`/projects/${projectId}/sav/${id}`)}
          updateStatus={updateStatus}
        />
      )}

      {activeTab === 'urgent' && (
        <UrgentTicketsTab
          tickets={getUrgentTickets()}
          overdueTickets={getOverdueTickets()}
          onViewTicket={(id) => navigate(`/projects/${projectId}/sav/${id}`)}
          updateStatus={updateStatus}
        />
      )}

      {activeTab === 'by-status' && (
        <ByStatusTab
          tickets={tickets}
          onViewTicket={(id) => navigate(`/projects/${projectId}/sav/${id}`)}
          updateStatus={updateStatus}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateTicketModal
          projectId={projectId || ''}
          onClose={() => setShowCreateModal(false)}
          onCreate={createTicket}
        />
      )}
    </div>
  );
}

// ============================================================================
// KPI Card Component
// ============================================================================

interface KPICardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'red' | 'orange' | 'green';
}

function KPICard({ label, value, icon, color }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  };

  return (
    <RealProCard className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
        </div>
      </div>
    </RealProCard>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

interface OverviewTabProps {
  summary: ReturnType<typeof useSAVManagement>['summary'];
  tickets: SAVTicket[];
  getUrgentTickets: () => SAVTicket[];
  getOverdueTickets: () => SAVTicket[];
  onViewTicket: (id: string) => void;
}

function OverviewTab({ summary, tickets, getUrgentTickets, getOverdueTickets, onViewTicket }: OverviewTabProps) {
  const urgentTickets = getUrgentTickets();
  const overdueTickets = getOverdueTickets();
  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stats by Status */}
      <RealProCard className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Repartition par statut
        </h3>
        <div className="space-y-3">
          {(Object.keys(SAV_STATUS_CONFIG) as SAVStatus[]).map((status) => {
            const config = SAV_STATUS_CONFIG[status];
            const count = tickets.filter((t) => t.status === status).length;
            const percent = tickets.length > 0 ? (count / tickets.length) * 100 : 0;

            return (
              <div key={status} className="flex items-center gap-3">
                <div className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
                  {config.label}
                </div>
                <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-neutral-900 dark:text-white w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </RealProCard>

      {/* Stats by Severity */}
      <RealProCard className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Repartition par severite
        </h3>
        <div className="space-y-3">
          {(Object.keys(SAV_SEVERITY_CONFIG) as SAVSeverity[]).map((severity) => {
            const config = SAV_SEVERITY_CONFIG[severity];
            const count = tickets.filter((t) => t.severity === severity).length;

            return (
              <div key={severity} className="flex items-center justify-between">
                <div className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
                  {config.label}
                </div>
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">{count}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Delai moyen resolution</span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              {summary?.avgResolutionDays || 0} jours
            </span>
          </div>
        </div>
      </RealProCard>

      {/* Categories */}
      <RealProCard className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Par categorie
        </h3>
        <div className="space-y-2">
          {(Object.keys(SAV_CATEGORY_CONFIG) as SAVCategory[]).map((category) => {
            const config = SAV_CATEGORY_CONFIG[category];
            const count = tickets.filter((t) => t.category === category).length;
            if (count === 0) return null;

            return (
              <div key={category} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                  {CATEGORY_ICONS[category]}
                  {config.label}
                </div>
                <span className="font-medium text-neutral-900 dark:text-white">{count}</span>
              </div>
            );
          })}
        </div>
      </RealProCard>

      {/* Urgent Tickets */}
      {urgentTickets.length > 0 && (
        <RealProCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Tickets urgents ({urgentTickets.length})
            </h3>
          </div>
          <div className="space-y-2">
            {urgentTickets.slice(0, 5).map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} onClick={() => onViewTicket(ticket.id)} />
            ))}
          </div>
        </RealProCard>
      )}

      {/* Overdue Tickets */}
      {overdueTickets.length > 0 && (
        <RealProCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              En retard ({overdueTickets.length})
            </h3>
          </div>
          <div className="space-y-2">
            {overdueTickets.slice(0, 5).map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} onClick={() => onViewTicket(ticket.id)} compact />
            ))}
          </div>
        </RealProCard>
      )}

      {/* Recent Tickets */}
      <RealProCard className="p-6 lg:col-span-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Tickets recents
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                  Titre
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                  Acheteur
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                  Lot
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                  Severite
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                  Statut
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                  Cree
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                  onClick={() => onViewTicket(ticket.id)}
                >
                  <td className="py-3 px-4">
                    <span className="font-medium text-neutral-900 dark:text-white">{ticket.title}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-300">
                    {ticket.buyer ? `${ticket.buyer.first_name} ${ticket.buyer.last_name}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-neutral-900 dark:text-white">
                    {ticket.lot?.lot_number || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${SAV_SEVERITY_CONFIG[ticket.severity].color}`}>
                      {SAV_SEVERITY_CONFIG[ticket.severity].label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${SAV_STATUS_CONFIG[ticket.status].color}`}>
                      {SAV_STATUS_CONFIG[ticket.status].label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-500">
                    {getDaysSinceCreation(ticket.created_at)}j
                  </td>
                  <td className="py-3 px-4">
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RealProCard>
    </div>
  );
}

// ============================================================================
// All Tickets Tab
// ============================================================================

interface AllTicketsTabProps {
  tickets: SAVTicket[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterStatus: SAVStatus | 'all';
  setFilterStatus: (s: SAVStatus | 'all') => void;
  filterSeverity: SAVSeverity | 'all';
  setFilterSeverity: (s: SAVSeverity | 'all') => void;
  filterCategory: SAVCategory | 'all';
  setFilterCategory: (c: SAVCategory | 'all') => void;
  onViewTicket: (id: string) => void;
  updateStatus: (id: string, status: SAVStatus) => Promise<void>;
}

function AllTicketsTab({
  tickets,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterSeverity,
  setFilterSeverity,
  filterCategory,
  setFilterCategory,
  onViewTicket,
  updateStatus,
}: AllTicketsTabProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <RealProCard className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as SAVStatus | 'all')}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
          >
            <option value="all">Tous les statuts</option>
            {(Object.keys(SAV_STATUS_CONFIG) as SAVStatus[]).map((status) => (
              <option key={status} value={status}>
                {SAV_STATUS_CONFIG[status].label}
              </option>
            ))}
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as SAVSeverity | 'all')}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
          >
            <option value="all">Toutes severites</option>
            {(Object.keys(SAV_SEVERITY_CONFIG) as SAVSeverity[]).map((severity) => (
              <option key={severity} value={severity}>
                {SAV_SEVERITY_CONFIG[severity].label}
              </option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as SAVCategory | 'all')}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
          >
            <option value="all">Toutes categories</option>
            {(Object.keys(SAV_CATEGORY_CONFIG) as SAVCategory[]).map((category) => (
              <option key={category} value={category}>
                {SAV_CATEGORY_CONFIG[category].label}
              </option>
            ))}
          </select>
        </div>
      </RealProCard>

      {/* Tickets Table */}
      <RealProCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                  Titre
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                  Acheteur / Lot
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                  Categorie
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                  Severite
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                  Statut
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                  Assigne
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                  Age
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    Aucun ticket trouve
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer ${
                      isTicketOverdue(ticket) ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                    }`}
                    onClick={() => onViewTicket(ticket.id)}
                  >
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium text-neutral-900 dark:text-white">{ticket.title}</span>
                        {ticket.description && (
                          <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{ticket.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-neutral-900 dark:text-white">
                          {ticket.buyer ? `${ticket.buyer.first_name} ${ticket.buyer.last_name}` : '-'}
                        </p>
                        <p className="text-xs text-neutral-500">{ticket.lot?.lot_number || '-'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {ticket.category && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                          {CATEGORY_ICONS[ticket.category]}
                          <span className="hidden sm:inline">{SAV_CATEGORY_CONFIG[ticket.category].label}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${SAV_SEVERITY_CONFIG[ticket.severity].color}`}>
                        {SAV_SEVERITY_CONFIG[ticket.severity].label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${SAV_STATUS_CONFIG[ticket.status].color}`}>
                        {SAV_STATUS_CONFIG[ticket.status].label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-300">
                      {ticket.assigned_company?.name || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${isTicketOverdue(ticket) ? 'text-red-600 font-medium' : 'text-neutral-500'}`}>
                        {getDaysSinceCreation(ticket.created_at)}j
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <ChevronRight className="h-4 w-4 text-neutral-400" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </RealProCard>
    </div>
  );
}

// ============================================================================
// Urgent Tickets Tab
// ============================================================================

interface UrgentTicketsTabProps {
  tickets: SAVTicket[];
  overdueTickets: SAVTicket[];
  onViewTicket: (id: string) => void;
  updateStatus: (id: string, status: SAVStatus) => Promise<void>;
}

function UrgentTicketsTab({ tickets, overdueTickets, onViewTicket, updateStatus }: UrgentTicketsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Critical/Blocking */}
      <RealProCard className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Critiques et bloquants ({tickets.length})
        </h3>
        {tickets.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">Aucun ticket urgent</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} onClick={() => onViewTicket(ticket.id)} showActions onStatusChange={updateStatus} />
            ))}
          </div>
        )}
      </RealProCard>

      {/* Overdue */}
      <RealProCard className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-600" />
          En retard ({overdueTickets.length})
        </h3>
        {overdueTickets.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">Aucun ticket en retard</p>
        ) : (
          <div className="space-y-3">
            {overdueTickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} onClick={() => onViewTicket(ticket.id)} showActions onStatusChange={updateStatus} />
            ))}
          </div>
        )}
      </RealProCard>
    </div>
  );
}

// ============================================================================
// By Status Tab
// ============================================================================

interface ByStatusTabProps {
  tickets: SAVTicket[];
  onViewTicket: (id: string) => void;
  updateStatus: (id: string, status: SAVStatus) => Promise<void>;
}

function ByStatusTab({ tickets, onViewTicket, updateStatus }: ByStatusTabProps) {
  const statuses: SAVStatus[] = ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'FIXED', 'VALIDATED'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statuses.map((status) => {
        const config = SAV_STATUS_CONFIG[status];
        const statusTickets = tickets.filter((t) => t.status === status);

        return (
          <div key={status} className="space-y-3">
            <div className={`px-3 py-2 rounded-lg ${config.color}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{config.label}</span>
                <span className="text-sm">{statusTickets.length}</span>
              </div>
            </div>
            <div className="space-y-2">
              {statusTickets.map((ticket) => (
                <RealProCard
                  key={ticket.id}
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onViewTicket(ticket.id)}
                >
                  <p className="font-medium text-sm text-neutral-900 dark:text-white line-clamp-2">
                    {ticket.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${SAV_SEVERITY_CONFIG[ticket.severity].color}`}>
                      {SAV_SEVERITY_CONFIG[ticket.severity].label}
                    </span>
                    <span className="text-xs text-neutral-500">{getDaysSinceCreation(ticket.created_at)}j</span>
                  </div>
                  {ticket.lot?.lot_number && (
                    <p className="mt-1 text-xs text-neutral-500">Lot {ticket.lot.lot_number}</p>
                  )}
                </RealProCard>
              ))}
              {statusTickets.length === 0 && (
                <p className="text-center text-xs text-neutral-400 py-4">Aucun ticket</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Ticket Row Component
// ============================================================================

interface TicketRowProps {
  ticket: SAVTicket;
  onClick: () => void;
  compact?: boolean;
  showActions?: boolean;
  onStatusChange?: (id: string, status: SAVStatus) => Promise<void>;
}

function TicketRow({ ticket, onClick, compact, showActions, onStatusChange }: TicketRowProps) {
  const isOverdue = isTicketOverdue(ticket);

  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${
        isOverdue
          ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
          : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-neutral-900 dark:text-white truncate">{ticket.title}</p>
          {!compact && (
            <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
              {ticket.buyer && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {ticket.buyer.first_name} {ticket.buyer.last_name}
                </span>
              )}
              {ticket.lot?.lot_number && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  Lot {ticket.lot.lot_number}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${SAV_SEVERITY_CONFIG[ticket.severity].color}`}>
            {SAV_SEVERITY_CONFIG[ticket.severity].label}
          </span>
          {!compact && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${SAV_STATUS_CONFIG[ticket.status].color}`}>
              {SAV_STATUS_CONFIG[ticket.status].label}
            </span>
          )}
        </div>
      </div>
      {showActions && onStatusChange && SAV_STATUS_CONFIG[ticket.status].nextStatuses.length > 0 && (
        <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-700 flex gap-2">
          {SAV_STATUS_CONFIG[ticket.status].nextStatuses.slice(0, 2).map((nextStatus) => (
            <button
              key={nextStatus}
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(ticket.id, nextStatus);
              }}
              className="text-xs px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
            >
              {SAV_STATUS_CONFIG[nextStatus].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Create Ticket Modal
// ============================================================================

interface CreateTicketModalProps {
  projectId: string;
  onClose: () => void;
  onCreate: (data: CreateTicketData) => Promise<any>;
}

function CreateTicketModal({ projectId, onClose, onCreate }: CreateTicketModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '' as SAVCategory | '',
    severity: 'MAJOR' as SAVSeverity,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreate({
        projectId,
        title: formData.title,
        description: formData.description || undefined,
        location: formData.location || undefined,
        category: formData.category || undefined,
        severity: formData.severity,
      });
      onClose();
    } catch (err) {
      console.error('Error creating ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Nouveau ticket SAV</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Titre *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Description du probleme"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Details supplementaires..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Localisation
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ex: Cuisine, Salle de bain..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Categorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as SAVCategory })}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              >
                <option value="">Selectionner...</option>
                {(Object.keys(SAV_CATEGORY_CONFIG) as SAVCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {SAV_CATEGORY_CONFIG[cat].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Severite *
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as SAVSeverity })}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                required
              >
                {(Object.keys(SAV_SEVERITY_CONFIG) as SAVSeverity[]).map((sev) => (
                  <option key={sev} value={sev}>
                    {SAV_SEVERITY_CONFIG[sev].label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <RealProButton type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </RealProButton>
            <RealProButton type="submit" disabled={isSubmitting || !formData.title.trim()}>
              {isSubmitting ? 'Creation...' : 'Creer le ticket'}
            </RealProButton>
          </div>
        </form>
      </div>
    </div>
  );
}
