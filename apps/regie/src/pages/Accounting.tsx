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
  Wallet,
  TrendingUp,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Send,
  ChevronRight,
  Receipt,
} from 'lucide-react';

// Mock data - Statistiques mensuelles
const mockStats = {
  totalRents: 312450,
  collected: 289800,
  pending: 15200,
  overdue: 7450,
  ownerPayouts: 245600,
};

// Mock data - Paiements locataires
const mockPayments = [
  { id: '1', tenant: 'Martin Dupont', property: 'Résidence du Lac', unit: 'Apt 3.2', amount: 2030, dueDate: '01.12.2024', status: 'paid', paidDate: '30.11.2024' },
  { id: '2', tenant: 'Sophie Weber', property: 'Immeuble Central', unit: 'Apt 1.1', amount: 1600, dueDate: '01.12.2024', status: 'paid', paidDate: '01.12.2024' },
  { id: '3', tenant: 'Pierre Favre', property: 'Résidence du Lac', unit: 'Apt 2.1', amount: 2300, dueDate: '01.12.2024', status: 'pending' },
  { id: '4', tenant: 'Marie Rochat', property: 'Commerce Centre', unit: 'Local A', amount: 3950, dueDate: '01.12.2024', status: 'overdue', daysOverdue: 10 },
  { id: '5', tenant: 'Jean Müller', property: 'Immeuble Central', unit: 'Apt 2.3', amount: 1810, dueDate: '01.12.2024', status: 'paid', paidDate: '02.12.2024' },
  { id: '6', tenant: 'Boulangerie ABC', property: 'Commerce Centre', unit: 'Local B', amount: 4500, dueDate: '01.12.2024', status: 'paid', paidDate: '28.11.2024' },
  { id: '7', tenant: 'Claire Bernard', property: 'Villa des Roses', unit: 'Maison', amount: 3200, dueDate: '01.12.2024', status: 'overdue', daysOverdue: 5 },
];

// Mock data - Mandants (propriétaires)
const mockOwners = [
  { id: '1', name: 'Schmidt Immobilier SA', properties: 4, rentsCollected: 8500, commission: 425, toPay: 8075, status: 'pending' },
  { id: '2', name: 'Jean Dupont', properties: 2, rentsCollected: 4200, commission: 210, toPay: 3990, status: 'paid' },
  { id: '3', name: 'Famille Martin', properties: 1, rentsCollected: 2100, commission: 105, toPay: 1995, status: 'paid' },
  { id: '4', name: 'Fonds de placement ABC', properties: 8, rentsCollected: 18500, commission: 925, toPay: 17575, status: 'pending' },
  { id: '5', name: 'Sophie Blanc', properties: 1, rentsCollected: 1800, commission: 90, toPay: 1710, status: 'paid' },
];

// Mock data - Transactions récentes
const mockTransactions = [
  { id: '1', date: '2024-12-10', description: 'Loyer - Martin Dupont', amount: 2030, type: 'income', category: 'Loyer' },
  { id: '2', date: '2024-12-09', description: 'Versement propriétaire - Schmidt SA', amount: -8075, type: 'payout', category: 'Versement' },
  { id: '3', date: '2024-12-08', description: 'Loyer - Sophie Weber', amount: 1600, type: 'income', category: 'Loyer' },
  { id: '4', date: '2024-12-05', description: 'Commission gestion - Décembre', amount: 1650, type: 'commission', category: 'Commission' },
  { id: '5', date: '2024-12-03', description: 'Charges SIG - Immeuble Central', amount: -1250, type: 'expense', category: 'Charges' },
  { id: '6', date: '2024-12-01', description: 'Loyer - Boulangerie ABC', amount: 4500, type: 'income', category: 'Loyer' },
];

// Mock data - Rappels envoyés
const mockReminders = [
  { id: '1', tenant: 'Marie Rochat', property: 'Commerce Centre', amount: 3950, level: 2, sentDate: '2024-12-08', dueAmount: 7900 },
  { id: '2', tenant: 'Claire Bernard', property: 'Villa des Roses', amount: 3200, level: 1, sentDate: '2024-12-10', dueAmount: 3200 },
];

