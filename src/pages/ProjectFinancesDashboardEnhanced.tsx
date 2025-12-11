import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Building2,
  ArrowRight,
  BarChart3,
  PieChart,
  Calendar,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useCFCManagement, formatCHF, getVarianceStatus, calculateProgress } from '../hooks/useCFCManagement';
import {
  useBuyerInstallments,
  formatCentsToChf,
  getDueDaysInfo,
  INSTALLMENT_STATUS_CONFIG,
} from '../hooks/useBuyerInstallments';
import { RealProCard } from '@/components/realpro/RealProCard';
import { RealProButton } from '@/components/realpro/RealProButton';
import { RealProTabs } from '@/components/realpro/RealProTabs';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';

export default function ProjectFinancesDashboardEnhanced() {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const {
    budget,
    lines: cfcLines,
    summary: cfcSummary,
    loading: cfcLoading,
    refresh: refreshCFC,
  } = useCFCManagement(projectId!);

  const {
    installments,
    buyerSummaries,
    projectSummary: installmentsSummary,
    loading: installmentsLoading,
    getOverdueInstallments,
    getUpcomingInstallments,
    refresh: refreshInstallments,
  } = useBuyerInstallments(projectId!);

  const loading = cfcLoading || installmentsLoading;
  const overdueInstallments = getOverdueInstallments();
  const upcomingInstallments = getUpcomingInstallments();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: "Vue d'ensemble" },
    { id: 'cfc', label: `Budget CFC (${cfcLines.length})` },
    { id: 'buyers', label: `Acheteurs (${buyerSummaries.length})` },
    { id: 'alerts', label: `Alertes (${overdueInstallments.length})` },
  ];

  const handleRefresh = () => {
    refreshCFC();
    refreshInstallments();
  };

  return (
    <div className="px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Finances du projet
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Vue d'ensemble des budgets CFC et acomptes acheteurs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RealProButton variant="secondary" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </RealProButton>
          <Link to={`/projects/${projectId}/finances/invoices/new`}>
            <RealProButton variant="primary">
              <Plus className="w-4 h-4" />
              Nouvelle facture
            </RealProButton>
          </Link>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Budget CFC */}
        <RealProCard className="!p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            {cfcSummary && (
              <Badge className={cfcSummary.totalVariance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {cfcSummary.totalVariance >= 0 ? '+' : ''}{formatCHF(cfcSummary.totalVariance)}
              </Badge>
            )}
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Budget Total CFC</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {cfcSummary ? formatCHF(cfcSummary.totalBudget) : '-'}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <span className="text-neutral-500 dark:text-neutral-400">
              Engage: <span className="font-medium text-neutral-700 dark:text-neutral-300">{cfcSummary?.percentCommitted.toFixed(1)}%</span>
            </span>
            <span className="text-neutral-500 dark:text-neutral-400">
              Paye: <span className="font-medium text-neutral-700 dark:text-neutral-300">{cfcSummary?.percentPaid.toFixed(1)}%</span>
            </span>
          </div>
        </RealProCard>

        {/* Acomptes Factures */}
        <RealProCard className="!p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Total Facture</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {installmentsSummary ? formatCHF(installmentsSummary.totalInvoiced) : '-'}
          </p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-500 dark:text-neutral-400">Encaisse</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {installmentsSummary?.percentCollected.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${installmentsSummary?.percentCollected || 0}%` }}
              />
            </div>
          </div>
        </RealProCard>

        {/* Encaisse */}
        <RealProCard className="!p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Encaisse</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {installmentsSummary ? formatCHF(installmentsSummary.totalPaid) : '-'}
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <Users className="w-4 h-4" />
            <span>{installmentsSummary?.buyersCount || 0} acheteurs</span>
          </div>
        </RealProCard>

        {/* En retard */}
        <RealProCard className="!p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            {overdueInstallments.length > 0 && (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                {overdueInstallments.length} en retard
              </Badge>
            )}
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Montant en retard</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {installmentsSummary ? formatCHF(installmentsSummary.totalOverdue) : '-'}
          </p>
          {overdueInstallments.length > 0 && (
            <Link
              to={`/projects/${projectId}/finances/payments`}
              className="mt-3 inline-flex items-center text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Voir les retards
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          )}
        </RealProCard>
      </div>

      {/* Tabs */}
      <RealProTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CFC Summary */}
            <RealProCard
              title="Budget CFC"
              action={
                <Link to={`/projects/${projectId}/finances/cfc`}>
                  <RealProButton variant="secondary" size="sm">
                    Voir tout
                  </RealProButton>
                </Link>
              }
            >
              {cfcLines.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                    Aucun budget CFC configure
                  </p>
                  <Link to={`/projects/${projectId}/finances/cfc`}>
                    <RealProButton variant="secondary">
                      <Plus className="w-4 h-4" />
                      Configurer le budget
                    </RealProButton>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cfcLines.slice(0, 5).map((line) => {
                    const progress = calculateProgress(line.amount_committed, line.amount_budgeted);
                    const varianceStatus = getVarianceStatus(line.variance);

                    return (
                      <div key={line.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-neutral-500 dark:text-neutral-400">
                              {line.code}
                            </span>
                            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {line.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {formatCHF(line.amount_committed)} / {formatCHF(line.amount_budgeted)}
                            </span>
                            <span className={`text-xs ${varianceStatus.color}`}>
                              {line.variance >= 0 ? '+' : ''}{formatCHF(line.variance)}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              progress > 100 ? 'bg-red-500' : progress > 80 ? 'bg-amber-500' : 'bg-brand-500'
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {cfcLines.length > 5 && (
                    <Link
                      to={`/projects/${projectId}/finances/cfc`}
                      className="block text-center text-sm text-brand-600 dark:text-brand-400 hover:underline pt-2"
                    >
                      +{cfcLines.length - 5} autres postes
                    </Link>
                  )}
                </div>
              )}
            </RealProCard>

            {/* Upcoming Payments */}
            <RealProCard
              title="Prochaines echeances"
              action={
                <Link to={`/projects/${projectId}/finances/payments`}>
                  <RealProButton variant="secondary" size="sm">
                    Voir tout
                  </RealProButton>
                </Link>
              }
            >
              {upcomingInstallments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Aucune echeance dans les 30 prochains jours
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingInstallments.slice(0, 5).map((inst) => {
                    const dueInfo = getDueDaysInfo(inst.due_date);
                    const statusConfig = INSTALLMENT_STATUS_CONFIG[inst.status];

                    return (
                      <div
                        key={inst.id}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-neutral-100">
                              {inst.buyer?.first_name} {inst.buyer?.last_name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              Lot {inst.lot?.lot_number} - {dueInfo.label}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {formatCHF(inst.amount)}
                          </p>
                          <Badge className={statusConfig.color} variant="default">
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </RealProCard>
          </div>
        )}

        {/* CFC Tab */}
        {activeTab === 'cfc' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Budget CFC detaille
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {budget ? `Version ${budget.version} - ${budget.name}` : 'Aucun budget'}
                </p>
              </div>
              <Link to={`/projects/${projectId}/finances/cfc`}>
                <RealProButton variant="primary">
                  <BarChart3 className="w-4 h-4" />
                  Gerer le budget
                </RealProButton>
              </Link>
            </div>

            {/* CFC Summary Cards */}
            {cfcSummary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-center">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Budget</p>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    {formatCHF(cfcSummary.totalBudget)}
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-center">
                  <p className="text-sm text-amber-600 dark:text-amber-400">Engage</p>
                  <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                    {formatCHF(cfcSummary.totalCommitted)}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    {cfcSummary.percentCommitted.toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl text-center">
                  <p className="text-sm text-purple-600 dark:text-purple-400">Facture</p>
                  <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                    {formatCHF(cfcSummary.totalInvoiced)}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    {cfcSummary.percentInvoiced.toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl text-center">
                  <p className="text-sm text-green-600 dark:text-green-400">Paye</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">
                    {formatCHF(cfcSummary.totalPaid)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {cfcSummary.percentPaid.toFixed(1)}%
                  </p>
                </div>
              </div>
            )}

            {/* CFC Lines Table */}
            <RealProCard>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                      <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                        Code
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                        Designation
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                        Budget
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                        Engage
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                        Paye
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                        Ecart
                      </th>
                      <th className="py-3 px-4 text-xs font-medium text-neutral-500 uppercase">
                        Progression
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cfcLines.map((line) => {
                      const progress = calculateProgress(line.amount_committed, line.amount_budgeted);
                      const varianceStatus = getVarianceStatus(line.variance);

                      return (
                        <tr
                          key={line.id}
                          className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                        >
                          <td className="py-3 px-4 font-mono text-sm text-neutral-600 dark:text-neutral-400">
                            {line.code}
                          </td>
                          <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">
                            {line.label}
                          </td>
                          <td className="py-3 px-4 text-right text-neutral-700 dark:text-neutral-300">
                            {formatCHF(line.amount_budgeted)}
                          </td>
                          <td className="py-3 px-4 text-right text-neutral-700 dark:text-neutral-300">
                            {formatCHF(line.amount_committed)}
                          </td>
                          <td className="py-3 px-4 text-right text-neutral-700 dark:text-neutral-300">
                            {formatCHF(line.amount_paid)}
                          </td>
                          <td className={`py-3 px-4 text-right font-medium ${varianceStatus.color}`}>
                            {line.variance >= 0 ? '+' : ''}{formatCHF(line.variance)}
                          </td>
                          <td className="py-3 px-4 w-32">
                            <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  progress > 100 ? 'bg-red-500' : progress > 80 ? 'bg-amber-500' : 'bg-brand-500'
                                }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </RealProCard>
          </div>
        )}

        {/* Buyers Tab */}
        {activeTab === 'buyers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Situation par acheteur
              </h2>
              <Link to={`/projects/${projectId}/finances/invoices`}>
                <RealProButton variant="secondary">
                  <FileText className="w-4 h-4" />
                  Toutes les factures
                </RealProButton>
              </Link>
            </div>

            {buyerSummaries.length === 0 ? (
              <RealProCard>
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Aucun acheteur avec factures
                  </p>
                </div>
              </RealProCard>
            ) : (
              <div className="grid gap-4">
                {buyerSummaries.map((buyer) => (
                  <RealProCard key={buyer.buyerId} className="!p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                          <Users className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                            {buyer.buyerName}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                            <span>Lot {buyer.lotNumber}</span>
                            <span>{formatCHF(buyer.lotPrice)}</span>
                            <span>{buyer.installmentsCount} factures</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Paye</p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {formatCHF(buyer.totalPaid)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Reste</p>
                          <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            {formatCHF(buyer.totalRemaining)}
                          </p>
                        </div>
                        <div className="w-32">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-neutral-500 dark:text-neutral-400">Progres</span>
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">
                              {buyer.percentPaid.toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${buyer.percentPaid}%` }}
                            />
                          </div>
                        </div>
                        {buyer.overdueCount > 0 && (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            {buyer.overdueCount} en retard
                          </Badge>
                        )}
                      </div>
                    </div>
                  </RealProCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Paiements en retard
            </h2>

            {overdueInstallments.length === 0 ? (
              <RealProCard>
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Aucun paiement en retard
                  </p>
                </div>
              </RealProCard>
            ) : (
              <div className="space-y-4">
                {overdueInstallments.map((inst) => {
                  const dueInfo = getDueDaysInfo(inst.due_date);

                  return (
                    <RealProCard key={inst.id} className="!p-4 border-red-200 dark:border-red-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                              {inst.buyer?.first_name} {inst.buyer?.last_name}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                              <span>Lot {inst.lot?.lot_number}</span>
                              <span className="text-red-600 dark:text-red-400 font-medium">
                                {dueInfo.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                              {formatCHF(inst.amount)}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              Echeance: {new Date(inst.due_date).toLocaleDateString('fr-CH')}
                            </p>
                          </div>
                          <RealProButton variant="secondary" size="sm">
                            Relancer
                          </RealProButton>
                        </div>
                      </div>
                    </RealProCard>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
