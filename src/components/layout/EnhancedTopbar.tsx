import { useState } from 'react';
import { ChevronDown, LogOut, User, Globe, Building2, Check } from 'lucide-react';
import { useI18n, type LanguageCode } from '../../lib/i18n';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useProjects } from '../../hooks/useProjects';
import { NotificationBell } from '../NotificationBell';
import clsx from 'clsx';

interface EnhancedTopbarProps {
  currentProjectId?: string | null;
  onProjectChange?: (projectId: string) => void;
}

export function EnhancedTopbar({ currentProjectId, onProjectChange }: EnhancedTopbarProps) {
  const { t, language, setLanguage } = useI18n();
  const { user } = useCurrentUser();
  const { projects } = useProjects();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'FR', label: 'Français' },
    { code: 'DE', label: 'Deutsch' },
    { code: 'EN', label: 'English' },
    { code: 'IT', label: 'Italiano' },
  ];

  const currentProject = projects?.find(p => p.id === currentProjectId);

  return (
    <header className="h-16 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between gap-4 px-6 relative z-50">
      <div className="flex items-center space-x-4">
        {projects && projects.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowProjectMenu(!showProjectMenu)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors min-w-[200px]"
            >
              <Building2 className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-900 truncate flex-1 text-left">
                {currentProject?.name || 'Sélectionner un projet'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </button>

            {showProjectMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProjectMenu(false)}
                />
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Vos projets
                    </p>
                  </div>
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        onProjectChange?.(project.id);
                        setShowProjectMenu(false);
                      }}
                      className={clsx(
                        'w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between',
                        {
                          'bg-brand-50': currentProjectId === project.id,
                        }
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={clsx(
                          'text-sm font-medium truncate',
                          {
                            'text-brand-700': currentProjectId === project.id,
                            'text-gray-900': currentProjectId !== project.id,
                          }
                        )}>
                          {project.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {project.city || '—'} · {project.status}
                        </p>
                      </div>
                      {currentProjectId === project.id && (
                        <Check className="w-4 h-4 text-brand-600 flex-shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <NotificationBell />

        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Globe className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">{language}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showLangMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowLangMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={clsx(
                      'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between',
                      {
                        'bg-brand-50 text-brand-700': language === lang.code,
                        'text-gray-700': language !== lang.code,
                      }
                    )}
                  >
                    <span>{lang.label}</span>
                    {language === lang.code && (
                      <Check className="w-4 h-4 text-brand-600" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-medium text-sm">
              {user?.first_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 leading-tight">{user?.email}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 hidden lg:block" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200 lg:hidden">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-colors">
                  <User className="w-4 h-4" />
                  <span>{t('nav.settings')}</span>
                </button>
                <div className="border-t border-gray-200 my-1" />
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span>{t('auth.logout')}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
