import { useState } from 'react';
import {
  Button,
  Badge,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Select,
} from '@realpro/ui';
import { PageShell, ContentCard, PageSection } from '@realpro/ui/layouts';
import { StatCard } from '@realpro/ui';
import {
  Download,
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  PiggyBank,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Building,
} from 'lucide-react';

// Mock data
const mockBudgetSummary = {
  totalBudget: 245000,
  spent: 178500,
  remaining: 66500,
  reserveFund: 125000,
  reserveTarget: 150000,
  overdueAmount: 8450,
  overdueCount: 5,
};

const mockCategories = [
  { name: 'Chauffage / Énergie', budget: 65000, spent: 48200, color: 'bg-blue-500' },
  { name: 'Entretien courant', budget: 45000, spent: 38900, color: 'bg-emerald-500' },
  { name: 'Assurances', budget: 35000, spent: 35000, color: 'bg-purple-500' },
  { name: 'Conciergerie', budget: 32000, spent: 24000, color: 'bg-orange-500' },
  { name: 'Ascenseur', budget: 28000, spent: 18400, color: 'bg-pink-500' },
  { name: 'Eau', budget: 22000, spent: 14000, color: 'bg-cyan-500' },
  { name: 'Divers', budget: 18000, spent: 0, color: 'bg-gray-500' },
];

const mockCalls = [
  {
    id: '1',
    period: 'Q1 2025',
    dueDate: '2025-01-31',
    amount: 61250,
    collected: 52800,
    status: 'in_progress',
  },
  {
    id: '2',
    period: 'Q4 2024',
    dueDate: '2024-10-31',
    amount: 61250,
    collected: 61250,
    status: 'completed',
  },
  {
    id: '3',
    period: 'Q3 2024',
    dueDate: '2024-07-31',
    amount: 61250,
    collected: 61250,
    status: 'completed',
  },
  {
    id: '4',
    period: 'Q2 2024',
    dueDate: '2024-04-30',
    amount: 61250,
    collected: 61250,
    status: 'completed',
  },
];

const mockTransactions = [
  { id: '1', date: '2025-01-10', description: 'Chauffage - Acompte janvier', amount: -4200, type: 'expense' },
  { id: '2', date: '2025-01-08', description: 'Charges Q1 - Dupont', amount: 2550, type: 'income' },
  { id: '3', date: '2025-01-07', description: 'Charges Q1 - Martin', amount: 1980, type: 'income' },
  { id: '4', date: '2025-01-05', description: 'Entretien jardin', amount: -850, type: 'expense' },
  { id: '5', date: '2025-01-03', description: 'Réparation interphone', amount: -320, type: 'expense' },
];

