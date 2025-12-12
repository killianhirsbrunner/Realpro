import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ClipboardCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Key,
  Award,
  Building2,
  Zap,
  Droplets,
  Thermometer,
  Paintbrush,
  Trees,
  MoreHorizontal,
  Plus,
  Eye,
  ChevronRight,
  Filter,
  TrendingUp,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  useQualityControl,
  Inspection,
  InspectionType,
  InspectionStatus,
  INSPECTION_TYPE_CONFIG,
  INSPECTION_STATUS_CONFIG,
  ISSUE_SEVERITY_CONFIG,
  formatInspectionDate,
  getInspectionUrgency,
  getDaysUntilInspection,
} from '../hooks/useQualityControl';

// ============================================================================
// Icons mapping
// ============================================================================

const INSPECTION_TYPE_ICONS: Record<InspectionType, React.ReactNode> = {
  PRE_INSPECTION: <Search className="h-4 w-4" />,
  INSPECTION: <ClipboardCheck className="h-4 w-4" />,
  FINAL_INSPECTION: <Award className="h-4 w-4" />,
  HANDOVER: <Key className="h-4 w-4" />,
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  STRUCTURAL: <Building2 className="h-4 w-4" />,
  ELECTRICAL: <Zap className="h-4 w-4" />,
  PLUMBING: <Droplets className="h-4 w-4" />,
  HVAC: <Thermometer className="h-4 w-4" />,
  FINISHING: <Paintbrush className="h-4 w-4" />,
  EXTERIOR: <Trees className="h-4 w-4" />,
  OTHER: <MoreHorizontal className="h-4 w-4" />,
};

// ============================================================================
// Tab Types
// ============================================================================

type TabType = 'overview' | 'inspections' | 'issues' | 'schedule';

// ============================================================================
// Main Component
// ============================================================================

export function ProjectQualityControlEnhanced() {
  const { projectId } = useParams<{ projectId: string }>();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [statusFilter, setStatusFilter] = useState<InspectionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<InspectionType | 'all'>('all');

  const {
    inspections,
    summary,
    loading,
    error,
    getUpcoming,
    getWithIssues,
  } = useQualityControl(projectId || '');

  // Filtered inspections
  const filteredInspections = useMemo(() => {
    return inspections.filter((i) => {
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      if (typeFilter !== 'all' && i.type !== typeFilter) return false;
      return true;
    });
  }, [inspections, statusFilter, typeFilter]);

  // Upcoming inspections
  const upcomingInspections = useMemo(() => getUpcoming(), [getUpcoming]);

  // Inspections with unresolved issues
  const inspectionsWithIssues = useMemo(() => getWithIssues(), [getWithIssues]);

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
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Vue d\'ensemble', icon: TrendingUp },
    { id: 'inspections' as TabType, label: 'Inspections', icon: ClipboardCheck, count: inspections.length },
    { id: 'issues' as TabType, label: 'Problemes', icon: AlertTriangle, count: summary?.openIssues || 0 },
    { id: 'schedule' as TabType, label: 'Planning', icon: Calendar, count: upcomingInspections.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Controle Qualite
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestion des inspections et controle de conformite
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Nouvelle inspection
        </Button>
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
                  ${activeTab === tab.id
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
        <OverviewTab summary={summary} inspections={inspections} inspectionsWithIssues={inspectionsWithIssues} />
      )}

      {activeTab === 'inspections' && (
        <InspectionsTab
          inspections={filteredInspections}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          onStatusFilterChange={setStatusFilter}
          onTypeFilterChange={setTypeFilter}
        />
      )}

      {activeTab === 'issues' && (
        <IssuesTab summary={summary} inspectionsWithIssues={inspectionsWithIssues} />
      )}

      {activeTab === 'schedule' && (
        <ScheduleTab upcomingInspections={upcomingInspections} />
      )}
    </div>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

interface OverviewTabProps {
  summary: ReturnType<typeof useQualityControl>['summary'];
  inspections: Inspection[];
  inspectionsWithIssues: Inspection[];
}

