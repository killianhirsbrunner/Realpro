import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  FileSignature,
  Plus,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  FileEdit,
  Ban,
  ChevronRight,
  RefreshCw,
  Send,
  Trash2,
  Building2,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import {
  useAvenantManagement,
  Avenant,
  AvenantStatus,
  AvenantType,
  AVENANT_STATUS_CONFIG,
  AVENANT_TYPE_CONFIG,
  CreateAvenantData,
  formatCHF,
  getSuggestedType,
  canEditAvenant,
  canDeleteAvenant,
  getDaysSinceCreation,
} from '../hooks/useAvenantManagement';
import { formatDate } from '../lib/utils/format';

// ============================================================================
// Tab Configuration
// ============================================================================

type TabId = 'overview' | 'all' | 'pending' | 'by-lot';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: "Vue d'ensemble", icon: <FileSignature className="h-4 w-4" /> },
  { id: 'all', label: 'Tous les avenants', icon: <Filter className="h-4 w-4" /> },
  { id: 'pending', label: 'En attente', icon: <Clock className="h-4 w-4" /> },
  { id: 'by-lot', label: 'Par lot', icon: <Building2 className="h-4 w-4" /> },
];

// ============================================================================
// Status Icons
// ============================================================================

const STATUS_ICONS: Record<AvenantStatus, React.ReactNode> = {
  draft: <FileEdit className="h-4 w-4" />,
  pending_signature: <Clock className="h-4 w-4" />,
  signed: <CheckCircle className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
  cancelled: <Ban className="h-4 w-4" />,
};

// ============================================================================
// Main Component
// ============================================================================

