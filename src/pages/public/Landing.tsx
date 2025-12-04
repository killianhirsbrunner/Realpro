import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { RealProLogo } from '../../components/branding/RealProLogo';
import { ThemeToggle } from '../../components/ThemeToggle';
import { ScrollReveal, FadeIn } from '../../components/ui/PageTransition';
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  MessageSquare,
  Clock,
  Zap,
  ArrowRight,
  Check,
  BarChart3,
  Shield,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Building2,
      title: 'Vision 360° en temps réel',
      description: 'Pilotez l\'intégralité de votre portefeuille de promotions depuis un tableau de bord centralisé. Indicateurs de performance, alertes prédictives et métriques stratégiques synchronisés en temps réel pour une prise de décision éclairée.'
    },
    {
      icon: Users,
      title: 'Gestion commerciale complète',
      description: 'Système CRM professionnel dédié à l\'immobilier promoteur. Automatisez votre cycle de vente depuis la prospection jusqu\'à la signature, avec suivi des courtiers, gestion des réservations et monitoring des encaissements.'
    },
    {
      icon: FileText,
      title: 'Collaboration architecturale',
      description: 'Plateforme collaborative pour architectes et bureaux d\'études. Annotez les plans directement en ligne, validez les modifications clients et calculez automatiquement l\'impact financier de chaque demande de modification.'
    },
    {
      icon: TrendingUp,
      title: 'Soumissions & Appels d\'offres',
      description: 'Centralisez et optimisez votre processus d\'adjudication. Comparez les offres fournisseurs, détectez automatiquement les écarts de coûts et sécurisez vos marges avec une analyse comparative intelligente.'
    },
    {
      icon: MessageSquare,
      title: 'Hub de communication centralisé',
      description: 'Fédérez tous vos interlocuteurs sur une plateforme unique et sécurisée. Conversations contextualisées par projet et lot, archivage intelligent des documents et traçabilité complète des échanges pour une gestion sans faille.'
    },
    {
      icon: Clock,
      title: 'Automatisation intelligente',
      description: 'Workflows automatisés de bout en bout, de la première prise de contact jusqu\'à la remise des clés. Notifications contextuelles, rappels intelligents et orchestration des processus pour maximiser votre efficacité opérationnelle.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      {/* Header */}
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-4 px-6 animate-in fade-in slide-in-from-top-2">
            <nav className="flex flex-col gap-3">
              <Link to="/features" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-2">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-2">
                Tarifs
              </Link>
              <Link to="/contact" className="text-neutral-700 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-2">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32 text-center overflow-hidden">
        <div
          className="absolute inset-0 -z-10 transition-all duration-300"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            opacity: Math.max(1 - scrollY / 500, 0)
          }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-600/10 dark:bg-brand-600/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-brand-600/10 dark:bg-brand-600/5 rounded-full blur-3xl" />
        </div>

        <FadeIn delay={100}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-600/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6 border border-brand-600/20 hover:bg-brand-600/15 transition-colors cursor-pointer">
            <Sparkles className="w-3.5 h-3.5" />
            Solution #1 pour les promoteurs suisses
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 dark:text-white leading-[1.1] tracking-tight mb-6 max-w-5xl mx-auto">
            Pilotez vos promotions avec une <span className="bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 bg-clip-text text-transparent">précision absolue</span>
          </h1>
        </FadeIn>

        <FadeIn delay={300}>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8 leading-relaxed px-4">
            La seule plateforme qui centralise 100% de vos opérations immobilières.
            <span className="text-neutral-900 dark:text-white font-medium"> Architectes, courtiers, acheteurs, fournisseurs et notaires</span> : tous connectés en temps réel.
          </p>
        </FadeIn>

        <FadeIn delay={400}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link to="/auth/register">
              <Button
                size="lg"
                className="group rounded-full px-8 h-12 text-base font-medium shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 hover:scale-105 border-0 text-white"
              >
                Commencer gratuitement
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-12 text-base font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all duration-300"
              >
                Voir les tarifs
              </Button>
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={500}>
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-500 flex-wrap mb-12">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-brand-600" />
              14 jours gratuits
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-brand-600" />
              Sans engagement
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-brand-600" />
              Données en Suisse
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={600}>
          <div className="relative max-w-6xl mx-auto mt-12">
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-neutral-950 via-transparent to-transparent z-10 pointer-events-none h-32 bottom-0 top-auto" />
            <div className="relative rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
              <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="px-4 py-1 bg-white dark:bg-neutral-700 rounded-md border border-neutral-200 dark:border-neutral-600 text-[10px] text-neutral-600 dark:text-neutral-400 max-w-xs truncate">
                    realpro.ch/dashboard
                  </div>
                </div>
              </div>

              <div className="flex bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
                <div className="hidden md:flex flex-col w-16 bg-neutral-100 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-2 gap-2">
                  <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                    <Users className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  </div>
                </div>

                <div className="flex-1 p-4 sm:p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Vue d'ensemble</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Dernière mise à jour : il y a 2 min</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    <div className="bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-800/20 rounded-xl p-3 border border-brand-200/50 dark:border-brand-800/50 h-24 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[9px] font-semibold text-brand-700 dark:text-brand-400 uppercase tracking-wide">Projets actifs</div>
                        <TrendingUp className="w-3 h-3 text-brand-600 flex-shrink-0" />
                      </div>
                      <div className="text-2xl font-bold text-brand-900 dark:text-brand-300 leading-none">12</div>
                      <div className="text-[9px] text-brand-600 dark:text-brand-400 mt-auto">+2 ce mois</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-3 border border-orange-200/50 dark:border-orange-800/50 h-24 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[9px] font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide">Taux de vente</div>
                        <Users className="w-3 h-3 text-orange-600 flex-shrink-0" />
                      </div>
                      <div className="text-2xl font-bold text-orange-900 dark:text-orange-300 leading-none">87%</div>
                      <div className="text-[9px] text-orange-600 dark:text-orange-400 mt-auto">234/268 lots</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-3 border border-green-200/50 dark:border-green-800/50 h-24 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[9px] font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">Revenu total</div>
                        <BarChart3 className="w-3 h-3 text-green-600 flex-shrink-0" />
                      </div>
                      <div className="text-2xl font-bold text-green-900 dark:text-green-300 leading-none">12.4M</div>
                      <div className="text-[9px] text-green-600 dark:text-green-400 mt-auto">+8.2% vs. prévu</div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3 border border-blue-200/50 dark:border-blue-800/50 h-24 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[9px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">Prospects</div>
                        <MessageSquare className="w-3 h-3 text-blue-600 flex-shrink-0" />
                      </div>
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-300 leading-none">142</div>
                      <div className="text-[9px] text-blue-600 dark:text-blue-400 mt-auto">18 nouveaux</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-neutral-800/50 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 h-40 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-neutral-900 dark:text-white">Évolution des ventes</h4>
                        <span className="text-[9px] text-neutral-500">6 mois</span>
                      </div>
                      <div className="flex items-end gap-1 flex-1">
                        <div className="flex-1 bg-gradient-to-t from-brand-600 to-brand-400 rounded-t" style={{height: '45%'}}></div>
                        <div className="flex-1 bg-gradient-to-t from-brand-600 to-brand-400 rounded-t" style={{height: '60%'}}></div>
                        <div className="flex-1 bg-gradient-to-t from-brand-600 to-brand-400 rounded-t" style={{height: '55%'}}></div>
                        <div className="flex-1 bg-gradient-to-t from-brand-600 to-brand-400 rounded-t" style={{height: '75%'}}></div>
                        <div className="flex-1 bg-gradient-to-t from-brand-600 to-brand-400 rounded-t" style={{height: '85%'}}></div>
                        <div className="flex-1 bg-gradient-to-t from-brand-600 to-brand-400 rounded-t" style={{height: '100%'}}></div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[8px] text-neutral-500">Jan</span>
                        <span className="text-[8px] text-neutral-500">Juin</span>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800/50 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 h-40 flex flex-col">
                      <h4 className="text-xs font-semibold text-neutral-900 dark:text-white mb-3">Projets récents</h4>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-medium text-neutral-900 dark:text-white truncate">Les Jardins du Lac</div>
                            <div className="text-[8px] text-neutral-500">42 lots • 89% vendus</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-medium text-neutral-900 dark:text-white truncate">Résidence Panorama</div>
                            <div className="text-[8px] text-neutral-500">28 lots • 67% vendus</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-medium text-neutral-900 dark:text-white truncate">Villa des Pins</div>
                            <div className="text-[8px] text-neutral-500">15 lots • 45% vendus</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 h-16 flex items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-[9px] font-semibold text-amber-900 dark:text-amber-300 leading-tight">3 échéances cette semaine</div>
                          <div className="text-[8px] text-amber-700 dark:text-amber-400 mt-0.5">CFC, signatures, RDV</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 h-16 flex items-center">
                      <div className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-[9px] font-semibold text-green-900 dark:text-green-300 leading-tight">8 contrats signés ce mois</div>
                          <div className="text-[8px] text-green-700 dark:text-green-400 mt-0.5">CHF 2.1M encaissés</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Features Section - Background Color */}
      <section className="bg-gradient-to-br from-neutral-50 via-neutral-100/50 to-neutral-50 dark:from-neutral-900/50 dark:via-neutral-900 dark:to-neutral-900/50 py-16 md:py-24 border-y border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight leading-tight">
                Tout ce dont vous avez besoin.<br />
                <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">Rien de superflu.</span>
              </h2>
              <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Chaque module conçu avec des promoteurs pour répondre aux défis réels du terrain.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title}>
                <div className="group p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer backdrop-blur-sm">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center mb-5 shadow-lg shadow-brand-600/20 group-hover:shadow-brand-600/40 group-hover:scale-110 transition-all duration-500">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-600/5 dark:via-brand-600/10 to-transparent rounded-3xl -z-10" />
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: '360°', label: 'Vision complète', sublabel: 'de vos projets' },
              { value: '5+', label: 'Acteurs connectés', sublabel: 'en temps réel' },
              { value: '1', label: 'Seule plateforme', sublabel: 'tout en un' },
              { value: '100%', label: 'Centralisé', sublabel: 'et sécurisé' }
            ].map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-brand-600 to-brand-700 bg-clip-text text-transparent mb-3">
                  {stat.value}
                </div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {stat.label}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {stat.sublabel}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* CTA Section - Background Color */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-16 md:py-24 border-y border-neutral-800 dark:border-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-transparent to-brand-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-brand-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-brand-600 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-600/20 border border-brand-600/30 text-brand-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Démarrez en 5 minutes
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight leading-tight">
              Prêt à transformer votre gestion ?
            </h2>
            <p className="text-base md:text-lg text-neutral-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Rejoignez les promoteurs qui économisent <span className="text-brand-400 font-semibold">15h par semaine</span> avec RealPro.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/register">
                <Button
                  size="lg"
                  className="group bg-brand-600 text-white hover:bg-brand-700 border-0 rounded-full px-8 h-12 text-base font-medium shadow-2xl hover:shadow-brand-600/50 transition-all duration-300 hover:scale-105"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-neutral-900 rounded-full px-8 h-12 text-base font-medium backdrop-blur-md transition-all duration-300 hover:scale-105"
                >
                  Demander une démo
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
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
