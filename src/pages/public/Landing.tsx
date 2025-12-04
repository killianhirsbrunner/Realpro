import { Link } from 'react-router-dom';
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
  Check
} from 'lucide-react';

export function Landing() {
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
            <Link to="/" className="flex items-center transition-opacity hover:opacity-80 flex-shrink-0">
              <RealProLogo width={186} height={49} />
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

      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-medium mb-8 border border-blue-600/20">
          <Zap className="w-3.5 h-3.5" />
          Solution #1 pour les promoteurs suisses
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight mb-6 max-w-5xl mx-auto">
          Pilotez vos projets immobiliers avec précision
        </h1>

        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          La plateforme 360° qui centralise toute l'information de vos projets immobiliers.
          Architectes, courtiers, clients, fournisseurs, notaires : communiquez et gérez tout depuis un seul outil.
          Une vision globale, un contrôle total.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/auth/register">
            <Button size="lg" className="rounded-full px-8 h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all bg-blue-600 hover:bg-blue-700 border-0 text-white">
              Commencer gratuitement
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-medium">
              Voir les tarifs
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-neutral-500 dark:text-neutral-500 flex-wrap">
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
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 hover:bg-white dark:hover:bg-neutral-900 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-5 shadow-lg shadow-blue-600/20">
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

      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              360°
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Vision complète
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              5+
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Acteurs connectés
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              1
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Seule plateforme
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              100%
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Centralisé
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

      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-600/5 to-blue-600/10 dark:from-blue-600/10 dark:to-blue-600/5 rounded-3xl p-8 border border-blue-600/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Gagnez du temps
                </h3>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Plus besoin de jongler entre 10 outils différents. Tout est centralisé dans RealPro. Nos clients économisent en moyenne 15h par semaine.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/50 dark:from-neutral-900/50 dark:to-neutral-800/30 rounded-3xl p-8 border border-neutral-200/50 dark:border-neutral-700/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-700 dark:bg-neutral-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-white" />
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

          <div className="bg-gradient-to-br from-[#F5A623]/5 to-[#F5A623]/10 dark:from-[#F5A623]/10 dark:to-[#F5A623]/5 rounded-3xl p-8 border border-[#F5A623]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5A623] flex items-center justify-center flex-shrink-0">
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

          <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/50 dark:from-neutral-900/50 dark:to-neutral-800/30 rounded-3xl p-8 border border-neutral-200/50 dark:border-neutral-700/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-700 dark:bg-neutral-600 flex items-center justify-center flex-shrink-0">
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
                className="p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50"
              >
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
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

      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 rounded-[2.5rem] p-12 md:p-20 text-center text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/10"></div>
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-semibold mb-5 tracking-tight leading-tight max-w-3xl mx-auto">
              Prêt à transformer votre gestion de projets ?
            </h2>
            <p className="text-base md:text-lg text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Une plateforme. Tous vos acteurs. Toutes vos informations.
              Testez gratuitement pendant 14 jours. Sans engagement, sans carte bancaire.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/register">
                <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 border-0 rounded-full px-8 h-12 text-base font-medium shadow-2xl">
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border border-white/30 text-white hover:bg-white/10 rounded-full px-8 h-12 text-base font-medium backdrop-blur-sm">
                  Demander une démo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-200/50 dark:border-neutral-800/50 py-16 bg-neutral-50/50 dark:bg-neutral-900/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="mb-4">
                <RealProLogo width={186} height={49} />
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
