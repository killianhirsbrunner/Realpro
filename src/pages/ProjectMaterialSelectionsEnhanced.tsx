import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Package,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Users,
  ChevronRight,
  Filter,
  BarChart3,
  Eye,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Lock,
  Unlock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  useMaterialSelectionManagement,
  MaterialCategory,
  formatCHF,
  getCategoryIcon,
} from '../hooks/useMaterialSelectionManagement';

// ============================================================================
// Tab Types
// ============================================================================

type TabType = 'overview' | 'categories' | 'lots' | 'analytics';

// ============================================================================
// Main Component
// ============================================================================

export function ProjectMaterialSelectionsEnhanced() {
  const { projectId } = useParams<{ projectId: string }>();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const {
    categories,
    options,
    stats,
    loading,
    error,
    getOptionsByCategory,
  } = useMaterialSelectionManagement(projectId || '');

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
    { id: 'categories' as TabType, label: 'Categories', icon: Package, count: categories.length },
    { id: 'lots' as TabType, label: 'Par lot', icon: Building2, count: stats?.totalLots || 0 },
    { id: 'analytics' as TabType, label: 'Analytique', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Selection Materiaux
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestion des choix materiaux par lot et categorie
          </p>
        </div>
        <Link to={`/projects/${projectId}/materials/catalogue`}>
          <Button>
            <Package className="h-4 w-4" />
            Gerer le catalogue
          </Button>
        </Link>
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
        <OverviewTab stats={stats} categories={categories} options={options} projectId={projectId || ''} />
      )}

      {activeTab === 'categories' && (
        <CategoriesTab categories={categories} getOptionsByCategory={getOptionsByCategory} projectId={projectId || ''} />
      )}

      {activeTab === 'lots' && (
        <LotsTab stats={stats} projectId={projectId || ''} />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTab stats={stats} categories={categories} />
      )}
    </div>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

interface OverviewTabProps {
  stats: ReturnType<typeof useMaterialSelectionManagement>['stats'];
  categories: MaterialCategory[];
  options: ReturnType<typeof useMaterialSelectionManagement>['options'];
  projectId: string;
}

