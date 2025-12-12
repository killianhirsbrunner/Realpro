import { useState } from 'react';
import {
  Button,
  Badge,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@realpro/ui';
import { PageShell, ContentCard } from '@realpro/ui/layouts';
import { StatCard } from '@realpro/ui';
import {
  Receipt,
  FileText,
  Download,
  Wallet,
  PiggyBank,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Filter,
} from 'lucide-react';

// Mock data - Charges par code CFC
const mockCFCCharges = [
  { code: '21', name: 'Entretien courant', budget: 12000, spent: 9850, percent: 82 },
  { code: '23', name: 'Chauffage & eau chaude', budget: 18500, spent: 16200, percent: 87 },
  { code: '24', name: 'Électricité parties communes', budget: 4200, spent: 3890, percent: 93 },
  { code: '27', name: 'Ascenseur', budget: 6800, spent: 5400, percent: 79 },
  { code: '28', name: 'Nettoyage', budget: 8400, spent: 7000, percent: 83 },
  { code: '29', name: 'Conciergerie', budget: 14400, spent: 12000, percent: 83 },
  { code: '31', name: 'Assurances', budget: 9200, spent: 9200, percent: 100 },
  { code: '35', name: 'Frais administratifs', budget: 4800, spent: 4000, percent: 83 },
];

// Mock data - Fonds de rénovation
const mockRenovationFund = {
  balance: 245800,
  monthlyContribution: 4200,
  lastContribution: '2024-12-01',
  projectedWorks: [
    { name: 'Réfection toiture', estimatedCost: 85000, plannedYear: 2026 },
    { name: 'Ravalement façade', estimatedCost: 120000, plannedYear: 2027 },
    { name: 'Remplacement chaudière', estimatedCost: 45000, plannedYear: 2028 },
  ],
};

// Mock data - Mouvements récents
const mockTransactions = [
  { id: '1', date: '2024-12-10', description: 'Paiement facture Chauffage SA', amount: -2450, type: 'expense', category: 'Chauffage' },
  { id: '2', date: '2024-12-08', description: 'Appel de charges Q4 - Dupont', amount: 1250, type: 'income', category: 'Charges' },
  { id: '3', date: '2024-12-08', description: 'Appel de charges Q4 - Martin', amount: 980, type: 'income', category: 'Charges' },
  { id: '4', date: '2024-12-05', description: 'Nettoyage parties communes', amount: -580, type: 'expense', category: 'Entretien' },
  { id: '5', date: '2024-12-03', description: 'Facture électricité', amount: -890, type: 'expense', category: 'Électricité' },
  { id: '6', date: '2024-12-01', description: 'Alimentation fonds de rénovation', amount: -4200, type: 'fund', category: 'Fonds' },
];

// Mock data - Copropriétaires avec soldes
const mockOwnerBalances = [
  { id: '1', name: 'Jean Dupont', lots: '3A, 3B', milliemes: 85, balance: -120, status: 'overdue' },
  { id: '2', name: 'Marie Martin', lots: '2A', milliemes: 42, balance: 0, status: 'ok' },
  { id: '3', name: 'Schmidt Immobilier SA', lots: '1A, 1B, 4A, 4B', milliemes: 168, balance: 450, status: 'credit' },
  { id: '4', name: 'Sophie Blanc', lots: '5A', milliemes: 38, balance: 0, status: 'ok' },
  { id: '5', name: 'Pierre Weber', lots: '6A', milliemes: 45, balance: -580, status: 'overdue' },
];

// Mock data - Décomptes annuels
const mockAnnualStatements = [
  { year: 2024, status: 'draft', totalCharges: 48250, totalPaid: 45800, balance: 2450, sent: false },
  { year: 2023, status: 'closed', totalCharges: 45890, totalPaid: 45890, balance: 0, sent: true },
  { year: 2022, status: 'closed', totalCharges: 43120, totalPaid: 43120, balance: 0, sent: true },
];

export function AccountingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProperty] = useState('Résidence Les Alpes');

  const totalBudget = mockCFCCharges.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = mockCFCCharges.reduce((sum, c) => sum + c.spent, 0);
  const budgetUsage = Math.round((totalSpent / totalBudget) * 100);

  const totalUnpaid = mockOwnerBalances
    .filter((o) => o.balance < 0)
    .reduce((sum, o) => sum + Math.abs(o.balance), 0);

  return (
    <PageShell
      title="Comptabilité"
      subtitle={selectedProperty}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Exporter
          </Button>
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            Changer d'immeuble
          </Button>
          <Button leftIcon={<FileText className="w-4 h-4" />}>
            Nouveau décompte
          </Button>
        </div>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Solde courant"
          value="CHF 24'380"
          icon={<Wallet className="h-5 w-5" />}
          iconBgClass="bg-brand-100 dark:bg-brand-900"
          iconColorClass="text-brand-600 dark:text-brand-400"
        />
        <StatCard
          label="Fonds de rénovation"
          value={`CHF ${mockRenovationFund.balance.toLocaleString('fr-CH')}`}
          description={`+${mockRenovationFund.monthlyContribution.toLocaleString('fr-CH')}/mois`}
          icon={<PiggyBank className="h-5 w-5" />}
          iconBgClass="bg-emerald-100 dark:bg-emerald-900"
          iconColorClass="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Budget utilisé"
          value={`${budgetUsage}%`}
          description={`CHF ${totalSpent.toLocaleString('fr-CH')} / ${totalBudget.toLocaleString('fr-CH')}`}
          icon={<Receipt className="h-5 w-5" />}
          iconBgClass="bg-blue-100 dark:bg-blue-900"
          iconColorClass="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="Impayés"
          value={`CHF ${totalUnpaid.toLocaleString('fr-CH')}`}
          description={`${mockOwnerBalances.filter((o) => o.balance < 0).length} copropriétaires`}
          icon={<AlertCircle className="h-5 w-5" />}
          iconBgClass="bg-error-100 dark:bg-error-900"
          iconColorClass="text-error-600 dark:text-error-400"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="cfc">Charges CFC</TabsTrigger>
          <TabsTrigger value="fund">Fonds de rénovation</TabsTrigger>
          <TabsTrigger value="balances">Soldes</TabsTrigger>
          <TabsTrigger value="statements">Décomptes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <ContentCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Mouvements récents
                  </h3>
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
                    Voir tout
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                            tx.type === 'income'
                              ? 'bg-success-100 dark:bg-success-900'
                              : tx.type === 'fund'
                              ? 'bg-brand-100 dark:bg-brand-900'
                              : 'bg-error-100 dark:bg-error-900'
                          }`}
                        >
                          {tx.type === 'income' ? (
                            <ArrowDownRight className="h-5 w-5 text-success-600" />
                          ) : tx.type === 'fund' ? (
                            <PiggyBank className="h-5 w-5 text-brand-600" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-error-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white text-sm">
                            {tx.description}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {new Date(tx.date).toLocaleDateString('fr-CH')} · {tx.category}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-semibold ${
                          tx.amount > 0 ? 'text-success-600' : 'text-neutral-900 dark:text-white'
                        }`}
                      >
                        {tx.amount > 0 ? '+' : ''}
                        CHF {Math.abs(tx.amount).toLocaleString('fr-CH')}
                      </span>
                    </div>
                  ))}
                </div>
              </ContentCard>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              {/* Budget Progress */}
              <ContentCard>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Consommation budget
                </h3>
                <div className="space-y-4">
                  {mockCFCCharges.slice(0, 4).map((charge) => (
                    <div key={charge.code}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {charge.code} - {charge.name}
                        </span>
                        <span className="font-medium text-neutral-900 dark:text-white">
                          {charge.percent}%
                        </span>
                      </div>
                      <Progress
                        value={charge.percent}
                        size="sm"
                        variant={charge.percent > 90 ? 'error' : charge.percent > 75 ? 'warning' : 'success'}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => setActiveTab('cfc')}
                >
                  Voir tous les codes CFC
                </Button>
              </ContentCard>

              {/* Renovation Fund */}
              <ContentCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <PiggyBank className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      Fonds de rénovation
                    </h3>
                    <p className="text-2xl font-bold text-emerald-600">
                      CHF {mockRenovationFund.balance.toLocaleString('fr-CH')}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Prochain versement
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-neutral-900 dark:text-white">
                      CHF {mockRenovationFund.monthlyContribution.toLocaleString('fr-CH')}
                    </span>
                    <span className="text-sm text-neutral-500">01.01.2025</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => setActiveTab('fund')}
                >
                  Voir la planification
                </Button>
              </ContentCard>
            </div>
          </div>
        </TabsContent>

        {/* CFC Charges Tab */}
        <TabsContent value="cfc">
          <ContentCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Charges par code CFC - Exercice 2024
              </h3>
              <Badge variant="info" size="sm">
                En cours
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Code</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Désignation</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Budget</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Dépensé</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Reste</th>
                    <th className="py-3 px-4 text-xs font-semibold text-neutral-500 uppercase w-32">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {mockCFCCharges.map((charge) => (
                    <tr key={charge.code} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-brand-600">{charge.code}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">{charge.name}</td>
                      <td className="py-3 px-4 text-right text-neutral-600">CHF {charge.budget.toLocaleString('fr-CH')}</td>
                      <td className="py-3 px-4 text-right font-medium">CHF {charge.spent.toLocaleString('fr-CH')}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={charge.budget - charge.spent < 0 ? 'text-error-600' : 'text-success-600'}>
                          CHF {(charge.budget - charge.spent).toLocaleString('fr-CH')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Progress value={charge.percent} size="sm" variant={charge.percent > 90 ? 'error' : charge.percent > 75 ? 'warning' : 'success'} className="flex-1" />
                          <span className="text-xs font-medium w-8">{charge.percent}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                    <td className="py-3 px-4 font-semibold" colSpan={2}>Total</td>
                    <td className="py-3 px-4 text-right font-semibold">CHF {totalBudget.toLocaleString('fr-CH')}</td>
                    <td className="py-3 px-4 text-right font-semibold">CHF {totalSpent.toLocaleString('fr-CH')}</td>
                    <td className="py-3 px-4 text-right font-semibold text-success-600">CHF {(totalBudget - totalSpent).toLocaleString('fr-CH')}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Progress value={budgetUsage} size="sm" className="flex-1" />
                        <span className="text-xs font-semibold w-8">{budgetUsage}%</span>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </ContentCard>
        </TabsContent>

        {/* Renovation Fund Tab */}
        <TabsContent value="fund">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ContentCard>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Travaux planifiés</h3>
                <div className="space-y-4">
                  {mockRenovationFund.projectedWorks.map((work, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border-l-4 border-brand-500">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                          <Building className="h-6 w-6 text-brand-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-900 dark:text-white">{work.name}</h4>
                          <p className="text-sm text-neutral-500">Prévu pour {work.plannedYear}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-neutral-900 dark:text-white">CHF {work.estimatedCost.toLocaleString('fr-CH')}</p>
                        <p className="text-xs text-neutral-500">estimation</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">Total travaux planifiés</p>
                      <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        CHF {mockRenovationFund.projectedWorks.reduce((sum, w) => sum + w.estimatedCost, 0).toLocaleString('fr-CH')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">Solde actuel</p>
                      <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">CHF {mockRenovationFund.balance.toLocaleString('fr-CH')}</p>
                    </div>
                  </div>
                </div>
              </ContentCard>
            </div>

            <div>
              <ContentCard>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Évolution du fonds</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                    <span className="text-sm text-neutral-600">Mensuel</span>
                    <span className="font-semibold">CHF {mockRenovationFund.monthlyContribution.toLocaleString('fr-CH')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                    <span className="text-sm text-neutral-600">Annuel</span>
                    <span className="font-semibold">CHF {(mockRenovationFund.monthlyContribution * 12).toLocaleString('fr-CH')}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Projection à 5 ans</h4>
                  <div className="space-y-2">
                    {[2025, 2026, 2027, 2028, 2029].map((year, index) => {
                      const projected = mockRenovationFund.balance + mockRenovationFund.monthlyContribution * 12 * (index + 1);
                      return (
                        <div key={year} className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600">{year}</span>
                          <span className="font-medium">~CHF {projected.toLocaleString('fr-CH')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ContentCard>
            </div>
          </div>
        </TabsContent>

        {/* Owner Balances Tab */}
        <TabsContent value="balances">
          <ContentCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Soldes copropriétaires</h3>
              <Button variant="outline" size="sm" leftIcon={<Receipt className="h-4 w-4" />}>Envoyer rappels</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Copropriétaire</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Lots</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">‰</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Solde</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Statut</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {mockOwnerBalances.map((owner) => (
                    <tr key={owner.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="py-3 px-4 font-medium">{owner.name}</td>
                      <td className="py-3 px-4 text-neutral-600">{owner.lots}</td>
                      <td className="py-3 px-4 text-right text-neutral-600">{owner.milliemes}‰</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-semibold ${owner.balance < 0 ? 'text-error-600' : owner.balance > 0 ? 'text-success-600' : ''}`}>
                          {owner.balance !== 0 && (owner.balance > 0 ? '+' : '')}CHF {owner.balance.toLocaleString('fr-CH')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={owner.status === 'overdue' ? 'error' : owner.status === 'credit' ? 'success' : 'neutral'} size="sm">
                          {owner.status === 'overdue' ? 'Impayé' : owner.status === 'credit' ? 'Crédit' : 'OK'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">Détails</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ContentCard>
        </TabsContent>

        {/* Annual Statements Tab */}
        <TabsContent value="statements">
          <ContentCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Décomptes annuels</h3>
              <Button leftIcon={<FileText className="h-4 w-4" />}>Créer décompte 2024</Button>
            </div>

            <div className="space-y-4">
              {mockAnnualStatements.map((statement) => (
                <div key={statement.year} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-brand-100 dark:bg-brand-900 rounded-xl flex items-center justify-center">
                      <span className="text-lg font-bold text-brand-700 dark:text-brand-300">{statement.year}</span>
                    </div>
                    <div>
                      <p className="font-semibold">Décompte {statement.year}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500">
                        <span>Total: CHF {statement.totalCharges.toLocaleString('fr-CH')}</span>
                        <span>·</span>
                        <span>Payé: CHF {statement.totalPaid.toLocaleString('fr-CH')}</span>
                        {statement.balance !== 0 && (
                          <>
                            <span>·</span>
                            <span className={statement.balance > 0 ? 'text-error-600' : 'text-success-600'}>
                              Solde: {statement.balance > 0 ? '+' : ''}CHF {statement.balance.toLocaleString('fr-CH')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statement.status === 'draft' ? 'warning' : 'success'} size="sm">
                      {statement.status === 'draft' ? <><Clock className="h-3 w-3 mr-1" />Brouillon</> : <><CheckCircle2 className="h-3 w-3 mr-1" />Clôturé</>}
                    </Badge>
                    {statement.sent && <Badge variant="info" size="sm">Envoyé</Badge>}
                    <Button variant="outline" size="sm">{statement.status === 'draft' ? 'Modifier' : 'Voir'}</Button>
                    <Button variant="ghost" size="sm" leftIcon={<Download className="h-4 w-4" />}>PDF</Button>
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
