import { useState } from 'react';
import {
  Button,
  SearchInput,
  Badge,
  Progress,
  Select,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@realpro/ui';
import { PageShell, ContentCard } from '@realpro/ui/layouts';
import { StatCard } from '@realpro/ui';
import {
  Download,
  Plus,
  Wallet,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Mail,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Send,
} from 'lucide-react';

// Mock data
const mockPaymentSummary = {
  expectedMonth: 125800,
  receivedMonth: 98450,
  pendingAmount: 27350,
  overdueAmount: 12800,
  overdueCount: 4,
};

const mockSchedule = [
  {
    id: '1',
    tenant: 'Marie Dupont',
    property: 'Résidence Lac-Léman',
    unit: '3.5 pièces - 2ème',
    amount: 2100,
    dueDate: '2025-01-01',
    status: 'paid',
    paidDate: '2024-12-28',
  },
  {
    id: '2',
    tenant: 'Pierre Martin',
    property: 'Immeuble Centre-Ville',
    unit: 'Studio - 4ème',
    amount: 1100,
    dueDate: '2025-01-01',
    status: 'paid',
    paidDate: '2025-01-02',
  },
  {
    id: '3',
    tenant: 'Sophie Bernard',
    property: 'Villa des Roses',
    unit: 'Maison 6 pièces',
    amount: 3600,
    dueDate: '2025-01-01',
    status: 'pending',
    paidDate: null,
  },
  {
    id: '4',
    tenant: 'Jean Müller',
    property: 'Résidence Lac-Léman',
    unit: '4.5 pièces - RDC',
    amount: 2380,
    dueDate: '2024-12-01',
    status: 'overdue',
    paidDate: null,
    daysOverdue: 42,
  },
  {
    id: '5',
    tenant: 'Lisa Weber',
    property: 'Immeuble Centre-Ville',
    unit: '2.5 pièces - 1er',
    amount: 1450,
    dueDate: '2024-11-01',
    status: 'overdue',
    paidDate: null,
    daysOverdue: 72,
  },
];

const mockReminders = [
  {
    id: '1',
    tenant: 'Jean Müller',
    amount: 2380,
    daysOverdue: 42,
    remindersSent: 2,
    lastReminder: '2024-12-20',
  },
  {
    id: '2',
    tenant: 'Lisa Weber',
    amount: 1450,
    daysOverdue: 72,
    remindersSent: 3,
    lastReminder: '2025-01-05',
  },
];

const statusConfig = {
  paid: { label: 'Payé', variant: 'success' as const, icon: CheckCircle2 },
  pending: { label: 'En attente', variant: 'warning' as const, icon: Clock },
  overdue: { label: 'En retard', variant: 'error' as const, icon: AlertTriangle },
  partial: { label: 'Partiel', variant: 'info' as const, icon: Clock },
};

export function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  const [statusFilter, setStatusFilter] = useState('all');

  const collectionRate = Math.round(
    (mockPaymentSummary.receivedMonth / mockPaymentSummary.expectedMonth) * 100
  );

  const filteredSchedule = mockSchedule.filter((payment) => {
    const matchesSearch = payment.tenant.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageShell
      title="Encaissements"
      subtitle="Suivi des loyers et charges"
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Exporter
          </Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Saisir un paiement
          </Button>
        </div>
      }
    >
      {/* Period selector */}
      <div className="flex items-center gap-4 mb-6">
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-48"
        >
          <option value="2025-01">Janvier 2025</option>
          <option value="2024-12">Décembre 2024</option>
          <option value="2024-11">Novembre 2024</option>
          <option value="2024-10">Octobre 2024</option>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Attendu ce mois"
          value={`CHF ${mockPaymentSummary.expectedMonth.toLocaleString('fr-CH')}`}
          icon={<Wallet className="h-5 w-5" />}
          iconBgClass="bg-brand-100 dark:bg-brand-900"
          iconColorClass="text-brand-600 dark:text-brand-400"
        />
        <StatCard
          label="Encaissé"
          value={`CHF ${mockPaymentSummary.receivedMonth.toLocaleString('fr-CH')}`}
          description={`${collectionRate}% du total`}
          icon={<TrendingUp className="h-5 w-5" />}
          iconBgClass="bg-success-100 dark:bg-success-900"
          iconColorClass="text-success-600 dark:text-success-400"
        />
        <StatCard
          label="En attente"
          value={`CHF ${mockPaymentSummary.pendingAmount.toLocaleString('fr-CH')}`}
          icon={<Clock className="h-5 w-5" />}
          iconBgClass="bg-warning-100 dark:bg-warning-900"
          iconColorClass="text-warning-600 dark:text-warning-400"
        />
        <StatCard
          label="Impayés"
          value={`CHF ${mockPaymentSummary.overdueAmount.toLocaleString('fr-CH')}`}
          description={`${mockPaymentSummary.overdueCount} locataires`}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconBgClass="bg-error-100 dark:bg-error-900"
          iconColorClass="text-error-600 dark:text-error-400"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="schedule">Échéancier</TabsTrigger>
            <TabsTrigger value="reminders">Relances ({mockReminders.length})</TabsTrigger>
            <TabsTrigger value="receipts">Quittances</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 flex-wrap">
            <SearchInput
              placeholder="Rechercher un locataire..."
              onSearch={setSearch}
              className="w-full sm:w-64"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            >
              <option value="all">Tous les statuts</option>
              <option value="paid">Payés</option>
              <option value="pending">En attente</option>
              <option value="overdue">En retard</option>
            </Select>
          </div>
        </div>

        <TabsContent value="schedule">
          <ContentCard padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                      Locataire
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                      Objet
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                      Échéance
                    </th>
                    <th className="text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                      Montant
                    </th>
                    <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-3">
                      Statut
                    </th>
                    <th className="px-6 py-3 w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {filteredSchedule.map((payment) => {
                    const status = statusConfig[payment.status as keyof typeof statusConfig];
                    const StatusIcon = status.icon;
                    return (
                      <tr key={payment.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-6 py-4">
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {payment.tenant}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-neutral-900 dark:text-white">
                              {payment.property}
                            </p>
                            <p className="text-xs text-neutral-500">{payment.unit}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {new Date(payment.dueDate).toLocaleDateString('fr-CH')}
                            {payment.status === 'overdue' && (
                              <p className="text-xs text-error-500">
                                +{(payment as any).daysOverdue} jours
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            CHF {payment.amount.toLocaleString('fr-CH')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={status.variant} size="sm">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {payment.status === 'pending' && (
                            <Button variant="ghost" size="sm">
                              Confirmer
                            </Button>
                          )}
                          {payment.status === 'overdue' && (
                            <Button variant="outline" size="sm" leftIcon={<Send className="h-3.5 w-3.5" />}>
                              Relancer
                            </Button>
                          )}
                          {payment.status === 'paid' && (
                            <Button variant="ghost" size="sm" leftIcon={<FileText className="h-3.5 w-3.5" />}>
                              Quittance
                            </Button>
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

        <TabsContent value="reminders">
          <div className="space-y-4">
            {mockReminders.map((reminder) => (
              <ContentCard key={reminder.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-error-100 dark:bg-error-900 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-error-600 dark:text-error-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        {reminder.tenant}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        CHF {reminder.amount.toLocaleString('fr-CH')} · {reminder.daysOverdue} jours de retard
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {reminder.remindersSent} relance(s) envoyée(s) · Dernière le{' '}
                        {new Date(reminder.lastReminder).toLocaleDateString('fr-CH')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Mail className="h-4 w-4" />}>
                      Rappel email
                    </Button>
                    <Button variant="primary" size="sm" leftIcon={<FileText className="h-4 w-4" />}>
                      Mise en demeure
                    </Button>
                  </div>
                </div>
              </ContentCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="receipts">
          <ContentCard>
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Génération de quittances
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                Générez les quittances de loyer pour tous les paiements confirmés du mois.
              </p>
              <Button variant="primary" leftIcon={<FileText className="h-4 w-4" />}>
                Générer les quittances de janvier 2025
              </Button>
            </div>
          </ContentCard>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
