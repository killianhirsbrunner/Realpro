import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
      <div className="px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <span className="font-bold text-lg text-neutral-900 dark:text-white">RealPro</span>
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

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              © {currentYear} Realpro SA · v1.0
            </span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
              <div className="flex items-center justify-center w-4 h-4 bg-red-600 rounded-sm">
                <span className="text-white text-[8px] font-bold">+</span>
              </div>
              <span className="text-[10px] font-medium text-red-700 dark:text-red-400">Développé en Suisse</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
