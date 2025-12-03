import { useEffect, useState } from 'react';
import { TrendingUp, Building2, FileText, Users, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

type ProjectRow = {
  id: string;
  name: string;
  city?: string | null;
  status: string;
  type: string;
  lots: {
    total: number;
    sold: number;
    reserved: number;
    free: number;
  };
  cfc: {
    budget: number;
    engagement: number;
    invoiced: number;
    paid: number;
  };
  soldRatio: number;
};

type OverviewResponse = {
  projectsSummary: {
    totalProjects: number;
    byStatus: {
      planning: number;
      sales: number;
      construction: number;
      delivered: number;
    };
  };
  salesSummary: {
    totalLots: number;
    totalSalesChf: number;
  };
  buyerFilesSummary: {
    total: number;
    readyForNotary: number;
    signed: number;
  };
  submissionsSummary: {
    total: number;
    inProgress: number;
    adjudicated: number;
  };
  projects: ProjectRow[];
};

export function ReportingOverview() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const organizationId = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    loadData();
  }, [organizationId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/reporting`;

      const response = await fetch(`${apiUrl}/organization/overview`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du reporting');
      }

      const json = await response.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger le reporting');
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
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Reporting multi-projets
        </h1>
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error || 'Impossible de charger le reporting'}</p>
          </div>
        </Card>
      </div>
    );
  }

  const { projectsSummary, salesSummary, buyerFilesSummary, submissionsSummary, projects } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Direction · Vue multi-projets
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">
            Reporting multi-projets
          </h1>
          <p className="text-sm text-gray-500">
            Synthèse de votre portefeuille : ventes, CFC, dossiers notaire, soumissions
          </p>
        </div>
        <Button onClick={loadData} variant="secondary">
          Actualiser
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Building2 className="w-5 h-5 text-blue-600" />}
          label="Projets actifs"
          value={projectsSummary.totalProjects}
          helper={`${projectsSummary.byStatus.sales} en vente · ${projectsSummary.byStatus.construction} en chantier`}
        />
        <KpiCard
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          label="Lots vendus"
          value={salesSummary.totalLots}
          helper={`Total ventes ≈ ${formatCurrency(salesSummary.totalSalesChf)}`}
        />
        <KpiCard
          icon={<FileText className="w-5 h-5 text-purple-600" />}
          label="Dossiers notaire"
          value={`${buyerFilesSummary.signed}/${buyerFilesSummary.total}`}
          helper={`${buyerFilesSummary.readyForNotary} prêts pour notaire`}
        />
        <KpiCard
          icon={<Users className="w-5 h-5 text-orange-600" />}
          label="Soumissions"
          value={submissionsSummary.inProgress}
          helper={`${submissionsSummary.adjudicated} adjudiquées`}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">
          Projets de l'organisation
        </h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Projet
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Lots (vendus/total)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Budget CFC
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Engagé
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Facturé
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Payé
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{p.name}</span>
                        <span className="text-xs text-gray-500">
                          {p.city || '—'} · {renderStatusLabel(p.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-medium text-gray-900 tabular-nums">
                          {p.lots.sold}/{p.lots.total}
                        </span>
                        <span className="text-xs text-gray-500">
                          {(p.soldRatio * 100).toFixed(0)}% vendus
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-gray-900 tabular-nums">
                      {formatCurrency(p.cfc.budget)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right tabular-nums text-gray-600">
                      {formatCurrency(p.cfc.engagement)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right tabular-nums text-gray-600">
                      {formatCurrency(p.cfc.invoiced)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right tabular-nums text-gray-600">
                      {formatCurrency(p.cfc.paid)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun projet
              </h3>
              <p className="text-sm text-gray-500">
                Les projets apparaîtront ici une fois créés
              </p>
            </div>
          )}
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  helper?: string;
}) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900 tabular-nums">
            {value}
          </p>
          {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  let label = status;
  let variant: 'success' | 'warning' | 'danger' | 'default' = 'default';

  if (s === 'SALES') {
    label = 'Vente';
    variant = 'success';
  } else if (s === 'CONSTRUCTION') {
    label = 'Chantier';
    variant = 'warning';
  } else if (s === 'PLANNING') {
    label = 'Planification';
    variant = 'default';
  } else if (s === 'DELIVERED') {
    label = 'Livré';
    variant = 'success';
  }

  return <Badge variant={variant}>{label}</Badge>;
}

function renderStatusLabel(status: string): string {
  const s = status.toUpperCase();
  if (s === 'SALES') return 'En vente';
  if (s === 'CONSTRUCTION') return 'En chantier';
  if (s === 'PLANNING') return 'En planification';
  if (s === 'DELIVERED') return 'Livré';
  return status;
}

function formatCurrency(amount: number): string {
  if (amount === 0) return 'CHF —';
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
