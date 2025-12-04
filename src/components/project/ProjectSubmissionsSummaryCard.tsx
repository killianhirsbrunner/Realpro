import { ClipboardList, Send, CheckCircle2, FileCheck } from 'lucide-react';
import { useProjectSubmissionsSummary } from '@/hooks/useProjectSubmissionsSummary';
import { Link } from 'react-router-dom';

interface ProjectSubmissionsSummaryCardProps {
  projectId: string;
}

export default function ProjectSubmissionsSummaryCard({ projectId }: ProjectSubmissionsSummaryCardProps) {
  const { data, loading } = useProjectSubmissionsSummary(projectId);

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
          <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-secondary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Soumissions</h3>
            <p className="text-sm text-gray-500">{data.total} appels d'offres</p>
          </div>
        </div>
        <Link
          to={`/projects/${projectId}/submissions`}
          className="text-sm text-secondary-600 hover:text-secondary-700 font-medium"
        >
          Voir tous →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <FileCheck className="w-3 h-3 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Brouillons</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{data.draft}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Send className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-medium text-blue-900">Publiées</span>
          </div>
          <p className="text-xl font-bold text-blue-600">{data.published}</p>
        </div>

        <div className="bg-amber-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-3 h-3 text-amber-600" />
            <span className="text-xs font-medium text-amber-900">Clôturées</span>
          </div>
          <p className="text-xl font-bold text-amber-600">{data.closed}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            <span className="text-xs font-medium text-green-900">Adjudiquées</span>
          </div>
          <p className="text-xl font-bold text-green-600">{data.adjudicated}</p>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Moyenne d'offres</span>
          <span className="font-semibold text-gray-900">{data.averageOffers} par soumission</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Valeur adjudiquée</span>
          <span className="font-semibold text-green-600">
            {(data.totalEstimatedValue / 1000000).toFixed(2)}M CHF
          </span>
        </div>
      </div>
    </div>
  );
}
