import { useParams, Link } from 'react-router-dom';
import { Plus, Filter, Download, Users, Clock, FileText, CheckCircle } from 'lucide-react';
import { RealProCard } from '../components/realpro/RealProCard';
import { RealProButton } from '../components/realpro/RealProButton';
import { RealProTopbar } from '../components/realpro/RealProTopbar';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { CRMKanban } from '../components/crm';
import { useCRMPipeline } from '../hooks/useCRMPipeline';
import { useI18n } from '../lib/i18n';

export default function ProjectCRMPipeline() {
  const { t } = useI18n();
  const { projectId } = useParams<{ projectId: string }>();
  const { pipeline, loading, error, refetch } = useCRMPipeline(projectId!);

  if (loading) return <LoadingState message="Chargement du pipeline commercial..." />;
  if (error) return <ErrorState message={error} retry={refetch} />;
  if (!pipeline) return <ErrorState message="Aucune donnée disponible" retry={refetch} />;

  const totalContacts = Object.values(pipeline).reduce((sum, arr) => sum + arr.length, 0);

  const stats = [
    {
      label: 'Prospects',
      value: pipeline.prospect?.length || 0,
      icon: Users,
      gradient: 'from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-800',
      border: 'border-neutral-200 dark:border-neutral-700',
      textColor: 'text-neutral-900 dark:text-neutral-100',
      labelColor: 'text-neutral-600 dark:text-neutral-400',
      iconBg: 'bg-neutral-100 dark:bg-neutral-700',
      iconColor: 'text-neutral-600 dark:text-neutral-400',
    },
    {
      label: 'Réservés',
      value: pipeline.reserved?.length || 0,
      icon: Clock,
      gradient: 'from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20',
      border: 'border-amber-200 dark:border-amber-800',
      textColor: 'text-amber-900 dark:text-amber-100',
      labelColor: 'text-amber-700 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'En cours',
      value: pipeline.in_progress?.length || 0,
      icon: FileText,
      gradient: 'from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-800/20',
      border: 'border-brand-200 dark:border-brand-800',
      textColor: 'text-brand-900 dark:text-brand-100',
      labelColor: 'text-brand-700 dark:text-brand-400',
      iconBg: 'bg-brand-100 dark:bg-brand-900/30',
      iconColor: 'text-brand-600 dark:text-brand-400',
    },
    {
      label: 'Signés',
      value: pipeline.signed?.length || 0,
      icon: CheckCircle,
      gradient: 'from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20',
      border: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-900 dark:text-green-100',
      labelColor: 'text-green-700 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
  ];

  const subtitle = `${totalContacts} contact${totalContacts !== 1 ? 's' : ''} au total`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <RealProTopbar
        title={t('crm.pipeline')}
        subtitle={subtitle}
        actions={
          <div className="flex items-center gap-3">
            <RealProButton variant="outline">
              <Filter className="w-4 h-4" />
              Filtrer
            </RealProButton>
            <RealProButton variant="outline">
              <Download className="w-4 h-4" />
              Exporter
            </RealProButton>
            <Link to={`/projects/${projectId}/crm/prospects/new`}>
              <RealProButton variant="primary">
                <Plus className="w-4 h-4" />
                Ajouter un prospect
              </RealProButton>
            </Link>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`p-5 bg-gradient-to-br ${stat.gradient} rounded-xl border ${stat.border} shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${stat.labelColor}`}>{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion funnel info */}
      <RealProCard padding="md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {pipeline.prospect?.length || 0}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Prospects</p>
            </div>
            <div className="text-neutral-300 dark:text-neutral-600">→</div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {pipeline.reserved?.length || 0}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Réservations</p>
            </div>
            <div className="text-neutral-300 dark:text-neutral-600">→</div>
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                {pipeline.in_progress?.length || 0}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">En cours</p>
            </div>
            <div className="text-neutral-300 dark:text-neutral-600">→</div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {pipeline.signed?.length || 0}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Signés</p>
            </div>
          </div>

          {totalContacts > 0 && (
            <div className="text-right">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Taux de conversion global</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {((pipeline.signed?.length || 0) / totalContacts * 100).toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      </RealProCard>

      {/* Kanban Board */}
      <CRMKanban pipeline={pipeline} projectId={projectId!} />
    </div>
  );
}
