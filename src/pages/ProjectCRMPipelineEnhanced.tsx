import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users,
  TrendingUp,
  Target,
  DollarSign,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  ChevronRight,
  Plus,
  Filter,
  Download,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  UserCheck,
  FileSignature,
  Eye,
  MoreHorizontal,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  useCRMPipelineManagement,
  PipelineContact,
  PipelineStage,
  STAGE_CONFIG,
  formatCHF,
  getContactUrgency,
  calculatePipelineForecast,
} from '../hooks/useCRMPipelineManagement';

// ============================================================================
// Tab Types
// ============================================================================

type TabType = 'overview' | 'pipeline' | 'analytics' | 'performance';

// ============================================================================
// Main Component
// ============================================================================

export function ProjectCRMPipelineEnhanced() {
  const { projectId } = useParams<{ projectId: string }>();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stageFilter, setStageFilter] = useState<PipelineStage | 'all'>('all');

  const {
    contacts,
    stageData,
    analytics,
    summary,
    loading,
    error,
    getStalledContacts,
    getHotDeals,
  } = useCRMPipelineManagement(projectId || '');

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    if (stageFilter === 'all') return contacts;
    return contacts.filter((c) => c.stage === stageFilter);
  }, [contacts, stageFilter]);

  // Stalled and hot deals
  const stalledDeals = useMemo(() => getStalledContacts(14), [getStalledContacts]);
  const hotDeals = useMemo(() => getHotDeals(5), [getHotDeals]);

  // Pipeline forecast
  const forecast = useMemo(() => calculatePipelineForecast(stageData), [stageData]);

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
    { id: 'pipeline' as TabType, label: 'Pipeline', icon: Users, count: contacts.length },
    { id: 'analytics' as TabType, label: 'Analytique', icon: BarChart3 },
    { id: 'performance' as TabType, label: 'Performance', icon: Target },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Pipeline Commercial
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestion des prospects, reservations et ventes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Link to={`/projects/${projectId}/crm/prospects/new`}>
            <Button>
              <Plus className="h-4 w-4" />
              Nouveau prospect
            </Button>
          </Link>
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
        <OverviewTab
          summary={summary}
          analytics={analytics}
          stageData={stageData}
          stalledDeals={stalledDeals}
          hotDeals={hotDeals}
          forecast={forecast}
        />
      )}

      {activeTab === 'pipeline' && (
        <PipelineTab
          contacts={filteredContacts}
          stageData={stageData}
          stageFilter={stageFilter}
          onStageFilterChange={setStageFilter}
          projectId={projectId || ''}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTab analytics={analytics} stageData={stageData} />
      )}

      {activeTab === 'performance' && (
        <PerformanceTab analytics={analytics} />
      )}
    </div>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

interface OverviewTabProps {
  summary: ReturnType<typeof useCRMPipelineManagement>['summary'];
  analytics: ReturnType<typeof useCRMPipelineManagement>['analytics'];
  stageData: ReturnType<typeof useCRMPipelineManagement>['stageData'];
  stalledDeals: PipelineContact[];
  hotDeals: PipelineContact[];
  forecast: ReturnType<typeof calculatePipelineForecast>;
}

