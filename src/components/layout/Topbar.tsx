import { useState } from 'react';
import { ChevronDown, LogOut, User, Globe } from 'lucide-react';
import { useI18n, type LanguageCode } from '../../lib/i18n';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { SearchBar } from '../ui/SearchBar';
import clsx from 'clsx';

export function Topbar() {
  const { t, language, setLanguage } = useI18n();
  const { user } = useCurrentUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'FR', label: 'Français' },
    { code: 'DE', label: 'Deutsch' },
    { code: 'EN', label: 'English' },
    { code: 'IT', label: 'Italiano' },
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between gap-4 px-6">
      <div className="flex items-center space-x-4 flex-1">
        <SearchBar placeholder="Rechercher un projet, lot, acheteur, entreprise..." />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Globe className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{language}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={clsx(
                    'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors',
                    {
                      'bg-blue-50 text-blue-700': language === lang.code,
                      'text-gray-700': language !== lang.code,
                    }
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              {user?.first_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
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
          )}
        </div>
      </div>
    </header>
  );
}
