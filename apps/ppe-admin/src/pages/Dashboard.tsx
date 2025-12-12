import { Card, CardHeader, CardContent, Badge, Progress } from '@realpro/ui';
import { Building, Users, Receipt, Wrench, AlertTriangle, Calendar } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ title, value, subtitle, icon, iconBg }: StatCardProps) {
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
          </div>
          <div className={`p-3 rounded-xl ${iconBg}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const mockProperties = [
  { id: '1', name: 'Résidence Les Alpes', units: 24, balance: 45230, healthScore: 92 },
  { id: '2', name: 'Immeuble Lac-Léman', units: 16, balance: 28150, healthScore: 78 },
  { id: '3', name: 'Copropriété du Parc', units: 32, balance: 62480, healthScore: 95 },
];

const mockAlerts = [
  { id: '1', type: 'warning', message: 'Fonds de rénovation sous le seuil recommandé', property: 'Immeuble Lac-Léman' },
  { id: '2', type: 'info', message: 'Assemblée générale prévue dans 14 jours', property: 'Résidence Les Alpes' },
  { id: '3', type: 'error', message: '3 charges impayées depuis plus de 90 jours', property: 'Copropriété du Parc' },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Vue d'ensemble de vos copropriétés
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Immeubles gérés"
          value={12}
          subtitle="3 copropriétés"
          icon={<Building className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          title="Copropriétaires"
          value={186}
          subtitle="actifs"
          icon={<Users className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          title="Charges du mois"
          value="CHF 42'350"
          subtitle="encaissées"
          icon={<Receipt className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-50 dark:bg-purple-900/20"
        />
        <StatCard
          title="Travaux en cours"
          value={4}
          subtitle="projets actifs"
          icon={<Wrench className="w-6 h-6 text-orange-600" />}
          iconBg="bg-orange-50 dark:bg-orange-900/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Santé financière des copropriétés
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-neutral-900 dark:text-white truncate">
                      {property.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {property.units} lots · CHF {property.balance.toLocaleString('fr-CH')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24">
                      <Progress
                        value={property.healthScore}
                        size="sm"
                        variant={property.healthScore >= 90 ? 'success' : property.healthScore >= 70 ? 'warning' : 'error'}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {property.healthScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning-500" />
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Alertes et rappels
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700"
                >
                  <Badge
                    variant={alert.type === 'error' ? 'error' : alert.type === 'warning' ? 'warning' : 'info'}
                    size="sm"
                  >
                    {alert.type === 'error' ? 'Urgent' : alert.type === 'warning' ? 'Attention' : 'Info'}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900 dark:text-white">
                      {alert.message}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {alert.property}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-neutral-500" />
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Prochains événements
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">15 Jan 2025</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">Assemblée générale</p>
              <p className="text-sm text-neutral-500">Résidence Les Alpes</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">22 Jan 2025</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">Fin travaux toiture</p>
              <p className="text-sm text-neutral-500">Copropriété du Parc</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">31 Jan 2025</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">Échéance décompte</p>
              <p className="text-sm text-neutral-500">Tous les immeubles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
