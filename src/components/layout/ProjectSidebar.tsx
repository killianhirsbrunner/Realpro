import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Users,
  FileText,
  FolderOpen,
  DollarSign,
  ClipboardList,
  Wrench,
  Building2,
  MessageSquare,
  Scale,
  Briefcase,
  BarChart3,
} from 'lucide-react';
import clsx from 'clsx';
import { useI18n } from '../../lib/i18n';

interface ProjectSidebarProps {
  projectId: string;
}

export function ProjectSidebar({ projectId }: ProjectSidebarProps) {
  const { t } = useI18n();
  const location = useLocation();

  const modules = [
    {
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
      path: 'dashboard',
      badge: null,
    },
    {
      label: t('nav.lots'),
      icon: Home,
      path: 'lots',
      badge: null,
    },
    {
      label: 'CRM',
      icon: Users,
      path: 'crm',
      badge: null,
    },
    {
      label: 'Courtiers',
      icon: Briefcase,
      path: 'brokers',
      badge: null,
    },
    {
      label: 'Notaire',
      icon: Scale,
      path: 'notary',
      badge: null,
    },
    {
      label: t('nav.documents'),
      icon: FolderOpen,
      path: 'documents',
      badge: null,
    },
    {
      label: 'Finances',
      icon: DollarSign,
      path: 'finances',
      badge: null,
    },
    {
      label: 'Soumissions',
      icon: ClipboardList,
      path: 'submissions',
      badge: null,
    },
    {
      label: 'Modifications',
      icon: Wrench,
      path: 'modifications',
      badge: 3,
    },
    {
      label: 'Chantier',
      icon: Building2,
      path: 'construction',
      badge: null,
    },
    {
      label: 'Communication',
      icon: MessageSquare,
      path: 'communication',
      badge: 5,
    },
    {
      label: 'Reporting',
      icon: BarChart3,
      path: 'reporting',
      badge: null,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 border-r border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl">

      <div className="p-6 border-b border-neutral-200/50 dark:border-neutral-800/50">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Modules Projet
        </h2>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {modules.map((module) => {
          const href = `/projects/${projectId}/${module.path}`;
          const isActive = location.pathname === href ||
                          location.pathname.startsWith(`${href}/`);
          const Icon = module.icon;

          return (
            <Link
              key={module.path}
              to={href}
              className={clsx(
                'flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                'hover:scale-[1.02] active:scale-[0.98]',
                {
                  'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm border-l-4 border-primary': isActive,
                  'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200': !isActive,
                }
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={clsx('h-4 w-4', {
                  'text-primary-600 dark:text-primary-400': isActive,
                })} />
                <span>{module.label}</span>
              </div>

              {module.badge && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  {module.badge}
                </span>
              )}
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
