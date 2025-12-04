import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { RealProLogo } from '../../components/branding/RealProLogo';
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
  Sparkles
} from 'lucide-react';

export function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const features = [
    {
      icon: Building2,
      title: 'Vue 360° de vos projets',
      description: 'Centralisez toutes les informations de vos promotions dans un seul outil. Vision globale en temps réel de tous vos projets immobiliers.'
    },
    {
      icon: Users,
      title: 'Courtiers & Acheteurs',
      description: 'Gérez les informations des acheteurs avec vos courtiers à titre. Suivi des réservations, signatures et paiements centralisés.'
    },
    {
      icon: FileText,
      title: 'Plans & Modifications',
      description: 'Collaborez avec vos architectes sur les plans. Gérez les demandes de modifications des clients et validez les adaptations.'
    },
    {
      icon: TrendingUp,
      title: 'Offres Fournisseurs',
      description: 'Centralisez les offres selon les choix clients. Gérez plus-values, moins-values et validations d\'offres en un seul endroit.'
    },
    {
      icon: MessageSquare,
      title: 'Communication unifiée',
      description: 'Un seul canal pour tous : architectes, courtiers, clients, fournisseurs, notaires. Fini les emails perdus, tout est centralisé.'
    },
    {
      icon: Clock,
      title: 'Documents & Workflows',
      description: 'Tous vos documents accessibles instantanément. Workflows automatisés de la réservation à la livraison des clés.'
    }
  ];

  const testimonials = [
    {
      quote: "Enfin une vraie vision 360° ! Architectes, courtiers, clients, fournisseurs : tout le monde sur la même plateforme. Plus d'emails perdus, tout est centralisé.",
      author: "Jean Dupont",
      role: "Directeur, Promotions Genevoises SA"
    },
    {
      quote: "La gestion des modifications de plans avec les architectes et la validation des offres fournisseurs selon les choix clients est devenue un jeu d'enfant. Gain de temps incroyable.",
      author: "Marie Schmidt",
      role: "Gérante, Schmidt Développement Immobilier"
    },
    {
      quote: "Centraliser toutes les informations projets au même endroit a transformé notre efficacité. On pilote tous nos projets en temps réel depuis une seule interface.",
      author: "Pierre Rossi",
      role: "CEO, Immobilière Rossi & Partners"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <header className="sticky top-0 z-50 border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-70 flex-shrink-0">
              <RealProLogo width={234} height={70} />
            </Link>

            <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
              <Link to="/features" className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Tarifs
              </Link>
              <Link to="/contact" className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link to="/login">
                <Button variant="outline" size="sm" className="rounded-full h-9">
                  Connexion
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm" className="rounded-full h-9 bg-blue-600 hover:bg-blue-700 border-0 text-white">
                  Essai gratuit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-20 pb-32 md:pt-32 md:pb-40 text-center overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            opacity: Math.max(1 - scrollY / 500, 0)
          }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        </div>

        <div className="animate-in fade-in slide-in-from-top-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-medium mb-8 border border-blue-600/20 hover:bg-blue-600/15 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            Solution #1 pour les promoteurs suisses
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight mb-6 max-w-5xl mx-auto">
            Pilotez vos projets immobiliers avec <span className="text-blue-600">précision</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            La plateforme 360° qui centralise toute l'information de vos projets immobiliers.
            Architectes, courtiers, clients, fournisseurs, notaires : communiquez et gérez tout depuis un seul outil.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/auth/register">
              <Button
                size="lg"
                className="group rounded-full px-8 h-12 text-base font-medium shadow-lg hover:shadow-2xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 hover:scale-105 border-0 text-white"
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

          <div className="flex items-center justify-center gap-6 text-xs text-neutral-500 dark:text-neutral-500 flex-wrap mb-16">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-blue-600" />
              14 jours gratuits
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-blue-600" />
              Sans engagement
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-blue-600" />
              Données en Suisse
            </span>
          </div>

          <div className="relative max-w-6xl mx-auto mt-16">
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-neutral-950 via-transparent to-transparent z-10 pointer-events-none h-32 bottom-0 top-auto" />

            <div className="relative perspective-1000">
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

                <div className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-6 md:p-8">

                  <div className="mb-6 flex items-center justify-between animate-in fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-32 mb-1.5" />
                        <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded w-20" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50 animate-in fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">Projets actifs</div>
                        <TrendingUp className="w-3 h-3 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-1">12</div>
                      <div className="flex items-center gap-1">
                        <div className="text-[9px] text-blue-600 dark:text-blue-400">+3 ce mois</div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 shadow-sm animate-in fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Ventes</div>
                        <Users className="w-3 h-3 text-neutral-500" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">87%</div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-green-600 h-full rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200/50 dark:border-green-800/50 animate-in fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-[10px] font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">Revenu</div>
                        <BarChart3 className="w-3 h-3 text-green-600" />
                      </div>
                      <div className="text-lg font-bold text-green-900 dark:text-green-300 mb-1">CHF 12.4M</div>
                      <div className="text-[9px] text-green-600 dark:text-green-400">+18% vs mois dernier</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-sm animate-in fade-in" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xs font-semibold text-neutral-900 dark:text-white">Activité récente</div>
                        <div className="text-[9px] text-neutral-500">Aujourd'hui</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-1.5" />
                            <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded w-2/3" />
                          </div>
                          <div className="text-[8px] text-neutral-500">2h</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-600/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-4/5 mb-1.5" />
                            <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded w-1/2" />
                          </div>
                          <div className="text-[8px] text-neutral-500">5h</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-600/10 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-1.5" />
                            <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded w-1/3" />
                          </div>
                          <div className="text-[8px] text-neutral-500">1j</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-sm animate-in fade-in" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xs font-semibold text-neutral-900 dark:text-white">Performance</div>
                        <div className="text-[9px] text-blue-600 font-medium">+12%</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-neutral-600 dark:text-neutral-400">Taux de conversion</span>
                          <span className="font-semibold text-neutral-900 dark:text-white">73%</span>
                        </div>
                        <div className="w-full bg-neutral-100 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: '73%' }}></div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] mt-3">
                          <span className="text-neutral-600 dark:text-neutral-400">Délai moyen signature</span>
                          <span className="font-semibold text-neutral-900 dark:text-white">12j</span>
                        </div>
                        <div className="w-full bg-neutral-100 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-green-600 h-full rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] mt-3">
                          <span className="text-neutral-600 dark:text-neutral-400">Satisfaction client</span>
                          <span className="font-semibold text-neutral-900 dark:text-white">4.8/5</span>
                        </div>
                        <div className="w-full bg-neutral-100 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-yellow-500 h-full rounded-full" style={{ width: '96%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 animate-in fade-in" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 border border-neutral-200 dark:border-neutral-700 text-center hover:shadow-md transition-shadow">
                      <div className="text-xl font-bold text-neutral-900 dark:text-white mb-1">156</div>
                      <div className="text-[9px] text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Lots vendus</div>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 border border-neutral-200 dark:border-neutral-700 text-center hover:shadow-md transition-shadow">
                      <div className="text-xl font-bold text-neutral-900 dark:text-white mb-1">23</div>
                      <div className="text-[9px] text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">Courtiers actifs</div>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 border border-neutral-200 dark:border-neutral-700 text-center hover:shadow-md transition-shadow">
                      <div className="text-xl font-bold text-neutral-900 dark:text-white mb-1">8</div>
                      <div className="text-[9px] text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">En construction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight leading-tight">
            Conçu pour les professionnels.<br />Simple par nature.
          </h2>
          <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-normal">
            Chaque fonctionnalité répond à un besoin réel. Rien de superflu, tout l'essentiel.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 hover:bg-white dark:hover:bg-neutral-900 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              style={{
                animation: 'fadeIn 0.5s ease-out',
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-5 shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/30 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-600/5 to-transparent rounded-3xl -z-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent mb-3">
              360°
            </div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Vision complète
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              de vos projets
            </p>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent mb-3">
              5+
            </div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Acteurs connectés
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              en temps réel
            </p>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent mb-3">
              1
            </div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Seule plateforme
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              tout en un
            </p>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent mb-3">
              100%
            </div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Centralisé
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              et sécurisé
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-medium mb-6">
              <MessageSquare className="w-3.5 h-3.5" />
              Centralisation totale
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6 tracking-tight leading-tight">
              Tous vos acteurs.<br />Une seule plateforme.
            </h2>
            <p className="text-base text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              Fini les emails perdus, les fichiers Excel dispersés et les informations manquantes. RealPro connecte architectes, courtiers, clients, fournisseurs et notaires en temps réel.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600/10 dark:bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                    Communication unifiée
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Échangez avec tous vos partenaires depuis une seule interface
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600/10 dark:bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                    Données synchronisées
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Toutes les informations mises à jour en temps réel
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600/10 dark:bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                    Traçabilité complète
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Historique de toutes les décisions et validations
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-700">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">Architecte</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Plans validés</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">Courtier</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Contrat signé</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">Fournisseur</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Offre validée</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                  <div className="w-10 h-10 rounded-lg bg-neutral-700/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-neutral-700 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">Client</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Choix confirmés</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight">
            Pourquoi choisir RealPro ?
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Des avantages concrets pour votre quotidien
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="group bg-gradient-to-br from-blue-600/5 to-blue-600/10 dark:from-blue-600/10 dark:to-blue-600/5 rounded-3xl p-8 border border-blue-600/20 hover:border-blue-600/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Gagnez du temps
                </h3>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Plus besoin de jongler entre 10 outils différents. Tout est centralisé dans RealPro.
                </p>
                <p className="text-sm font-semibold text-blue-600 mt-2">
                  15h économisées par semaine en moyenne
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-neutral-50 to-neutral-100/50 dark:from-neutral-900/50 dark:to-neutral-800/30 rounded-3xl p-8 border border-neutral-200/50 dark:border-neutral-700/50 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-700 dark:bg-neutral-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Zéro erreur
                </h3>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Les informations sont synchronisées automatiquement. Plus de risque d'oublier une validation ou de perdre un document important.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-[#F5A623]/5 to-[#F5A623]/10 dark:from-[#F5A623]/10 dark:to-[#F5A623]/5 rounded-3xl p-8 border border-[#F5A623]/20 hover:border-[#F5A623]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5A623] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Communication fluide
                </h3>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Échangez avec tous vos partenaires depuis la même interface. Historique complet de toutes les conversations.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-neutral-50 to-neutral-100/50 dark:from-neutral-900/50 dark:to-neutral-800/30 rounded-3xl p-8 border border-neutral-200/50 dark:border-neutral-700/50 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-700 dark:bg-neutral-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Décisions rapides
                </h3>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Validez les offres fournisseurs, gérez les modifications clients et approuvez les documents en quelques clics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-neutral-50 dark:bg-neutral-900/30">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-medium mb-6">
              <Clock className="w-3.5 h-3.5" />
              Flux de travail simplifié
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight leading-tight">
              De la conception à la livraison
            </h2>
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Suivez chaque étape de vos projets avec une visibilité totale
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Phase Conception
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                Collaborez avec vos architectes sur les plans. Gérez les demandes de modifications clients en temps réel.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  Plans partagés
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  Modifications validées
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  Historique complet
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5A623] to-[#e09520] flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Phase Commercialisation
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                Travaillez avec vos courtiers pour gérer les acheteurs. Centralisez contrats et signatures.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F5A623]"></div>
                  Infos acheteurs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F5A623]"></div>
                  Contrats centralisés
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F5A623]"></div>
                  Suivi paiements
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Phase Réalisation
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                Gérez les choix clients et validez les offres fournisseurs. Plus-values et moins-values en un clic.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700"></div>
                  Choix matériaux
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700"></div>
                  Offres fournisseurs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700"></div>
                  Validation rapide
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight">
              Ils nous font confiance
            </h2>
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Des promoteurs qui gagnent du temps chaque jour
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-600/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                style={{
                  animation: 'fadeIn 0.5s ease-out',
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="mb-6">
                  <svg className="w-8 h-8 text-blue-600/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                  {testimonial.quote}
                </p>
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-medium mb-6">
              <Shield className="w-3.5 h-3.5" />
              Sécurité & Conformité
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight">
              Vos données en sécurité
            </h2>
            <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Conformité RGPD et hébergement en Suisse
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-blue-600/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Données cryptées
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Chiffrement de bout en bout pour toutes vos données sensibles
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-blue-600/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🇨🇭</span>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Hébergé en Suisse
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Vos données restent en Suisse, conformément aux lois locales
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-blue-600/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Conforme RGPD
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Respect total de la réglementation européenne
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 rounded-[2.5rem] p-12 md:p-20 text-center text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/10"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-600 rounded-full blur-3xl"></div>
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-600/30 text-blue-300 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Démarrez en 5 minutes
            </div>

            <h2 className="text-3xl md:text-5xl font-semibold mb-5 tracking-tight leading-tight max-w-3xl mx-auto">
              Prêt à transformer votre gestion de projets ?
            </h2>
            <p className="text-base md:text-lg text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Rejoignez les promoteurs immobiliers qui économisent <span className="text-blue-400 font-semibold">15h par semaine</span> avec RealPro.
              Testez gratuitement pendant 14 jours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link to="/auth/register">
                <Button
                  size="lg"
                  className="group bg-blue-600 text-white hover:bg-blue-700 border-0 rounded-full px-8 h-12 text-base font-medium shadow-2xl hover:shadow-blue-600/50 transition-all duration-300 hover:scale-105"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-8 h-12 text-base font-medium backdrop-blur-sm transition-all duration-300"
                >
                  Demander une démo
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-400" />
                Sans carte bancaire
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-400" />
                Sans engagement
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-400" />
                Support inclus
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-200/50 dark:border-neutral-800/50 py-16 bg-neutral-50/50 dark:bg-neutral-900/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="mb-6">
                <RealProLogo width={210} height={63} />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-4 max-w-xs leading-relaxed">
                La solution complète pour les promoteurs immobiliers suisses
              </p>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-4 text-sm">Produit</h3>
              <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                <li><Link to="/features" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Fonctionnalités</Link></li>
                <li><Link to="/pricing" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Tarifs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-4 text-sm">Entreprise</h3>
              <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                <li><Link to="/about" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">À propos</Link></li>
                <li><Link to="/contact" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-4 text-sm">Légal</h3>
              <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                <li><Link to="/legal/cgu" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">CGU</Link></li>
                <li><Link to="/legal/cgv" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">CGV</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Confidentialité</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-200/50 dark:border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-500 text-center sm:text-left">
              © 2024-2025 Realpro SA. Tous droits réservés.
            </p>
            <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-600">
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
