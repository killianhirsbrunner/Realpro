import { type ReactNode } from 'react';
import clsx from 'clsx';
import { Building2, HardHat, Home, ChevronRight } from 'lucide-react';

export interface AppOption {
  /** App identifier */
  id: 'ppe-admin' | 'promoteur' | 'regie';
  /** App name */
  name: string;
  /** App description */
  description: string;
  /** App icon */
  icon: ReactNode;
  /** App color class */
  colorClass: string;
  /** App URL or path */
  href: string;
  /** Is app available */
  available?: boolean;
  /** Coming soon badge */
  comingSoon?: boolean;
}

export const defaultApps: AppOption[] = [
  {
    id: 'ppe-admin',
    name: 'Administrateur PPE',
    description: 'Gestion des copropriétés, AG, budget et maintenance',
    icon: <Building2 className="h-6 w-6" />,
    colorClass: 'bg-blue-500',
    href: '/ppe-admin',
    available: true,
  },
  {
    id: 'promoteur',
    name: 'Promoteur immobilier',
    description: 'Suivi des projets, lots, acheteurs et finances',
    icon: <HardHat className="h-6 w-6" />,
    colorClass: 'bg-amber-500',
    href: '/promoteur',
    available: true,
  },
  {
    id: 'regie',
    name: 'Régie immobilière',
    description: 'Gestion locative, baux, encaissements et technique',
    icon: <Home className="h-6 w-6" />,
    colorClass: 'bg-emerald-500',
    href: '/regie',
    available: true,
  },
];

export interface AppSelectorProps {
  /** Apps to display */
  apps?: AppOption[];
  /** Selected app callback */
  onSelectApp?: (app: AppOption) => void;
  /** Custom link renderer */
  renderLink?: (app: AppOption, children: ReactNode) => ReactNode;
  /** User info */
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  /** Logout handler */
  onLogout?: () => void;
  /** Additional classes */
  className?: string;
}

export function AppSelector({
  apps = defaultApps,
  onSelectApp,
  renderLink,
  user,
  onLogout,
  className,
}: AppSelectorProps) {
  const handleAppClick = (app: AppOption) => {
    if (app.available && !app.comingSoon) {
      onSelectApp?.(app);
    }
  };

  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col',
        'bg-neutral-50 dark:bg-neutral-950',
        className
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-brand-400 flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Realpro Suite
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Sélectionnez une application
            </p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {user.name}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {user.email}
              </p>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
              >
                Déconnexion
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Title */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Choisissez votre application
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Accédez à l'une des applications de la suite Realpro
            </p>
          </div>

          {/* App cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {apps.map((app) => {
              const isDisabled = !app.available || app.comingSoon;

              const cardContent = (
                <div
                  className={clsx(
                    'group relative p-6 rounded-2xl border transition-all duration-200',
                    'bg-white dark:bg-neutral-900',
                    isDisabled
                      ? 'border-neutral-200 dark:border-neutral-800 opacity-60 cursor-not-allowed'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-brand-300 hover:shadow-lg cursor-pointer'
                  )}
                  onClick={() => !isDisabled && handleAppClick(app)}
                >
                  {/* Coming soon badge */}
                  {app.comingSoon && (
                    <span className="absolute top-4 right-4 px-2 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full">
                      Bientôt
                    </span>
                  )}

                  {/* Icon */}
                  <div
                    className={clsx(
                      'h-14 w-14 rounded-xl flex items-center justify-center mb-4',
                      app.colorClass,
                      'text-white'
                    )}
                  >
                    {app.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    {app.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    {app.description}
                  </p>

                  {/* Action */}
                  <div
                    className={clsx(
                      'flex items-center gap-1 text-sm font-medium transition-colors',
                      isDisabled
                        ? 'text-neutral-400'
                        : 'text-brand-500 group-hover:text-brand-600'
                    )}
                  >
                    <span>Accéder</span>
                    <ChevronRight
                      className={clsx(
                        'h-4 w-4 transition-transform',
                        !isDisabled && 'group-hover:translate-x-1'
                      )}
                    />
                  </div>
                </div>
              );

              // If custom link renderer is provided and app is available
              if (renderLink && !isDisabled) {
                return (
                  <div key={app.id}>{renderLink(app, cardContent)}</div>
                );
              }

              // Default: use anchor tag or div
              if (!isDisabled) {
                return (
                  <a key={app.id} href={app.href} className="block">
                    {cardContent}
                  </a>
                );
              }

              return <div key={app.id}>{cardContent}</div>;
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800">
        <p>© {new Date().getFullYear()} Realpro. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