function OverviewTab({ summary, analytics, stageData, stalledDeals, hotDeals, forecast }: OverviewTabProps) {
  if (!summary || !analytics) return null;

  const kpiCards = [
    {
      title: 'Contacts actifs',
      value: summary.totalProspects + summary.totalReservations + summary.totalBuyers,
      icon: Users,
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    },
    {
      title: 'Valeur pipeline',
      value: formatCHF(summary.pipelineValue),
      icon: DollarSign,
      color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
      isFormatted: true,
    },
    {
      title: 'Taux de conversion',
      value: `${summary.conversionRate.toFixed(1)}%`,
      icon: Target,
      color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
      isFormatted: true,
    },
    {
      title: 'Signes ce mois',
      value: summary.signedThisMonth,
      icon: FileSignature,
      color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
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
                <p className={`text-2xl font-semibold text-gray-900 dark:text-white ${kpi.isFormatted ? 'text-xl' : ''}`}>
                  {kpi.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Entonnoir de vente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stageData.map((stage, index) => {
                const maxCount = Math.max(...stageData.map((s) => s.count));
                const width = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;

                return (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {stage.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{stage.count}</span>
                        {stage.value > 0 && (
                          <span className="text-xs text-gray-400">
                            ({formatCHF(stage.value)})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-8 bg-gray-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
                      <div
                        className={`h-full rounded-lg transition-all duration-500 ${STAGE_CONFIG[stage.stage].color.replace('text-', 'bg-').split(' ')[0]}`}
                        style={{ width: `${Math.max(width, stage.count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Prevision des ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-600 mb-1">Pessimiste</p>
                  <p className="text-xl font-bold text-red-700">{formatCHF(forecast.pessimistic)}</p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p className="text-sm text-amber-600 mb-1">Realiste</p>
                  <p className="text-xl font-bold text-amber-700">{formatCHF(forecast.realistic)}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Optimiste</p>
                  <p className="text-xl font-bold text-green-700">{formatCHF(forecast.optimistic)}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-neutral-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Valeur moyenne pondérée</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCHF(analytics.weightedPipelineValue)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Cycle de vente moyen</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Math.round(summary.avgTimeToClose)} jours
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hot Deals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Affaires prioritaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hotDeals.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune affaire en cours</p>
            ) : (
              <div className="space-y-3">
                {hotDeals.map((deal) => (
                  <ContactRow key={deal.id} contact={deal} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stalled Deals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Affaires en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stalledDeals.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-gray-500">Aucune affaire bloquee</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stalledDeals.slice(0, 5).map((deal) => (
                  <ContactRow key={deal.id} contact={deal} showUrgency />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// Pipeline Tab
// ============================================================================

interface PipelineTabProps {
  contacts: PipelineContact[];
  stageData: ReturnType<typeof useCRMPipelineManagement>['stageData'];
  stageFilter: PipelineStage | 'all';
  onStageFilterChange: (stage: PipelineStage | 'all') => void;
  projectId: string;
}

function PipelineTab({ contacts, stageData, stageFilter, onStageFilterChange, projectId }: PipelineTabProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Filtrer par etape:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onStageFilterChange('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                stageFilter === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300'
              }`}
            >
              Tous ({contacts.length})
            </button>
            {stageData.map((stage) => (
              <button
                key={stage.stage}
                onClick={() => onStageFilterChange(stage.stage)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  stageFilter === stage.stage
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300'
                }`}
              >
                {stage.label} ({stage.count})
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.length === 0 ? (
          <Card className="col-span-full">
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun contact trouve</p>
            </div>
          </Card>
        ) : (
          contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} projectId={projectId} />
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Analytics Tab
// ============================================================================

interface AnalyticsTabProps {
  analytics: ReturnType<typeof useCRMPipelineManagement>['analytics'];
  stageData: ReturnType<typeof useCRMPipelineManagement>['stageData'];
}

function AnalyticsTab({ analytics, stageData }: AnalyticsTabProps) {
  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total contacts</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {analytics.totalContacts}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Valeur pipeline</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCHF(analytics.totalPipelineValue)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Valeur ponderee</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCHF(analytics.weightedPipelineValue)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Valeur moyenne</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCHF(analytics.avgDealValue)}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendance mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthlyTrend.map((month) => (
                <div key={month.month} className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">{month.month}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Nouveaux</p>
                      <p className="font-semibold text-blue-600">{month.newProspects}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Conversions</p>
                      <p className="font-semibold text-green-600">{month.conversions}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Perdus</p>
                      <p className="font-semibold text-red-600">{month.lostDeals}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Source Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sources de prospects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.sourceDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([source, count]) => {
                  const total = Object.values(analytics.sourceDistribution).reduce((a, b) => a + b, 0);
                  const percent = total > 0 ? (count / total) * 100 : 0;

                  return (
                    <div key={source}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{source}</span>
                        <span className="text-gray-500">{count} ({percent.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lost Reasons */}
      {Object.keys(analytics.lostReasons).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Raisons de perte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analytics.lostReasons)
                .sort(([, a], [, b]) => b - a)
                .map(([reason, count]) => (
                  <div key={reason} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-600">{count}</p>
                    <p className="text-sm text-red-700 mt-1">{reason}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// Performance Tab
// ============================================================================

interface PerformanceTabProps {
  analytics: ReturnType<typeof useCRMPipelineManagement>['analytics'];
}

function PerformanceTab({ analytics }: PerformanceTabProps) {
  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Conversion Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Metriques de conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-brand-600">
                {analytics.conversionMetrics.overallConversion.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">Taux global</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {Math.round(analytics.conversionMetrics.avgSalesCycle)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Jours moyens</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.totalContacts}
              </p>
              <p className="text-sm text-gray-500 mt-1">Contacts totaux</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-600">
                {analytics.stageDistribution.signed}
              </p>
              <p className="text-sm text-gray-500 mt-1">Ventes conclues</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance par agent</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.performanceByAgent.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune donnee d'agent disponible</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Agent</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Contacts</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Conversions</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Taux</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Jours moy.</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.performanceByAgent.map((agent) => (
                    <tr key={agent.agentId} className="border-b border-gray-100 dark:border-neutral-800">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-brand-600" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {agent.agentName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                        {agent.contacts}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-green-600 font-medium">{agent.conversions}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-medium ${agent.conversionRate > 20 ? 'text-green-600' : agent.conversionRate > 10 ? 'text-amber-600' : 'text-red-600'}`}>
                          {agent.conversionRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                        {Math.round(agent.avgDaysToClose) || '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Shared Components
// ============================================================================

interface ContactRowProps {
  contact: PipelineContact;
  showUrgency?: boolean;
}

function ContactRow({ contact, showUrgency }: ContactRowProps) {
  const stageConfig = STAGE_CONFIG[contact.stage];
  const urgency = getContactUrgency(contact);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{contact.fullName}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {contact.lotNumber && (
              <>
                <Building2 className="h-3 w-3" />
                <span>Lot {contact.lotNumber}</span>
              </>
            )}
            {contact.lotPrice && (
              <span className="text-green-600">{formatCHF(contact.lotPrice)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {showUrgency && urgency.label && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgency.color}`}>
            {contact.daysInStage}j
          </span>
        )}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageConfig.color}`}>
          {stageConfig.label}
        </span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}

interface ContactCardProps {
  contact: PipelineContact;
  projectId: string;
}

function ContactCard({ contact, projectId }: ContactCardProps) {
  const stageConfig = STAGE_CONFIG[contact.stage];
  const urgency = getContactUrgency(contact);

  const getDetailLink = () => {
    switch (contact.type) {
      case 'prospect':
        return `/projects/${projectId}/crm/prospects/${contact.id}`;
      case 'reservation':
        return `/projects/${projectId}/crm/reservations/${contact.id}`;
      case 'buyer':
        return `/projects/${projectId}/buyers/${contact.id}`;
      default:
        return '#';
    }
  };

  return (
    <Card hover>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
              <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{contact.fullName}</h3>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${stageConfig.color}`}>
                {stageConfig.label}
              </span>
            </div>
          </div>
          {urgency.label && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgency.color}`}>
              {urgency.label}
            </span>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <Mail className="h-4 w-4" />
            <span className="truncate">{contact.email}</span>
          </div>
          {contact.phone && (
            <div className="flex items-center gap-2 text-gray-500">
              <Phone className="h-4 w-4" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.lotNumber && (
            <div className="flex items-center gap-2 text-gray-500">
              <Building2 className="h-4 w-4" />
              <span>Lot {contact.lotNumber}</span>
              {contact.lotPrice && (
                <span className="text-green-600 font-medium">{formatCHF(contact.lotPrice)}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-neutral-700">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{contact.daysInStage} jours dans cette etape</span>
          </div>
          <Link to={getDetailLink()}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export { ProjectCRMPipelineEnhanced };
