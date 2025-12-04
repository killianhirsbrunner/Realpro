import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, LogOut, User, Search, Bell } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { ThemeToggle } from '../ThemeToggle';
import { supabase } from '../../lib/supabase';
import clsx from 'clsx';

export function Topbar() {
  const { t } = useI18n();
  const { user } = useCurrentUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl flex items-center justify-between px-6 relative z-50">
      <div className="flex items-center gap-8 flex-1">
        <h1 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
          {pageTitle}
        </h1>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder={t('actions.search')}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-150"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="h-9 w-9 rounded-lg hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95">
          <Bell className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
        </button>

        <ThemeToggle />
        <LanguageSwitcher />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 h-9 px-2.5 rounded-lg hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 transition-all duration-150 hover:scale-105 active:scale-95"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-semibold">
              {user?.first_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <ChevronDown className={clsx('h-3.5 w-3.5 text-neutral-500 transition-transform duration-200', {
              'rotate-180': showUserMenu,
            })} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{user?.email}</p>
              </div>

              <div className="py-1">
                <button className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 flex items-center gap-3 transition-colors duration-150">
                  <User className="w-4 h-4" />
                  <span>{t('settings.profile')}</span>
                </button>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('auth.logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/projects/')) return 'Projet';
  if (pathname.startsWith('/broker')) return 'Espace Courtier';
  if (pathname.startsWith('/buyer')) return 'Espace Acheteur';
  if (pathname.startsWith('/promoter')) return 'Dashboard Promoteur';
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname === '/billing') return 'Facturation';
  if (pathname === '/chantier') return 'Chantier';
  return 'Realpro Suite';
}
