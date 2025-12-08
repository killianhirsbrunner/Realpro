import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  FolderOpen,
  Hammer,
  Settings,
  CreditCard,
  FileText,
  TrendingUp,
  Wrench,
  BarChart3,
  MessageSquare,
  Bell,
  ClipboardList,
  Shield,
  ChevronDown,
  ChevronRight,
  Activity,
  PieChart,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { RealProLogo } from '../branding/RealProLogo';
import { useOrganizationContext } from '../../contexts/OrganizationContext';
import clsx from 'clsx';
import { useState } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  children?: NavItem[];
}

export function Sidebar() {
  const { t } = useI18n();
  const location = useLocation();
  const { currentOrganization } = useOrganizationContext();
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Projets',
      href: '/projects',
      icon: Building2
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      badge: 'NEW'
    },
    {
      name: 'Reporting',
      href: '/reporting',
      icon: PieChart
    },
    {
      name: 'Promoteur',
      href: '/promoter',
      icon: TrendingUp
    },
    {
      name: 'Courtiers',
      href: '/broker',
      icon: Users
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquare
    },
    {
      name: 'Chantier',
      href: '/chantier',
      icon: Hammer
    },
    {
      name: 'SAV',
      href: '/sav',
      icon: Wrench
    },
    {
      name: 'Soumissions',
      href: '/submissions',
      icon: FileText
    },
    {
      name: 'Taches',
      href: '/tasks',
      icon: ClipboardList
    },
    {
      name: 'Facturation',
      href: '/billing',
      icon: CreditCard
    },
  ];

  const administrationItems: NavItem[] = [
    {
      name: 'Parametres',
      href: '/settings',
      icon: Settings
    },
    {
      name: 'Organisation',
      href: '/organization/settings',
      icon: Building2
    },
    {
      name: 'Admin',
      href: '/admin/realpro',
      icon: Shield
    },
    {
      name: 'Audit Logs',
      href: '/admin/audit-logs',
      icon: Activity
    },
  ];

  const renderNavItem = (item: NavItem, depth = 0) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.href ||
                    (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.name);

    return (
      <div key={item.name}>
        <Link
          to={hasChildren ? '#' : item.href}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleSection(item.name);
            }
          }}
          className={clsx(
            'group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            {
              'bg-realpro-turquoise text-white shadow-md shadow-realpro-turquoise/20': isActive,
              'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50': !isActive,
              'ml-3': depth > 0,
            }
          )}
        >
          <Icon className={clsx('h-[18px] w-[18px] flex-shrink-0 transition-colors', {
            'text-white': isActive,
            'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300': !isActive,
          })} />
          <span className="flex-1 truncate">{item.name}</span>
          {item.badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </Link>
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-0.5">
            {item.children.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-60 h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
      <div className="h-16 px-5 flex items-center border-b border-neutral-200 dark:border-neutral-800">
        <Link to="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          {currentOrganization?.logo_url ? (
            <img
              src={currentOrganization.logo_url}
              alt={currentOrganization.name}
              className="h-9 w-auto max-w-[140px] object-contain"
            />
          ) : (
            <RealProLogo size="md" />
          )}
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <div>
          <h3 className="px-3 mb-2 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Principal
          </h3>
          <div className="space-y-0.5">
            {navigation.map(item => renderNavItem(item))}
          </div>
        </div>

        <div>
          <h3 className="px-3 mb-2 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Administration
          </h3>
          <div className="space-y-0.5">
            {administrationItems.map(item => renderNavItem(item))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
          <span className="font-medium">RealPro</span>
          <span>v2.0</span>
        </div>
      </div>
    </aside>
  );
}
