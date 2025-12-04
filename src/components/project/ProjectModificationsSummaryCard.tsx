import { Palette, Settings, FileEdit, CheckCircle } from 'lucide-react';
import { useProjectModificationsSummary } from '@/hooks/useProjectModificationsSummary';
import { Link } from 'react-router-dom';

interface ProjectModificationsSummaryCardProps {
  projectId: string;
}

export default function ProjectModificationsSummaryCard({ projectId }: ProjectModificationsSummaryCardProps) {
  const { data, loading } = useProjectModificationsSummary(projectId);

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
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Modifications</h3>
            <p className="text-sm text-gray-500">Choix & Demandes clients</p>
          </div>
        </div>
        <Link
          to={`/projects/${projectId}/materials`}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Gérer →
        </Link>
      </div>

      <div className="space-y-4">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Catalogue matériaux</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-indigo-800">
            <div>
              <p className="text-2xl font-bold text-indigo-600">
                {data.materialChoices.totalCategories}
              </p>
              <p className="mt-1">Catégories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">
                {data.materialChoices.totalOptions}
              </p>
              <p className="mt-1">Options</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">
                {data.materialChoices.buyersWithChoices}
              </p>
              <p className="mt-1">Acheteurs</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileEdit className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Demandes de modification</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total demandes</span>
              <span className="font-semibold text-gray-900">
                {data.changeRequests.total}
              </span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                {data.changeRequests.pending} en attente
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {data.changeRequests.underReview} en revue
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                {data.changeRequests.approved} approuvées
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Coût estimé total</span>
            <span className="text-lg font-bold text-gray-900">
              {(data.changeRequests.totalEstimatedCost / 1000).toFixed(0)}K CHF
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
