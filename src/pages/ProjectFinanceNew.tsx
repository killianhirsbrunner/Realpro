import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Download,
  Plus,
  FileText,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { SidePanel } from '../components/ui/SidePanel';
import { StatsGrid } from '../components/ui/StatsGrid';
import { Badge } from '../components/ui/Badge';
import { useFinance } from '../hooks/useFinance';

export default function ProjectFinanceNew() {
  const { projectId } = useParams();
  const { cfcBudgets, loading } = useFinance(projectId);
  const [selectedCfc, setSelectedCfc] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleRowClick = (cfc: any) => {
    setSelectedCfc(cfc);
    setIsPanelOpen(true);
  };

  const totalBudget = cfcBudgets.reduce((sum: number, c: any) => sum + (c.budgeted_amount || 0), 0);
  const totalEngaged = cfcBudgets.reduce((sum: number, c: any) => sum + (c.engaged_amount || 0), 0);
  const totalBilled = cfcBudgets.reduce((sum: number, c: any) => sum + (c.billed_amount || 0), 0);
  const totalPaid = cfcBudgets.reduce((sum: number, c: any) => sum + (c.paid_amount || 0), 0);

  const remaining = totalBudget - totalEngaged;
  const budgetUsagePercent = totalBudget > 0 ? ((totalEngaged / totalBudget) * 100).toFixed(1) : 0;

  const stats = [
    {
      label: 'Budget total',
      value: `CHF ${totalBudget.toLocaleString('fr-CH')}`,
      icon: DollarSign,
      color: 'neutral' as const,
    },
    {
      label: 'Engagé',
      value: `CHF ${totalEngaged.toLocaleString('fr-CH')}`,
      icon: TrendingUp,
      color: 'primary' as const,
    },
    {
      label: 'Facturé',
      value: `CHF ${totalBilled.toLocaleString('fr-CH')}`,
      icon: FileText,
      color: 'warning' as const,
    },
    {
      label: 'Payé',
      value: `CHF ${totalPaid.toLocaleString('fr-CH')}`,
      icon: TrendingDown,
      color: 'success' as const,
    },
  ];

  const columns = [
    {
      key: 'code',
      label: 'CFC',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {value}
            </span>
          </div>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'budgeted_amount',
      label: 'Budget',
      render: (value: number) => (
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
          CHF {value?.toLocaleString('fr-CH') || '0'}
        </span>
      ),
    },
    {
      key: 'engaged_amount',
      label: 'Engagé',
      render: (value: number) => (
        <span className="text-neutral-900 dark:text-neutral-100">
          CHF {value?.toLocaleString('fr-CH') || '0'}
        </span>
      ),
    },
    {
      key: 'billed_amount',
      label: 'Facturé',
      render: (value: number) => (
        <span className="text-neutral-900 dark:text-neutral-100">
          CHF {value?.toLocaleString('fr-CH') || '0'}
        </span>
      ),
    },
    {
      key: 'paid_amount',
      label: 'Payé',
      render: (value: number) => (
        <span className="text-neutral-900 dark:text-neutral-100">
          CHF {value?.toLocaleString('fr-CH') || '0'}
        </span>
      ),
    },
    {
      key: 'remaining',
      label: 'Restant',
      render: (value: any, row: any) => {
        const remaining = (row.budgeted_amount || 0) - (row.engaged_amount || 0);
        const isOverBudget = remaining < 0;
        return (
          <span
            className={`font-semibold ${
              isOverBudget
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            }`}
          >
            CHF {remaining.toLocaleString('fr-CH')}
          </span>
        );
      },
    },
    {
      key: 'usage',
      label: 'Utilisation',
      sortable: false,
      render: (value: any, row: any) => {
        const usage =
          row.budgeted_amount > 0
            ? ((row.engaged_amount / row.budgeted_amount) * 100).toFixed(0)
            : 0;
        const isOverBudget = Number(usage) > 100;
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isOverBudget
                    ? 'bg-red-600 dark:bg-red-400'
                    : Number(usage) > 80
                    ? 'bg-amber-600 dark:bg-amber-400'
                    : 'bg-primary-600 dark:bg-primary-400'
                }`}
                style={{ width: `${Math.min(Number(usage), 100)}%` }}
              />
            </div>
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 w-12">
              {usage}%
            </span>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Finances & CFC
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Suivi budgétaire par codes CFC et gestion financière
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter rapport
            </Button>

            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle facture
            </Button>
          </div>
        </div>

        <StatsGrid stats={stats} columns={4} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Vue d'ensemble budgétaire
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-600 dark:text-neutral-400">Budget utilisé</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {budgetUsagePercent}%
                  </span>
                </div>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      Number(budgetUsagePercent) > 100
                        ? 'bg-red-600 dark:bg-red-400'
                        : Number(budgetUsagePercent) > 80
                        ? 'bg-amber-600 dark:bg-amber-400'
                        : 'bg-primary-600 dark:bg-primary-400'
                    }`}
                    style={{ width: `${Math.min(Number(budgetUsagePercent), 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Restant</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    CHF {remaining.toLocaleString('fr-CH')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    Taux d'utilisation
                  </p>
                  <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {budgetUsagePercent}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Alertes budgétaires
            </h3>

            <div className="space-y-3">
              {cfcBudgets
                .filter(
                  (cfc: any) =>
                    cfc.budgeted_amount > 0 &&
                    (cfc.engaged_amount / cfc.budgeted_amount) * 100 > 80
                )
                .map((cfc: any) => {
                  const usage = ((cfc.engaged_amount / cfc.budgeted_amount) * 100).toFixed(0);
                  const isOverBudget = Number(usage) > 100;

                  return (
                    <div
                      key={cfc.id}
                      className={`flex items-start gap-3 p-3 rounded-xl ${
                        isOverBudget
                          ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
                          : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      <AlertCircle
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          isOverBudget
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold mb-1 ${
                            isOverBudget
                              ? 'text-red-900 dark:text-red-100'
                              : 'text-amber-900 dark:text-amber-100'
                          }`}
                        >
                          CFC {cfc.code} - {cfc.name}
                        </p>
                        <p
                          className={`text-xs ${
                            isOverBudget
                              ? 'text-red-700 dark:text-red-300'
                              : 'text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {isOverBudget
                            ? `Dépassement de ${usage}% du budget`
                            : `${usage}% du budget utilisé`}
                        </p>
                      </div>
                      <Badge variant={isOverBudget ? 'danger' : 'warning'}>{usage}%</Badge>
                    </div>
                  );
                })}

              {cfcBudgets.filter(
                (cfc: any) =>
                  cfc.budgeted_amount > 0 && (cfc.engaged_amount / cfc.budgeted_amount) * 100 > 80
              ).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Aucune alerte budgétaire
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Détail par CFC
          </h2>

          <DataTable
            data={cfcBudgets}
            columns={columns}
            onRowClick={handleRowClick}
            selectedRow={selectedCfc}
            emptyMessage="Aucun budget CFC configuré"
          />
        </div>
      </div>

      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={selectedCfc ? `CFC ${selectedCfc.code} - ${selectedCfc.name}` : 'Détail CFC'}
        width="md"
      >
        {selectedCfc && (
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-600 dark:text-neutral-400">Code CFC</label>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {selectedCfc.code} - {selectedCfc.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Budget</label>
                  <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    CHF {selectedCfc.budgeted_amount?.toLocaleString('fr-CH') || '0'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Engagé</label>
                  <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    CHF {selectedCfc.engaged_amount?.toLocaleString('fr-CH') || '0'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Facturé</label>
                  <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    CHF {selectedCfc.billed_amount?.toLocaleString('fr-CH') || '0'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400">Payé</label>
                  <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    CHF {selectedCfc.paid_amount?.toLocaleString('fr-CH') || '0'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 block">
                  Utilisation budgétaire
                </label>
                <div className="relative w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all ${
                      selectedCfc.budgeted_amount > 0 &&
                      (selectedCfc.engaged_amount / selectedCfc.budgeted_amount) * 100 > 100
                        ? 'bg-red-600 dark:bg-red-400'
                        : 'bg-primary-600 dark:bg-primary-400'
                    }`}
                    style={{
                      width: `${Math.min(
                        selectedCfc.budgeted_amount > 0
                          ? (selectedCfc.engaged_amount / selectedCfc.budgeted_amount) * 100
                          : 0,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-2">
                  {selectedCfc.budgeted_amount > 0
                    ? ((selectedCfc.engaged_amount / selectedCfc.budgeted_amount) * 100).toFixed(1)
                    : 0}
                  % utilisé
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4">
                <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 block">
                  Restant disponible
                </label>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  CHF{' '}
                  {(
                    (selectedCfc.budgeted_amount || 0) - (selectedCfc.engaged_amount || 0)
                  ).toLocaleString('fr-CH')}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button variant="primary" className="flex-1">
                Modifier budget
              </Button>
              <Button variant="secondary" className="flex-1">
                Voir détails
              </Button>
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
