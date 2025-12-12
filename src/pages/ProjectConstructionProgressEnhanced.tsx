import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ArrowLeft,
  Filter,
  BarChart3,
  Users,
  Hammer,
  Home,
  ChevronRight,
  Eye,
  Edit3,
  Layers,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  useConstructionProgress,
  LotProgress,
  ConstructionPhase,
  PHASE_CONFIG,
  getProgressColor,
  getProgressStatus,
  formatProgressDate,
  calculateEstimatedCompletion,
} from '../hooks/useConstructionProgress';

// ============================================================================
// Tab Types
// ============================================================================

type TabType = 'overview' | 'lots' | 'phases' | 'timeline';

// ============================================================================
// Main Component
// ============================================================================

export function ProjectConstructionProgressEnhanced() {
  const { projectId } = useParams<{ projectId: string }>();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [phaseFilter, setPhaseFilter] = useState<ConstructionPhase | 'all'>('all');
  const [progressFilter, setProgressFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');

  const {
    lots,
    summary,
    loading,
    error,
    getByPhase,
    getDelayed,
    getCompleted,
  } = useConstructionProgress(projectId || '');

  // Filtered lots
  const filteredLots = useMemo(() => {
    let result = lots;

    if (phaseFilter !== 'all') {
      result = result.filter((l) => l.currentPhase === phaseFilter);
    }

    if (progressFilter !== 'all') {
      if (progressFilter === 'not_started') {
        result = result.filter((l) => l.globalProgress === 0);
      } else if (progressFilter === 'in_progress') {
        result = result.filter((l) => l.globalProgress > 0 && l.globalProgress < 100);
      } else if (progressFilter === 'completed') {
        result = result.filter((l) => l.globalProgress >= 100);
      }
    }

    return result;
  }, [lots, phaseFilter, progressFilter]);

  // Delayed lots
  const delayedLots = useMemo(() => getDelayed(), [getDelayed]);

  // Completed lots
  const completedLots = useMemo(() => getCompleted(), [getCompleted]);

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
    { id: 'lots' as TabType, label: 'Par lot', icon: Building2, count: lots.length },
    { id: 'phases' as TabType, label: 'Par phase', icon: Layers },
    { id: 'timeline' as TabType, label: 'Timeline', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to={`/projects/${projectId}/planning`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour au planning
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Avancement Construction
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Suivi de progression par lot et par phase
          </p>
        </div>
        <Button>
          <Edit3 className="h-4 w-4" />
          Mettre a jour
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
              {tab.count !== undefined && (
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
          lots={lots}
          delayedLots={delayedLots}
          completedLots={completedLots}
        />
      )}

      {activeTab === 'lots' && (
        <LotsTab
          lots={filteredLots}
          phaseFilter={phaseFilter}
          progressFilter={progressFilter}
          onPhaseFilterChange={setPhaseFilter}
          onProgressFilterChange={setProgressFilter}
          projectId={projectId || ''}
        />
      )}

      {activeTab === 'phases' && (
        <PhasesTab summary={summary} lots={lots} getByPhase={getByPhase} />
      )}

      {activeTab === 'timeline' && (
        <TimelineTab lots={lots} />
      )}
    </div>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

interface OverviewTabProps {
  summary: ReturnType<typeof useConstructionProgress>['summary'];
  lots: LotProgress[];
  delayedLots: LotProgress[];
  completedLots: LotProgress[];
}

function OverviewTab({ summary, lots, delayedLots, completedLots }: OverviewTabProps) {
  if (!summary) return null;

  const kpiCards = [
    {
      title: 'Lots totaux',
      value: summary.totalLots,
      icon: Building2,
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    },
    {
      title: 'Progression moyenne',
      value: `${summary.avgGlobalProgress.toFixed(0)}%`,
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    },
    {
      title: 'Lots termines',
      value: summary.lotsCompleted,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30',
    },
    {
      title: 'En retard',
      value: summary.lotsDelayed,
      icon: AlertTriangle,
      color: summary.lotsDelayed > 0
        ? 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
        : 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
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
        {/* Global Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progression globale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Avancement moyen</span>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {summary.avgGlobalProgress.toFixed(0)}%
                </span>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${summary.avgGlobalProgress}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm pt-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{summary.lotsWithProgress}</p>
                  <p className="text-gray-500">En cours</p>
                </div>
                <div>
                  <p className="font-medium text-green-600">{summary.lotsCompleted}</p>
                  <p className="text-gray-500">Termines</p>
                </div>
                <div>
                  <p className="font-medium text-amber-600">{summary.totalLots - summary.lotsWithProgress - summary.lotsCompleted}</p>
                  <p className="text-gray-500">Non demarres</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution par phase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(PHASE_CONFIG).map(([phase, config]) => {
                const count = summary.phaseDistribution[phase as ConstructionPhase];
                const percent = summary.totalLots > 0 ? (count / summary.totalLots) * 100 : 0;

                return (
                  <div key={phase}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{config.label}</span>
                      <span className="text-gray-500">{count} lot{count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${config.color.replace('text-', 'bg-').split(' ')[0]}`}
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

      {/* Delayed & Recent Completions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delayed Lots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Lots en retard
            </CardTitle>
          </CardHeader>
          <CardContent>
            {delayedLots.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500">Aucun retard detecte</p>
              </div>
            ) : (
              <div className="space-y-3">
                {delayedLots.slice(0, 5).map((lot) => (
                  <LotRow key={lot.lotId} lot={lot} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Completions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Lots termines
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedLots.length === 0 ? (
              <div className="text-center py-8">
                <Hammer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun lot termine</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedLots.slice(0, 5).map((lot) => (
                  <LotRow key={lot.lotId} lot={lot} showProgress />
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
// Lots Tab
// ============================================================================

interface LotsTabProps {
  lots: LotProgress[];
  phaseFilter: ConstructionPhase | 'all';
  progressFilter: 'all' | 'not_started' | 'in_progress' | 'completed';
  onPhaseFilterChange: (phase: ConstructionPhase | 'all') => void;
  onProgressFilterChange: (filter: 'all' | 'not_started' | 'in_progress' | 'completed') => void;
  projectId: string;
}

function LotsTab({
  lots,
  phaseFilter,
  progressFilter,
  onPhaseFilterChange,
  onProgressFilterChange,
  projectId,
}: LotsTabProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Filtrer:</span>
          </div>
          <select
            value={phaseFilter}
            onChange={(e) => onPhaseFilterChange(e.target.value as ConstructionPhase | 'all')}
            className="rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
          >
            <option value="all">Toutes les phases</option>
            {Object.entries(PHASE_CONFIG).map(([phase, config]) => (
              <option key={phase} value={phase}>{config.label}</option>
            ))}
          </select>
          <select
            value={progressFilter}
            onChange={(e) => onProgressFilterChange(e.target.value as any)}
            className="rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="not_started">Non demarre</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Termine</option>
          </select>
        </div>
      </Card>

      {/* Lots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lots.length === 0 ? (
          <Card className="col-span-full">
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun lot trouve</p>
            </div>
          </Card>
        ) : (
          lots.map((lot) => (
            <LotCard key={lot.lotId} lot={lot} projectId={projectId} />
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Phases Tab
// ============================================================================

interface PhasesTabProps {
  summary: ReturnType<typeof useConstructionProgress>['summary'];
  lots: LotProgress[];
  getByPhase: (phase: ConstructionPhase) => LotProgress[];
}

function PhasesTab({ summary, lots, getByPhase }: PhasesTabProps) {
  const [expandedPhase, setExpandedPhase] = useState<ConstructionPhase | null>(null);

  if (!summary) return null;

  return (
    <div className="space-y-4">
      {Object.entries(PHASE_CONFIG).map(([phase, config]) => {
        const phaseLots = getByPhase(phase as ConstructionPhase);
        const isExpanded = expandedPhase === phase;

        return (
          <Card key={phase}>
            <button
              onClick={() => setExpandedPhase(isExpanded ? null : phase as ConstructionPhase)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${config.color}`}>
                    <Hammer className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{config.label}</h3>
                    <p className="text-sm text-gray-500">{config.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{phaseLots.length}</p>
                    <p className="text-sm text-gray-500">lot{phaseLots.length !== 1 ? 's' : ''}</p>
                  </div>
                  <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </button>

            {isExpanded && phaseLots.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700 space-y-3">
                {phaseLots.map((lot) => (
                  <LotRow key={lot.lotId} lot={lot} showProgress />
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ============================================================================
// Timeline Tab
// ============================================================================

interface TimelineTabProps {
  lots: LotProgress[];
}

function TimelineTab({ lots }: TimelineTabProps) {
  // Group lots by recent activity
  const sortedLots = useMemo(() => {
    return [...lots]
      .filter((l) => l.lastUpdateDate)
      .sort((a, b) => new Date(b.lastUpdateDate).getTime() - new Date(a.lastUpdateDate).getTime())
      .slice(0, 20);
  }, [lots]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, LotProgress[]> = {};
    sortedLots.forEach((lot) => {
      const date = lot.lastUpdateDate.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(lot);
    });
    return groups;
  }, [sortedLots]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Historique des mises a jour</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedByDate).length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune mise a jour recente</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByDate).map(([date, dateLots]) => (
                <div key={date}>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    {formatProgressDate(date)}
                  </h3>
                  <div className="space-y-3 pl-4 border-l-2 border-gray-200 dark:border-neutral-700">
                    {dateLots.map((lot) => (
                      <div
                        key={lot.lotId}
                        className="p-4 rounded-lg bg-gray-50 dark:bg-neutral-800"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${PHASE_CONFIG[lot.currentPhase].color}`}>
                              <Building2 className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                Lot {lot.lotNumber}
                              </p>
                              <p className="text-sm text-gray-500">
                                {PHASE_CONFIG[lot.currentPhase].label}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {lot.globalProgress}%
                            </p>
                            {lot.buyerName && (
                              <p className="text-xs text-gray-500">{lot.buyerName}</p>
                            )}
                          </div>
                        </div>
                        {lot.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-neutral-700">
                            {lot.notes}
                          </p>
                        )}
                      </div>
                    ))}
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
// Shared Components
// ============================================================================

interface LotRowProps {
  lot: LotProgress;
  showProgress?: boolean;
}

function LotRow({ lot, showProgress }: LotRowProps) {
  const phaseConfig = PHASE_CONFIG[lot.currentPhase];
  const status = getProgressStatus(lot);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${phaseConfig.color}`}>
          <Building2 className="h-4 w-4" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            Lot {lot.lotNumber}
          </p>
          <p className="text-sm text-gray-500">
            {phaseConfig.label}
            {lot.buyerName && ` - ${lot.buyerName}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {showProgress && (
          <div className="w-24">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">Progression</span>
              <span className="font-medium">{lot.globalProgress}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${lot.globalProgress}%` }}
              />
            </div>
          </div>
        )}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
          {status.label}
        </span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}

interface LotCardProps {
  lot: LotProgress;
  projectId: string;
}

function LotCard({ lot, projectId }: LotCardProps) {
  const phaseConfig = PHASE_CONFIG[lot.currentPhase];
  const status = getProgressStatus(lot);
  const estimatedCompletion = calculateEstimatedCompletion(lot);

  return (
    <Card hover>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${phaseConfig.color}`}>
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Lot {lot.lotNumber}</h3>
              <p className="text-sm text-gray-500">{lot.lotType}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Progression globale</span>
            <span className="font-semibold text-gray-900 dark:text-white">{lot.globalProgress}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
              style={{ width: `${lot.globalProgress}%` }}
            />
          </div>
        </div>

        {/* Phase Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Phase actuelle</p>
            <p className="font-medium text-gray-900 dark:text-white">{phaseConfig.label}</p>
          </div>
          {lot.buyerName && (
            <div>
              <p className="text-gray-500">Acheteur</p>
              <p className="font-medium text-gray-900 dark:text-white truncate">{lot.buyerName}</p>
            </div>
          )}
        </div>

        {/* Phase Progress Bars */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-24">Gros oeuvre</span>
            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${lot.grosOeuvreProgress}%` }} />
            </div>
            <span className="text-xs font-medium w-8 text-right">{lot.grosOeuvreProgress}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-24">Second oeuvre</span>
            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${lot.secondOeuvreProgress}%` }} />
            </div>
            <span className="text-xs font-medium w-8 text-right">{lot.secondOeuvreProgress}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-24">Finitions</span>
            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div className="h-full bg-pink-500 rounded-full" style={{ width: `${lot.finitionsProgress}%` }} />
            </div>
            <span className="text-xs font-medium w-8 text-right">{lot.finitionsProgress}%</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-neutral-700">
          <div className="text-xs text-gray-500">
            {estimatedCompletion ? (
              <span>Fin estimee: {formatProgressDate(estimatedCompletion.toISOString())}</span>
            ) : lot.lastUpdateDate ? (
              <span>Maj: {formatProgressDate(lot.lastUpdateDate)}</span>
            ) : null}
          </div>
          <Link to={`/projects/${projectId}/lots/${lot.lotId}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default ProjectConstructionProgressEnhanced;
