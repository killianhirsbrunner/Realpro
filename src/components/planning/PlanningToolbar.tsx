import { useState } from 'react';
import { Plus, Download, Filter, Calendar, Flag, ListChecks } from 'lucide-react';

interface PlanningToolbarProps {
  onAddTask?: () => void;
  onAddMilestone?: () => void;
  onAddPhase?: () => void;
  onExport?: () => void;
  onFilterChange?: (filter: string) => void;
}

export function PlanningToolbar({
  onAddTask,
  onAddMilestone,
  onAddPhase,
  onExport,
  onFilterChange,
}: PlanningToolbarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { value: 'all', label: 'Toutes' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'delayed', label: 'En retard' },
    { value: 'completed', label: 'Terminées' },
  ];

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium flex items-center gap-2 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </button>

          {showMenu && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl z-50">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    onAddTask?.();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3"
                >
                  <ListChecks className="w-4 h-4 text-brand-600" />
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      Nouvelle tâche
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      Ajouter une tâche au planning
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onAddMilestone?.();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3"
                >
                  <Flag className="w-4 h-4 text-secondary-600" />
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      Nouveau jalon
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      Créer un jalon important
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onAddPhase?.();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3"
                >
                  <Calendar className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      Nouvelle phase
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      Créer une phase du projet
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onExport}
          className="px-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        <div className="flex items-center gap-1">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${activeFilter === filter.value
                  ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
