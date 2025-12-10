import { Link } from 'react-router-dom';
import { RealProLogo } from '../branding/RealProLogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
      <div className="px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <RealProLogo size="sm" />
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
            <Link
              to="/legal/cgu"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              CGU
            </Link>
            <Link
              to="/legal/cgv"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              CGV
            </Link>
            <Link
              to="/legal/mentions-legales"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              to="/legal/privacy"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Confidentialité
            </Link>
            <a
              href="mailto:contact@realpro.ch"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Contact
            </a>
            </div>
          </div>

          <div className="text-xs text-gray-400 dark:text-gray-500">
            © {currentYear} Realpro SA, Yverdon-les-Bains, Suisse · RealPro v1.0
          </div>
        </div>
      </div>
    </footer>
  );
}
