interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info';
}

interface ProjectHealthProps {
  health: {
    risks: Risk[];
    alerts: Alert[];
  };
}

export default function ProjectHealth({ health }: ProjectHealthProps) {
  return (
    <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-4">
      <h3 className="font-semibold text-lg text-neutral-900">Santé du Projet</h3>

      {health.risks.length === 0 && health.alerts.length === 0 && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
          <p className="text-sm text-green-700">Aucun risque ou alerte détecté</p>
        </div>
      )}

      {health.risks.map((r) => (
        <div key={r.id} className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <span className="text-red-500 mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-medium text-red-900">{r.title}</p>
              <p className="text-sm text-red-700 mt-1">{r.description}</p>
              <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                {r.severity === 'high' ? 'Critique' : r.severity === 'medium' ? 'Moyen' : 'Faible'}
              </span>
            </div>
          </div>
        </div>
      ))}

      {health.alerts.map((a) => (
        <div key={a.id} className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
          <div className="flex items-start gap-3">
            <span className="text-yellow-600 mt-0.5">⚡</span>
            <div className="flex-1">
              <p className="font-medium text-yellow-900">{a.title}</p>
              <p className="text-sm text-yellow-700 mt-1">{a.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
