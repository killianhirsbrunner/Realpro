import { useState } from 'react';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { SearchBar } from '../ui/SearchBar';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { ThemeToggle } from '../ThemeToggle';
import clsx from 'clsx';

export function Topbar() {
  const { t } = useI18n();
  const { user } = useCurrentUser();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4 px-6 transition-colors">
      <div className="flex items-center space-x-4 flex-1">
        <SearchBar placeholder={t('actions.search') + '...'} />
      </div>

      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <LanguageSwitcher />

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-medium">
              {user?.first_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors">
                <User className="w-4 h-4" />
                <span>{t('settings.profile')}</span>
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors">
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
