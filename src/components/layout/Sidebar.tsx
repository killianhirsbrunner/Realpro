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
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import clsx from 'clsx';

interface SidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function Sidebar({ currentPath = '/dashboard', onNavigate }: SidebarProps) {
  const { t } = useI18n();

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.projects'), href: '/projects', icon: Building2 },
    { name: t('nav.lots'), href: '/lots', icon: Grid3x3 },
    { name: t('nav.crm'), href: '/crm', icon: Users },
    { name: t('nav.finance'), href: '/finance', icon: DollarSign },
    { name: t('nav.documents'), href: '/documents', icon: FolderOpen },
    { name: t('nav.construction'), href: '/construction', icon: Hammer },
    { name: t('nav.settings'), href: '/settings', icon: Settings },
    { name: t('nav.billing'), href: '/billing', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Building2 className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">PropTech</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath.startsWith(item.href);

          return (
            <button
              key={item.name}
              onClick={() => onNavigate?.(item.href)}
              className={clsx(
                'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                {
                  'bg-blue-50 text-blue-700': isActive,
                  'text-gray-700 hover:bg-gray-50': !isActive,
                }
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
