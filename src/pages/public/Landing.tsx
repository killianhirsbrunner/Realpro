import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { PublicHeader } from '../../components/layout/PublicHeader';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { ScrollReveal, FadeIn } from '../../components/ui/PageTransition';
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Check,
  Shield,
  Calculator,
  Calendar,
  Globe,
  Lock,
  Headphones,
  Zap,
  ChevronDown,
  ChevronUp,
  Star,
  Quote,
  Home,
  Briefcase,
  Wallet,
  Key,
  HardHat,
  FileCheck,
  Receipt,
  Wrench,
  LogIn,
  DollarSign,
  LayoutGrid,
} from 'lucide-react';

// Les 3 applications de la suite
const apps = [
  {
    id: 'ppe-admin',
    name: 'PPE Admin',
    tagline: 'Administrateur de copropriétés',
    description: 'Gérez efficacement vos immeubles en copropriété : assemblées générales, budgets, charges, documents et communication avec les copropriétaires.',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500',
    lightBg: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    href: '/app/ppe-admin',
    features: [
      { icon: Users, label: 'Gestion des copropriétaires' },
      { icon: Calendar, label: 'Assemblées générales' },
      { icon: Calculator, label: 'Budget & charges CFC' },
      { icon: FileText, label: 'GED documentaire' },
      { icon: Wrench, label: 'Tickets & interventions' },
    ],
    stats: { label: 'Immeubles gérés', value: '500+' },
  },
  {
    id: 'regie',
    name: 'Régie',
    tagline: 'Gestion locative immobilière',
    description: 'Pilotez votre parc locatif de A à Z : baux, encaissements, états des lieux, maintenance technique et relation propriétaires.',
    icon: Home,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    href: '/app/regie',
    features: [
      { icon: Key, label: 'Gestion des baux' },
      { icon: Receipt, label: 'Encaissements & rappels' },
      { icon: LogIn, label: 'États des lieux' },
      { icon: Wrench, label: 'Maintenance technique' },
      { icon: Wallet, label: 'Mandats propriétaires' },
    ],
    stats: { label: 'Baux actifs', value: '2,000+' },
  },
  {
    id: 'promoteur',
    name: 'Promoteur',
    tagline: 'Promotion immobilière',
    description: 'Centralisez vos projets de promotion : ventes, pipeline commercial, suivi de chantier, finances CFC et documentation.',
    icon: Briefcase,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500',
    lightBg: 'bg-purple-50 dark:bg-purple-900/20',
    textColor: 'text-purple-600 dark:text-purple-400',
    href: '/app/promoteur',
    features: [
      { icon: TrendingUp, label: 'Pipeline de ventes' },
      { icon: HardHat, label: 'Suivi de chantier' },
      { icon: DollarSign, label: 'Finances & CFC' },
      { icon: FileCheck, label: 'Documents projets' },
      { icon: Users, label: 'CRM acquéreurs' },
    ],
    stats: { label: 'Projets livrés', value: '200+' },
  },
];

const testimonials = [
  {
    quote: 'Realpro a transformé notre façon de gérer nos promotions. Le gain de temps est considérable et nos clients apprécient la transparence.',
    author: 'Marc Dubois',
    role: 'Directeur général',
    company: 'Dubois Immobilier SA',
    location: 'Genève',
    app: 'Promoteur',
    avatar: 'MD',
  },
  {
    quote: 'L\'application Régie nous permet de gérer 500 baux sans effort. Les rappels automatiques ont réduit nos impayés de 40%.',
    author: 'Sophie Müller',
    role: 'Responsable gérance',
    company: 'Helvetia Immobilier',
    location: 'Zurich',
    app: 'Régie',
    avatar: 'SM',
  },
  {
    quote: 'La gestion des AG est devenue un jeu d\'enfant. Les copropriétaires ont accès à tous leurs documents en ligne.',
    author: 'Pierre Fontana',
    role: 'Administrateur PPE',
    company: 'Fontana Gestion',
    location: 'Lausanne',
    app: 'PPE Admin',
    avatar: 'PF',
  },
];

const faqs = [
  {
    question: 'Puis-je utiliser une seule application ou dois-je prendre la suite complète ?',
    answer: 'Chaque application est indépendante et peut être utilisée seule. Vous pouvez commencer avec une application et en ajouter d\'autres selon vos besoins. La suite complète offre des avantages tarifaires et une meilleure intégration des données.',
  },
  {
    question: 'Combien de temps faut-il pour déployer une application ?',
    answer: 'Le déploiement initial prend généralement 48 heures. Cela inclut la création de votre compte, l\'import de vos données existantes et une formation de prise en main pour votre équipe.',
  },
  {
    question: 'Mes données sont-elles en sécurité ?',
    answer: 'Absolument. Toutes vos données sont hébergées exclusivement en Suisse, dans des datacenters certifiés ISO 27001. Nous appliquons un chiffrement de bout en bout (AES-256) et sommes conformes au RGPD et à la LPD suisse.',
  },
  {
    question: 'Y a-t-il un engagement minimum ?',
    answer: 'Non, nos abonnements sont sans engagement. Vous pouvez résilier à tout moment. Nous proposons également une période d\'essai gratuite de 14 jours pour tester toutes les fonctionnalités.',
  },
  {
    question: 'Le support est-il inclus dans l\'abonnement ?',
    answer: 'Oui, tous nos plans incluent un support par e-mail et chat. Les plans Professional et Enterprise bénéficient d\'un support téléphonique prioritaire et d\'un Customer Success Manager dédié.',
  },
];

