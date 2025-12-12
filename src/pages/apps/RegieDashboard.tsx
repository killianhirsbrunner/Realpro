import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Home,
  Users,
  Receipt,
  Wrench,
  TrendingUp,
  AlertCircle,
  Building2,
  Plus,
  Calendar,
  Key,
  FileText,
  Settings,
  DollarSign
} from 'lucide-react';

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
    <Card padding="none">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
            <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{value}</p>
            {subtitle && (
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
            )}
            {trend && (
              <p className={`mt-2 text-sm font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}% vs mois dernier
              </p>
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
    default: 'bg-emerald-500',
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

const quickActions = [
  { icon: Building2, label: 'Biens', href: '/regie/properties', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
  { icon: Users, label: 'Locataires', href: '/regie/tenants', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { icon: Key, label: 'Baux', href: '/regie/leases', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
  { icon: DollarSign, label: 'Paiements', href: '/regie/payments', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { icon: Wrench, label: 'Maintenance', href: '/regie/maintenance', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  { icon: FileText, label: 'Documents', href: '/regie/documents', color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20' },
];

export function RegieDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Régie
            </h1>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400">
            Gestion locative immobilière
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/regie/settings">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </Link>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau bien
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Biens gérés"
          value={167}
          subtitle="appartements et locaux"
          icon={<Building2 className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
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
          icon={<Receipt className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-50 dark:bg-purple-900/20"
        />
        <StatCard
          title="Interventions"
          value={12}
          subtitle="en cours"
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
                className="flex flex-col items-center gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rent Status */}
        <Card padding="none">
          <div className="p-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <CardTitle>Statut des loyers - Décembre</CardTitle>
                </div>
                <Link to="/regie/payments" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  Voir tout
                </Link>
              </div>
            </CardHeader>
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
                  <ProgressBar value={item.percent} variant={item.variant} />
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Taux d'occupation
                </span>
                <span className="text-lg font-bold text-emerald-600">94.6%</span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">
                9 biens vacants sur 167
              </p>
            </div>
          </div>
        </Card>

        {/* Maintenance */}
        <Card padding="none">
          <div className="p-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <CardTitle>Interventions récentes</CardTitle>
                </div>
                <Link to="/regie/maintenance" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  Voir tout
                </Link>
              </div>
            </CardHeader>
            <div className="space-y-3">
              {mockMaintenance.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl"
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
          </div>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card padding="none">
        <div className="p-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-neutral-500" />
              <CardTitle>Échéances à venir</CardTitle>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border-l-4 border-amber-500">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">15 Jan 2025</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">3 baux à renouveler</p>
              <p className="text-sm text-neutral-500">Préavis de 3 mois</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border-l-4 border-blue-500">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">20 Jan 2025</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">État des lieux sortant</p>
              <p className="text-sm text-neutral-500">Rue du Lac 12, apt 4A</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border-l-4 border-emerald-500">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">01 Fév 2025</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">2 nouvelles entrées</p>
              <p className="text-sm text-neutral-500">Contrats signés</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default RegieDashboard;