function OverviewTab({ stats, categories, options, projectId }: OverviewTabProps) {
  if (!stats) return null;

  const kpiCards = [
    {
      title: 'Lots avec choix',
      value: `${stats.lotsWithChoices}/${stats.totalLots}`,
      icon: Building2,
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    },
    {
      title: 'Lots complets',
      value: stats.lotsComplete,
      icon: CheckCircle2,
      color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    },
    {
      title: 'Revenus supplements',
      value: formatCHF(stats.totalSurcharge),
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30',
      isFormatted: true,
    },
    {
      title: 'En attente approbation',
      value: stats.pendingApprovals,
      icon: Clock,
      color: stats.pendingApprovals > 0
        ? 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30'
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
                <p className={`text-2xl font-semibold text-gray-900 dark:text-white ${kpi.isFormatted ? 'text-xl' : ''}`}>
                  {kpi.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progression globale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Lots avec selections</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalLots > 0 ? Math.round((stats.lotsWithChoices / stats.totalLots) * 100) : 0}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalLots > 0 ? (stats.lotsWithChoices / stats.totalLots) * 100 : 0}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm pt-2">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{stats.lotsWithChoices}</p>
                  <p className="text-gray-500">Avec choix</p>
                </div>
                <div>
                  <p className="font-medium text-green-600">{stats.lotsComplete}</p>
                  <p className="text-gray-500">Complets</p>
                </div>
                <div>
                  <p className="font-medium text-amber-600">{stats.totalLots - stats.lotsWithChoices}</p>
                  <p className="text-gray-500">Sans choix</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Revenus des supplements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-green-600">{formatCHF(stats.totalSurcharge)}</p>
                <p className="text-sm text-gray-500 mt-1">Total des supplements</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCHF(stats.avgSurchargePerLot)}
                  </p>
                  <p className="text-sm text-gray-500">Moyenne par lot</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {options.filter(o => !o.isStandard && o.priceDelta > 0).length}
                  </p>
                  <p className="text-sm text-gray-500">Options premium</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Upgrades */}
      {stats.popularUpgrades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Options les plus populaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.popularUpgrades.slice(0, 5).map((upgrade, index) => (
                <div
                  key={upgrade.optionId}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{upgrade.optionName}</p>
                      <p className="text-sm text-gray-500">{upgrade.count} selection(s)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCHF(upgrade.revenue)}</p>
                    <p className="text-xs text-gray-500">revenus</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Completion */}
      <Card>
        <CardHeader>
          <CardTitle>Completion par categorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.categoryCompletion.map((cat) => {
              const percent = cat.total > 0 ? (cat.completed / cat.total) * 100 : 0;
              return (
                <div key={cat.categoryId}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{cat.categoryName}</span>
                    <span className="text-gray-500">{cat.completed}/{cat.total} lots</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-500"
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
  );
}

// ============================================================================
// Categories Tab
// ============================================================================

interface CategoriesTabProps {
  categories: MaterialCategory[];
  getOptionsByCategory: (categoryId: string) => ReturnType<typeof useMaterialSelectionManagement>['options'];
  projectId: string;
}

function CategoriesTab({ categories, getOptionsByCategory, projectId }: CategoriesTabProps) {
  return (
    <div className="space-y-4">
      {categories.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune categorie configuree</p>
            <Link to={`/projects/${projectId}/materials/catalogue`}>
              <Button variant="outline" className="mt-4">
                Configurer le catalogue
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const categoryOptions = getOptionsByCategory(category.id);
            const standardCount = categoryOptions.filter(o => o.isStandard).length;
            const upgradeCount = categoryOptions.filter(o => !o.isStandard && o.priceDelta > 0).length;

            return (
              <Card key={category.id} hover>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
                        <p className="text-sm text-gray-500">{categoryOptions.length} option(s)</p>
                      </div>
                    </div>
                    {category.isRequired && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Obligatoire
                      </span>
                    )}
                  </div>

                  {category.description && (
                    <p className="text-sm text-gray-500">{category.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Standards</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{standardCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Upgrades</p>
                      <p className="font-semibold text-green-600">{upgradeCount}</p>
                    </div>
                  </div>

                  {category.deadline && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 pt-2 border-t border-gray-200 dark:border-neutral-700">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {new Date(category.deadline).toLocaleDateString('fr-CH')}</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Lots Tab
// ============================================================================

interface LotsTabProps {
  stats: ReturnType<typeof useMaterialSelectionManagement>['stats'];
  projectId: string;
}

function LotsTab({ stats, projectId }: LotsTabProps) {
  // This would need to fetch lots data, simplified for now
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Suivi par lot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-700">{stats?.totalLots || 0}</p>
              <p className="text-sm text-blue-600">Lots totaux</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
              <p className="text-3xl font-bold text-amber-700">{stats?.lotsWithChoices || 0}</p>
              <p className="text-sm text-amber-600">Avec selections</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-700">{stats?.lotsComplete || 0}</p>
              <p className="text-sm text-green-600">Complets</p>
            </div>
          </div>

          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Consultez les details par lot</p>
            <Link to={`/projects/${projectId}/materials`}>
              <Button variant="outline">
                Voir les lots
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Analytics Tab
// ============================================================================

interface AnalyticsTabProps {
  stats: ReturnType<typeof useMaterialSelectionManagement>['stats'];
  categories: MaterialCategory[];
}

function AnalyticsTab({ stats, categories }: AnalyticsTabProps) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Revenus supplements</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatCHF(stats.totalSurcharge)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Moyenne par lot</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCHF(stats.avgSurchargePerLot)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Taux completion</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.totalLots > 0 ? Math.round((stats.lotsComplete / stats.totalLots) * 100) : 0}%
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Categories</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{categories.length}</p>
          </div>
        </Card>
      </div>

      {/* Top Upgrades by Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 des options par revenus</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.popularUpgrades.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune donnee disponible</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">#</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Option</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Selections</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Revenus</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.popularUpgrades.map((upgrade, index) => (
                    <tr key={upgrade.optionId} className="border-b border-gray-100 dark:border-neutral-800">
                      <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900 dark:text-white">{upgrade.optionName}</span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                        {upgrade.count}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-medium text-green-600">{formatCHF(upgrade.revenue)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques par categorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.categoryCompletion.map((cat) => {
              const percent = cat.total > 0 ? (cat.completed / cat.total) * 100 : 0;
              return (
                <div key={cat.categoryId} className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{cat.categoryName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      percent >= 100 ? 'bg-green-100 text-green-700' :
                      percent >= 50 ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {percent.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 100 ? 'bg-green-500' :
                        percent >= 50 ? 'bg-amber-500' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {cat.completed} sur {cat.total} lots
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProjectMaterialSelectionsEnhanced;
