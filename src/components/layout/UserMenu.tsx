import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  LogOut,
  Building2,
  CreditCard,
  HelpCircle,
  ChevronRight,
  Shield,
  Bell,
} from 'lucide-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { supabase } from '../../lib/supabase';
import clsx from 'clsx';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, profile } = useCurrentUser();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      navigate('/auth/login');
    } catch (error) {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    {
      label: 'Mon profil',
      description: 'Informations personnelles',
      icon: User,
      href: '/settings/profile',
    },
    {
      label: 'Organisation',
      description: 'Gerer votre entreprise',
      icon: Building2,
      href: '/settings/organization',
    },
    {
      label: 'Notifications',
      description: 'Preferences de notifications',
      icon: Bell,
      href: '/notifications',
    },
    {
      label: 'Facturation',
      description: 'Abonnement et paiements',
      icon: CreditCard,
      href: '/billing',
    },
    {
      label: 'Securite',
      description: 'Mot de passe et connexion',
      icon: Shield,
      href: '/settings/security',
    },
  ];

  const secondaryItems = [
    {
      label: 'Parametres',
      icon: Settings,
      href: '/settings',
    },
    {
      label: 'Aide et support',
      icon: HelpCircle,
      href: '/help',
    },
  ];

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) return firstName.slice(0, 2).toUpperCase();
    return 'U';
  };

  const getFullName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) return profile.first_name;
    return 'Utilisateur';
  };

  const getRoleLabel = (role?: string) => {
    const labels: Record<string, string> = {
      PROMOTER: 'Promoteur',
      ADMIN: 'Administrateur',
      BROKER: 'Courtier',
      BUYER: 'Acheteur',
      NOTARY: 'Notaire',
      EG: 'Entreprise generale',
      ARCHITECT: 'Architecte',
    };
    return labels[role || ''] || role || 'Utilisateur';
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'relative p-1 rounded-full transition-all duration-200',
          'hover:ring-2 hover:ring-brand-500/30',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/50',
          isOpen && 'ring-2 ring-brand-500/50'
        )}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center text-sm font-semibold shadow-md">
          {getInitials(profile?.first_name, profile?.last_name)}
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-neutral-900 rounded-full" />
      </button>

      <div
        className={clsx(
          'absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50',
          'transition-all duration-200 origin-top-right',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        )}
      >
        <div className="p-4 bg-gradient-to-br from-brand-500 to-brand-600">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-lg font-semibold">
              {getInitials(profile?.first_name, profile?.last_name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white truncate">
                {getFullName()}
              </div>
              <div className="text-sm text-white/80 truncate">
                {profile?.email}
              </div>
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  {getRoleLabel(profile?.role ?? undefined)}
                </span>
              </div>
            </div>
          </div>
        </div>

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
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 transition-colors">
                  <Icon className="h-4.5 w-4.5 text-neutral-600 dark:text-neutral-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {item.label}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {item.description}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>

        <div className="px-2 pb-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex gap-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    navigate(item.href);
                    setIsOpen(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-2 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={clsx(
              'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
              'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
              'text-neutral-700 dark:text-neutral-300',
              'hover:bg-red-50 hover:border-red-200 hover:text-red-600',
              'dark:hover:bg-red-900/20 dark:hover:border-red-800 dark:hover:text-red-400',
              'focus:outline-none focus:ring-2 focus:ring-red-500/50',
              isLoggingOut && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isLoggingOut ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Deconnexion...</span>
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                <span>Se deconnecter</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
