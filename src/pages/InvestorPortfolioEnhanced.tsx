import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Package,
  PieChart,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
  Calendar,
  Activity,
} from 'lucide-react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import {
  useInvestorPortfolio,
  ProjectInvestment,
  PROJECT_STATUS_CONFIG,
  LOT_STATUS_CONFIG,
  formatCHF,
  formatPercent,
  getROIColorClass,
  getInvestmentHealth,
} from '../hooks/useInvestorPortfolio';

// ============================================================================
// Tab Configuration
// ============================================================================

type TabId = 'overview' | 'projects' | 'performance' | 'alerts';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: "Vue d'ensemble", icon: <PieChart className="h-4 w-4" /> },
  { id: 'projects', label: 'Projets', icon: <Building2 className="h-4 w-4" /> },
  { id: 'performance', label: 'Performance', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'alerts', label: 'Alertes', icon: <AlertTriangle className="h-4 w-4" /> },
];

// ============================================================================
// Main Component
// ============================================================================

export function InvestorPortfolioEnhanced() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const organizationId = user?.organizations?.[0]?.organization_id || '';

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { projects, summary, loading, error, refresh, getProjectsWithOverdue } = useInvestorPortfolio(organizationId);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (filterStatus === 'all') return projects;
    return projects.filter((p) => p.status === filterStatus);
  }, [projects, filterStatus]);

  // Projects with alerts
  const alertProjects = getProjectsWithOverdue();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Chargement du portfolio...</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white flex items-center gap-3">
            <Wallet className="h-8 w-8 text-primary-600" />
            Portfolio Investisseur
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {summary?.totalProjects || 0} projet{(summary?.totalProjects || 0) > 1 ? 's' : ''} -{' '}
            {summary?.totalLots || 0} lots au total
          </p>
        </div>
        <RealProButton variant="outline" onClick={refresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </RealProButton>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Valeur totale"
          value={formatCHF(summary?.totalCurrentValue || 0)}
          change={summary?.appreciationPercent || 0}
          icon={<DollarSign className="h-5 w-5" />}
          color="blue"
        />
        <KPICard
          label="ROI projete moyen"
          value={formatPercent(summary?.projectedROI || 0)}
          icon={<Target className="h-5 w-5" />}
          color={summary?.projectedROI && summary.projectedROI >= 10 ? 'green' : 'amber'}
        />
        <KPICard
          label="Encaisse"
          value={formatCHF(summary?.totalCollected || 0)}
          subValue={`${summary?.collectionRate?.toFixed(0) || 0}% collecte`}
          icon={<CheckCircle className="h-5 w-5" />}
          color="green"
        />
        <KPICard
          label="En retard"
          value={formatCHF(summary?.totalOverdue || 0)}
          icon={<AlertTriangle className="h-5 w-5" />}
          color={summary?.totalOverdue && summary.totalOverdue > 0 ? 'red' : 'neutral'}
          alert={summary?.totalOverdue && summary.totalOverdue > 0}
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
              {tab.id === 'alerts' && alertProjects.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                  {alertProjects.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab
          summary={summary}
          projects={projects}
          onViewProject={(id) => navigate(`/projects/${id}/overview`)}
        />
      )}

      {activeTab === 'projects' && (
        <ProjectsTab
          projects={filteredProjects}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onViewProject={(id) => navigate(`/projects/${id}/overview`)}
        />
      )}

      {activeTab === 'performance' && <PerformanceTab projects={projects} summary={summary} />}

      {activeTab === 'alerts' && (
        <AlertsTab
          projects={alertProjects}
          onViewProject={(id) => navigate(`/projects/${id}/overview`)}
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
  value: string;
  change?: number;
  subValue?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'amber' | 'red' | 'neutral';
  alert?: boolean;
}

function KPICard({ label, value, change, subValue, icon, color, alert }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    neutral: 'bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  };

  return (
    <RealProCard className={`p-4 ${alert ? 'ring-2 ring-red-500' : ''}`}>
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        {change !== undefined && (
          <div
            className={`flex items-center text-sm ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change >= 0 ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
        {subValue && <p className="text-xs text-neutral-400 mt-1">{subValue}</p>}
      </div>
    </RealProCard>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

interface OverviewTabProps {
  summary: ReturnType<typeof useInvestorPortfolio>['summary'];
  projects: ProjectInvestment[];
  onViewProject: (id: string) => void;
}

function OverviewTab({ summary, projects, onViewProject }: OverviewTabProps) {
  const topProjects = [...projects].sort((a, b) => b.projectedROI - a.projectedROI).slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Portfolio Distribution */}
      <RealProCard className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Repartition du portfolio
        </h3>
        <div className="space-y-4">
          {Object.entries(summary?.projectsByStatus || {}).map(([status, count]) => {
            const config = PROJECT_STATUS_CONFIG[status] || { label: status, color: 'bg-neutral-100' };
            const percent = summary?.totalProjects ? (count / summary.totalProjects) * 100 : 0;

            return (
              <div key={status} className="flex items-center gap-3">
                <div className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>{config.label}</div>
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

      {/* Lots Distribution */}
      <RealProCard className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Statut des lots</h3>
        <div className="space-y-4">
          {Object.entries(summary?.lotsByStatus || {}).map(([status, count]) => {
            const config = LOT_STATUS_CONFIG[status] || { label: status, color: 'bg-neutral-100' };
            const percent = summary?.totalLots ? (count / summary.totalLots) * 100 : 0;

            return (
              <div key={status} className="flex items-center gap-3">
                <div className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>{config.label}</div>
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

      {/* Financial Summary */}
      <RealProCard className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Resume financier</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-700">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Investissement total</span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              {formatCHF(summary?.totalInvestment || 0)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-700">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Valeur actuelle</span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              {formatCHF(summary?.totalCurrentValue || 0)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-700">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Plus-value</span>
            <span className={`font-semibold ${getROIColorClass(summary?.appreciationPercent || 0)}`}>
              {formatCHF(summary?.totalAppreciation || 0)}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">En attente</span>
            <span className="font-semibold text-amber-600">{formatCHF(summary?.totalPending || 0)}</span>
          </div>
        </div>
      </RealProCard>

      {/* Best Performers */}
      <RealProCard className="p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Meilleures performances
        </h3>
        <div className="space-y-3">
          {topProjects.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              rank={index + 1}
              onClick={() => onViewProject(project.id)}
            />
          ))}
        </div>
      </RealProCard>

      {/* Quick Stats */}
      <RealProCard className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Indicateurs cles</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Meilleur projet</p>
              <p className="font-semibold text-neutral-900 dark:text-white">
                {summary?.bestPerformingProject?.name || '-'}
              </p>
              <p className="text-xs text-green-600">
                ROI {formatPercent(summary?.bestPerformingProject?.roi || 0)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <Activity className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">A surveiller</p>
              <p className="font-semibold text-neutral-900 dark:text-white">
                {summary?.worstPerformingProject?.name || '-'}
              </p>
              <p className="text-xs text-amber-600">
                ROI {formatPercent(summary?.worstPerformingProject?.roi || 0)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Taux de collection</p>
              <p className="font-semibold text-neutral-900 dark:text-white">
                {summary?.collectionRate?.toFixed(0) || 0}%
              </p>
            </div>
          </div>
        </div>
      </RealProCard>
    </div>
  );
}

// ============================================================================
// Projects Tab
// ============================================================================

interface ProjectsTabProps {
  projects: ProjectInvestment[];
  filterStatus: string;
  setFilterStatus: (s: string) => void;
  onViewProject: (id: string) => void;
}

function ProjectsTab({ projects, filterStatus, setFilterStatus, onViewProject }: ProjectsTabProps) {
  return (
    <div className="space-y-4">
      {/* Filter */}
      <RealProCard className="p-4">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-neutral-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(PROJECT_STATUS_CONFIG).map(([status, config]) => (
              <option key={status} value={status}>
                {config.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-neutral-500">{projects.length} projet(s)</span>
        </div>
      </RealProCard>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={() => onViewProject(project.id)} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Performance Tab
// ============================================================================

interface PerformanceTabProps {
  projects: ProjectInvestment[];
  summary: ReturnType<typeof useInvestorPortfolio>['summary'];
}

function PerformanceTab({ projects, summary }: PerformanceTabProps) {
  const sortedByROI = [...projects].sort((a, b) => b.projectedROI - a.projectedROI);
  const sortedByCollection = [...projects].sort((a, b) => {
    const rateA = a.collectedAmount / (a.collectedAmount + a.pendingAmount) || 0;
    const rateB = b.collectedAmount / (b.collectedAmount + b.pendingAmount) || 0;
    return rateB - rateA;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ROI Ranking */}
      <RealProCard className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Classement par ROI
        </h3>
        <div className="space-y-3">
          {sortedByROI.map((project, index) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index < 3
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">{project.name}</p>
                  <p className="text-xs text-neutral-500">{project.city}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${getROIColorClass(project.projectedROI)}`}>
                  {formatPercent(project.projectedROI)}
                </p>
                <p className="text-xs text-neutral-500">ROI projete</p>
              </div>
            </div>
          ))}
        </div>
      </RealProCard>

      {/* Collection Rate Ranking */}
      <RealProCard className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Taux de collection
        </h3>
        <div className="space-y-3">
          {sortedByCollection.map((project) => {
            const rate =
              project.collectedAmount + project.pendingAmount > 0
                ? (project.collectedAmount / (project.collectedAmount + project.pendingAmount)) * 100
                : 0;

            return (
              <div key={project.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">{project.name}</span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">{rate.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      rate >= 80 ? 'bg-green-500' : rate >= 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Encaisse: {formatCHF(project.collectedAmount)}</span>
                  <span>En attente: {formatCHF(project.pendingAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </RealProCard>

      {/* Overall Performance */}
      <RealProCard className="p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Performance globale
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-center">
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">
              {summary?.totalProjects || 0}
            </p>
            <p className="text-sm text-neutral-500">Projets</p>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-center">
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">{summary?.totalLots || 0}</p>
            <p className="text-sm text-neutral-500">Lots</p>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-center">
            <p className={`text-3xl font-bold ${getROIColorClass(summary?.projectedROI || 0)}`}>
              {formatPercent(summary?.projectedROI || 0)}
            </p>
            <p className="text-sm text-neutral-500">ROI moyen</p>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-center">
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">
              {summary?.collectionRate?.toFixed(0) || 0}%
            </p>
            <p className="text-sm text-neutral-500">Taux collection</p>
          </div>
        </div>
      </RealProCard>
    </div>
  );
}

// ============================================================================
// Alerts Tab
// ============================================================================

interface AlertsTabProps {
  projects: ProjectInvestment[];
  onViewProject: (id: string) => void;
}

function AlertsTab({ projects, onViewProject }: AlertsTabProps) {
  if (projects.length === 0) {
    return (
      <RealProCard className="p-8 text-center">
        <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Aucune alerte</h3>
        <p className="text-neutral-500">Tous vos projets sont en bonne sante financiere.</p>
      </RealProCard>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <RealProCard
          key={project.id}
          className="p-4 border-l-4 border-red-500 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onViewProject(project.id)}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-neutral-900 dark:text-white">{project.name}</h4>
              </div>
              <p className="text-sm text-neutral-500">{project.city}</p>
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                <p className="text-sm text-red-600 dark:text-red-400">
                  <strong>{formatCHF(project.overdueAmount)}</strong> en retard de paiement
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-500">Encaisse</p>
              <p className="font-semibold text-neutral-900 dark:text-white">
                {formatCHF(project.collectedAmount)}
              </p>
              <ChevronRight className="h-5 w-5 text-neutral-400 mt-2 ml-auto" />
            </div>
          </div>
        </RealProCard>
      ))}
    </div>
  );
}

// ============================================================================
// Project Card Component
// ============================================================================

interface ProjectCardProps {
  project: ProjectInvestment;
  onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  const health = getInvestmentHealth(project);
  const statusConfig = PROJECT_STATUS_CONFIG[project.status] || { label: project.status, color: 'bg-neutral-100' };
  const salesProgress = project.totalLots > 0 ? (project.soldLots / project.totalLots) * 100 : 0;

  return (
    <RealProCard className="p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-neutral-900 dark:text-white">{project.name}</h4>
          <p className="text-sm text-neutral-500">{project.city}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>

      <div className="space-y-3">
        {/* Sales Progress */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-neutral-500">Ventes</span>
            <span className="font-medium text-neutral-900 dark:text-white">
              {project.soldLots}/{project.totalLots} lots
            </span>
          </div>
          <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all"
              style={{ width: `${salesProgress}%` }}
            />
          </div>
        </div>

        {/* Construction Progress */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-neutral-500">Construction</span>
            <span className="font-medium text-neutral-900 dark:text-white">{project.constructionProgress}%</span>
          </div>
          <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${project.constructionProgress}%` }}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-700">
          <div>
            <p className="text-xs text-neutral-500">ROI projete</p>
            <p className={`font-bold ${getROIColorClass(project.projectedROI)}`}>
              {formatPercent(project.projectedROI)}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Encaisse</p>
            <p className="font-bold text-neutral-900 dark:text-white">{formatCHF(project.collectedAmount)}</p>
          </div>
        </div>

        {/* Health Badge */}
        <div className="flex items-center justify-between pt-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${health.color}`}>{health.label}</span>
          {project.overdueAmount > 0 && (
            <span className="flex items-center gap-1 text-xs text-red-600">
              <AlertTriangle className="h-3 w-3" />
              {formatCHF(project.overdueAmount)} en retard
            </span>
          )}
        </div>
      </div>
    </RealProCard>
  );
}

// ============================================================================
// Project Row Component
// ============================================================================

interface ProjectRowProps {
  project: ProjectInvestment;
  rank: number;
  onClick: () => void;
}

function ProjectRow({ project, rank, onClick }: ProjectRowProps) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            rank <= 3
              ? 'bg-primary-600 text-white'
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
          }`}
        >
          {rank}
        </span>
        <div>
          <p className="font-medium text-neutral-900 dark:text-white">{project.name}</p>
          <p className="text-xs text-neutral-500">{project.city}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={`font-bold ${getROIColorClass(project.projectedROI)}`}>
            {formatPercent(project.projectedROI)}
          </p>
          <p className="text-xs text-neutral-500">ROI</p>
        </div>
        <ChevronRight className="h-5 w-5 text-neutral-400" />
      </div>
    </div>
  );
}
