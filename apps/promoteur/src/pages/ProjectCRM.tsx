import { useParams, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Skeleton,
  EmptyState,
  Avatar,
} from '@realpro/ui';
import {
  Plus,
  Users,
  ArrowLeft,
  Mail,
  Phone,
  AlertCircle,
  Clock,
} from 'lucide-react';
import {
  PROSPECT_STATUS_LABELS,
  CRM_PIPELINE_STAGES,
  type ProspectStatus,
  getProspectFullName,
  getProspectInitials,
} from '@realpro/entities';
import { useProject } from '@/features/projects/hooks/useProjects';
import { usePipeline } from '@/features/crm/hooks/useCRM';

const STATUS_COLOR: Record<string, string> = {
  NEW: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
  CONTACTED: 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800',
  QUALIFIED: 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800',
  VISIT_SCHEDULED: 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
  VISIT_DONE: 'bg-violet-100 dark:bg-violet-900/30 border-violet-200 dark:border-violet-800',
  OFFER_SENT: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
  NEGOTIATION: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800',
};

const HEADER_COLOR: Record<string, string> = {
  NEW: 'bg-blue-500',
  CONTACTED: 'bg-cyan-500',
  QUALIFIED: 'bg-indigo-500',
  VISIT_SCHEDULED: 'bg-purple-500',
  VISIT_DONE: 'bg-violet-500',
  OFFER_SENT: 'bg-amber-500',
  NEGOTIATION: 'bg-orange-500',
};

export function ProjectCRMPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: pipeline, isLoading: pipelineLoading, error } = usePipeline(projectId);

  const isLoading = projectLoading || pipelineLoading;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex-shrink-0 w-72">
              <Skeleton className="h-10 w-full rounded-t-lg" />
              <div className="space-y-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-b-lg min-h-[400px]">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
          Erreur de chargement
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-md">
          Impossible de charger le pipeline CRM. Veuillez réessayer ultérieurement.
        </p>
      </div>
    );
  }

  const totalProspects = pipeline
    ? Object.values(pipeline).reduce((sum, arr) => sum + arr.length, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to={`/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {project?.name || 'Retour au projet'}
      </Link>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Pipeline CRM
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            {totalProspects} prospect{totalProspects !== 1 ? 's' : ''} actif{totalProspects !== 1 ? 's' : ''}
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Nouveau prospect
        </Button>
      </div>

      {/* Kanban Board */}
      {totalProspects === 0 ? (
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="Aucun prospect"
          description="Ajoutez votre premier prospect pour commencer à suivre votre pipeline commercial."
          action={
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Nouveau prospect
            </Button>
          }
        />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
          {CRM_PIPELINE_STAGES.map((stage) => {
            const prospects = pipeline?.[stage.id as keyof typeof pipeline] || [];

            return (
              <div key={stage.id} className="flex-shrink-0 w-72">
                {/* Column Header */}
                <div
                  className={`${HEADER_COLOR[stage.id]} text-white px-3 py-2 rounded-t-lg flex items-center justify-between`}
                >
                  <span className="font-medium text-sm">{stage.label}</span>
                  <Badge variant="neutral" size="sm" className="bg-white/20 text-white">
                    {prospects.length}
                  </Badge>
                </div>

                {/* Column Content */}
                <div
                  className={`${STATUS_COLOR[stage.id]} border-x border-b rounded-b-lg min-h-[400px] p-2 space-y-2`}
                >
                  {prospects.map((prospect) => (
                    <Link
                      key={prospect.id}
                      to={`/projects/${projectId}/crm/${prospect.id}`}
                    >
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <Avatar
                              name={getProspectFullName(prospect)}
                              initials={getProspectInitials(prospect)}
                              size="sm"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                                {getProspectFullName(prospect)}
                              </h4>

                              <div className="mt-1 space-y-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                {prospect.email && (
                                  <div className="flex items-center gap-1 truncate">
                                    <Mail className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{prospect.email}</span>
                                  </div>
                                )}
                                {prospect.phone && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="w-3 h-3 flex-shrink-0" />
                                    <span>{prospect.phone}</span>
                                  </div>
                                )}
                              </div>

                              {prospect.budget_max && (
                                <div className="mt-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                  Budget: {new Intl.NumberFormat('fr-CH', {
                                    style: 'currency',
                                    currency: 'CHF',
                                    maximumFractionDigits: 0,
                                  }).format(prospect.budget_max)}
                                </div>
                              )}

                              <div className="mt-2 flex items-center gap-1 text-xs text-neutral-400">
                                <Clock className="w-3 h-3" />
                                <span>{prospect.days_in_stage}j dans cette étape</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}

                  {prospects.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-sm text-neutral-400">
                      Aucun prospect
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
