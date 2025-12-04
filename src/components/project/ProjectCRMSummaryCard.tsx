import { Users, UserPlus, UserCheck, FileText } from 'lucide-react';
import { useProjectCRMSummary } from '@/hooks/useProjectCRMSummary';
import { Link } from 'react-router-dom';

interface ProjectCRMSummaryCardProps {
  projectId: string;
}

export default function ProjectCRMSummaryCard({ projectId }: ProjectCRMSummaryCardProps) {
  const { data, loading } = useProjectCRMSummary(projectId);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">CRM & Ventes</h3>
            <p className="text-sm text-gray-500">Pipeline commercial</p>
          </div>
        </div>
        <Link
          to={`/projects/${projectId}/crm/prospects`}
          className="text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          Voir pipeline →
        </Link>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Prospects</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{data.prospects.total}</span>
          </div>
          <div className="flex gap-2 text-xs text-gray-600">
            <span>{data.prospects.new} nouveaux</span>
            <span>•</span>
            <span>{data.prospects.qualified} qualifiés</span>
            <span>•</span>
            <span>{data.prospects.visitScheduled} visites</span>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-900">Réservations</span>
            </div>
            <span className="text-lg font-bold text-amber-600">{data.reservations.total}</span>
          </div>
          <div className="flex gap-2 text-xs text-amber-700">
            <span>{data.reservations.pending} en attente</span>
            <span>•</span>
            <span>{data.reservations.confirmed} confirmées</span>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Acheteurs</span>
            </div>
            <span className="text-lg font-bold text-green-600">{data.buyers.total}</span>
          </div>
          <div className="flex gap-2 text-xs text-green-700">
            <span>{data.buyers.documentsPending} docs en attente</span>
            <span>•</span>
            <span>{data.buyers.signed} signés</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Taux de conversion</span>
          <span className="font-semibold text-gray-900">
            {data.prospects.total > 0
              ? Math.round((data.buyers.total / data.prospects.total) * 100)
              : 0}%
          </span>
        </div>
      </div>
    </div>
  );
}
