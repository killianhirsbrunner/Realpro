import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ThemeToggle';
import { ScrollReveal } from '../../components/ui/PageTransition';
import { Check, ArrowRight, Menu, X, Sparkles } from 'lucide-react';

export function Pricing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const plans = [
    {
      name: 'Starter',
      slug: 'starter',
      price: 199,
      description: 'Idéal pour démarrer avec 1-2 petits projets',
      features: [
        'Jusqu\'à 2 projets actifs',
        '10 utilisateurs inclus',
        'Stockage illimité',
        'Gestion de projets & lots',
        'CRM acquéreurs',
        'Documents & templates',
        'Planning de base',
        'Rapports standards',
        'Support email 48h'
      ],
      highlighted: false,
      badge: null
    },
    {
      name: 'Professional',
      slug: 'professional',
      price: 499,
      description: 'Pour les promoteurs gérant 3-5 projets simultanément',
      features: [
        'Jusqu\'à 5 projets actifs',
        'Utilisateurs illimités',
        'Stockage illimité',
        'Toutes fonctionnalités Starter',
        'Soumissions & adjudications',
        'Finance avancée & CFC',
        'Choix matériaux personnalisables',
        'Planning chantier détaillé',
        'Exports PDF professionnels',
        'API REST access',
        'Branding personnalisé',
        'Support prioritaire 24h'
      ],
      highlighted: true,
      badge: 'Le plus populaire'
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      price: 999,
      description: 'Pour les groupes immobiliers gérant jusqu\'à 10 projets',
      features: [
        'Jusqu\'à 10 projets actifs',
        'Utilisateurs illimités',
        'Stockage illimité',
        'Toutes fonctionnalités Pro',
        'Multi-organisations',
        'Workflow personnalisables',
        'Analytics & BI avancés',
        'API GraphQL',
        'White-label complet',
        'Success manager dédié',
        'Support 24/7 téléphone',
        'Formation sur site',
        'SLA 99.9% garanti'
      ],
      highlighted: false,
      badge: null,
      customNote: 'Plus de 10 projets ?',
      customLink: true
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center font-bold text-xl text-neutral-900 dark:text-white transition-opacity hover:opacity-70">
              RealPro
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link to="/features" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="text-brand-600 dark:text-brand-400 transition-colors">
                Tarifs
              </Link>
              <Link to="/contact" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
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
              <Link to="/pricing" className="text-brand-600 dark:text-brand-400 transition-colors py-2">
                Tarifs
              </Link>
              <Link to="/contact" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-2">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>

      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16 text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-600/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6 border border-brand-600/20">
            <Sparkles className="w-3.5 h-3.5" />
            14 jours d'essai gratuit
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white leading-[1.1] tracking-tight mb-6">
            Tarifs <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">simples et transparents</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Choisissez le plan qui correspond à vos besoins. Changez à tout moment.
          </p>
        </ScrollReveal>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-16 md:pb-24">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <ScrollReveal key={plan.slug}>
              <div className={`relative p-8 rounded-2xl border transition-all duration-500 hover:shadow-2xl ${
                plan.highlighted
                  ? 'border-brand-600 dark:border-brand-500 bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-900/20 dark:to-neutral-900 shadow-xl scale-105'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:-translate-y-2'
              }`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 text-white text-xs font-semibold shadow-lg">
                      Recommandé
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold bg-gradient-to-br from-brand-600 to-brand-700 bg-clip-text text-transparent">
                      CHF {plan.price}
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-400 text-lg">
                      /mois
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-500">
                    Facturation mensuelle ou annuelle
                  </p>
                </div>

                <Link to={`/auth/register?plan=${plan.slug}`} className="block mb-6">
                  <Button
                    className={`w-full rounded-full ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white border-0 shadow-lg shadow-brand-600/30'
                        : ''
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                    size="lg"
                  >
                    Commencer l'essai
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.customNote && (
                  <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      {plan.customNote}
                    </p>
                    {plan.customLink && (
                      <Link to="/contact" className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium">
                        Contactez-nous pour une offre sur mesure
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-neutral-50 via-neutral-100/50 to-neutral-50 dark:from-neutral-900/50 dark:via-neutral-900 dark:to-neutral-900/50 py-16 md:py-24 border-y border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4 text-center">
              Questions fréquentes
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-center mb-12 max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur nos plans et notre facturation
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-3 flex items-start gap-2">
                  <span className="text-brand-600 dark:text-brand-400 mt-1">●</span>
                  Puis-je changer de plan à tout moment ?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                  Oui, absolument. Les upgrades sont appliqués immédiatement avec un prorata automatique. Les downgrades prennent effet à la fin du cycle de facturation en cours pour éviter toute perte de données.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-3 flex items-start gap-2">
                  <span className="text-brand-600 dark:text-brand-400 mt-1">●</span>
                  Comment fonctionne l'essai gratuit ?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                  Profitez de 14 jours d'essai gratuit sur tous les plans, sans carte bancaire requise. Accédez à toutes les fonctionnalités du plan choisi. Vos données sont conservées même après l'essai.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-3 flex items-start gap-2">
                  <span className="text-brand-600 dark:text-brand-400 mt-1">●</span>
                  Le stockage est vraiment illimité ?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                  Oui, sur tous les plans. Nous appliquons une politique d'utilisation raisonnable (fair use). Pour un usage standard de gestion de projets immobiliers, vous n'atteindrez jamais les limites.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-3 flex items-start gap-2">
                  <span className="text-brand-600 dark:text-brand-400 mt-1">●</span>
                  Que se passe-t-il si je dépasse ma limite de projets ?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                  Vous recevez une notification dès 80% de votre limite. Vous avez 7 jours de grâce pour upgrader. Après ce délai, les projets excédentaires passent en lecture seule jusqu'à l'upgrade.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-3 flex items-start gap-2">
                  <span className="text-brand-600 dark:text-brand-400 mt-1">●</span>
                  Quels moyens de paiement acceptez-vous ?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                  Cartes de crédit (Visa, Mastercard, Amex), TWINT, Postfinance via Datatrans (certifié PCI-DSS). Virement bancaire disponible pour les paiements annuels.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-3 flex items-start gap-2">
                  <span className="text-brand-600 dark:text-brand-400 mt-1">●</span>
                  Les prix sont-ils HT ou TTC ?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                  Tous les prix affichés sont HT. La TVA suisse (8.1%) est ajoutée automatiquement pour les entreprises suisses. Les entreprises avec numéro TVA peuvent déduire ce montant.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-3 flex items-start gap-2">
                  <span className="text-brand-600 dark:text-brand-400 mt-1">●</span>
                  Où sont hébergées mes données ?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                  100% hébergement en Suisse (datacenters certifiés ISO 27001). Conformité totale RGPD et LPD (Loi suisse sur la Protection des Données). Vos données ne quittent jamais le territoire suisse.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-3 flex items-start gap-2">
                  <span className="text-brand-600 dark:text-brand-400 mt-1">●</span>
                  Y a-t-il un engagement minimum ?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                  Non pour les plans mensuels (résiliation avec préavis de 30 jours). Les plans annuels bénéficient d'un tarif réduit mais impliquent un engagement de 12 mois.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-3 flex items-start gap-2">
                  <span className="text-brand-600 dark:text-brand-400 mt-1">●</span>
                  Puis-je obtenir une facture ?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                  Oui, une facture conforme aux normes suisses est générée automatiquement pour chaque paiement et disponible dans votre espace. Export PDF et comptabilité inclus.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-3 flex items-start gap-2">
                  <span className="text-brand-600 dark:text-brand-400 mt-1">●</span>
                  Quel est le niveau de support inclus ?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                  Starter: email 48h. Professional: email 24h + chat. Enterprise: téléphone 24/7 + success manager dédié. Tous les plans incluent la base de connaissances et les tutoriels.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-3 flex items-start gap-2">
                  <span className="text-brand-600 dark:text-brand-400 mt-1">●</span>
                  Comment fonctionne la facturation annuelle ?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                  Le paiement annuel vous fait économiser environ 17% (équivalent à 2 mois gratuits). Un seul paiement au début de l'année, puis renouvellement automatique. Meilleur ROI garanti.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-3 flex items-start gap-2">
                  <span className="text-brand-600 dark:text-brand-400 mt-1">●</span>
                  Puis-je gérer plusieurs projets simultanément ?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                  Absolument. RealPro est conçu pour les promoteurs multi-projets. Tableau de bord global, vue consolidée des finances, planning inter-projets et rapports comparatifs inclus sur tous les plans.
                </p>
              </div>
            </div>

            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-800/20 border border-brand-200 dark:border-brand-800">
              <h3 className="font-bold text-xl text-neutral-900 dark:text-white mb-3 text-center">
                Vous avez d'autres questions ?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-center mb-6">
                Notre équipe est là pour vous aider à choisir le plan adapté à vos besoins
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact">
                  <Button
                    variant="default"
                    className="bg-brand-600 hover:bg-brand-700 text-white border-0 rounded-full px-6"
                  >
                    Contacter l'équipe commerciale
                  </Button>
                </Link>
                <a href="mailto:contact@realpro.ch">
                  <Button
                    variant="outline"
                    className="rounded-full px-6"
                  >
                    Envoyer un email
                  </Button>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
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
              Besoin d'un plan personnalisé ?
            </h2>
            <p className="text-base md:text-lg text-neutral-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Pour les grandes organisations, contactez-nous pour un devis sur mesure
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="group bg-brand-600 text-white hover:bg-brand-700 border-0 rounded-full px-8 h-12 text-base font-medium shadow-2xl hover:shadow-brand-600/50 transition-all duration-300 hover:scale-105"
                >
                  Nous contacter
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="border-t border-neutral-200/50 dark:border-neutral-800/50 py-12 md:py-16 bg-neutral-50/50 dark:bg-neutral-900/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            <div className="md:col-span-1">
              <div className="mb-4">
                <span className="font-bold text-xl text-neutral-900 dark:text-white">RealPro</span>
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
