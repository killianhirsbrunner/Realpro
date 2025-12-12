import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
      <div className="px-6 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-sm text-realpro-turquoise">realpro</span>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-5 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400">
              <Link
                to="/legal/cgu"
                className="hover:text-realpro-turquoise transition-colors"
              >
                CGU
              </Link>
              <Link
                to="/legal/cgv"
                className="hover:text-realpro-turquoise transition-colors"
              >
                CGV
              </Link>
              <Link
                to="/legal/mentions-legales"
                className="hover:text-realpro-turquoise transition-colors"
              >
                Mentions légales
              </Link>
              <Link
                to="/legal/privacy"
                className="hover:text-realpro-turquoise transition-colors"
              >
                Confidentialité
              </Link>
              <a
                href="mailto:contact@realpro.ch"
                className="hover:text-realpro-turquoise transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              © {currentYear} realpro SA · v2.1
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50">
              <div className="flex items-center justify-center w-4 h-4 bg-red-600 rounded-sm">
                <span className="text-white text-[8px] font-bold">+</span>
              </div>
              <span className="text-[10px] font-medium text-red-700 dark:text-red-400">Suisse</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
