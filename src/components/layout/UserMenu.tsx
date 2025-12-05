import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  LogOut,
  Building2,
  CreditCard,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { supabase } from '../../lib/supabase';
import clsx from 'clsx';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile } = useCurrentUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth/login');
  };

  const menuItems = [
    {
      label: 'Mon profil',
      icon: User,
      href: '/settings/profile',
    },
    {
      label: 'Mon organisation',
      icon: Building2,
      href: '/settings/organization',
    },
    {
      label: 'Facturation',
      icon: CreditCard,
      href: '/settings/billing',
    },
    {
      label: 'Paramètres',
      icon: Settings,
      href: '/settings',
    },
    {
      label: 'Aide',
      icon: HelpCircle,
      href: '/help',
    },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-medium">
          {getInitials(profile?.first_name || profile?.email)}
        </div>

        {/* Name (hidden on mobile) */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {profile?.first_name || 'Utilisateur'}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {profile?.email}
          </div>
        </div>

        <ChevronDown className={clsx(
          'h-4 w-4 text-neutral-500 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl-premium z-20">
            {/* User Info */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="font-medium text-neutral-900 dark:text-neutral-100">
                {profile?.first_name} {profile?.last_name}
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {profile?.email}
              </div>
              {profile?.role && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                    {profile.role}
                  </span>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      navigate(item.href);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Logout */}
            <div className="p-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
