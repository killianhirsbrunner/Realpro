import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold text-white">Realpro Suite</span>
            </div>
            <p className="text-sm">
              Solutions logicielles pour l'immobilier suisse.
              PPE, Promotion, Regie.
            </p>
          </div>

          {/* Applications */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Applications
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/ppe" className="hover:text-white transition-colors">
                  PPE Admin
                </a>
              </li>
              <li>
                <a href="/promoteur" className="hover:text-white transition-colors">
                  Promoteur
                </a>
              </li>
              <li>
                <a href="/regie" className="hover:text-white transition-colors">
                  Regie
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Entreprise
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  A propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/legal/cgu" className="hover:text-white transition-colors">
                  CGU
                </a>
              </li>
              <li>
                <a href="/legal/cgv" className="hover:text-white transition-colors">
                  CGV
                </a>
              </li>
              <li>
                <a href="/legal/privacy" className="hover:text-white transition-colors">
                  Confidentialite
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Realpro SA. Tous droits reserves. Suisse.</p>
        </div>
      </div>
    </footer>
  );
}
