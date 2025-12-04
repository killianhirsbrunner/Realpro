import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit, Trash2, Eye, FileText, MessageSquare } from 'lucide-react';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { ProspectInfoCard } from '../components/crm';
import { ProspectLotsCard } from '../components/crm/ProspectLotsCard';
import { ProspectActivityCard } from '../components/crm/ProspectActivityCard';
import { ProspectQuickActions } from '../components/crm/ProspectQuickActions';
import { useProspectDetail } from '../hooks/useProspectDetail';
import { RealProTabs } from '../components/realpro/RealProTabs';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function ProjectCRMProspectDetail() {
  const { projectId, prospectId } = useParams<{ projectId: string; prospectId: string }>();
  const navigate = useNavigate();
  const { prospect, loading, error, refetch } = useProspectDetail(projectId!, prospectId!);

  if (loading) return <LoadingState message="Chargement du prospect..." />;
  if (error) return <ErrorState message={error} retry={refetch} />;
  if (!prospect) return <ErrorState message="Prospect introuvable" retry={refetch} />;

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce prospect ?')) {
      // TODO: Implement delete logic
      navigate(`/projects/${projectId}/crm/prospects`);
    }
  };

  const getStatusBadge = () => {
    const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
      NEW: { label: 'Nouveau', variant: 'default' },
      CONTACTED: { label: 'Contacté', variant: 'default' },
      QUALIFIED: { label: 'Qualifié', variant: 'success' },
      NEGOTIATION: { label: 'Négociation', variant: 'warning' },
      CONVERTED: { label: 'Converti', variant: 'success' },
      LOST: { label: 'Perdu', variant: 'danger' },
    };
    const status = statusMap[prospect.status] || { label: prospect.status, variant: 'default' as const };
    return <Badge variant={status.variant}>{status.label}</Badge>;
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: <Eye className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <ProspectInfoCard prospect={prospect} />
          <ProspectLotsCard prospect={prospect} projectId={projectId!} />
        </div>
      )
    },
    {
      id: 'activity',
      label: 'Activité',
      icon: <MessageSquare className="w-4 h-4" />,
      content: (
        <ProspectActivityCard prospectId={prospectId!} projectId={projectId!} />
      )
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="w-4 h-4" />,
      content: (
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Documents
            </h3>
            <Button variant="outline" size="sm">
              Ajouter
            </Button>
          </div>
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              Aucun document
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 px-10 py-8">
      <div>
        <Link
          to={`/projects/${projectId}/crm/prospects`}
          className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux prospects
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {prospect.name}
              </h1>
              {getStatusBadge()}
            </div>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {prospect.email}
              {prospect.phone && ` • ${prospect.phone}`}
            </p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
              Ajouté le {new Date(prospect.createdAt).toLocaleDateString('fr-CH')}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <ProspectQuickActions
              prospect={prospect}
              projectId={projectId!}
              onStatusChange={refetch}
            />
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-brand-200 dark:border-brand-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Source</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white capitalize">
                {prospect.source || 'Non renseigné'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Budget</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {prospect.budget ? `CHF ${prospect.budget.toLocaleString('fr-CH')}` : 'Non renseigné'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Lots intéressés</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {prospect.interested_lots?.length || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Dernier contact</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {prospect.lastContact ? new Date(prospect.lastContact).toLocaleDateString('fr-CH', { day: 'numeric', month: 'short' }) : 'Jamais'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <RealProTabs tabs={tabs} defaultTab="overview" />
    </div>
  );
}
