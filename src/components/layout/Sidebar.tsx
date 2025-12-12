import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
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
  Briefcase,
  CalendarDays,
  Wallet,
  FolderOpen,
  HardHat,
  UserCircle,
  Building,
  LayoutGrid,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useOrganizationContext } from '../../contexts/OrganizationContext';
import { RealproLogo } from '../branding/RealProLogo';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'red' | 'blue';
  children?: NavItem[];
  description?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
  collapsible?: boolean;
}

export function Sidebar() {
  const { t } = useI18n();
  const location = useLocation();
  const { currentOrganization } = useOrganizationContext();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Projets']);

  // Auto-expand section based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/commercial') || path.startsWith('/crm') || path.startsWith('/broker') || path.startsWith('/contacts')) {
      setExpandedSections(prev => prev.includes('Commercial') ? prev : [...prev, 'Commercial']);
    } else if (path.startsWith('/chantier') || path.startsWith('/planning') || path.startsWith('/sav') || path.startsWith('/submissions')) {
      setExpandedSections(prev => prev.includes('Chantier') ? prev : [...prev, 'Chantier']);
    } else if (path.startsWith('/finance') || path.startsWith('/billing') || path.startsWith('/reporting')) {
      setExpandedSections(prev => prev.includes('Finances') ? prev : [...prev, 'Finances']);
    } else if (path.startsWith('/messages') || path.startsWith('/notifications') || path.startsWith('/documents')) {
      setExpandedSections(prev => prev.includes('Communication') ? prev : [...prev, 'Communication']);
    }
  }, [location.pathname]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NOUVELLE STRUCTURE DE NAVIGATION PAR DOMAINES MÉTIER
  // ═══════════════════════════════════════════════════════════════════════════

  const navigationSections: NavSection[] = [
    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 1: ACCUEIL - Point d'entrée unique
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: 'Accueil',
      collapsible: false,
      items: [
        {
          name: 'Tableau de bord',
          href: '/dashboard',
          icon: LayoutDashboard,
          description: 'Vue globale de votre activité',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 2: PROJETS - Cœur métier de l'application
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: 'Projets',
      collapsible: true,
      items: [
        {
          name: 'Tous les projets',
          href: '/projects',
          icon: Building2,
          description: 'Liste et gestion des projets',
        },
        {
          name: 'Vue promoteur',
          href: '/promoter',
          icon: TrendingUp,
          description: 'Synthèse promoteur',
        },
        {
          name: 'Analytics',
          href: '/analytics',
          icon: BarChart3,
          badge: 'NEW',
          badgeColor: 'emerald',
          description: 'Business Intelligence',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 3: COMMERCIAL - CRM, Ventes, Courtiers
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: 'Commercial',
      collapsible: true,
      items: [
        {
          name: 'CRM',
          href: '/crm',
          icon: Users,
          description: 'Gestion des prospects et clients',
        },
        {
          name: 'Contacts',
          href: '/contacts',
          icon: UserCircle,
          description: 'Annuaire des contacts',
        },
        {
          name: 'Entreprises',
          href: '/companies',
          icon: Building,
          description: 'Annuaire des entreprises',
        },
        {
          name: 'Courtiers',
          href: '/broker',
          icon: Briefcase,
          description: 'Gestion des courtiers',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 4: CHANTIER - Construction, Planning, SAV
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: 'Chantier',
      collapsible: true,
      items: [
        {
          name: 'Planning',
          href: '/planning',
          icon: CalendarDays,
          description: 'Planification des travaux',
        },
        {
          name: 'Construction',
          href: '/chantier',
          icon: HardHat,
          description: 'Suivi de chantier',
        },
        {
          name: 'SAV',
          href: '/sav',
          icon: Wrench,
          description: 'Service après-vente',
        },
        {
          name: 'Soumissions',
          href: '/submissions',
          icon: FileText,
          description: 'Appels d\'offres',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 5: FINANCES - Budget, CFC, Facturation
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: 'Finances',
      collapsible: true,
      items: [
        {
          name: 'Vue d\'ensemble',
          href: '/finance',
          icon: Wallet,
          description: 'Dashboard financier',
        },
        {
          name: 'Facturation',
          href: '/billing',
          icon: CreditCard,
          description: 'Gestion des factures',
        },
        {
          name: 'Reporting',
          href: '/reporting',
          icon: BarChart3,
          description: 'Rapports financiers',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 6: COMMUNICATION - Messages, Notifications, Documents
    // ─────────────────────────────────────────────────────────────────────────
    {
      title: 'Communication',
      collapsible: true,
      items: [
        {
          name: 'Messages',
          href: '/messages',
          icon: MessageSquare,
          description: 'Messagerie interne',
        },
        {
          name: 'Notifications',
          href: '/notifications',
          icon: Bell,
          description: 'Centre de notifications',
        },
        {
          name: 'Tâches',
          href: '/tasks',
          icon: ClipboardList,
          description: 'Gestion des tâches',
        },
      ],
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION ADMINISTRATION (en bas de la sidebar)
  // ─────────────────────────────────────────────────────────────────────────
  const administrationItems: NavItem[] = [
    {
      name: 'Paramètres',
      href: '/settings',
      icon: Settings,
    },
    {
      name: 'Organisation',
      href: '/organization/settings',
      icon: Building2,
    },
    {
      name: 'Admin',
      href: '/admin/realpro',
      icon: Shield,
    },
  ];

  const isPathActive = (href: string): boolean => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const Icon = item.icon;
    const isActive = isPathActive(item.href);
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
          title={item.description}
          className={clsx(
            'group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150',
            {
              'bg-realpro-turquoise text-white shadow-sm': isActive,
              'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60': !isActive,
              'ml-2': depth > 0,
            }
          )}
        >
          <Icon className={clsx('h-4 w-4 flex-shrink-0 transition-colors', {
            'text-white': isActive,
            'text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-300': !isActive,
          })} />
          <span className="flex-1 truncate">{item.name}</span>
          {item.badge && (
            <span className={clsx(
              'px-1.5 py-0.5 text-[9px] font-bold text-white rounded',
              {
                'bg-emerald-500': item.badgeColor === 'emerald' || !item.badgeColor,
                'bg-amber-500': item.badgeColor === 'amber',
                'bg-red-500': item.badgeColor === 'red',
                'bg-blue-500': item.badgeColor === 'blue',
              }
            )}>
              {item.badge}
            </span>
          )}
          {hasChildren && (
            isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
          )}
        </Link>
        {hasChildren && isExpanded && (
          <div className="mt-0.5 space-y-0.5">
            {item.children!.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (section: NavSection) => {
    const isExpanded = !section.collapsible || expandedSections.includes(section.title);
    const hasActiveItem = section.items.some(item => isPathActive(item.href));

    return (
      <div key={section.title} className="space-y-0.5">
        {section.collapsible ? (
          <button
            onClick={() => toggleSection(section.title)}
            className={clsx(
              'w-full flex items-center justify-between px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors',
              {
                'text-realpro-turquoise': hasActiveItem,
                'text-neutral-400 dark:text-neutral-500 hover:text-neutral-500 dark:hover:text-neutral-400': !hasActiveItem,
              }
            )}
          >
            <span>{section.title}</span>
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <h3 className="px-2.5 py-1.5 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            {section.title}
          </h3>
        )}
        {isExpanded && (
          <div className="space-y-0.5">
            {section.items.map(item => renderNavItem(item))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-60 h-full bg-white dark:bg-neutral-950 border-r border-neutral-200/80 dark:border-neutral-800/80 flex flex-col">
      {/* Logo Header */}
      <div className="h-16 px-4 flex items-center border-b border-neutral-200/80 dark:border-neutral-800/80">
        <Link to="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          {currentOrganization?.logo_url ? (
            <img
              src={currentOrganization.logo_url}
              alt={currentOrganization.name}
              className="h-8 w-auto max-w-[160px] object-contain"
            />
          ) : (
            <RealproLogo variant="full" size="sm" />
          )}
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2.5 py-3 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
        {navigationSections.map(section => renderSection(section))}
      </nav>

      {/* Administration Section - Fixed at bottom */}
      <div className="border-t border-neutral-200/80 dark:border-neutral-800/80 px-2.5 py-2.5">
        <h3 className="px-2.5 mb-1.5 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          Réglages
        </h3>
        <div className="space-y-0.5">
          {administrationItems.map(item => renderNavItem(item))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-neutral-200/80 dark:border-neutral-800/80">
        <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500">
          <span>Realpro</span>
          <span className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">v2.1</span>
        </div>
      </div>
    </aside>
  );
}
