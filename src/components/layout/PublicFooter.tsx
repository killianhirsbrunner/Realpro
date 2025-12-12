import { Link } from 'react-router-dom';
import { RealProLogo } from '../branding/RealProLogo';

interface PublicFooterProps {
  className?: string;
}

export function PublicFooter({ className = '' }: PublicFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-12 bg-white dark:bg-neutral-950 border-t border-neutral-200/80 dark:border-neutral-800/80 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8 mb-10">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link to="/">
              <RealProLogo variant="full" size="sm" />
            </Link>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
              La plateforme suisse pour piloter vos promotions immobilières.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50">
              <div className="flex items-center justify-center w-5 h-5 bg-red-600 rounded">
                <span className="text-white text-[10px] font-bold">+</span>
              </div>
              <span className="text-xs font-medium text-red-700 dark:text-red-400">Made in Switzerland</span>
            </div>
          </div>

          {/* Produit */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-3 text-sm">Produit</h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link to="/features" className="hover:text-realpro-turquoise transition-colors">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-realpro-turquoise transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-realpro-turquoise transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-3 text-sm">Ressources</h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link to="/contact" className="hover:text-realpro-turquoise transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-realpro-turquoise transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-3 text-sm">Légal</h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link to="/legal/cgu" className="hover:text-realpro-turquoise transition-colors">
                  CGU
                </Link>
              </li>
              <li>
                <Link to="/legal/cgv" className="hover:text-realpro-turquoise transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="hover:text-realpro-turquoise transition-colors">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80">
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            © 2024-{currentYear} realpro SA. Tous droits réservés. Hébergement des données en Suisse.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
