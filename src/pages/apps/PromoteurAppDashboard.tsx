import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Briefcase,
  Building2,
  TrendingUp,
  Users,
  Calendar,
  Plus,
  FileText,
  Settings,
  DollarSign,
  Hammer,
  ClipboardList,
  ArrowUpRight
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

function ProgressBar({ value, color = 'bg-purple-500' }: { value: number; color?: string }) {
  return (
    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

const mockProjects = [
  { id: '1', name: 'Les Terrasses du Lac', location: 'Lausanne', progress: 75, status: 'CONSTRUCTION', lotsTotal: 24, lotsSold: 18 },
  { id: '2', name: 'Résidence Bellevue', location: 'Genève', progress: 45, status: 'SELLING', lotsTotal: 36, lotsSold: 12 },
  { id: '3', name: 'Parc des Alpes', location: 'Montreux', progress: 90, status: 'CONSTRUCTION', lotsTotal: 18, lotsSold: 16 },
];

const mockSalesData = [
  { projectName: 'Les Terrasses du Lac', lotsTotal: 24, lotsSold: 18, lotsReserved: 3, percentage: 75 },
  { projectName: 'Résidence Bellevue', lotsTotal: 36, lotsSold: 12, lotsReserved: 8, percentage: 33 },
  { projectName: 'Parc des Alpes', lotsTotal: 18, lotsSold: 16, lotsReserved: 1, percentage: 89 },
];

const statusConfig: Record<string, { label: string; variant: 'info' | 'warning' | 'success' | 'default' }> = {
  PLANNING: { label: 'Planification', variant: 'info' },
  CONSTRUCTION: { label: 'Construction', variant: 'warning' },
  SELLING: { label: 'En vente', variant: 'success' },
  COMPLETED: { label: 'Terminé', variant: 'default' },
};

const quickActions = [
  { icon: Building2, label: 'Projets', href: '/projects', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
  { icon: Users, label: 'Acheteurs', href: '/promoteur/buyers', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { icon: ClipboardList, label: 'CRM', href: '/crm', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
  { icon: DollarSign, label: 'Finances', href: '/finance', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { icon: Hammer, label: 'Chantiers', href: '/chantier', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  { icon: FileText, label: 'Documents', href: '/promoteur/documents', color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20' },
];

export function PromoteurAppDashboard() {
  const stats = {
    activeProjects: 3,
    totalLots: 78,
    soldLots: 46,
    totalRevenue: 28500000,
    salesRate: 59,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Promoteur
            </h1>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400">
            Promotion immobilière
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/promoteur/settings">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </Link>
          <Link to="/projects/wizard">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau projet
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Projets actifs"
          value={stats.activeProjects}
          icon={<Building2 className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-50 dark:bg-purple-900/20"
        />
        <StatCard
          title="Unités vendues"
          value={stats.soldLots}
          subtitle={`sur ${stats.totalLots} disponibles`}
          icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          title="Chiffre d'affaires"
          value={`CHF ${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          subtitle="ventes confirmées"
          icon={<DollarSign className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          title="Taux de vente"
          value={`${stats.salesRate}%`}
          subtitle="tous projets confondus"
          icon={<Users className="w-6 h-6 text-amber-600" />}
          iconBg="bg-amber-50 dark:bg-amber-900/20"
          trend={{ value: 8, isPositive: true }}
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
                className="flex flex-col items-center gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Progress */}
        <Card padding="none">
          <div className="p-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-500" />
                  <CardTitle>Avancement des projets</CardTitle>
                </div>
                <Link to="/projects" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Voir tout
                </Link>
              </div>
            </CardHeader>
            <div className="space-y-4">
              {mockProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="block p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-neutral-900 dark:text-white">
                        {project.name}
                      </h3>
                      <Badge variant={statusConfig[project.status]?.variant || 'default'} size="sm">
                        {statusConfig[project.status]?.label || project.status}
                      </Badge>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                    {project.location} · {project.lotsSold}/{project.lotsTotal} lots vendus
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <ProgressBar value={project.progress} color="bg-purple-500" />
                    </div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {project.progress}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Card>

        {/* Sales Overview */}
        <Card padding="none">
          <div className="p-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <CardTitle>Performance commerciale</CardTitle>
                </div>
                <Link to="/crm" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Voir CRM
                </Link>
              </div>
            </CardHeader>
            <div className="space-y-4">
              {mockSalesData.map((sale) => (
                <div
                  key={sale.projectName}
                  className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-neutral-900 dark:text-white">
                      {sale.projectName}
                    </h3>
                    <span className="text-lg font-bold text-purple-600">
                      {sale.percentage}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {sale.lotsSold} vendus
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      {sale.lotsReserved} réservés
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                      {sale.lotsTotal - sale.lotsSold - sale.lotsReserved} disponibles
                    </span>
                  </div>
                  <ProgressBar value={sale.percentage} color="bg-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card padding="none">
        <div className="p-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-neutral-500" />
              <CardTitle>Activité récente</CardTitle>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border-l-4 border-emerald-500">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Aujourd'hui</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">2 nouvelles réservations</p>
              <p className="text-sm text-neutral-500">Les Terrasses du Lac</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border-l-4 border-purple-500">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Hier</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">Signature acte notarié</p>
              <p className="text-sm text-neutral-500">Parc des Alpes - Lot A12</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border-l-4 border-blue-500">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Cette semaine</p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">5 visites planifiées</p>
              <p className="text-sm text-neutral-500">Résidence Bellevue</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PromoteurAppDashboard;