export function BudgetPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2025');

  const spentPercentage = Math.round((mockBudgetSummary.spent / mockBudgetSummary.totalBudget) * 100);
  const reservePercentage = Math.round(
    (mockBudgetSummary.reserveFund / mockBudgetSummary.reserveTarget) * 100
  );

  return (
    <PageShell
      title="Budget & Comptabilité"
      subtitle="Gestion financière des copropriétés"
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Exporter
          </Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Nouvel appel de fonds
          </Button>
        </div>
      }
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Select
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
          className="w-48"
        >
          <option value="all">Tous les immeubles</option>
          <option value="1">Résidence Les Alpes</option>
          <option value="2">Immeuble Lac-Léman</option>
          <option value="3">Copropriété du Parc</option>
        </Select>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-32"
        >
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="calls">Appels de fonds</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Budget annuel"
              value={`CHF ${mockBudgetSummary.totalBudget.toLocaleString('fr-CH')}`}
              icon={<Wallet className="h-5 w-5" />}
              iconBgClass="bg-brand-100 dark:bg-brand-900"
              iconColorClass="text-brand-600 dark:text-brand-400"
            />
            <StatCard
              label="Dépensé"
              value={`CHF ${mockBudgetSummary.spent.toLocaleString('fr-CH')}`}
              description={`${spentPercentage}% du budget`}
              icon={<TrendingDown className="h-5 w-5" />}
              iconBgClass="bg-orange-100 dark:bg-orange-900"
              iconColorClass="text-orange-600 dark:text-orange-400"
            />
            <StatCard
              label="Fonds de réserve"
              value={`CHF ${mockBudgetSummary.reserveFund.toLocaleString('fr-CH')}`}
              description={`Objectif: CHF ${mockBudgetSummary.reserveTarget.toLocaleString('fr-CH')}`}
              icon={<PiggyBank className="h-5 w-5" />}
              iconBgClass="bg-success-100 dark:bg-success-900"
              iconColorClass="text-success-600 dark:text-success-400"
            />
            <StatCard
              label="Impayés"
              value={`CHF ${mockBudgetSummary.overdueAmount.toLocaleString('fr-CH')}`}
              description={`${mockBudgetSummary.overdueCount} copropriétaires`}
              icon={<AlertTriangle className="h-5 w-5" />}
              iconBgClass="bg-error-100 dark:bg-error-900"
              iconColorClass="text-error-600 dark:text-error-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget by category */}
            <ContentCard title="Répartition du budget">
              <div className="space-y-4">
                {mockCategories.map((category) => {
                  const percentage = Math.round((category.spent / category.budget) * 100);
                  return (
                    <div key={category.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          <span className="text-sm font-medium text-neutral-900 dark:text-white">
                            {category.name}
                          </span>
                        </div>
                        <span className="text-sm text-neutral-500">
                          CHF {category.spent.toLocaleString('fr-CH')} / {category.budget.toLocaleString('fr-CH')}
                        </span>
                      </div>
                      <Progress
                        value={percentage}
                        size="sm"
                        variant={percentage > 90 ? 'error' : percentage > 75 ? 'warning' : 'default'}
                      />
                    </div>
                  );
                })}
              </div>
            </ContentCard>

            {/* Reserve fund */}
            <ContentCard title="Fonds de réserve">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-success-200 dark:border-success-800 mb-4">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                        {reservePercentage}%
                      </span>
                      <p className="text-xs text-neutral-500">de l'objectif</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Montant actuel</span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      CHF {mockBudgetSummary.reserveFund.toLocaleString('fr-CH')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Objectif</span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      CHF {mockBudgetSummary.reserveTarget.toLocaleString('fr-CH')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Manquant</span>
                    <span className="text-sm font-semibold text-warning-600 dark:text-warning-400">
                      CHF {(mockBudgetSummary.reserveTarget - mockBudgetSummary.reserveFund).toLocaleString('fr-CH')}
                    </span>
                  </div>
                </div>

                <Progress value={reservePercentage} variant="success" />
              </div>
            </ContentCard>
          </div>
        </TabsContent>

        <TabsContent value="calls">
          <ContentCard padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                      Période
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                      Échéance
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                      Montant appelé
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                      Encaissé
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                      Progression
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                      Statut
                    </th>
                    <th className="px-6 py-3 w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {mockCalls.map((call) => {
                    const percentage = Math.round((call.collected / call.amount) * 100);
                    return (
                      <tr key={call.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-6 py-4">
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {call.period}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                          {new Date(call.dueDate).toLocaleDateString('fr-CH')}
                        </td>
                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                          CHF {call.amount.toLocaleString('fr-CH')}
                        </td>
                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                          CHF {call.collected.toLocaleString('fr-CH')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Progress value={percentage} size="sm" className="w-24" />
                            <span className="text-sm text-neutral-500">{percentage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={call.status === 'completed' ? 'success' : 'warning'}
                            size="sm"
                          >
                            {call.status === 'completed' ? 'Complété' : 'En cours'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm">
                            Détails
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ContentCard>
        </TabsContent>

        <TabsContent value="transactions">
          <ContentCard padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                      Description
                    </th>
                    <th className="text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {mockTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {new Date(tx.date).toLocaleDateString('fr-CH')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {tx.type === 'income' ? (
                            <ArrowUpRight className="h-4 w-4 text-success-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-error-500" />
                          )}
                          <span className="text-sm text-neutral-900 dark:text-white">
                            {tx.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`font-medium ${
                            tx.type === 'income'
                              ? 'text-success-600 dark:text-success-400'
                              : 'text-error-600 dark:text-error-400'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : ''}
                          CHF {tx.amount.toLocaleString('fr-CH')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ContentCard>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
