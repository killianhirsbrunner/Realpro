import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, LogOut, User, Search, Command } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { ThemeToggle } from '../ThemeToggle';
import { NotificationBell } from '../NotificationBell';
import { RealproLogo } from '../branding/RealProLogo';
import { supabase } from '../../lib/supabase';
import clsx from 'clsx';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION DES TITRES DE PAGES PAR SECTION
// ═══════════════════════════════════════════════════════════════════════════

const PAGE_TITLES: Record<string, { title: string; subtitle?: string; section?: string }> = {
  // ─────────────────────────────────────────────────────────────────────────
  // ACCUEIL
  // ─────────────────────────────────────────────────────────────────────────
  '/dashboard': { title: 'Tableau de bord', subtitle: 'Vue d\'ensemble de votre activité', section: 'Accueil' },
  '/notifications': { title: 'Notifications', subtitle: 'Centre de notifications', section: 'Communication' },

  // ─────────────────────────────────────────────────────────────────────────
  // PROJETS
  // ─────────────────────────────────────────────────────────────────────────
  '/projects': { title: 'Projets', subtitle: 'Liste de vos projets immobiliers', section: 'Projets' },
  '/promoter': { title: 'Vue promoteur', subtitle: 'Synthèse globale de vos projets', section: 'Projets' },
  '/analytics': { title: 'Analytics', subtitle: 'Business Intelligence & KPIs', section: 'Projets' },

  // ─────────────────────────────────────────────────────────────────────────
  // COMMERCIAL
  // ─────────────────────────────────────────────────────────────────────────
  '/crm': { title: 'CRM', subtitle: 'Gestion des prospects et clients', section: 'Commercial' },
  '/contacts': { title: 'Contacts', subtitle: 'Annuaire des contacts', section: 'Commercial' },
  '/companies': { title: 'Entreprises', subtitle: 'Annuaire des entreprises', section: 'Commercial' },
  '/broker': { title: 'Courtiers', subtitle: 'Gestion des partenaires courtiers', section: 'Commercial' },

  // ─────────────────────────────────────────────────────────────────────────
  // CHANTIER
  // ─────────────────────────────────────────────────────────────────────────
  '/planning': { title: 'Planning', subtitle: 'Planification des travaux', section: 'Chantier' },
  '/chantier': { title: 'Construction', subtitle: 'Suivi de chantier', section: 'Chantier' },
  '/sav': { title: 'SAV', subtitle: 'Service après-vente', section: 'Chantier' },
  '/submissions': { title: 'Soumissions', subtitle: 'Appels d\'offres', section: 'Chantier' },

  // ─────────────────────────────────────────────────────────────────────────
  // FINANCES
  // ─────────────────────────────────────────────────────────────────────────
  '/finance': { title: 'Finances', subtitle: 'Vue d\'ensemble financière', section: 'Finances' },
  '/billing': { title: 'Facturation', subtitle: 'Abonnement et paiements', section: 'Finances' },
  '/reporting': { title: 'Reporting', subtitle: 'Rapports et statistiques', section: 'Finances' },

  // ─────────────────────────────────────────────────────────────────────────
  // COMMUNICATION
  // ─────────────────────────────────────────────────────────────────────────
  '/messages': { title: 'Messages', subtitle: 'Messagerie interne', section: 'Communication' },
  '/tasks': { title: 'Tâches', subtitle: 'Gestion des tâches', section: 'Communication' },

  // ─────────────────────────────────────────────────────────────────────────
  // ADMINISTRATION
  // ─────────────────────────────────────────────────────────────────────────
  '/settings': { title: 'Paramètres', subtitle: 'Configuration utilisateur', section: 'Administration' },
  '/organization/settings': { title: 'Organisation', subtitle: 'Paramètres organisation', section: 'Administration' },
  '/admin/realpro': { title: 'Administration', subtitle: 'Panel administrateur', section: 'Administration' },
  '/admin/audit-logs': { title: 'Audit Logs', subtitle: 'Journal d\'activité', section: 'Administration' },
};