export function ProjectAvenantsEnhanced() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<AvenantStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<AvenantType | 'all'>('all');

  const {
    avenants,
    summary,
    loading,
    error,
    refresh,
    createAvenant,
    updateStatus,
    sendForSignature,
    cancelAvenant,
    deleteAvenant,
    getPendingSignature,
  } = useAvenantManagement(projectId || '');

  // Filtered avenants
  const filteredAvenants = useMemo(() => {
    let result = avenants;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.reference?.toLowerCase().includes(query) ||
          a.description?.toLowerCase().includes(query) ||
          a.supplier_offer?.supplier_name?.toLowerCase().includes(query)
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter((a) => a.status === filterStatus);
    }

    if (filterType !== 'all') {
      result = result.filter((a) => a.type === filterType);
    }

    return result;
  }, [avenants, searchQuery, filterStatus, filterType]);

  // Group by lot
  const avenantsByLot = useMemo(() => {
    const grouped: Record<string, Avenant[]> = {};
    avenants.forEach((a) => {
      const lotKey = a.lot?.lot_number || 'Sans lot';
      if (!grouped[lotKey]) {
        grouped[lotKey] = [];
      }
      grouped[lotKey].push(a);
    });
    return grouped;
  }, [avenants]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement...</p>
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
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 shadow-lg">
              <FileSignature className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                Avenants & Modifications
              </h1>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {summary?.total || 0} avenant{(summary?.total || 0) > 1 ? 's' : ''} - {formatCHF(summary?.totalAmount || 0)} total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RealProButton variant="outline" onClick={refresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </RealProButton>
            <RealProButton variant="outline" asChild>
              <Link to={`/projects/${projectId}/modifications/offers`}>
                Offres fournisseurs
              </Link>
            </RealProButton>
            <RealProButton onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel avenant
            </RealProButton>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          label="Total avenants"
          value={summary?.total || 0}
          subValue={formatCHF(summary?.totalAmount || 0)}
          icon={<FileSignature className="h-5 w-5" />}
          color="blue"
        />
        <KPICard
          label="En attente"
          value={summary?.pendingSignature || 0}
          subValue={formatCHF(summary?.totalAmountPending || 0)}
          icon={<Clock className="h-5 w-5" />}
          color="amber"
        />
        <KPICard
          label="Signes"
          value={summary?.signed || 0}
          subValue={formatCHF(summary?.totalAmountSigned || 0)}
          icon={<CheckCircle className="h-5 w-5" />}
          color="green"
        />
        <KPICard
          label="Ce mois"
          value={summary?.thisMonthCount || 0}
          subValue={formatCHF(summary?.thisMonthAmount || 0)}
          icon={<Calendar className="h-5 w-5" />}
          color="purple"
        />
        <KPICard
          label="Montant moyen"
          value={formatCHF(summary?.avgAmount || 0)}
          icon={<TrendingUp className="h-5 w-5" />}
          color="neutral"
          isAmount
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
              {tab.id === 'pending' && summary?.pendingSignature ? (
                <span className="ml-1 px-2 py-0.5 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                  {summary.pendingSignature}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab
          summary={summary}
          avenants={avenants}
          getPendingSignature={getPendingSignature}
          onViewAvenant={(id) => navigate(`/projects/${projectId}/modifications/avenants/${id}`)}
          onSendForSignature={sendForSignature}
        />
      )}

      {activeTab === 'all' && (
        <AllAvenantsTab
          avenants={filteredAvenants}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterType={filterType}
          setFilterType={setFilterType}
          onViewAvenant={(id) => navigate(`/projects/${projectId}/modifications/avenants/${id}`)}
          onSendForSignature={sendForSignature}
          onCancel={cancelAvenant}
          onDelete={deleteAvenant}
        />
      )}

      {activeTab === 'pending' && (
        <PendingTab
          avenants={getPendingSignature()}
          onViewAvenant={(id) => navigate(`/projects/${projectId}/modifications/avenants/${id}`)}
          onSign={(id) => navigate(`/projects/${projectId}/modifications/avenants/${id}/sign`)}
        />
      )}

      {activeTab === 'by-lot' && (
        <ByLotTab
          avenantsByLot={avenantsByLot}
          summary={summary}
          onViewAvenant={(id) => navigate(`/projects/${projectId}/modifications/avenants/${id}`)}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateAvenantModal
          projectId={projectId || ''}
          onClose={() => setShowCreateModal(false)}
          onCreate={createAvenant}
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
  value: number | string;
  subValue?: string;
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'green' | 'purple' | 'neutral';
  isAmount?: boolean;
}

function KPICard({ label, value, subValue, icon, color, isAmount }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    neutral: 'bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  };

  return (
    <RealProCard className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div>
          <p className={`${isAmount ? 'text-lg' : 'text-2xl'} font-bold text-neutral-900 dark:text-white`}>
            {value}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
          {subValue && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{subValue}</p>
          )}
        </div>
      </div>
    </RealProCard>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

interface OverviewTabProps {
  summary: ReturnType<typeof useAvenantManagement>['summary'];
  avenants: Avenant[];
  getPendingSignature: () => Avenant[];
  onViewAvenant: (id: string) => void;
  onSendForSignature: (id: string) => Promise<void>;
}

function OverviewTab({ summary, avenants, getPendingSignature, onViewAvenant, onSendForSignature }: OverviewTabProps) {
  const pendingAvenants = getPendingSignature();
  const recentAvenants = avenants.slice(0, 5);
  const drafts = avenants.filter((a) => a.status === 'draft');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stats by Status */}
      <RealProCard className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Repartition par statut
        </h3>
        <div className="space-y-3">
          {(Object.keys(AVENANT_STATUS_CONFIG) as AvenantStatus[]).map((status) => {
            const config = AVENANT_STATUS_CONFIG[status];
            const count = avenants.filter((a) => a.status === status).length;
            const percent = avenants.length > 0 ? (count / avenants.length) * 100 : 0;

            return (
              <div key={status} className="flex items-center gap-3">
                <div className={`px-2 py-1 rounded text-xs font-medium ${config.color} flex items-center gap-1`}>
                  {STATUS_ICONS[status]}
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

      {/* Stats by Type */}
      <RealProCard className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Repartition par type
        </h3>
        <div className="space-y-4">
          {(Object.keys(AVENANT_TYPE_CONFIG) as AvenantType[]).map((type) => {
            const config = AVENANT_TYPE_CONFIG[type];
            const count = summary?.byType[type] || 0;
            const typeAvenants = avenants.filter((a) => a.type === type);
            const amount = typeAvenants.reduce((sum, a) => sum + a.total_with_vat, 0);

            return (
              <div key={type} className="flex items-center justify-between">
                <div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
                    {config.label}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{config.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">{count}</p>
                  <p className="text-xs text-neutral-500">{formatCHF(amount)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </RealProCard>

      {/* Financial Summary */}
      <RealProCard className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Resume financier
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-700">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Total avenants</span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              {formatCHF(summary?.totalAmount || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-700">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Montant signe</span>
            <span className="font-semibold text-green-600">{formatCHF(summary?.totalAmountSigned || 0)}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-700">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">En attente</span>
            <span className="font-semibold text-amber-600">{formatCHF(summary?.totalAmountPending || 0)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Moyenne par avenant</span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              {formatCHF(summary?.avgAmount || 0)}
            </span>
          </div>
        </div>
      </RealProCard>

      {/* Drafts needing action */}
      {drafts.length > 0 && (
        <RealProCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <FileEdit className="h-5 w-5 text-neutral-600" />
              Brouillons a envoyer ({drafts.length})
            </h3>
          </div>
          <div className="space-y-2">
            {drafts.slice(0, 5).map((avenant) => (
              <AvenantRow
                key={avenant.id}
                avenant={avenant}
                onClick={() => onViewAvenant(avenant.id)}
                showSendButton
                onSend={() => onSendForSignature(avenant.id)}
              />
            ))}
          </div>
        </RealProCard>
      )}

      {/* Pending Signatures */}
      {pendingAvenants.length > 0 && (
        <RealProCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              En attente de signature ({pendingAvenants.length})
            </h3>
          </div>
          <div className="space-y-2">
            {pendingAvenants.slice(0, 5).map((avenant) => (
              <AvenantRow key={avenant.id} avenant={avenant} onClick={() => onViewAvenant(avenant.id)} compact />
            ))}
          </div>
        </RealProCard>
      )}

      {/* Recent Avenants */}
      <RealProCard className="p-6 lg:col-span-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Avenants recents</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Reference</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Titre</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Fournisseur</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Montant</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Statut</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentAvenants.map((avenant) => (
                <tr
                  key={avenant.id}
                  className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                  onClick={() => onViewAvenant(avenant.id)}
                >
                  <td className="py-3 px-4 text-sm font-mono text-neutral-600 dark:text-neutral-400">
                    {avenant.reference || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-neutral-900 dark:text-white">{avenant.title}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-300">
                    {avenant.supplier_offer?.supplier_name || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${AVENANT_TYPE_CONFIG[avenant.type].color}`}>
                      {AVENANT_TYPE_CONFIG[avenant.type].label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                    {formatCHF(avenant.total_with_vat)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${AVENANT_STATUS_CONFIG[avenant.status].color}`}>
                      {AVENANT_STATUS_CONFIG[avenant.status].label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-500">{formatDate(avenant.created_at)}</td>
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
// All Avenants Tab
// ============================================================================

interface AllAvenantsTabProps {
  avenants: Avenant[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterStatus: AvenantStatus | 'all';
  setFilterStatus: (s: AvenantStatus | 'all') => void;
  filterType: AvenantType | 'all';
  setFilterType: (t: AvenantType | 'all') => void;
  onViewAvenant: (id: string) => void;
  onSendForSignature: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function AllAvenantsTab({
  avenants,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  onViewAvenant,
  onSendForSignature,
  onCancel,
  onDelete,
}: AllAvenantsTabProps) {
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
            onChange={(e) => setFilterStatus(e.target.value as AvenantStatus | 'all')}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
          >
            <option value="all">Tous les statuts</option>
            {(Object.keys(AVENANT_STATUS_CONFIG) as AvenantStatus[]).map((status) => (
              <option key={status} value={status}>
                {AVENANT_STATUS_CONFIG[status].label}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as AvenantType | 'all')}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
          >
            <option value="all">Tous les types</option>
            {(Object.keys(AVENANT_TYPE_CONFIG) as AvenantType[]).map((type) => (
              <option key={type} value={type}>
                {AVENANT_TYPE_CONFIG[type].label}
              </option>
            ))}
          </select>
        </div>
      </RealProCard>

      {/* Table */}
      <RealProCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Reference</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Titre</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Lot</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Montant TTC</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Statut</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {avenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    Aucun avenant trouve
                  </td>
                </tr>
              ) : (
                avenants.map((avenant) => (
                  <tr
                    key={avenant.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                    onClick={() => onViewAvenant(avenant.id)}
                  >
                    <td className="py-3 px-4 text-sm font-mono text-neutral-600 dark:text-neutral-400">
                      {avenant.reference || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium text-neutral-900 dark:text-white">{avenant.title}</span>
                        {avenant.supplier_offer?.supplier_name && (
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {avenant.supplier_offer.supplier_name}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-300">
                      {avenant.lot?.lot_number || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${AVENANT_TYPE_CONFIG[avenant.type].color}`}>
                        {AVENANT_TYPE_CONFIG[avenant.type].label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-neutral-900 dark:text-white">
                      {formatCHF(avenant.total_with_vat)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${AVENANT_STATUS_CONFIG[avenant.status].color}`}>
                        {AVENANT_STATUS_CONFIG[avenant.status].label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {canEditAvenant(avenant) && (
                          <button
                            onClick={() => onSendForSignature(avenant.id)}
                            className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-primary-600"
                            title="Envoyer pour signature"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                        {avenant.status === 'pending_signature' && (
                          <button
                            onClick={() => onCancel(avenant.id)}
                            className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-amber-600"
                            title="Annuler"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                        {canDeleteAvenant(avenant) && (
                          <button
                            onClick={() => onDelete(avenant.id)}
                            className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-red-600"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
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
// Pending Tab
// ============================================================================

interface PendingTabProps {
  avenants: Avenant[];
  onViewAvenant: (id: string) => void;
  onSign: (id: string) => void;
}

function PendingTab({ avenants, onViewAvenant, onSign }: PendingTabProps) {
  if (avenants.length === 0) {
    return (
      <RealProCard className="p-8 text-center">
        <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
          Aucun avenant en attente
        </h3>
        <p className="text-neutral-500">Tous les avenants ont ete signes ou traites.</p>
      </RealProCard>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {avenants.map((avenant) => (
        <RealProCard key={avenant.id} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-neutral-500 font-mono">{avenant.reference}</p>
              <h4 className="font-semibold text-neutral-900 dark:text-white">{avenant.title}</h4>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${AVENANT_TYPE_CONFIG[avenant.type].color}`}>
              {AVENANT_TYPE_CONFIG[avenant.type].label}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Montant TTC</span>
              <span className="font-semibold text-neutral-900 dark:text-white">{formatCHF(avenant.total_with_vat)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Fournisseur</span>
              <span className="text-neutral-900 dark:text-white">{avenant.supplier_offer?.supplier_name || '-'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">En attente depuis</span>
              <span className="text-amber-600">{getDaysSinceCreation(avenant.generated_at || avenant.created_at)}j</span>
            </div>
            {avenant.requires_qualified_signature && (
              <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                <AlertTriangle className="h-3 w-3" />
                Signature qualifiee requise
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <RealProButton variant="outline" className="flex-1" onClick={() => onViewAvenant(avenant.id)}>
              Voir
            </RealProButton>
            <RealProButton className="flex-1" onClick={() => onSign(avenant.id)}>
              <FileSignature className="h-4 w-4 mr-2" />
              Signer
            </RealProButton>
          </div>
        </RealProCard>
      ))}
    </div>
  );
}

// ============================================================================
// By Lot Tab
// ============================================================================

interface ByLotTabProps {
  avenantsByLot: Record<string, Avenant[]>;
  summary: ReturnType<typeof useAvenantManagement>['summary'];
  onViewAvenant: (id: string) => void;
}

function ByLotTab({ avenantsByLot, summary, onViewAvenant }: ByLotTabProps) {
  const lots = Object.entries(avenantsByLot).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="space-y-4">
      {lots.map(([lotNumber, lotAvenants]) => {
        const lotTotal = lotAvenants.reduce((sum, a) => sum + a.total_with_vat, 0);
        const signedCount = lotAvenants.filter((a) => a.status === 'signed').length;
        const pendingCount = lotAvenants.filter((a) => a.status === 'pending_signature').length;

        return (
          <RealProCard key={lotNumber} className="overflow-hidden">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">{lotNumber}</h3>
                    <p className="text-xs text-neutral-500">{lotAvenants.length} avenant(s)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <p className="text-neutral-500">Total</p>
                    <p className="font-semibold text-neutral-900 dark:text-white">{formatCHF(lotTotal)}</p>
                  </div>
                  <div className="flex gap-2">
                    {signedCount > 0 && (
                      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {signedCount} signe(s)
                      </span>
                    )}
                    {pendingCount > 0 && (
                      <span className="px-2 py-1 rounded text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        {pendingCount} en attente
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {lotAvenants.map((avenant) => (
                <div
                  key={avenant.id}
                  className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                  onClick={() => onViewAvenant(avenant.id)}
                >
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{avenant.title}</p>
                    <p className="text-xs text-neutral-500">{avenant.reference}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-neutral-900 dark:text-white">{formatCHF(avenant.total_with_vat)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${AVENANT_STATUS_CONFIG[avenant.status].color}`}>
                      {AVENANT_STATUS_CONFIG[avenant.status].label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </div>
                </div>
              ))}
            </div>
          </RealProCard>
        );
      })}
    </div>
  );
}

// ============================================================================
// Avenant Row Component
// ============================================================================

interface AvenantRowProps {
  avenant: Avenant;
  onClick: () => void;
  compact?: boolean;
  showSendButton?: boolean;
  onSend?: () => void;
}

function AvenantRow({ avenant, onClick, compact, showSendButton, onSend }: AvenantRowProps) {
  return (
    <div
      className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:shadow-sm transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-neutral-900 dark:text-white truncate">{avenant.title}</p>
          {!compact && (
            <p className="text-xs text-neutral-500 mt-0.5">
              {avenant.reference} - {avenant.supplier_offer?.supplier_name}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-neutral-900 dark:text-white">{formatCHF(avenant.total_with_vat)}</span>
          {!compact && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${AVENANT_TYPE_CONFIG[avenant.type].color}`}>
              {AVENANT_TYPE_CONFIG[avenant.type].label}
            </span>
          )}
          {showSendButton && onSend && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSend();
              }}
              className="px-3 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
            >
              Envoyer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Create Avenant Modal
// ============================================================================

interface CreateAvenantModalProps {
  projectId: string;
  onClose: () => void;
  onCreate: (data: CreateAvenantData) => Promise<any>;
}

function CreateAvenantModal({ projectId, onClose, onCreate }: CreateAvenantModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    type: '' as AvenantType | '',
    supplierOfferId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestedType = formData.amount ? getSuggestedType(parseFloat(formData.amount) || 0) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.amount || !formData.supplierOfferId) return;

    setIsSubmitting(true);
    try {
      await onCreate({
        projectId,
        supplierOfferId: formData.supplierOfferId,
        title: formData.title,
        description: formData.description || undefined,
        amount: parseFloat(formData.amount),
        type: formData.type || undefined,
      });
      onClose();
    } catch (err) {
      console.error('Error creating avenant:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Nouvel avenant</h2>
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
              placeholder="Modification cuisine - Option premium"
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
              placeholder="Details de la modification..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              ID Offre fournisseur *
            </label>
            <input
              type="text"
              value={formData.supplierOfferId}
              onChange={(e) => setFormData({ ...formData, supplierOfferId: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="UUID de l'offre fournisseur"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Montant HT (CHF) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="1500.00"
                required
              />
              {suggestedType && (
                <p className="text-xs text-neutral-500 mt-1">
                  Type suggere: {AVENANT_TYPE_CONFIG[suggestedType].label}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as AvenantType })}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              >
                <option value="">Automatique</option>
                {(Object.keys(AVENANT_TYPE_CONFIG) as AvenantType[]).map((type) => (
                  <option key={type} value={type}>
                    {AVENANT_TYPE_CONFIG[type].label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {formData.amount && parseFloat(formData.amount) > 0 && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-neutral-500">Montant HT</span>
                <span className="text-neutral-900 dark:text-white">{formatCHF(parseFloat(formData.amount))}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-neutral-500">TVA (8.1%)</span>
                <span className="text-neutral-900 dark:text-white">{formatCHF(parseFloat(formData.amount) * 0.081)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-1 border-t border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-700 dark:text-neutral-300">Total TTC</span>
                <span className="text-neutral-900 dark:text-white">{formatCHF(parseFloat(formData.amount) * 1.081)}</span>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <RealProButton type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </RealProButton>
            <RealProButton type="submit" disabled={isSubmitting || !formData.title.trim() || !formData.amount || !formData.supplierOfferId}>
              {isSubmitting ? 'Creation...' : 'Creer l\'avenant'}
            </RealProButton>
          </div>
        </form>
      </div>
    </div>
  );
}