function OverviewTab({ summary, inspections, inspectionsWithIssues }: OverviewTabProps) {
  if (!summary) return null;

  const kpiCards = [
    {
      title: 'Inspections totales',
      value: summary.totalInspections,
      icon: ClipboardCheck,
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    },
    {
      title: 'En attente',
      value: summary.scheduled,
      icon: Clock,
      color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    },
    {
      title: 'Terminees',
      value: summary.completed,
      icon: CheckCircle2,
      color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    },
    {
      title: 'Problemes ouverts',
      value: summary.openIssues,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
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
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{kpi.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Taux de completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Inspections terminees</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {summary.completionRate.toFixed(0)}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${summary.completionRate}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{summary.scheduled}</p>
                  <p className="text-gray-500">Planifiees</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{summary.inProgress}</p>
                  <p className="text-gray-500">En cours</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{summary.completed}</p>
                  <p className="text-gray-500">Terminees</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issues Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Problemes identifies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Resolution moyenne</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {summary.avgResolutionDays} jours
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-red-600 font-medium">Ouverts</span>
                  </div>
                  <p className="text-2xl font-bold text-red-700 mt-2">{summary.openIssues}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-medium">Resolus</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700 mt-2">{summary.resolvedIssues}</p>
                </div>
              </div>
              {summary.criticalIssues > 0 && (
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-orange-600" />
                    <span className="text-orange-700 font-medium">
                      {summary.criticalIssues} probleme(s) critique(s) non resolu(s)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* By Type */}
      <Card>
        <CardHeader>
          <CardTitle>Inspections par type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(summary.byType).map(([type, count]) => {
              const config = INSPECTION_TYPE_CONFIG[type as InspectionType];
              return (
                <div key={type} className={`p-4 rounded-lg ${config.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {INSPECTION_TYPE_ICONS[type as InspectionType]}
                    <span className="font-medium">{config.label}</span>
                  </div>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Inspections with Issues */}
      {inspectionsWithIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Inspections avec problemes non resolus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inspectionsWithIssues.slice(0, 5).map((inspection) => (
                <InspectionRow key={inspection.id} inspection={inspection} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// Inspections Tab
// ============================================================================

interface InspectionsTabProps {
  inspections: Inspection[];
  statusFilter: InspectionStatus | 'all';
  typeFilter: InspectionType | 'all';
  onStatusFilterChange: (status: InspectionStatus | 'all') => void;
  onTypeFilterChange: (type: InspectionType | 'all') => void;
}

function InspectionsTab({
  inspections,
  statusFilter,
  typeFilter,
  onStatusFilterChange,
  onTypeFilterChange,
}: InspectionsTabProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Filtrer par:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as InspectionStatus | 'all')}
            className="rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(INSPECTION_STATUS_CONFIG).map(([status, config]) => (
              <option key={status} value={status}>{config.label}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value as InspectionType | 'all')}
            className="rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
          >
            <option value="all">Tous les types</option>
            {Object.entries(INSPECTION_TYPE_CONFIG).map(([type, config]) => (
              <option key={type} value={type}>{config.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Inspections List */}
      <div className="space-y-3">
        {inspections.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune inspection trouvee</p>
            </div>
          </Card>
        ) : (
          inspections.map((inspection) => (
            <InspectionCard key={inspection.id} inspection={inspection} />
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Issues Tab
// ============================================================================

interface IssuesTabProps {
  summary: ReturnType<typeof useQualityControl>['summary'];
  inspectionsWithIssues: Inspection[];
}

function IssuesTab({ summary, inspectionsWithIssues }: IssuesTabProps) {
  if (!summary) return null;

  return (
    <div className="space-y-6">
      {/* Issues Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-neutral-800">
              <AlertTriangle className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-semibold">{summary.totalIssues}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ouverts</p>
              <p className="text-2xl font-semibold">{summary.openIssues}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <XCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Critiques</p>
              <p className="text-2xl font-semibold">{summary.criticalIssues}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Resolus</p>
              <p className="text-2xl font-semibold">{summary.resolvedIssues}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Severity Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution par severite</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(ISSUE_SEVERITY_CONFIG).map(([severity, config]) => (
              <div key={severity} className={`p-4 rounded-lg ${config.color}`}>
                <span className="font-medium">{config.label}</span>
                <p className="text-2xl font-bold mt-1">
                  {/* Would need real data here */}
                  --
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inspections with Open Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Inspections avec problemes ouverts</CardTitle>
        </CardHeader>
        <CardContent>
          {inspectionsWithIssues.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">Tous les problemes sont resolus</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inspectionsWithIssues.map((inspection) => (
                <div
                  key={inspection.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {INSPECTION_TYPE_ICONS[inspection.type]}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {INSPECTION_TYPE_CONFIG[inspection.type].label}
                          {inspection.lot && ` - Lot ${inspection.lot.lot_number}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatInspectionDate(inspection.scheduled_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-red-600 font-medium">
                          {(inspection.issues_count || 0) - (inspection.resolved_count || 0)} probleme(s) ouvert(s)
                        </p>
                        <p className="text-xs text-gray-500">
                          sur {inspection.issues_count} total
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Schedule Tab
// ============================================================================

interface ScheduleTabProps {
  upcomingInspections: Inspection[];
}

function ScheduleTab({ upcomingInspections }: ScheduleTabProps) {
  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Inspection[]> = {};
    upcomingInspections.forEach((inspection) => {
      const date = new Date(inspection.scheduled_date).toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(inspection);
    });
    return groups;
  }, [upcomingInspections]);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <CardTitle>Inspections a venir</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingInspections.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune inspection planifiee</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByDate).map(([date, dateInspections]) => (
                <div key={date}>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    {new Date(date).toLocaleDateString('fr-CH', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                  <div className="space-y-3 pl-4 border-l-2 border-gray-200 dark:border-neutral-700">
                    {dateInspections.map((inspection) => {
                      const urgency = getInspectionUrgency(inspection);
                      return (
                        <div
                          key={inspection.id}
                          className="p-4 rounded-lg bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${INSPECTION_TYPE_CONFIG[inspection.type].color}`}>
                                {INSPECTION_TYPE_ICONS[inspection.type]}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {INSPECTION_TYPE_CONFIG[inspection.type].label}
                                </p>
                                {inspection.lot && (
                                  <p className="text-sm text-gray-500">
                                    Lot {inspection.lot.lot_number}
                                    {inspection.lot.floor && ` - Etage ${inspection.lot.floor}`}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-500">
                                {new Date(inspection.scheduled_date).toLocaleTimeString('fr-CH', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {urgency.label && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgency.color}`}>
                                  {urgency.label}
                                </span>
                              )}
                              <Button variant="ghost" size="sm">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {inspection.inspector && (
                            <p className="text-sm text-gray-500 mt-2">
                              Inspecteur: {inspection.inspector.first_name} {inspection.inspector.last_name}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cette semaine</p>
              <p className="text-2xl font-semibold">
                {upcomingInspections.filter((i) => getDaysUntilInspection(i.scheduled_date) <= 7).length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aujourd'hui</p>
              <p className="text-2xl font-semibold">
                {upcomingInspections.filter((i) => getDaysUntilInspection(i.scheduled_date) === 0).length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ce mois</p>
              <p className="text-2xl font-semibold">{upcomingInspections.length}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// Shared Components
// ============================================================================

interface InspectionRowProps {
  inspection: Inspection;
}

function InspectionRow({ inspection }: InspectionRowProps) {
  const statusConfig = INSPECTION_STATUS_CONFIG[inspection.status];
  const typeConfig = INSPECTION_TYPE_CONFIG[inspection.type];

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${typeConfig.color}`}>
          {INSPECTION_TYPE_ICONS[inspection.type]}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {typeConfig.label}
            {inspection.lot && ` - Lot ${inspection.lot.lot_number}`}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(inspection.scheduled_date).toLocaleDateString('fr-CH')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
        {(inspection.issues_count || 0) > 0 && (
          <span className="text-sm text-red-600 font-medium">
            {(inspection.issues_count || 0) - (inspection.resolved_count || 0)} ouvert(s)
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}

interface InspectionCardProps {
  inspection: Inspection;
}

function InspectionCard({ inspection }: InspectionCardProps) {
  const statusConfig = INSPECTION_STATUS_CONFIG[inspection.status];
  const typeConfig = INSPECTION_TYPE_CONFIG[inspection.type];
  const urgency = getInspectionUrgency(inspection);

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${typeConfig.color}`}>
            {INSPECTION_TYPE_ICONS[inspection.type]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {typeConfig.label}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
              {urgency.label && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgency.color}`}>
                  {urgency.label}
                </span>
              )}
            </div>
            {inspection.lot && (
              <p className="text-sm text-gray-500 mt-1">
                Lot {inspection.lot.lot_number}
                {inspection.lot.floor && ` - Etage ${inspection.lot.floor}`}
              </p>
            )}
            <p className="text-sm text-gray-500">
              {formatInspectionDate(inspection.scheduled_date)}
            </p>
            {inspection.inspector && (
              <p className="text-sm text-gray-500">
                Inspecteur: {inspection.inspector.first_name} {inspection.inspector.last_name}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {(inspection.issues_count || 0) > 0 && (
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {inspection.issues_count} probleme(s)
              </p>
              <p className="text-xs text-gray-500">
                {inspection.resolved_count || 0} resolu(s)
              </p>
            </div>
          )}
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            Details
          </Button>
        </div>
      </div>
      {inspection.notes && (
        <p className="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
          {inspection.notes}
        </p>
      )}
    </Card>
  );
}
