import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ThemeToggle';
import { RealProLogo } from '../branding/RealProLogo';
import { Menu, X, ChevronDown, Building2, Home, Briefcase, ArrowRight } from 'lucide-react';

interface PublicHeaderProps {
  className?: string;
}

const apps = [
  {
    id: 'ppe-admin',
    name: 'PPE Admin',
    description: 'Administration de copropriétés',
    icon: Building2,
    href: '/app/ppe-admin',
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  },
  {
    id: 'regie',
    name: 'Régie',
    description: 'Gestion locative immobilière',
    icon: Home,
    color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
    href: '/app/regie',
  },
  {
    id: 'promoteur',
    name: 'Promoteur',
    description: 'Promotion immobilière',
    icon: Briefcase,
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
    href: '/app/promoteur',
  },
];

export function PublicHeader({ className = '' }: PublicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appsMenuOpen, setAppsMenuOpen] = useState(false);
  const appsMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const navItems = [
    { path: '/features', label: 'Fonctionnalités' },
    { path: '/pricing', label: 'Tarifs' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Close apps menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (appsMenuRef.current && !appsMenuRef.current.contains(event.target as Node)) {
        setAppsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-50 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <RealProLogo variant="full" size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Apps Dropdown */}
            <div className="relative" ref={appsMenuRef}>
              <button
                onClick={() => setAppsMenuOpen(!appsMenuOpen)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  appsMenuOpen
                    ? 'text-realpro-turquoise bg-realpro-turquoise/5'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                Applications
                <ChevronDown className={`w-4 h-4 transition-transform ${appsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {appsMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 mb-1">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Suite Realpro
                    </p>
                  </div>
                  {apps.map((app) => (
                    <Link
                      key={app.id}
                      to={app.href}
                      onClick={() => setAppsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${app.color}`}>
                        <app.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900 dark:text-white group-hover:text-realpro-turquoise transition-colors">
                          {app.name}
                        </p>
                        <p className="text-xs text-neutral-500">{app.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                  <div className="border-t border-neutral-200 dark:border-neutral-700 mt-2 pt-2">
                    <Link
                      to="/apps"
                      onClick={() => setAppsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 p-2 text-sm text-realpro-turquoise hover:bg-realpro-turquoise/5 rounded-lg transition-colors"
                    >
                      Voir toutes les applications
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'text-realpro-turquoise bg-realpro-turquoise/5'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="bg-realpro-turquoise hover:bg-realpro-turquoise-dark text-white border-0 shadow-sm"
              >
                Essai gratuit
              </Button>
            </Link>
            <button
              className="lg:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-3 px-6">
          <nav className="flex flex-col gap-1">
            {/* Apps Section */}
            <div className="py-2 border-b border-neutral-200 dark:border-neutral-800 mb-2">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-3">
                Applications
              </p>
              {apps.map((app) => (
                <Link
                  key={app.id}
                  to={app.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${app.color}`}>
                    <app.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white text-sm">{app.name}</p>
                    <p className="text-xs text-neutral-500">{app.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2.5 px-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'text-realpro-turquoise bg-realpro-turquoise/5'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors md:hidden"
            >
              Connexion
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default PublicHeader;
