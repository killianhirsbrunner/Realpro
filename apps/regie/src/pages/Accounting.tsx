import { Card, CardHeader, CardContent, Button, Badge } from '@realpro/ui';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

const mockStats = {
  totalRents: 45750,
  collected: 42300,
  pending: 3450,
  overdue: 1850,
};

const mockPayments = [
  { id: '1', tenant: 'Martin Dupont', property: 'Résidence du Lac, Apt 3.2', amount: 2030, dueDate: '01.12.2024', status: 'paid', paidDate: '30.11.2024' },
  { id: '2', tenant: 'Sophie Weber', property: 'Immeuble Central, Apt 1.1', amount: 1600, dueDate: '01.12.2024', status: 'paid', paidDate: '01.12.2024' },
  { id: '3', tenant: 'Pierre Favre', property: 'Résidence du Lac, Apt 2.1', amount: 2300, dueDate: '01.12.2024', status: 'pending', paidDate: null },
  { id: '4', tenant: 'Marie Rochat', property: 'Commerce Place Neuve', amount: 3950, dueDate: '01.12.2024', status: 'overdue', paidDate: null },
  { id: '5', tenant: 'Jean Müller', property: 'Immeuble Central, Apt 2.3', amount: 1810, dueDate: '01.12.2024', status: 'paid', paidDate: '02.12.2024' },
];

const statusConfig = {
  paid: { label: 'Payé', variant: 'success' as const, icon: CheckCircle2 },
  pending: { label: 'En attente', variant: 'warning' as const, icon: Clock },
  overdue: { label: 'En retard', variant: 'error' as const, icon: AlertCircle },
};

export function AccountingPage() {
  const collectionRate = Math.round((mockStats.collected / mockStats.totalRents) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Comptabilité
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Suivi des encaissements et paiements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
            Décembre 2024
          </Button>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  CHF {mockStats.totalRents.toLocaleString('fr-CH')}
                </p>
                <p className="text-sm text-neutral-500">Total à encaisser</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  CHF {mockStats.collected.toLocaleString('fr-CH')}
                </p>
                <p className="text-sm text-neutral-500">Encaissé ({collectionRate}%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  CHF {mockStats.pending.toLocaleString('fr-CH')}
                </p>
                <p className="text-sm text-neutral-500">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  CHF {mockStats.overdue.toLocaleString('fr-CH')}
                </p>
                <p className="text-sm text-neutral-500">En retard</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Loyers du mois
            </h2>
            <div className="flex gap-2">
              <Badge variant="success" size="sm">
                {mockPayments.filter((p) => p.status === 'paid').length} payés
              </Badge>
              <Badge variant="warning" size="sm">
                {mockPayments.filter((p) => p.status === 'pending').length} en attente
              </Badge>
              <Badge variant="error" size="sm">
                {mockPayments.filter((p) => p.status === 'overdue').length} en retard
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {mockPayments.map((payment) => {
              const StatusIcon = statusConfig[payment.status as keyof typeof statusConfig].icon;
              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      payment.status === 'paid' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                      payment.status === 'pending' ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      <StatusIcon className={`w-4 h-4 ${
                        payment.status === 'paid' ? 'text-emerald-600' :
                        payment.status === 'pending' ? 'text-orange-600' :
                        'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {payment.tenant}
                      </p>
                      <p className="text-sm text-neutral-500">{payment.property}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        CHF {payment.amount.toLocaleString('fr-CH')}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Échéance: {payment.dueDate}
                      </p>
                    </div>
                    <Badge
                      variant={statusConfig[payment.status as keyof typeof statusConfig].variant}
                      size="sm"
                    >
                      {statusConfig[payment.status as keyof typeof statusConfig].label}
                    </Badge>
                    {payment.status === 'overdue' && (
                      <Button variant="outline" size="sm">
                        Relancer
                      </Button>
                    )}
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
