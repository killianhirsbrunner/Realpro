import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, CheckCircle2, MessageSquare, FileText } from 'lucide-react';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { ProspectInfoCard } from '../components/crm';
import { useProspectDetail } from '../hooks/useProspectDetail';

export default function ProjectCRMProspectDetail() {
  const { projectId, prospectId } = useParams<{ projectId: string; prospectId: string }>();
  const navigate = useNavigate();
  const { prospect, loading, error, refetch } = useProspectDetail(projectId!, prospectId!);

  if (loading) return <LoadingState message="Chargement du prospect..." />;
  if (error) return <ErrorState message={error} retry={refetch} />;
  if (!prospect) return <ErrorState message="Prospect introuvable" retry={refetch} />;

  const handleConvertToReservation = () => {
    // TODO: Implement conversion logic
    console.log('Converting to reservation:', prospect.id);
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce prospect ?')) {
      // TODO: Implement delete logic
      navigate(`/projects/${projectId}/crm/prospects`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/projects/${projectId}/crm/prospects`}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {prospect.name}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Prospect ajouté le {new Date(prospect.createdAt).toLocaleDateString('fr-CH')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
          <Link
            to={`/projects/${projectId}/crm/prospects/${prospectId}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </Link>
          <button
            onClick={handleConvertToReservation}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Convertir en réservation
          </button>
        </div>
      </div>

      {/* Prospect Information */}
      <ProspectInfoCard prospect={prospect} />

      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Activité récente
            </h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              Ajouter
            </button>
          </div>
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Aucune activité enregistrée
            </p>
          </div>
        </div>

        {/* Documents */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Documents
            </h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              Ajouter
            </button>
          </div>
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Aucun document
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
