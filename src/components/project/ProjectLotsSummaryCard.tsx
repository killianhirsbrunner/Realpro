import { Building2, CheckCircle, Clock, Home, TrendingUp } from 'lucide-react';
import { useProjectLotsSummary } from '@/hooks/useProjectLotsSummary';
import { Link } from 'react-router-dom';

interface ProjectLotsSummaryCardProps {
  projectId: string;
}

export default function ProjectLotsSummaryCard({ projectId }: ProjectLotsSummaryCardProps) {
  const { data, loading } = useProjectLotsSummary(projectId);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 p-6 animate-pulse">
        <div className="h-6 bg-neutral-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-neutral-200 rounded"></div>
          <div className="h-4 bg-neutral-200 rounded"></div>
          <div className="h-4 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Lots</h3>
            <p className="text-sm text-neutral-500">{data.total} lots au total</p>
          </div>
        </div>
        <Link
          to={`/projects/${projectId}/lots`}
          className="text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          Voir tous →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Vendus</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{data.sold + data.delivered}</p>
          <p className="text-xs text-green-700 mt-1">{data.salesRate}% du total</p>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-900">Réservés</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{data.reserved}</p>
        </div>

        <div className="bg-neutral-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-4 h-4 text-neutral-600" />
            <span className="text-sm font-medium text-neutral-900">Disponibles</span>
          </div>
          <p className="text-2xl font-bold text-neutral-600">{data.available}</p>
        </div>

        <div className="bg-brand-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-medium text-brand-900">Valeur vendue</span>
          </div>
          <p className="text-lg font-bold text-brand-600">
            {(data.soldValue / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-brand-700 mt-1">
            sur {(data.totalValue / 1000000).toFixed(1)}M CHF
          </p>
        </div>
      </div>

      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
          style={{ width: `${data.salesRate}%` }}
        ></div>
      </div>
      <p className="text-xs text-neutral-500 mt-2 text-center">
        Taux de commercialisation : {data.salesRate}%
      </p>
    </div>
  );
}
