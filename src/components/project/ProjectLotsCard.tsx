import { Home, Package, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCHF, formatPercent } from '../../lib/utils/format';

interface ProjectLotsCardProps {
  projectId: string;
  lots: {
    total: number;
    available: number;
    reserved: number;
    sold: number;
    totalRevenue: number;
    averagePrice: number;
  };
}

export function ProjectLotsCard({ projectId, lots }: ProjectLotsCardProps) {
  const salesRate = lots.total > 0 ? (lots.sold / lots.total) * 100 : 0;

  const stats = [
    {
      label: 'Disponibles',
      value: lots.available,
      icon: Package,
      color: 'text-brand-600 bg-brand-50',
    },
    {
      label: 'Réservés',
      value: lots.reserved,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: 'Vendus',
      value: lots.sold,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
    },
  ];

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-gray-600" />
            <Card.Title>Lots & Commercialisation</Card.Title>
          </div>
          <Badge variant="default">{lots.total} lots</Badge>
        </div>
      </Card.Header>

      <Card.Content className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className={`p-2 rounded-lg ${stat.color} mb-2`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Taux de commercialisation</span>
            <span className="text-lg font-bold text-gray-900">
              {formatPercent(salesRate)}
            </span>
          </div>

          <div className="relative w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-600 transition-all duration-700"
              style={{ width: `${salesRate}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {lots.totalRevenue > 0 && (
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Chiffre d'affaires</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCHF(lots.totalRevenue)}
              </span>
            </div>
            {lots.averagePrice > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Prix moyen</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCHF(lots.averagePrice)}
                </span>
              </div>
            )}
          </div>
        )}

        <Link to={`/projects/${projectId}/lots`}>
          <Button variant="outline" className="w-full gap-2">
            <TrendingUp className="h-4 w-4" />
            Voir tous les lots
          </Button>
        </Link>
      </Card.Content>
    </Card>
  );
}
