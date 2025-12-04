import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganizationContext } from '../contexts/OrganizationContext';
import { Building2, Check, ChevronDown, Plus } from 'lucide-react';

export function ProjectSelector() {
  const { currentProject, projects, setCurrentProject } = useOrganizationContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (projects.length === 0) {
    return (
      <button
        onClick={() => navigate('/projects/new')}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-primary-700 dark:text-primary-400 text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Créer un projet
      </button>
    );
  }

  const statusColors: Record<string, string> = {
    PLANNING: 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400',
    CONSTRUCTION: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    SELLING: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    COMPLETED: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400',
    ARCHIVED: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-500',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors w-full"
      >
        {currentProject?.image_url ? (
          <img
            src={currentProject.image_url}
            alt={currentProject.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-neutral-400" />
          </div>
        )}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {currentProject?.name || 'Sélectionner un projet'}
          </p>
          {currentProject && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {currentProject.city} • {currentProject.code}
            </p>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
          <div className="p-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  setCurrentProject(project);
                  setIsOpen(false);
                  navigate(`/dashboard/projects/${project.id}`);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 w-full transition-colors"
              >
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-neutral-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {project.name}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[project.status] || statusColors.PLANNING}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {project.city} • {project.code}
                  </p>
                </div>
                {project.id === currentProject?.id && (
                  <Check className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/projects/new');
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 w-full transition-colors text-primary-700 dark:text-primary-400 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Nouveau projet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
