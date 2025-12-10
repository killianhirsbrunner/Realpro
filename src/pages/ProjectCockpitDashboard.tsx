import { Link, useParams } from 'react-router-dom';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Calendar,
  Grid3x3,
  ArrowRight,
  AlertCircle,
  MessageSquare,
  FolderOpen,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';
import ProjectExportPanel from '../components/ProjectExportPanel';
import { DeadlineCard } from '../components/dashboard/DeadlineCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { useProjectDashboard } from '../hooks/useProjectDashboard';

export function ProjectCockpitDashboard() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, loading, error } = useProjectDashboard(projectId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error?.message || 'Données introuvables'}</p>
          </div>
        </Card>
      </div>
    );
  }

  const { project, sales, finance, planning, notary, submissions, deadlines, recentDocuments, recentMessages } = data;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <header className="space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
            <Building2 className="w-4 h-4" />
            <span>Cockpit Projet</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                {project.name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <span>{project.city || '—'}</span>
                <span>·</span>
                <span>{project.canton || '—'}</span>
                <span>·</span>
                <Badge variant={getStatusVariant(project.status)}>
                  {formatStatus(project.status)}
                </Badge>
                {project.type && (
                  <>
                    <span>·</span>
                    <span>{project.type}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={<Grid3x3 className="w-5 h-5" />}
            label="Ventes"
            value={`${sales.lotsSold}/${sales.lotsTotal}`}
            helper={`${sales.lotsReserved} réservés · ${sales.lotsFree} disponibles`}
            variant="default"
          />
          <KpiCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Budget CFC"
            value={formatCurrency(finance.cfcBudget)}
            helper={`Engagé: ${formatCurrency(finance.cfcEngaged)}`}
            variant="success"
          />
          <KpiCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Avancement"
            value={`${planning.progressPct}%`}
            helper={
              planning.nextMilestone
                ? `Prochaine étape: ${planning.nextMilestone.name}`
                : 'Aucune étape planifiée'
            }
            variant="warning"
          />
          <KpiCard
            icon={<FileText className="w-5 h-5" />}
            label="Dossiers notaire"
            value={`${notary.signed}/${notary.buyerFilesTotal}`}
            helper={`${notary.readyForNotary} prêts pour signature`}
            variant="default"
          />
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ModuleCard
            title="Ventes & lots"
            description="Suivi des lots, réservations et ventes signées"
            icon={<Grid3x3 className="w-5 h-5" />}
            link={`/projects/${project.id}/lots`}
            stats={[
              { label: 'Vendus', value: sales.lotsSold },
              { label: 'Réservés', value: sales.lotsReserved },
              { label: 'Libres', value: sales.lotsFree },
            ]}
          />

          <ModuleCard
            title="Finance & CFC"
            description="Budget, engagements, facturation et paiements"
            icon={<DollarSign className="w-5 h-5" />}
            link={`/projects/${project.id}/finance`}
            stats={[
              { label: 'Facturé', value: formatCurrency(finance.cfcInvoiced) },
              { label: 'Payé', value: formatCurrency(finance.cfcPaid) },
            ]}
          />

          <ModuleCard
            title="Planning chantier"
            description="Phases du chantier, jalons et suivi avancement"
            icon={<Calendar className="w-5 h-5" />}
            link={`/projects/${project.id}/planning`}
            stats={[
              { label: 'Avancement', value: `${planning.progressPct}%` },
            ]}
          />

          <ModuleCard
            title="Acheteurs"
            description="Dossiers acheteurs, documents et historique"
            icon={<Users className="w-5 h-5" />}
            link={`/projects/${project.id}/buyers`}
            stats={[
              { label: 'Prêts', value: notary.readyForNotary },
              { label: 'Signés', value: notary.signed },
            ]}
          />

          <ModuleCard
            title="Soumissions"
            description="Appels d'offres, comparatifs et adjudications"
            icon={<FileText className="w-5 h-5" />}
            link={`/projects/${project.id}/submissions`}
            stats={[
              { label: 'En cours', value: submissions.open },
              { label: 'Adjudiquées', value: submissions.adjudicated },
            ]}
          />

          <ModuleCard
            title="Choix matériaux"
            description="Suivi des choix acquéreurs et rendez-vous"
            icon={<Building2 className="w-5 h-5" />}
            link={`/projects/${project.id}/materials`}
            stats={[]}
          />
        </section>

        {deadlines.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                Échéances importantes
              </h2>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {deadlines.length} échéance{deadlines.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {deadlines.slice(0, 8).map((deadline) => (
                <DeadlineCard key={deadline.id} deadline={deadline} />
              ))}
            </div>
          </section>
        )}

        <section className="grid gap-5 lg:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Progression ventes
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Lots vendus</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {sales.lotsSold} / {sales.lotsTotal}
                </span>
              </div>
              <div className="w-full h-4 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all"
                  style={{
                    width: `${sales.lotsTotal > 0 ? (sales.lotsSold / sales.lotsTotal) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3">
                <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Vendus</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{sales.lotsSold}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Réservés</div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{sales.lotsReserved}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Libres</div>
                  <div className="text-2xl font-bold text-neutral-600 dark:text-neutral-400">{sales.lotsFree}</div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Budget CFC
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Payé</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(finance.cfcPaid)} / {formatCurrency(finance.cfcBudget)}
                </span>
              </div>
              <div className="w-full h-4 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all"
                  style={{
                    width: `${finance.cfcBudget > 0 ? (finance.cfcPaid / finance.cfcBudget) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3">
                <div className="text-center p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Engagé</div>
                  <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(finance.cfcEngaged)}
                  </div>
                </div>
                <div className="text-center p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Facturé</div>
                  <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(finance.cfcInvoiced)}
                  </div>
                </div>
                <div className="text-center p-3 rounded-lg bg-brand-50 dark:bg-brand-950/30">
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Payé</div>
                  <div className="text-sm font-bold text-brand-600 dark:text-brand-400">
                    {formatCurrency(finance.cfcPaid)}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Documents récents
                </h3>
              </div>
              <Link
                to={`/projects/${project.id}/documents`}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                Voir tout
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentDocuments.length > 0 ? (
                recentDocuments.map((doc) => (
                  <Link
                    key={doc.id}
                    to={`/projects/${project.id}/documents/${doc.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        {format(new Date(doc.uploaded_at), 'dd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  </Link>
                ))
              ) : (
                <p className="text-sm text-neutral-500 dark:text-neutral-500 text-center py-8">
                  Aucun document récent
                </p>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Messages récents
                </h3>
              </div>
              <Link
                to={`/projects/${project.id}/messages`}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                Voir tout
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentMessages.length > 0 ? (
                recentMessages.map((msg) => (
                  <Link
                    key={msg.id}
                    to={`/projects/${project.id}/messages?thread=${msg.thread_id}`}
                    className="block p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {msg.sender_name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        {format(new Date(msg.created_at), 'dd MMM', { locale: fr })}
                      </p>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {msg.content}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-neutral-500 dark:text-neutral-500 text-center py-8">
                  Aucun message récent
                </p>
              )}
            </div>
          </Card>
        </section>

        <QuickActions projectId={project.id} />

        <ProjectExportPanel projectId={projectId || ''} />
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  helper,
  variant = 'default',
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  helper?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}) {
  const bgColors = {
    default: 'bg-neutral-50 dark:bg-neutral-900',
    success: 'bg-green-50 dark:bg-green-950/30',
    warning: 'bg-amber-50 dark:bg-amber-950/30',
    danger: 'bg-red-50 dark:bg-red-950/30',
  };

  const iconColors = {
    default: 'text-neutral-600 dark:text-neutral-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-amber-600 dark:text-amber-400',
    danger: 'text-red-600 dark:text-red-400',
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2.5 rounded-xl ${bgColors[variant]}`}>
              <div className={iconColors[variant]}>{icon}</div>
            </div>
            <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium">
              {label}
            </p>
          </div>
          <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums mb-1">
            {value}
          </p>
          {helper && (
            <p className="text-xs text-neutral-500 dark:text-neutral-500">{helper}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

function ModuleCard({
  title,
  description,
  icon,
  link,
  stats,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  stats: { label: string; value: string | number }[];
}) {
  return (
    <Link
      to={link}
      className="group block rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-xl transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {icon}
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">{description}</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
      {stats.length > 0 && (
        <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-xs">
              <span className="text-neutral-500 dark:text-neutral-500">{stat.label}: </span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}

function getStatusVariant(status: string): 'default' | 'success' | 'warning' | 'danger' {
  const s = status.toUpperCase();
  if (s === 'DELIVERED' || s === 'COMPLETED') return 'success';
  if (s === 'CONSTRUCTION' || s === 'SELLING') return 'warning';
  if (s === 'PLANNING') return 'default';
  return 'default';
}

function formatStatus(status: string): string {
  const s = status.toUpperCase();
  if (s === 'PLANNING') return 'Planification';
  if (s === 'SALES' || s === 'SELLING') return 'En vente';
  if (s === 'CONSTRUCTION') return 'En chantier';
  if (s === 'DELIVERED' || s === 'COMPLETED') return 'Livré';
  return status;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}