const statusConfig = {
  paid: { label: 'Payé', variant: 'success' as const, icon: CheckCircle2 },
  pending: { label: 'En attente', variant: 'warning' as const, icon: Clock },
  overdue: { label: 'En retard', variant: 'error' as const, icon: AlertCircle },
};

export function AccountingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth] = useState('Décembre 2024');

  const collectionRate = Math.round((mockStats.collected / mockStats.totalRents) * 100);
  const paidCount = mockPayments.filter((p) => p.status === 'paid').length;
  const pendingCount = mockPayments.filter((p) => p.status === 'pending').length;
  const overdueCount = mockPayments.filter((p) => p.status === 'overdue').length;

  return (
    <PageShell
      title="Comptabilité"
      subtitle={selectedMonth}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
            Changer de mois
          </Button>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Exporter
          </Button>
          <Button leftIcon={<Send className="w-4 h-4" />}>
            Envoyer rappels
          </Button>
        </div>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Total à encaisser"
          value={`CHF ${mockStats.totalRents.toLocaleString('fr-CH')}`}
          icon={<Wallet className="h-5 w-5" />}
          iconBgClass="bg-brand-100 dark:bg-brand-900"
          iconColorClass="text-brand-600 dark:text-brand-400"
        />
        <StatCard
          label="Encaissé"
          value={`CHF ${mockStats.collected.toLocaleString('fr-CH')}`}
          description={`${collectionRate}% du total`}
          icon={<TrendingUp className="h-5 w-5" />}
          iconBgClass="bg-success-100 dark:bg-success-900"
          iconColorClass="text-success-600 dark:text-success-400"
        />
        <StatCard
          label="En attente"
          value={`CHF ${mockStats.pending.toLocaleString('fr-CH')}`}
          description={`${pendingCount} locataires`}
          icon={<Clock className="h-5 w-5" />}
          iconBgClass="bg-warning-100 dark:bg-warning-900"
          iconColorClass="text-warning-600 dark:text-warning-400"
        />
        <StatCard
          label="En retard"
          value={`CHF ${mockStats.overdue.toLocaleString('fr-CH')}`}
          description={`${overdueCount} locataires`}
          icon={<AlertCircle className="h-5 w-5" />}
          iconBgClass="bg-error-100 dark:bg-error-900"
          iconColorClass="text-error-600 dark:text-error-400"
        />
        <StatCard
          label="À verser propriétaires"
          value={`CHF ${mockStats.ownerPayouts.toLocaleString('fr-CH')}`}
          icon={<Users className="h-5 w-5" />}
          iconBgClass="bg-violet-100 dark:bg-violet-900"
          iconColorClass="text-violet-600 dark:text-violet-400"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="rents">Loyers ({mockPayments.length})</TabsTrigger>
          <TabsTrigger value="owners">Mandants ({mockOwners.length})</TabsTrigger>
          <TabsTrigger value="reminders">Rappels ({mockReminders.length})</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Collection Progress */}
            <div className="lg:col-span-2">
              <ContentCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Encaissement {selectedMonth}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="sm">{paidCount} payés</Badge>
                    <Badge variant="warning" size="sm">{pendingCount} en attente</Badge>
                    <Badge variant="error" size="sm">{overdueCount} en retard</Badge>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Progression encaissements
                    </span>
                    <span className="text-lg font-bold text-brand-600">{collectionRate}%</span>
                  </div>
                  <Progress value={collectionRate} size="lg" />
                  <div className="flex justify-between mt-2 text-xs text-neutral-500">
                    <span>CHF 0</span>
                    <span>CHF {mockStats.totalRents.toLocaleString('fr-CH')}</span>
                  </div>
                </div>

                {/* Recent Transactions */}
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                  Dernières transactions
                </h4>
                <div className="space-y-3">
                  {mockTransactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                          tx.type === 'income' ? 'bg-success-100 dark:bg-success-900' :
                          tx.type === 'commission' ? 'bg-brand-100 dark:bg-brand-900' :
                          tx.type === 'payout' ? 'bg-violet-100 dark:bg-violet-900' :
                          'bg-error-100 dark:bg-error-900'
                        }`}>
                          {tx.type === 'income' ? <ArrowDownRight className="h-5 w-5 text-success-600" /> :
                           tx.type === 'commission' ? <Receipt className="h-5 w-5 text-brand-600" /> :
                           tx.type === 'payout' ? <Users className="h-5 w-5 text-violet-600" /> :
                           <ArrowUpRight className="h-5 w-5 text-error-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white text-sm">{tx.description}</p>
                          <p className="text-xs text-neutral-500">{new Date(tx.date).toLocaleDateString('fr-CH')} · {tx.category}</p>
                        </div>
                      </div>
                      <span className={`font-semibold ${tx.amount > 0 ? 'text-success-600' : 'text-neutral-900 dark:text-white'}`}>
                        {tx.amount > 0 ? '+' : ''}CHF {Math.abs(tx.amount).toLocaleString('fr-CH')}
                      </span>
                    </div>
                  ))}
                </div>
              </ContentCard>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Overdue Alert */}
              {overdueCount > 0 && (
                <ContentCard className="border-error-200 dark:border-error-800 bg-error-50/50 dark:bg-error-900/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-error-100 dark:bg-error-900 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-error-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-error-700 dark:text-error-300">Impayés</h3>
                      <p className="text-2xl font-bold text-error-600">CHF {mockStats.overdue.toLocaleString('fr-CH')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-error-600 dark:text-error-400 mb-4">
                    {overdueCount} locataire{overdueCount > 1 ? 's' : ''} en retard de paiement
                  </p>
                  <Button variant="outline" size="sm" className="w-full border-error-300 text-error-700 hover:bg-error-100" leftIcon={<Send className="h-4 w-4" />}>
                    Envoyer rappels
                  </Button>
                </ContentCard>
              )}

              {/* Owner Payouts */}
              <ContentCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">Versements propriétaires</h3>
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />} onClick={() => setActiveTab('owners')}>
                    Voir tout
                  </Button>
                </div>
                <div className="space-y-3">
                  {mockOwners.slice(0, 3).map((owner) => (
                    <div key={owner.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white text-sm">{owner.name}</p>
                        <p className="text-xs text-neutral-500">{owner.properties} bien{owner.properties > 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 dark:text-white">CHF {owner.toPay.toLocaleString('fr-CH')}</span>
                        <Badge variant={owner.status === 'paid' ? 'success' : 'warning'} size="sm">
                          {owner.status === 'paid' ? 'Versé' : 'À verser'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ContentCard>

              {/* Monthly Summary */}
              <ContentCard>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Résumé mensuel</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-sm text-neutral-600">Loyers encaissés</span>
                    <span className="font-semibold text-success-600">+CHF {mockStats.collected.toLocaleString('fr-CH')}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-sm text-neutral-600">Charges payées</span>
                    <span className="font-semibold">-CHF 12'450</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-sm text-neutral-600">Commissions</span>
                    <span className="font-semibold text-brand-600">+CHF 15'600</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-sm text-neutral-600">Versements propriétaires</span>
                    <span className="font-semibold">-CHF {mockStats.ownerPayouts.toLocaleString('fr-CH')}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
                    <span className="font-semibold text-neutral-900 dark:text-white">Solde période</span>
                    <span className="font-bold text-brand-600">+CHF 46'950</span>
                  </div>
                </div>
              </ContentCard>
            </div>
          </div>
        </TabsContent>

        {/* Rents Tab */}
        <TabsContent value="rents">
          <ContentCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Loyers {selectedMonth}</h3>
              <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>Exporter</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Locataire</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Bien</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Montant</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Échéance</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Statut</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {mockPayments.map((payment) => {
                    const StatusIcon = statusConfig[payment.status as keyof typeof statusConfig].icon;
                    return (
                      <tr key={payment.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                              payment.status === 'paid' ? 'bg-success-100' : payment.status === 'pending' ? 'bg-warning-100' : 'bg-error-100'
                            }`}>
                              <StatusIcon className={`h-4 w-4 ${
                                payment.status === 'paid' ? 'text-success-600' : payment.status === 'pending' ? 'text-warning-600' : 'text-error-600'
                              }`} />
                            </div>
                            <span className="font-medium">{payment.tenant}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-neutral-600">
                          <div>
                            <p>{payment.property}</p>
                            <p className="text-xs text-neutral-400">{payment.unit}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">CHF {payment.amount.toLocaleString('fr-CH')}</td>
                        <td className="py-3 px-4 text-center text-neutral-600">{payment.dueDate}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={statusConfig[payment.status as keyof typeof statusConfig].variant} size="sm">
                            {statusConfig[payment.status as keyof typeof statusConfig].label}
                            {payment.status === 'overdue' && payment.daysOverdue && ` (${payment.daysOverdue}j)`}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {payment.status === 'overdue' && (
                            <Button variant="outline" size="sm" leftIcon={<Send className="h-3 w-3" />}>Relancer</Button>
                          )}
                          {payment.status === 'pending' && (
                            <Button variant="ghost" size="sm">Pointer</Button>
                          )}
                          {payment.status === 'paid' && (
                            <Button variant="ghost" size="sm" leftIcon={<FileText className="h-3 w-3" />}>Quittance</Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ContentCard>
        </TabsContent>

        {/* Owners Tab */}
        <TabsContent value="owners">
          <ContentCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Comptes mandants</h3>
              <Button leftIcon={<Send className="h-4 w-4" />}>Générer versements</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Propriétaire</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Biens</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Loyers encaissés</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Commission (5%)</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">À verser</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Statut</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {mockOwners.map((owner) => (
                    <tr key={owner.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-violet-600" />
                          </div>
                          <span className="font-medium">{owner.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">{owner.properties}</td>
                      <td className="py-3 px-4 text-right text-success-600">+CHF {owner.rentsCollected.toLocaleString('fr-CH')}</td>
                      <td className="py-3 px-4 text-right text-brand-600">CHF {owner.commission.toLocaleString('fr-CH')}</td>
                      <td className="py-3 px-4 text-right font-semibold">CHF {owner.toPay.toLocaleString('fr-CH')}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={owner.status === 'paid' ? 'success' : 'warning'} size="sm">
                          {owner.status === 'paid' ? 'Versé' : 'À verser'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {owner.status === 'pending' ? (
                          <Button variant="outline" size="sm">Verser</Button>
                        ) : (
                          <Button variant="ghost" size="sm">Détails</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                    <td className="py-3 px-4 font-semibold" colSpan={2}>Total</td>
                    <td className="py-3 px-4 text-right font-semibold text-success-600">
                      +CHF {mockOwners.reduce((sum, o) => sum + o.rentsCollected, 0).toLocaleString('fr-CH')}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-brand-600">
                      CHF {mockOwners.reduce((sum, o) => sum + o.commission, 0).toLocaleString('fr-CH')}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      CHF {mockOwners.reduce((sum, o) => sum + o.toPay, 0).toLocaleString('fr-CH')}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </ContentCard>
        </TabsContent>

        {/* Reminders Tab */}
        <TabsContent value="reminders">
          <ContentCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Rappels de paiement</h3>
              <Button leftIcon={<Send className="h-4 w-4" />}>Nouveau rappel</Button>
            </div>

            {mockReminders.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-success-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun rappel en cours</h3>
                <p className="text-neutral-500">Tous les locataires sont à jour de paiement</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mockReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-4 bg-error-50 dark:bg-error-900/20 rounded-xl border border-error-200 dark:border-error-800">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-error-100 dark:bg-error-900 flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-error-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-neutral-900 dark:text-white">{reminder.tenant}</h4>
                          <Badge variant="error" size="sm">Rappel n°{reminder.level}</Badge>
                        </div>
                        <p className="text-sm text-neutral-500">{reminder.property}</p>
                        <p className="text-xs text-neutral-400 mt-1">Envoyé le {reminder.sentDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">Montant dû</p>
                        <p className="text-xl font-bold text-error-600">CHF {reminder.dueAmount.toLocaleString('fr-CH')}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Rappel suivant</Button>
                        <Button variant="ghost" size="sm">Détails</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ContentCard>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
