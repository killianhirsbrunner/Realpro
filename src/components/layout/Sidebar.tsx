import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Grid3x3,
  Users,
  DollarSign,
  FolderOpen,
  Hammer,
  Settings,
  CreditCard,
  FileText,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { RealProLogo } from '../branding/RealProLogo';
import clsx from 'clsx';

export function Sidebar() {
  const { t } = useI18n();
  const location = useLocation();

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.projects'), href: '/projects', icon: Building2 },
    { name: 'Promoteur', href: '/promoter', icon: TrendingUp },
    { name: 'Courtiers', href: '/broker', icon: Users },
    { name: t('nav.documents'), href: '/documents', icon: FolderOpen },
    { name: 'Soumissions', href: '/submissions', icon: FileText },
    { name: 'Chantier', href: '/chantier', icon: Hammer },
    { name: 'SAV', href: '/sav', icon: Wrench },
    { name: t('nav.billing'), href: '/billing', icon: CreditCard },
    { name: t('nav.settings'), href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full border-r border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl flex flex-col">
      <div className="p-4">
        <Link to="/dashboard" className="block">
          <RealProLogo width={200} height={66} />
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href ||
                          (item.href !== '/dashboard' && location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                'hover:scale-[1.02] active:scale-[0.98]',
                {
                  'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm': isActive,
                  'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200': !isActive,
                }
              )}
            >
              <Icon className={clsx('h-4 w-4', {
                'text-primary-600 dark:text-primary-400': isActive,
              })} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
          © 2024 Realpro SA
        </div>
      </div>
    </aside>
  );
}
