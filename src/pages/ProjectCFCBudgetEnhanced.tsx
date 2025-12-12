import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  BarChart3,
  PieChart,
  Eye,
  Edit3,
  Plus,
  FileText,
  Clock,
  Target,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  useCFCBudgetManagement,
  CFCLine,
  CFCStatus,
  CFC_STATUS_CONFIG,
  formatCHF,
  formatPercent,
  getVarianceColor,
  getProgressColor,
  getCFCGroupLabel,
  calculateBudgetHealth,
} from '../hooks/useCFCBudgetManagement';

// ============================================================================
// Tab Types
// ============================================================================

type TabType = 'overview' | 'lines' | 'analysis' | 'alerts';

// ============================================================================
// Main Component
// ============================================================================

export function ProjectCFCBudgetEnhanced() {
  const { projectId } = useParams<{ projectId: string }>();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [statusFilter, setStatusFilter] = useState<CFCStatus | 'all'>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const {
    lines,
    hierarchicalLines,
    summary,
    loading,
    error,
    getOverBudget,
  } = useCFCBudgetManagement(projectId || '');

  // Filtered lines
  const filteredLines = useMemo(() => {
    if (statusFilter === 'all') return lines;
    return lines.filter((l) => l.status === statusFilter);
  }, [lines, statusFilter]);

  // Over budget lines
  const overBudgetLines = useMemo(() => getOverBudget(), [getOverBudget]);

  // Budget health
  const budgetHealth = useMemo(() => {
    if (!summary) return null;
    return calculateBudgetHealth(summary);
  }, [summary]);

  const toggleGroup = (code: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedGroups(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Vue d\'ensemble', icon: TrendingUp },
    { id: 'lines' as TabType, label: 'Lignes CFC', icon: FileText, count: lines.length },
    { id: 'analysis' as TabType, label: 'Analyse', icon: BarChart3 },
    { id: 'alerts' as TabType, label: 'Alertes', icon: AlertTriangle, count: overBudgetLines.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to={`/projects/${projectId}/finances`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour aux finances
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Budget CFC
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Compte Final de Construction - Suivi budgetaire
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Edit3 className="h-4 w-4" />
            Reviser
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            Nouvelle ligne
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-neutral-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`
                  ml-1 px-2 py-0.5 rounded-full text-xs font-medium
                  ${tab.id === 'alerts' ? 'bg-red-100 text-red-600' :
                    activeTab === tab.id
                    ? 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400'
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab summary={summary} budgetHealth={budgetHealth} hierarchicalLines={hierarchicalLines} />
      )}

      {activeTab === 'lines' && (
        <LinesTab
          lines={filteredLines}
          hierarchicalLines={hierarchicalLines}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
        />
      )}

      {activeTab === 'analysis' && (
        <AnalysisTab summary={summary} lines={lines} />
      )}

      {activeTab === 'alerts' && (
        <AlertsTab summary={summary} overBudgetLines={overBudgetLines} />
      )}
    </div>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

interface OverviewTabProps {
  summary: ReturnType<typeof useCFCBudgetManagement>['summary'];
  budgetHealth: ReturnType<typeof calculateBudgetHealth> | null;
  hierarchicalLines: CFCLine[];
}

function OverviewTab({ summary, budgetHealth, hierarchicalLines }: OverviewTabProps) {
  if (!summary) return null;

  const kpiCards = [
    {
      title: 'Budget total',
      value: formatCHF(summary.totalBudgetCurrent),
      icon: Wallet,
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    },
    {
      title: 'Engage',
      value: formatCHF(summary.totalEngaged),
      subtitle: formatPercent(summary.engagedPercent),
      icon: Target,
      color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    },
    {
      title: 'Paye',
      value: formatCHF(summary.totalPaid),
      subtitle: formatPercent(summary.paidPercent),
      icon: CheckCircle2,
      color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    },
    {
      title: 'Restant',
      value: formatCHF(summary.totalRemaining),
      icon: summary.totalRemaining >= 0 ? TrendingUp : TrendingDown,
      color: summary.totalRemaining >= 0
        ? 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30'
        : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${kpi.color}`}>
                <kpi.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.title}</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{kpi.value}</p>
                {kpi.subtitle && (
                  <p className="text-xs text-gray-500">{kpi.subtitle}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Health */}
        <Card>
          <CardHeader>
            <CardTitle>Sante budgetaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetHealth && (
                <div className="text-center py-4">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${budgetHealth.color} mb-4`}>
                    <span className="text-3xl font-bold">{budgetHealth.score}</span>
                  </div>
                  <p className={`text-lg font-semibold ${budgetHealth.color.split(' ')[0]}`}>
                    {budgetHealth.label}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4 text-center text-sm pt-4 border-t border-gray-200 dark:border-neutral-700">
                <div>
                  <p className="text-2xl font-bold text-green-600">{summary.linesOnTrack}</p>
                  <p className="text-gray-500">Dans le budget</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600">{summary.linesWarning}</p>
                  <p className="text-gray-500">Attention</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{summary.linesOverBudget}</p>
                  <p className="text-gray-500">Depassement</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progression budgetaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Engaged */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">Engage</span>
                  <span className="font-medium">{formatPercent(summary.engagedPercent)}</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(summary.engagedPercent)}`}
                    style={{ width: `${Math.min(summary.engagedPercent, 100)}%` }}
                  />
                </div>
              </div>
              {/* Invoiced */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">Facture</span>
                  <span className="font-medium">{formatPercent(summary.invoicedPercent)}</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(summary.invoicedPercent, 100)}%` }}
                  />
                </div>
              </div>
              {/* Paid */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">Paye</span>
                  <span className="font-medium">{formatPercent(summary.paidPercent)}</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(summary.paidPercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CFC Groups Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Repartition par groupe CFC</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hierarchicalLines.filter(l => l.level === 0).map((group) => {
              const percent = summary.totalBudgetCurrent > 0
                ? (group.budgetCurrent / summary.totalBudgetCurrent) * 100
                : 0;
              const engagedPercent = group.budgetCurrent > 0
                ? (group.engaged / group.budgetCurrent) * 100
                : 0;

              return (
                <div key={group.id} className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {group.code} - {group.label}
                      </span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${CFC_STATUS_CONFIG[group.status].color}`}>
                        {CFC_STATUS_CONFIG[group.status].label}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">{formatCHF(group.budgetCurrent)}</p>
                      <p className="text-xs text-gray-500">{percent.toFixed(1)}% du total</p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getProgressColor(engagedPercent)}`}
                      style={{ width: `${Math.min(engagedPercent, 100)}%` }}
                    />
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

// ============================================================================
// Lines Tab
// ============================================================================

interface LinesTabProps {
  lines: CFCLine[];
  hierarchicalLines: CFCLine[];
  statusFilter: CFCStatus | 'all';
  onStatusFilterChange: (status: CFCStatus | 'all') => void;
  expandedGroups: Set<string>;
  toggleGroup: (code: string) => void;
}

function LinesTab({
  lines,
  hierarchicalLines,
  statusFilter,
  onStatusFilterChange,
  expandedGroups,
  toggleGroup,
}: LinesTabProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Filtrer par statut:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onStatusFilterChange('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300'
              }`}
            >
              Tous ({lines.length})
            </button>
            {Object.entries(CFC_STATUS_CONFIG).map(([status, config]) => {
              const count = lines.filter((l) => l.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => onStatusFilterChange(status as CFCStatus)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300'
                  }`}
                >
                  {config.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* CFC Lines Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-neutral-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Code CFC</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Libelle</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Budget</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Engage</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Paye</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Ecart</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hierarchicalLines.filter(l => l.level === 0).map((group) => {
                const isExpanded = expandedGroups.has(group.code);
                const children = group.children || [];

                return (
                  <React.Fragment key={group.id}>
                    {/* Parent Row */}
                    <tr className="border-b border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800/50">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleGroup(group.code)}
                          className="flex items-center gap-2 font-medium text-gray-900 dark:text-white"
                        >
                          {children.length > 0 && (
                            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                          )}
                          {group.code}
                        </button>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {group.label}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                        {formatCHF(group.budgetCurrent)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                        {formatCHF(group.engaged)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                        {formatCHF(group.paid)}
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${getVarianceColor(group.variance)}`}>
                        {formatCHF(group.variance)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${CFC_STATUS_CONFIG[group.status].color}`}>
                          {CFC_STATUS_CONFIG[group.status].label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>

                    {/* Children Rows */}
                    {isExpanded && children.map((child) => (
                      <tr key={child.id} className="border-b border-gray-100 dark:border-neutral-800">
                        <td className="py-3 px-4 pl-10 text-gray-600 dark:text-gray-400">
                          {child.code}
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {child.label}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                          {formatCHF(child.budgetCurrent)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                          {formatCHF(child.engaged)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                          {formatCHF(child.paid)}
                        </td>
                        <td className={`py-3 px-4 text-right font-medium ${getVarianceColor(child.variance)}`}>
                          {formatCHF(child.variance)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${CFC_STATUS_CONFIG[child.status].color}`}>
                            {CFC_STATUS_CONFIG[child.status].label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// Analysis Tab
// ============================================================================

interface AnalysisTabProps {
  summary: ReturnType<typeof useCFCBudgetManagement>['summary'];
  lines: CFCLine[];
}

function AnalysisTab({ summary, lines }: AnalysisTabProps) {
  if (!summary) return null;

  // Group lines by first digit of code
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, { label: string; budget: number; engaged: number; paid: number }> = {};
    lines.forEach((line) => {
      const firstDigit = line.code.charAt(0);
      const label = getCFCGroupLabel(line.code);
      if (!groups[firstDigit]) {
        groups[firstDigit] = { label, budget: 0, engaged: 0, paid: 0 };
      }
      groups[firstDigit].budget += line.budgetCurrent;
      groups[firstDigit].engaged += line.engaged;
      groups[firstDigit].paid += line.paid;
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [lines]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Budget total</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCHF(summary.totalBudgetCurrent)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Engage</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">
              {formatCHF(summary.totalEngaged)}
            </p>
            <p className="text-sm text-gray-500">{formatPercent(summary.engagedPercent)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Ecart</p>
            <p className={`text-3xl font-bold mt-1 ${getVarianceColor(summary.totalVariance)}`}>
              {formatCHF(summary.totalVariance)}
            </p>
          </div>
        </Card>
      </div>

      {/* Budget Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Repartition du budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groupedByCategory.map(([code, data]) => {
              const percent = summary.totalBudgetCurrent > 0
                ? (data.budget / summary.totalBudgetCurrent) * 100
                : 0;
              const engagedPercent = data.budget > 0
                ? (data.engaged / data.budget) * 100
                : 0;

              return (
                <div key={code} className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">{code}</span>
                      <h4 className="font-medium text-gray-900 dark:text-white">{data.label}</h4>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">{formatCHF(data.budget)}</p>
                      <p className="text-xs text-gray-500">{percent.toFixed(1)}% du total</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Engage</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatCHF(data.engaged)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Paye</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatCHF(data.paid)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Progression</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatPercent(engagedPercent)}</p>
                    </div>
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

// ============================================================================
// Alerts Tab
// ============================================================================

interface AlertsTabProps {
  summary: ReturnType<typeof useCFCBudgetManagement>['summary'];
  overBudgetLines: CFCLine[];
}

function AlertsTab({ summary, overBudgetLines }: AlertsTabProps) {
  if (!summary) return null;

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Depassements</p>
              <p className="text-2xl font-semibold text-red-600">{summary.linesOverBudget}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Attention requise</p>
              <p className="text-2xl font-semibold text-amber-600">{summary.linesWarning}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Dans le budget</p>
              <p className="text-2xl font-semibold text-green-600">{summary.linesOnTrack}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Over Budget Lines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Lignes en depassement
          </CardTitle>
        </CardHeader>
        <CardContent>
          {overBudgetLines.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">Aucun depassement budgetaire</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overBudgetLines.map((line) => (
                <div
                  key={line.id}
                  className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-red-700">{line.code}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{line.label}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Budget: {formatCHF(line.budgetCurrent)} | Engage: {formatCHF(line.engaged)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-600">{formatCHF(line.variance)}</p>
                      <p className="text-sm text-red-500">{formatPercent(line.variancePercent)} d'ecart</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Over Budget */}
      {summary.topOverBudgetLines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top 5 des depassements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.topOverBudgetLines.map((line, index) => (
                <div key={line.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{line.code} - {line.label}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-red-600">{formatCHF(line.variance)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ProjectCFCBudgetEnhanced;
