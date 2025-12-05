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
  BarChart3,
  GitBranch,
  MessageSquare,
  Bell,
  Package,
  Calendar,
  ClipboardList,
  UserCheck,
  Shield,
  ChevronDown,
  ChevronRight,
  Activity,
  PieChart,
  Workflow
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { RealProLogo } from '../branding/RealProLogo';
import { OrganizationSelector } from '../OrganizationSelector';
import { ProjectSelector } from '../ProjectSelector';
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
      name: 'Dashboard Global',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Projets',
      href: '/projects',
      icon: Building2
    },
    {
      name: 'Analytics & BI',
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
      name: 'Tâches',
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
      name: 'Paramètres',
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
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
            'hover:scale-[1.02] active:scale-[0.98]',
            {
              'bg-realpro-turquoise/10 text-realpro-turquoise shadow-sm': isActive,
              'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800': !isActive,
              'ml-4': depth > 0,
            }
          )}
        >
          <Icon className={clsx('h-4 w-4 flex-shrink-0', {
            'text-realpro-turquoise': isActive,
          })} />
          <span className="flex-1">{item.name}</span>
          {item.badge && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-green-500 text-white rounded-full">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </Link>
        {hasChildren && isExpanded && (
          <div className="ml-2 mt-1 space-y-0.5">
            {item.children.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col">
      {/* Logo */}
      <div className="p-6 flex justify-center border-b border-gray-200 dark:border-gray-800">
        <Link to="/dashboard" className="block transition-opacity hover:opacity-80">
          <RealProLogo size="lg" />
        </Link>
      </div>

      {/* Selectors */}
      <div className="px-3 py-4 space-y-3 border-b border-gray-200 dark:border-gray-800">
        <OrganizationSelector />
        <ProjectSelector />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="mb-4">
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Principal
          </h3>
          {navigation.map(item => renderNavItem(item))}
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Administration
          </h3>
          {administrationItems.map(item => renderNavItem(item))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <div className="font-semibold text-realpro-turquoise mb-1">RealPro SA</div>
          <div>© 2024-2025 • v2.0</div>
        </div>
      </div>
    </aside>
  );
}
