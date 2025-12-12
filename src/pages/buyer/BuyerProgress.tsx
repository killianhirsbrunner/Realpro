import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingState } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { supabase } from '../../lib/supabase';
import { formatDateCH } from '../../lib/utils/format';
import { getStatusLabel } from '../../lib/constants/status-labels';

interface BuyerProgressData {
  project: {
    name: string;
  };
  lot: {
    lot_number: string;
  };
  progress_pct: number;
  phases: Array<{
    id: string;
    name: string;
    status: string;
    planned_start_date: string | null;
    planned_end_date: string | null;
  }>;
  updates: Array<{
    id: string;
    created_at: string;
    message: string;
  }>;
}

export function BuyerProgress() {
  const { buyerId } = useParams<{ buyerId: string }>();
  const [data, setData] = useState<BuyerProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (buyerId) {
      fetchProgress(buyerId);
    }
  }, [buyerId]);

  async function fetchProgress(id: string) {
    try {
      setLoading(true);
      setError(null);

      // Fetch buyer with project info
      const { data: buyer, error: buyerError } = await supabase
        .from('buyers')
        .select(`
          projects (name),
          lots (lot_number, project_id)
        `)
        .eq('id', id)
        .single();

      if (buyerError) throw buyerError;

      const projectId = buyer.lots?.project_id;

      // Fetch phases
      const { data: phases } = await supabase
        .from('project_phases')
        .select('id, name, status, planned_start_date, planned_end_date, progress_percent')
        .eq('project_id', projectId)
        .order('order_index');

      const avgProgress = phases && phases.length > 0
        ? phases.reduce((sum, p) => sum + (p.progress_percent || 0), 0) / phases.length
        : 0;

      // TODO: Fetch construction updates
      const updates: any[] = [];

      setData({
        project: { name: buyer.projects?.name || '' },
        lot: { lot_number: buyer.lots?.lot_number || '' },
        progress_pct: Math.round(avgProgress),
        phases: phases || [],
        updates,
      });
    } catch (err: any) {
      console.error('Error fetching progress:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingState message="Chargement..." />;
  if (error) return <ErrorState message={error} retry={() => fetchProgress(buyerId!)} />;
  if (!data) return <ErrorState message="Aucune donnée disponible" />;

  const { project, lot, progress_pct, phases, updates } = data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-neutral-900">
          Avancement du projet
        </h1>
        <p className="text-sm text-neutral-500">
          {project.name} · Appartement {lot.lot_number}
        </p>
      </header>

      {/* Overall Progress */}
      <section className="space-y-2 rounded-2xl border bg-white px-4 py-4">
        <p className="text-sm font-medium text-neutral-900">
          Avancement global : {progress_pct} %
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${Math.min(100, progress_pct)}%` }}
          />
        </div>
        <p className="text-xs text-neutral-500">
          Ce pourcentage représente l'avancement global estimé du projet.
        </p>
      </section>

      {/* Phases */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-900">Grandes étapes</h2>
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="min-w-full text-xs">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  Phase
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  Prévu
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {phases.map((p) => (
                <tr key={p.id}>
                  <td className="px-3 py-2 align-middle">{p.name}</td>
                  <td className="px-3 py-2 align-middle">
                    {formatDateRange(p.planned_start_date, p.planned_end_date)}
                  </td>
                  <td className="px-3 py-2 align-middle">
                    <PhaseStatusPill status={p.status} />
                  </td>
                </tr>
              ))}
              {phases.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-center text-sm text-neutral-500">
                    Les phases du projet n'ont pas encore été définies.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Updates */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-900">
          Dernières nouvelles chantier
        </h2>
        {updates.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Aucune actualité n'a encore été publiée. Vous serez informé dès
            qu'une étape importante sera franchie.
          </p>
        ) : (
          <ul className="space-y-3 text-sm">
            {updates.map((u) => (
              <li key={u.id} className="rounded-2xl border bg-white px-4 py-3">
                <p className="text-xs text-neutral-500 mb-1">
                  {formatDateCH(u.created_at)}
                </p>
                <p className="text-neutral-900">{u.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function PhaseStatusPill({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  let label = getStatusLabel('phase', status);
  let styles = 'bg-neutral-100 text-neutral-700';

  if (normalized === 'NOT_STARTED' || normalized === 'PLANNED') {
    styles = 'bg-slate-50 text-slate-700';
  } else if (normalized === 'IN_PROGRESS') {
    styles = 'bg-amber-50 text-amber-700';
  } else if (normalized === 'COMPLETED') {
    styles = 'bg-emerald-50 text-emerald-700';
  } else if (normalized === 'DELAYED') {
    styles = 'bg-red-50 text-red-700';
  }

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}

function formatDateRange(
  startIso: string | null | undefined,
  endIso: string | null | undefined
): string {
  if (!startIso && !endIso) return '—';
  if (startIso && !endIso) return `Dès le ${formatDateCH(startIso)}`;
  if (!startIso && endIso) return `Jusqu'au ${formatDateCH(endIso)}`;
  return `${formatDateCH(startIso!)} – ${formatDateCH(endIso!)}`;
}
