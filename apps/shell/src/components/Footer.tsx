import { Link } from 'react-router-dom';
import { RealproLogo } from '../../../../src/components/branding/RealProLogo';
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';

const footerLinks = {
  applications: [
    { name: 'PPE Admin', href: '/ppe' },
    { name: 'Promoteur', href: '/promoteur' },
    { name: 'Régie', href: '/regie' },
  ],
  entreprise: [
    { name: 'À propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Tarifs', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
  ],
  legal: [
    { name: 'Conditions générales', href: '/legal/cgu' },
    { name: 'Politique de confidentialité', href: '/legal/privacy' },
    { name: 'Mentions légales', href: '/legal/mentions' },
  ],
  support: [
    { name: 'Centre d\'aide', href: '/help' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Status', href: '/status' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand column - spans 2 columns */}
          <div className="col-span-2">
            <RealproLogo size="lg" theme="dark" />
            <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-xs">
              La suite logicielle suisse pour les professionnels de l'immobilier.
              PPE, Promotion, Gérance.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <a
                href="mailto:contact@realpro.ch"
                className="flex items-center gap-3 text-slate-400 hover:text-[#3DAABD] transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                contact@realpro.ch
              </a>
              <a
                href="tel:+41223456789"
                className="flex items-center gap-3 text-slate-400 hover:text-[#3DAABD] transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                +41 22 345 67 89
              </a>
              <div className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Rue du Rhône 42<br />1204 Genève, Suisse</span>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#3DAABD] hover:text-white transition-all"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#3DAABD] hover:text-white transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Applications */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Applications
            </h3>
            <ul className="space-y-3">
              {footerLinks.applications.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-[#3DAABD] transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Entreprise
            </h3>
            <ul className="space-y-3">
              {footerLinks.entreprise.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-[#3DAABD] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-[#3DAABD] transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Légal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-[#3DAABD] transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Realpro SA. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                {/* Swiss flag */}
                <div className="w-5 h-5 relative">
                  <div className="w-full h-full bg-red-600 rounded-sm" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-3 bg-white rounded-sm" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-1 bg-white rounded-sm" />
                  </div>
                </div>
                <span className="text-slate-500 text-sm">Made in Switzerland</span>
              </div>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500 text-sm">100% hébergé en Suisse</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
