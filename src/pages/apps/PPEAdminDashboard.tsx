import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Building2,
  Users,
  Receipt,
  Wrench,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Plus,
  TrendingUp,
  FileText,
  Settings
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ title, value, subtitle, icon, iconBg }: StatCardProps) {
  return (
    <Card padding="none">
      <div className="p-6">
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
      </div>
    </Card>
  );
}

function ProgressBar({ value, variant = 'default' }: { value: number; variant?: 'default' | 'success' | 'warning' | 'error' }) {
  const colors = {
    default: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };

  return (
    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
      <div
        className={`h-full ${colors[variant]} transition-all duration-300`}
        style={{ width: `${value}%` }}
      />
    </div>
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

const quickActions = [
  { icon: Building2, label: 'Immeubles', href: '/ppe-admin/properties', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { icon: Users, label: 'Copropriétaires', href: '/ppe-admin/owners', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
  { icon: Receipt, label: 'Comptabilité', href: '/ppe-admin/accounting', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
  { icon: Calendar, label: 'Assemblées', href: '/ppe-admin/assemblies', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  { icon: Wrench, label: 'Travaux', href: '/ppe-admin/works', color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20' },
  { icon: FileText, label: 'Documents', href: '/ppe-admin/documents', color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20' },
];

export function PPEAdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              PPE Admin
            </h1>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400">
            Administration de copropriétés
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/ppe-admin/settings">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </Link>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel immeuble
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Immeubles gérés"
          value={12}
          subtitle="3 copropriétés"
          icon={<Building2 className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          title="Copropriétaires"
          value={186}
          subtitle="actifs"
          icon={<Users className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
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

      {/* Quick Actions */}
      <Card padding="none">
        <div className="p-6">
          <CardHeader>
            <CardTitle>Accès rapide</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Health */}
        <Card padding="none">
          <div className="p-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <CardTitle>Santé financière</CardTitle>
                </div>
                <Link to="/ppe-admin/accounting" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Voir tout
                </Link>
              </div>
            </CardHeader>
            <div className="space-y-4">
              {mockProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl"
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
                      <ProgressBar
                        value={property.healthScore}
                        variant={property.healthScore >= 90 ? 'success' : property.healthScore >= 70 ? 'warning' : 'error'}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right text-neutral-700 dark:text-neutral-300">
                      {property.healthScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Alerts */}
        <Card padding="none">
          <div className="p-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <CardTitle>Alertes et rappels</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700"
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
          </div>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card padding="none">
        <div className="p-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-neutral-500" />
              <CardTitle>Prochains événements</CardTitle>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">15 Jan 2025</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">Assemblée générale</p>
              <p className="text-sm text-neutral-500">Résidence Les Alpes</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">22 Jan 2025</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">Fin travaux toiture</p>
              <p className="text-sm text-neutral-500">Copropriété du Parc</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">31 Jan 2025</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">Échéance décompte</p>
              <p className="text-sm text-neutral-500">Tous les immeubles</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PPEAdminDashboard;
