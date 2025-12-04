import { useEffect, useState } from 'react';
import { Calendar, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

type PhaseDto = {
  id: string;
  name: string;
  plannedStart?: string | null;
  plannedEnd?: string | null;
  actualStart?: string | null;
  actualEnd?: string | null;
  status: string;
  order: number;
};

type PlanningResponse = {
  progressPct: number;
  start?: string | null;
  end?: string | null;
  phases: PhaseDto[];
};

export function ProjectPlanning() {
  const [data, setData] = useState<PlanningResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectId = '10000000-0000-0000-0000-000000000001';
  const organizationId = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/planning`;

      const response = await fetch(`${apiUrl}/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du planning');
      }

      const json = await response.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger le planning du projet');
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

  if (!data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-sm text-gray-500">Planning introuvable</p>
      </div>
    );
  }

  const { phases, start, end, progressPct } = data;
  const hasTimeline = start && end;

  const phasesInProgress = phases.filter(p => p.status === 'IN_PROGRESS').length;
  const phasesCompleted = phases.filter(p => p.status === 'COMPLETED').length;
  const phasesLate = phases.filter(p => p.status === 'LATE').length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-gray-400">
          Chantier · Planning
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">
          Planning du projet
        </h1>
        <p className="text-sm text-gray-500">
          Vue synthétique des phases du chantier avec diagramme de Gantt
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-brand-50">
              <TrendingUp className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Avancement</p>
              <p className="text-xl font-semibold text-gray-900 tabular-nums">
                {progressPct}%
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-50">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Terminées</p>
              <p className="text-xl font-semibold text-gray-900 tabular-nums">
                {phasesCompleted}/{phases.length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">En cours</p>
              <p className="text-xl font-semibold text-gray-900 tabular-nums">
                {phasesInProgress}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-50">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">En retard</p>
              <p className="text-xl font-semibold text-gray-900 tabular-nums">
                {phasesLate}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Progression globale
          </h2>
          <span className="text-sm font-medium text-gray-900 tabular-nums">
            {progressPct}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
          />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Diagramme de Gantt
          </h2>
          <Button variant="secondary" size="sm" onClick={loadData}>
            Actualiser
          </Button>
        </div>

        {!hasTimeline ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Planning en préparation
            </h3>
            <p className="text-sm text-gray-500">
              Les dates planifiées ne sont pas encore définies pour ce projet
            </p>
          </div>
        ) : (
          <GanttChart phases={phases} start={start} end={end} />
        )}
      </Card>

      {phases.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
            Liste des phases
          </h2>
          <div className="space-y-3">
            {phases.map((phase, index) => (
              <PhaseRow key={phase.id} phase={phase} index={index + 1} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function GanttChart({
  phases,
  start,
  end,
}: {
  phases: PhaseDto[];
  start: string;
  end: string;
}) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const totalMs = endDate.getTime() - startDate.getTime() || 1;

  const toPct = (dateIso?: string | null) => {
    if (!dateIso) return 0;
    const d = new Date(dateIso);
    const clamped = Math.min(
      endDate.getTime(),
      Math.max(startDate.getTime(), d.getTime())
    );
    return ((clamped - startDate.getTime()) / totalMs) * 100;
  };

  const generateMonthMarkers = () => {
    const markers: { label: string; position: number }[] = [];
    const current = new Date(startDate);
    current.setDate(1);

    while (current <= endDate) {
      const position = toPct(current.toISOString());
      const label = current.toLocaleDateString('fr-CH', {
        month: 'short',
        year: '2-digit',
      });
      markers.push({ label, position });

      current.setMonth(current.getMonth() + 1);
    }

    return markers;
  };

  const monthMarkers = generateMonthMarkers();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(start)}</span>
        <span>{formatDate(end)}</span>
      </div>

      <div className="relative">
        <div className="flex justify-between items-center h-6 mb-2 relative">
          {monthMarkers.map((marker, i) => (
            <div
              key={i}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${marker.position}%` }}
            >
              <div className="h-1 w-px bg-gray-300" />
              <span className="text-[10px] text-gray-400 mt-1">
                {marker.label}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3 mt-8">
          {phases.map((phase) => {
            const left = toPct(phase.plannedStart);
            const right = toPct(phase.plannedEnd);
            const width = Math.max(2, right - left);

            let barColor = 'bg-brand-500';
            if (phase.status === 'COMPLETED') barColor = 'bg-green-500';
            else if (phase.status === 'LATE') barColor = 'bg-red-500';
            else if (phase.status === 'IN_PROGRESS') barColor = 'bg-amber-500';

            return (
              <div key={phase.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-900 truncate max-w-[200px]">
                    {phase.name}
                  </span>
                  <PhaseStatusBadge status={phase.status} />
                </div>
                <div className="relative h-6 rounded-lg bg-gray-100">
                  <div
                    className={`absolute h-6 rounded-lg ${barColor} shadow-sm transition-all duration-300 hover:shadow-md`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    title={`${phase.name}\n${formatDate(phase.plannedStart || '')} - ${formatDate(phase.plannedEnd || '')}`}
                  />
                  {phase.actualStart && phase.actualEnd && (
                    <div
                      className="absolute h-6 rounded-lg bg-green-700 opacity-50"
                      style={{
                        left: `${toPct(phase.actualStart)}%`,
                        width: `${Math.max(2, toPct(phase.actualEnd) - toPct(phase.actualStart))}%`,
                      }}
                      title="Dates réelles"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-400" />
          <span className="text-gray-600">Non démarré</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500" />
          <span className="text-gray-600">En cours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span className="text-gray-600">Terminé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span className="text-gray-600">En retard</span>
        </div>
      </div>
    </div>
  );
}

function PhaseRow({ phase, index }: { phase: PhaseDto; index: number }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
        <span className="text-sm font-semibold text-brand-600">{index}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm">{phase.name}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
          {phase.plannedStart && phase.plannedEnd && (
            <>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(phase.plannedStart)} - {formatDate(phase.plannedEnd)}
              </span>
              <span>·</span>
              <span>{calculateDuration(phase.plannedStart, phase.plannedEnd)} jours</span>
            </>
          )}
        </div>
      </div>
      <PhaseStatusBadge status={phase.status} />
    </div>
  );
}

function PhaseStatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  let label = status;
  let variant: 'default' | 'success' | 'warning' | 'danger' = 'default';

  if (s === 'NOT_STARTED') {
    label = 'Non démarré';
    variant = 'default';
  } else if (s === 'IN_PROGRESS') {
    label = 'En cours';
    variant = 'warning';
  } else if (s === 'COMPLETED') {
    label = 'Terminé';
    variant = 'success';
  } else if (s === 'LATE') {
    label = 'En retard';
    variant = 'danger';
  }

  return <Badge variant={variant}>{label}</Badge>;
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  const date = new Date(iso);
  return date.toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function calculateDuration(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
