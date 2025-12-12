interface ConstructionSection {
  id: string;
  name: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  startDate?: string;
  endDate?: string;
}

interface ProjectConstructionSummaryProps {
  construction: {
    overallProgress: number;
    sections: ConstructionSection[];
  };
}

const statusColors = {
  not_started: { bg: 'bg-neutral-100', text: 'text-neutral-700', label: 'Non démarré' },
  in_progress: { bg: 'bg-brand-100', text: 'text-brand-700', label: 'En cours' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Terminé' },
  delayed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Retard' },
};

export default function ProjectConstructionSummary({ construction }: ProjectConstructionSummaryProps) {
  return (
    <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-neutral-900">Chantier</h3>
        <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold">
          {construction.overallProgress}%
        </span>
      </div>

      <div className="w-full bg-neutral-200 rounded-full h-4">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
          style={{ width: `${construction.overallProgress}%` }}
        />
      </div>

      <div className="space-y-4">
        {construction.sections.map((section) => {
          const statusStyle = statusColors[section.status];
          return (
            <div key={section.id} className="p-4 bg-neutral-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-neutral-900">{section.name}</p>
                <span className={`px-2 py-1 ${statusStyle.bg} ${statusStyle.text} rounded text-xs font-medium`}>
                  {statusStyle.label}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Avancement</span>
                <span className="font-semibold text-neutral-900">{section.progress}%</span>
              </div>

              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    section.status === 'delayed' ? 'bg-red-500' : 'bg-brand-500'
                  }`}
                  style={{ width: `${section.progress}%` }}
                />
              </div>

              {(section.startDate || section.endDate) && (
                <div className="flex gap-4 text-xs text-neutral-500 mt-2">
                  {section.startDate && <span>Début: {section.startDate}</span>}
                  {section.endDate && <span>Fin: {section.endDate}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