const trustPoints = [
  {
    icon: Shield,
    title: 'Sécurité suisse',
    description: 'Hébergement exclusif en Suisse, conformité RGPD et LPD.',
  },
  {
    icon: Globe,
    title: 'Multilingue',
    description: 'Interface en français, allemand, italien et anglais.',
  },
  {
    icon: Headphones,
    title: 'Support dédié',
    description: 'Équipe basée en Suisse, disponible par téléphone et chat.',
  },
  {
    icon: Lock,
    title: 'Conformité',
    description: 'Normes CFC, intégration bancaire et notariale suisse.',
  },
];

export function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedApp, setSelectedApp] = useState(apps[0]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <PublicHeader />

      {/* Hero Section - Suite Overview */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-b from-neutral-50 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeIn delay={100}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-realpro-turquoise/10 text-realpro-turquoise text-sm font-medium mb-6 border border-realpro-turquoise/20">
                <LayoutGrid className="w-3.5 h-3.5" />
                3 applications • 1 plateforme
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-[1.1] tracking-tight mb-6">
                La suite complète pour<br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500">
                  l'immobilier suisse
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={300}>
              <p className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                PPE Admin, Régie et Promoteur : trois applications métier conçues pour les professionnels suisses de l'immobilier. Choisissez celle qui correspond à votre activité.
              </p>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/register">
                  <Button size="lg" className="h-13 px-8 text-base bg-realpro-turquoise hover:bg-realpro-turquoise-dark text-white border-0 shadow-lg shadow-realpro-turquoise/20 font-medium">
                    Essai gratuit 14 jours
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="h-13 px-8 text-base border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    Demander une démo
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Apps Cards Preview */}
          <FadeIn delay={500}>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {apps.map((app) => (
                <Link
                  key={app.id}
                  to={app.href}
                  className="group relative bg-white dark:bg-neutral-800/50 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-transparent hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${app.color}`} />
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-xl ${app.lightBg} group-hover:bg-white/20 flex items-center justify-center mb-4 transition-colors`}>
                      <app.icon className={`w-7 h-7 ${app.textColor} group-hover:text-white transition-colors`} />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-white mb-1 transition-colors">
                      {app.name}
                    </h3>
                    <p className="text-sm text-neutral-500 group-hover:text-white/80 mb-4 transition-colors">
                      {app.tagline}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-realpro-turquoise group-hover:text-white transition-colors">
                      Accéder à l'app
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Apps Detailed Section */}
      <section className="py-24 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                Découvrez nos applications
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Chaque application est conçue pour répondre aux besoins spécifiques de votre métier.
              </p>
            </div>
          </ScrollReveal>

          {/* App Selector Tabs */}
          <ScrollReveal>
            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-white dark:bg-neutral-800 rounded-xl p-1.5 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      selectedApp.id === app.id
                        ? `${app.bgColor} text-white shadow-lg`
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <app.icon className="w-4 h-4" />
                    {app.name}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Selected App Details */}
          <ScrollReveal>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Features */}
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${selectedApp.lightBg} ${selectedApp.textColor} text-sm font-medium mb-4`}>
                  <selectedApp.icon className="w-4 h-4" />
                  {selectedApp.name}
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                  {selectedApp.tagline}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                  {selectedApp.description}
                </p>

                <div className="space-y-4 mb-8">
                  {selectedApp.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg ${selectedApp.lightBg} flex items-center justify-center`}>
                        <feature.icon className={`w-5 h-5 ${selectedApp.textColor}`} />
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Link to={selectedApp.href}>
                    <Button className={`${selectedApp.bgColor} hover:opacity-90 text-white border-0`}>
                      Accéder à {selectedApp.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline">
                      Demander une démo
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right - App Preview */}
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedApp.color} opacity-10 rounded-3xl blur-2xl`} />
                <div className="relative bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl overflow-hidden">
                  {/* Browser Header */}
                  <div className="bg-neutral-100 dark:bg-neutral-900 px-4 py-3 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="px-4 py-1 bg-white dark:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-500">
                        app.realpro.ch/{selectedApp.id}
                      </div>
                    </div>
                  </div>

                  {/* App Content Preview */}
                  <div className="p-6 min-h-[400px] bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                          Tableau de bord
                        </h4>
                        <p className="text-xs text-neutral-500">Bienvenue sur {selectedApp.name}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full ${selectedApp.lightBg} ${selectedApp.textColor} text-xs font-medium`}>
                        {selectedApp.stats.value} {selectedApp.stats.label}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {selectedApp.features.slice(0, 4).map((feature, i) => (
                        <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                          <div className={`w-8 h-8 rounded-lg ${selectedApp.lightBg} flex items-center justify-center mb-2`}>
                            <feature.icon className={`w-4 h-4 ${selectedApp.textColor}`} />
                          </div>
                          <p className="text-xs text-neutral-500">{feature.label}</p>
                          <p className="text-lg font-bold text-neutral-900 dark:text-white">
                            {Math.floor(Math.random() * 100) + 10}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Activity List */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                      <h5 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                        Activité récente
                      </h5>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <div className="flex-1">
                              <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                            </div>
                            <div className="text-xs text-neutral-400">il y a {i}h</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-realpro-turquoise/10 text-realpro-turquoise text-sm font-medium mb-4 border border-realpro-turquoise/20">
                <Zap className="w-3.5 h-3.5" />
                Accès rapide
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                Lancez-vous dès maintenant
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Choisissez votre application et commencez à travailler en quelques clics.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {apps.map((app) => (
              <ScrollReveal key={app.id}>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${app.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
                  <div className="relative bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700 hover:border-transparent transition-all h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-6 shadow-lg`}>
                      <app.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                      {app.name}
                    </h3>
                    <p className={`text-sm ${app.textColor} font-medium mb-3`}>
                      {app.tagline}
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                      {app.description}
                    </p>

                    <div className="space-y-2 mb-8">
                      {app.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Check className={`w-4 h-4 ${app.textColor}`} />
                          {feature.label}
                        </div>
                      ))}
                    </div>

                    <Link to={app.href} className="block">
                      <Button className={`w-full ${app.bgColor} hover:opacity-90 text-white border-0`}>
                        Ouvrir {app.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-realpro-turquoise/10 text-realpro-turquoise text-sm font-medium mb-4 border border-realpro-turquoise/20">
                <Star className="w-3.5 h-3.5" />
                Témoignages
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                Ils utilisent Realpro au quotidien
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index}>
                <div className="relative bg-white dark:bg-neutral-800/50 rounded-2xl p-8 border border-neutral-200/80 dark:border-neutral-700/50 h-full flex flex-col">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-medium mb-4 w-fit">
                    Utilise {testimonial.app}
                  </div>
                  <Quote className="w-10 h-10 text-realpro-turquoise/20 mb-4" />
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6 flex-grow">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-realpro-turquoise to-realpro-turquoise-dark flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-8 px-8 py-4 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-realpro-turquoise">50+</div>
                  <div className="text-sm text-neutral-500">Sociétés clientes</div>
                </div>
                <div className="w-px h-12 bg-neutral-200 dark:bg-neutral-700"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-realpro-turquoise">3,000+</div>
                  <div className="text-sm text-neutral-500">Objets gérés</div>
                </div>
                <div className="w-px h-12 bg-neutral-200 dark:bg-neutral-700"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-realpro-turquoise">98%</div>
                  <div className="text-sm text-neutral-500">Satisfaction</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                Pensé pour la Suisse
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
                Développé en Suisse, avec une parfaite maîtrise des spécificités locales.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustPoints.map((point) => (
              <ScrollReveal key={point.title}>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-5 border border-neutral-200/80 dark:border-neutral-700/50 h-full">
                  <div className="w-10 h-10 rounded-lg bg-realpro-turquoise/10 flex items-center justify-center mb-3">
                    <point.icon className="w-5 h-5 text-realpro-turquoise" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1.5">
                    {point.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-neutral-50/70 dark:bg-neutral-900/30">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-realpro-turquoise/10 text-realpro-turquoise text-sm font-medium mb-4 border border-realpro-turquoise/20">
                <MessageSquare className="w-3.5 h-3.5" />
                FAQ
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                Questions fréquentes
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index}>
                <div className="bg-white dark:bg-neutral-800/50 rounded-xl border border-neutral-200/80 dark:border-neutral-700/50 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors"
                  >
                    <span className="font-medium text-neutral-900 dark:text-white pr-4">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-realpro-turquoise flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 lg:py-28 bg-neutral-900 dark:bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative">
          <ScrollReveal>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5 tracking-tight">
              Prêt à optimiser votre gestion immobilière ?
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
              Choisissez l'application qui correspond à votre métier et commencez gratuitement.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Link to="/register">
                <Button size="lg" className="h-13 px-8 text-base bg-realpro-turquoise hover:bg-realpro-turquoise-light text-white border-0 shadow-lg shadow-realpro-turquoise/20 font-medium">
                  Démarrer l'essai gratuit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="h-13 px-8 text-base border-neutral-600 text-white hover:bg-neutral-800 hover:border-neutral-500">
                  Planifier une démo
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-realpro-turquoise" />
                14 jours gratuits
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-realpro-turquoise" />
                Sans carte bancaire
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-realpro-turquoise" />
                Support inclus
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
