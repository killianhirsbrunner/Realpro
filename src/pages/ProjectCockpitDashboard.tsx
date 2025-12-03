import { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';

type ProjectCockpit = {
  project: {
    id: string;
    name: string;
    type: string;
    city?: string;
    canton?: string;
    status: string;
  };
  sales: {
    lotsTotal: number;
    lotsSold: number;
    lotsReserved: number;
    lotsFree: number;
  };
  finance: {
    cfcBudget: number;
    cfcEngaged: number;
    cfcInvoiced: number;
    cfcPaid: number;
  };
  planning: {
    progressPct: number;
    nextMilestone?: {
      name: string;
      plannedEnd: string;
    } | null;
  };
  notary: {
    buyerFilesTotal: number;
    readyForNotary: number;
    signed: number;
  };
  submissions: {
    open: number;
    adjudicated: number;
  };
};

interface ProjectCockpitDashboardProps {
  projectId: string;
}

export function ProjectCockpitDashboard({ projectId }: ProjectCockpitDashboardProps) {
  const [data, setData] = useState<ProjectCockpit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/project-dashboard`;

      const response = await fetch(`${apiUrl}/projects/${projectId}/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erreur lors du chargement');

      const json = await response.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger le cockpit projet');
    } finally {
      setLoading(false);
    }
  };

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
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error || 'Données introuvables'}</p>
          </div>
        </Card>
      </div>
    );
  }

  const { project, sales, finance, planning, notary, submissions } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
          <Building2 className="w-4 h-4" />
          <span>Cockpit Projet</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {project.name}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <span>{project.city || '—'}</span>
              <span>·</span>
              <span>{project.canton || '—'}</span>
              <span>·</span>
              <Badge variant={getStatusVariant(project.status)}>
                {formatStatus(project.status)}
              </Badge>
              <span>·</span>
              <span>{project.type}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ModuleCard
          title="Ventes & lots"
          description="Suivi des lots, réservations et ventes signées"
          icon={<Grid3x3 className="w-5 h-5" />}
          link={`/projects/${project.id}/broker/lots`}
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
          title="Notaire & acquéreurs"
          description="Dossiers acheteurs, actes et rendez-vous"
          icon={<Users className="w-5 h-5" />}
          link={`/projects/${project.id}/notary`}
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
          description="Suivi des choix acquéreurs et demandes"
          icon={<Building2 className="w-5 h-5" />}
          link={`/projects/${project.id}/materials`}
          stats={[
            { label: 'Catalogue', value: '—' },
          ]}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Progression ventes
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Lots vendus</span>
              <span className="font-semibold text-gray-900">
                {sales.lotsSold} / {sales.lotsTotal}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 rounded-full transition-all"
                style={{
                  width: `${sales.lotsTotal > 0 ? (sales.lotsSold / sales.lotsTotal) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="text-center">
                <div className="text-xs text-gray-500">Vendus</div>
                <div className="text-lg font-semibold text-green-600">{sales.lotsSold}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Réservés</div>
                <div className="text-lg font-semibold text-amber-600">{sales.lotsReserved}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Libres</div>
                <div className="text-lg font-semibold text-gray-600">{sales.lotsFree}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Budget CFC
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Payé</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(finance.cfcPaid)} / {formatCurrency(finance.cfcBudget)}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{
                  width: `${finance.cfcBudget > 0 ? (finance.cfcPaid / finance.cfcBudget) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="text-center">
                <div className="text-xs text-gray-500">Engagé</div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(finance.cfcEngaged)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Facturé</div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(finance.cfcInvoiced)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Payé</div>
                <div className="text-sm font-semibold text-blue-600">
                  {formatCurrency(finance.cfcPaid)}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
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
    default: 'bg-gray-50',
    success: 'bg-green-50',
    warning: 'bg-amber-50',
    danger: 'bg-red-50',
  };

  const iconColors = {
    default: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-amber-600',
    danger: 'text-red-600',
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className={`p-2 rounded-lg ${bgColors[variant]}`}>
              <div className={iconColors[variant]}>{icon}</div>
            </div>
            <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
              {label}
            </p>
          </div>
          <p className="text-2xl font-semibold text-gray-900 tabular-nums mt-2">
            {value}
          </p>
          {helper && (
            <p className="text-xs text-gray-500 mt-1">{helper}</p>
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
    <a
      href={link}
      className="group block rounded-2xl border border-gray-200 bg-white p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
      {stats.length > 0 && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-xs">
              <span className="text-gray-500">{stat.label}: </span>
              <span className="font-semibold text-gray-900">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </a>
  );
}

function getStatusVariant(status: string): 'default' | 'success' | 'warning' | 'danger' {
  const s = status.toUpperCase();
  if (s === 'DELIVERED') return 'success';
  if (s === 'CONSTRUCTION') return 'warning';
  if (s === 'PLANNING') return 'default';
  return 'default';
}

function formatStatus(status: string): string {
  const s = status.toUpperCase();
  if (s === 'PLANNING') return 'Planification';
  if (s === 'SALES') return 'En vente';
  if (s === 'CONSTRUCTION') return 'En chantier';
  if (s === 'DELIVERED') return 'Livré';
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
