import { Card, CardHeader, CardContent, Badge, Progress } from '@realpro/ui';
import { Building2, Users, Receipt, Wrench, TrendingUp, AlertCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: { value: number; isPositive: boolean };
}

function StatCard({ title, value, subtitle, icon, iconBg, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
            <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{value}</p>
            {subtitle && (
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
            )}
            {trend && (
              <p className={`mt-2 text-sm font-medium ${trend.isPositive ? 'text-success-600' : 'text-error-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}% vs mois dernier
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${iconBg}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const mockRentStatus = [
  { status: 'Payés', count: 142, percent: 85, variant: 'success' as const },
  { status: 'En attente', count: 18, percent: 11, variant: 'warning' as const },
  { status: 'Impayés', count: 7, percent: 4, variant: 'error' as const },
];

const mockMaintenance = [
  { id: '1', title: 'Fuite robinet cuisine', property: 'Rue du Lac 12, apt 3B', status: 'urgent', date: '12.12.2024' },
  { id: '2', title: 'Remplacement serrure', property: 'Avenue des Alpes 45', status: 'pending', date: '11.12.2024' },
  { id: '3', title: 'Panne chauffage', property: 'Chemin du Parc 8, apt 2A', status: 'in_progress', date: '10.12.2024' },
];

const statusConfig = {
  urgent: { label: 'Urgent', variant: 'error' as const },
  pending: { label: 'En attente', variant: 'warning' as const },
  in_progress: { label: 'En cours', variant: 'info' as const },
};

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Vue d'ensemble de votre parc locatif
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Biens gérés"
          value={167}
          subtitle="appartements et locaux"
          icon={<Building2 className="w-6 h-6 text-violet-600" />}
          iconBg="bg-violet-50 dark:bg-violet-900/20"
        />
        <StatCard
          title="Locataires actifs"
          value={158}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          trend={{ value: 3, isPositive: true }}
        />
        <StatCard
          title="Loyers du mois"
          value="CHF 312'450"
          subtitle="encaissés"
          icon={<Receipt className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          title="Interventions"
          value={12}
          subtitle="en cours"
          icon={<Wrench className="w-6 h-6 text-orange-600" />}
          iconBg="bg-orange-50 dark:bg-orange-900/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-500" />
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Statut des loyers - Décembre
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRentStatus.map((item) => (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={item.variant} size="sm">{item.status}</Badge>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {item.count} locataires
                      </span>
                    </div>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {item.percent}%
                    </span>
                  </div>
                  <Progress value={item.percent} size="sm" variant={item.variant} />
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Taux d'occupation
                </span>
                <span className="text-lg font-bold text-violet-600">94.6%</span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">
                9 biens vacants sur 167
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Interventions récentes
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockMaintenance.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-neutral-900 dark:text-white truncate">
                        {item.title}
                      </h3>
                      <Badge variant={statusConfig[item.status as keyof typeof statusConfig].variant} size="sm">
                        {statusConfig[item.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 truncate">
                      {item.property}
                    </p>
                  </div>
                  <span className="text-xs text-neutral-400 whitespace-nowrap ml-2">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Échéances à venir
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border-l-4 border-warning-500">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">15 Jan 2025</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">3 baux à renouveler</p>
              <p className="text-sm text-neutral-500">Préavis de 3 mois</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border-l-4 border-info-500">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">20 Jan 2025</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">État des lieux sortant</p>
              <p className="text-sm text-neutral-500">Rue du Lac 12, apt 4A</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border-l-4 border-success-500">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">01 Fév 2025</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">2 nouvelles entrées</p>
              <p className="text-sm text-neutral-500">Contrats signés</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