function getPageInfo(pathname: string): { title: string; subtitle?: string; section?: string } {
  // Direct match
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ROUTES DE PROJETS
  // ─────────────────────────────────────────────────────────────────────────
  if (pathname.startsWith('/projects/')) {
    // Sous-pages spécifiques
    if (pathname.includes('/lots/')) {
      return { title: 'Détail du lot', subtitle: 'Informations et suivi du lot', section: 'Projets' };
    }
    if (pathname.includes('/buyers/')) {
      return { title: 'Fiche acquéreur', subtitle: 'Détails et suivi client', section: 'Projets' };
    }
    if (pathname.includes('/planning')) {
      return { title: 'Planning projet', subtitle: 'Planification et jalons', section: 'Projets' };
    }
    if (pathname.includes('/finance') || pathname.includes('/finances')) {
      return { title: 'Finances projet', subtitle: 'Budget et CFC', section: 'Projets' };
    }
    if (pathname.includes('/crm')) {
      return { title: 'CRM projet', subtitle: 'Pipeline et prospects', section: 'Projets' };
    }
    if (pathname.includes('/sav')) {
      return { title: 'SAV projet', subtitle: 'Tickets et interventions', section: 'Projets' };
    }
    if (pathname.includes('/materials')) {
      return { title: 'Matériaux', subtitle: 'Catalogue et sélections', section: 'Projets' };
    }
    if (pathname.includes('/submissions')) {
      return { title: 'Soumissions', subtitle: 'Appels d\'offres projet', section: 'Projets' };
    }
    if (pathname.includes('/documents')) {
      return { title: 'Documents', subtitle: 'Bibliothèque documentaire', section: 'Projets' };
    }
    if (pathname.includes('/settings')) {
      return { title: 'Paramètres projet', subtitle: 'Configuration', section: 'Projets' };
    }
    // Page projet par défaut
    return { title: 'Projet', subtitle: 'Tableau de bord projet', section: 'Projets' };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PORTAILS EXTERNES
  // ─────────────────────────────────────────────────────────────────────────
  if (pathname.startsWith('/broker')) {
    return { title: 'Espace Courtier', subtitle: 'Portail partenaire', section: 'Commercial' };
  }
  if (pathname.startsWith('/buyer')) {
    return { title: 'Espace Acquéreur', subtitle: 'Portail client', section: 'Portail' };
  }
  if (pathname.startsWith('/supplier')) {
    return { title: 'Espace Fournisseur', subtitle: 'Portail fournisseur', section: 'Portail' };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REPORTING
  // ─────────────────────────────────────────────────────────────────────────
  if (pathname.startsWith('/reporting/')) {
    return { title: 'Reporting', subtitle: 'Rapports détaillés', section: 'Finances' };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ADMINISTRATION
  // ─────────────────────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin/')) {
    return { title: 'Administration', subtitle: 'Gestion système', section: 'Administration' };
  }
  if (pathname.startsWith('/settings/')) {
    return { title: 'Paramètres', subtitle: 'Configuration', section: 'Administration' };
  }

  return { title: 'Realpro', section: 'Accueil' };
}

export function Topbar() {
  const { t } = useI18n();
  const { user } = useCurrentUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const pageInfo = getPageInfo(location.pathname);

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
    <header className="h-14 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 flex items-center px-5">
      <div className="flex items-center gap-4 flex-1">
        {/* Page Info */}
        <div className="flex items-center gap-2">
          {pageInfo.section && (
            <span className="text-[10px] font-semibold text-realpro-turquoise uppercase tracking-wider px-2 py-0.5 bg-realpro-turquoise/10 rounded">
              {pageInfo.section}
            </span>
          )}
          <h1 className="text-base font-semibold text-neutral-900 dark:text-white">
            {pageInfo.title}
          </h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md ml-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-realpro-turquoise transition-colors" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full h-9 pl-9 pr-16 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-realpro-turquoise/20 focus:border-realpro-turquoise focus:bg-white dark:focus:bg-neutral-800 transition-all duration-150"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <kbd className="hidden sm:flex h-5 items-center gap-0.5 rounded border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 px-1.5 text-[10px] font-medium text-neutral-400">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <NotificationBell />
        <ThemeToggle />
        <LanguageSwitcher />

        <div className="ml-2 h-6 w-px bg-neutral-200 dark:bg-neutral-800" />

        <div className="relative ml-1.5" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 h-9 pl-1.5 pr-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150"
          >
            <div className="w-7 h-7 rounded-md bg-realpro-turquoise flex items-center justify-center text-white text-xs font-semibold">
              {user?.first_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-neutral-900 dark:text-white leading-tight">
                {user?.first_name || 'Utilisateur'}
              </span>
            </div>
            <ChevronDown className={clsx('h-3.5 w-3.5 text-neutral-400 transition-transform duration-150', {
              'rotate-180': showUserMenu,
            })} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full text-left px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2.5 transition-colors duration-150"
                >
                  <User className="w-4 h-4" />
                  <span>Mon profil</span>
                </button>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2.5 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
