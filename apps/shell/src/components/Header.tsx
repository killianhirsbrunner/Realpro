import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RealproLogo } from '../../../../src/components/branding/RealProLogo';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Applications', href: '/apps' },
  { name: 'Fonctionnalités', href: '/features' },
  { name: 'Tarifs', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if we're on the landing page (for transparent header)
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine header styling based on scroll and page
  const headerBg = isLandingPage && !scrolled
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-md shadow-sm';

  const textColor = isLandingPage && !scrolled
    ? 'text-white'
    : 'text-gray-700';

  const activeColor = isLandingPage && !scrolled
    ? 'text-[#5BC4D6]'
    : 'text-[#3DAABD]';

  const logoTheme = isLandingPage && !scrolled ? 'dark' : 'light';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <RealproLogo size="md" theme={logoTheme} />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:opacity-80 ${
                  location.pathname === item.href
                    ? activeColor
                    : textColor
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-4">
            <a
              href="/apps"
              className={`text-sm font-medium transition-colors hover:opacity-80 ${textColor}`}
            >
              Connexion
            </a>
            <Link
              to="/contact"
              className="rounded-xl bg-gradient-to-r from-[#3DAABD] to-[#2E8A9A] px-5 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-[#3DAABD]/25 transition-all duration-300"
            >
              Essai gratuit
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className={`p-2 rounded-lg transition-colors ${textColor} ${
                isLandingPage && !scrolled ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t shadow-xl">
            <div className="px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'bg-[#3DAABD]/10 text-[#3DAABD]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t mt-4 space-y-3">
                <a
                  href="/apps"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </a>
                <Link
                  to="/contact"
                  className="block px-4 py-3 rounded-xl bg-gradient-to-r from-[#3DAABD] to-[#2E8A9A] text-white text-center font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Essai gratuit
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
