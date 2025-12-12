import { Card, CardHeader, CardContent, Badge, Progress } from '@realpro/ui';
import { Building2, TrendingUp, Users, Calendar } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
}

function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
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
          <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProjectSummary {
  id: string;
  name: string;
  location: string;
  progress: number;
  status: 'planning' | 'construction' | 'commercialization' | 'delivered';
  unitsTotal: number;
  unitsSold: number;
}

const mockProjects: ProjectSummary[] = [
  {
    id: '1',
    name: 'Résidence du Lac',
    location: 'Lausanne, VD',
    progress: 75,
    status: 'construction',
    unitsTotal: 24,
    unitsSold: 18,
  },
  {
    id: '2',
    name: 'Les Terrasses de Morges',
    location: 'Morges, VD',
    progress: 30,
    status: 'planning',
    unitsTotal: 16,
    unitsSold: 4,
  },
  {
    id: '3',
    name: 'Éco-Quartier Soleil',
    location: 'Nyon, VD',
    progress: 95,
    status: 'commercialization',
    unitsTotal: 32,
    unitsSold: 28,
  },
];

const statusLabels: Record<string, { label: string; variant: 'info' | 'warning' | 'success' | 'neutral' }> = {
  planning: { label: 'Planification', variant: 'info' },
  construction: { label: 'Construction', variant: 'warning' },
  commercialization: { label: 'Commercialisation', variant: 'success' },
  delivered: { label: 'Livré', variant: 'neutral' },
};

export function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Vue d'ensemble de vos projets immobiliers
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Projets actifs"
          value={8}
          icon={<Building2 className="w-6 h-6 text-primary-600" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Unités vendues"
          value={142}
          subtitle="sur 198 disponibles"
          icon={<TrendingUp className="w-6 h-6 text-primary-600" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Prospects"
          value={67}
          subtitle="ce mois"
          icon={<Users className="w-6 h-6 text-primary-600" />}
          trend={{ value: 23, isPositive: true }}
        />
        <StatCard
          title="Visites planifiées"
          value={12}
          subtitle="cette semaine"
          icon={<Calendar className="w-6 h-6 text-primary-600" />}
        />
      </div>

      {/* Projects Overview */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Projets en cours
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-neutral-900 dark:text-white truncate">
                      {project.name}
                    </h3>
                    <Badge variant={statusLabels[project.status].variant}>
                      {statusLabels[project.status].label}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    {project.location}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {project.unitsSold}/{project.unitsTotal} unités
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      vendues
                    </p>
                  </div>
                  <div className="w-32">
                    <Progress value={project.progress} size="md" showValue />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
