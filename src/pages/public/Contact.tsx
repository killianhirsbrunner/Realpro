import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { RealProLogo } from '../../components/branding/RealProLogo';
import { ThemeToggle } from '../../components/ThemeToggle';
import { ScrollReveal } from '../../components/ui/PageTransition';
import { Mail, Phone, MapPin, Send, Check, Menu, X } from 'lucide-react';

export function Contact() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-70">
              <RealProLogo size="lg" />
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link to="/features" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Tarifs
              </Link>
              <Link to="/contact" className="text-brand-600 dark:text-brand-400 transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/login" className="hidden sm:block">
                <Button variant="outline" size="sm" className="rounded-full">
                  Connexion
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm" className="rounded-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 border-0 text-white shadow-lg shadow-brand-600/30">
                  Essai gratuit
                </Button>
              </Link>
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-4 px-6 animate-in fade-in slide-in-from-top-2">
            <nav className="flex flex-col gap-3">
              <Link to="/features" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-2">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-2">
                Tarifs
              </Link>
              <Link to="/contact" className="text-brand-600 dark:text-brand-400 transition-colors py-2">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>

      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16 text-center">
        <ScrollReveal>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white leading-[1.1] tracking-tight mb-6">
            Parlons de votre <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">projet</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Une question ? Besoin d'une démo ? Notre équipe est là pour vous aider.
          </p>
        </ScrollReveal>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-16 md:pb-24">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <ScrollReveal>
            <div className="group p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-600/20 group-hover:shadow-brand-600/40 group-hover:scale-110 transition-all duration-500">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                Email
              </h3>
              <a
                href="mailto:contact@realpro.ch"
                className="text-brand-600 dark:text-brand-400 hover:underline text-sm"
              >
                contact@realpro.ch
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="group p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-600/20 group-hover:shadow-brand-600/40 group-hover:scale-110 transition-all duration-500">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                Téléphone
              </h3>
              <a
                href="tel:+41223456789"
                className="text-brand-600 dark:text-brand-400 hover:underline text-sm"
              >
                +41 22 345 67 89
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="group p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-600/20 group-hover:shadow-brand-600/40 group-hover:scale-110 transition-all duration-500">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                Adresse
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Rue du Commerce 12<br />
                1200 Genève, Suisse
              </p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="max-w-2xl mx-auto p-8 md:p-12 rounded-2xl bg-gradient-to-br from-neutral-50 via-neutral-100/50 to-neutral-50 dark:from-neutral-900/50 dark:via-neutral-900 dark:to-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-600/30">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                  Message envoyé
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                  Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full">
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Nom complet *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Jean Dupont"
                      className="rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Email *
                    </label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="jean.dupont@entreprise.ch"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Entreprise
                    </label>
                    <Input
                      value={formData.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      placeholder="Promotions SA"
                      className="rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Téléphone
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+41 22 345 67 89"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Message *
                  </label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Décrivez votre projet ou vos besoins..."
                    rows={6}
                    className="rounded-xl"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full rounded-full group bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 border-0 text-white shadow-lg shadow-brand-600/30">
                  Envoyer le message
                  <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-16 md:py-24 border-y border-neutral-800 dark:border-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-transparent to-brand-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-brand-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-brand-600 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight leading-tight">
              Préférez essayer par vous-même ?
            </h2>
            <p className="text-base md:text-lg text-neutral-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Créez votre compte et explorez RealPro gratuitement pendant 14 jours
            </p>
            <Link to="/auth/register">
              <Button
                size="lg"
                className="group bg-brand-600 text-white hover:bg-brand-700 border-0 rounded-full px-8 h-12 text-base font-medium shadow-2xl hover:shadow-brand-600/50 transition-all duration-300 hover:scale-105"
              >
                Commencer gratuitement
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <footer className="border-t border-neutral-200/50 dark:border-neutral-800/50 py-12 md:py-16 bg-neutral-50/50 dark:bg-neutral-900/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            <div className="md:col-span-1">
              <div className="mb-4">
                <RealProLogo size="lg" />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 max-w-xs leading-relaxed">
                La solution complète pour les promoteurs immobiliers suisses
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Produit</h3>
              <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                <li><Link to="/features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Fonctionnalités</Link></li>
                <li><Link to="/pricing" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Tarifs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Entreprise</h3>
              <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                <li><Link to="/contact" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Légal</h3>
              <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                <li><Link to="/legal/cgu" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">CGU</Link></li>
                <li><Link to="/legal/cgv" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">CGV</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Confidentialité</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-200/50 dark:border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
              © 2024-2025 Realpro SA. Tous droits réservés.
            </p>
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <span>Made in</span>
              <span className="text-red-500">🇨🇭</span>
              <span>Switzerland</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
