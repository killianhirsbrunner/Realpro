import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Home,
  ArrowRight,
  CheckCircle,
  Shield,
  Server,
  Clock,
  Zap,
  BarChart3,
  FileText,
  Bell,
  Lock,
  Globe,
  ChevronRight,
  Star,
  Quote,
  Play
} from 'lucide-react';
import { RealproLogo } from '../../../../src/components/branding/RealProLogo';

// App definitions with extended info
const apps = [
  {
    id: 'ppe-admin',
    name: 'PPE Admin',
    tagline: 'Syndic & Copropriétés',
    description: 'Gérez vos copropriétés avec une solution complète et intuitive. Assemblées, charges, fonds de rénovation.',
    icon: Building2,
    href: '/ppe',
    color: 'from-blue-500 to-blue-600',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    features: [
      'Assemblées générales digitalisées',
      'Répartition automatique des charges',
      'Gestion des fonds de rénovation',
      'Portail copropriétaires',
      'Documents & PV en ligne'
    ],
  },
  {
    id: 'promoteur',
    name: 'Promoteur',
    tagline: 'Promotion Immobilière',
    description: 'Pilotez vos projets de promotion de A à Z. Ventes, suivi chantier, relation acquéreurs.',
    icon: Home,
    href: '/promoteur',
    color: 'from-emerald-500 to-emerald-600',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    features: [
      'Gestion multi-projets',
      'CRM acquéreurs intégré',
      'Suivi avancement chantier',
      'Configurateur en ligne',
      'Tableaux de bord financiers'
    ],
  },
  {
    id: 'regie',
    name: 'Régie',
    tagline: 'Gérance Immobilière',
    description: 'Optimisez la gestion de votre parc locatif. Baux, encaissements, maintenance, états des lieux.',
    icon: Users,
    href: '/regie',
    color: 'from-purple-500 to-purple-600',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    features: [
      'Gestion des baux & locataires',
      'Encaissements automatisés',
      'États des lieux digitaux',
      'Portail locataire',
      'Gestion technique & maintenance'
    ],
  },
];

// Stats with icons
const stats = [
  { value: '500+', label: 'Immeubles gérés', icon: Building2 },
  { value: '10\'000+', label: 'Utilisateurs actifs', icon: Users },
  { value: '99.9%', label: 'Disponibilité', icon: Clock },
  { value: '100%', label: 'Hébergé en Suisse', icon: Shield },
];

// Platform features
const platformFeatures = [
  {
    icon: Shield,
    title: 'Sécurité maximale',
    description: 'Données chiffrées, authentification forte, conformité RGPD/LPD.'
  },
  {
    icon: Server,
    title: 'Hébergement suisse',
    description: 'Vos données restent en Suisse, dans des datacenters certifiés.'
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Interface rapide et réactive, même avec de gros volumes.'
  },
  {
    icon: BarChart3,
    title: 'Analytics avancés',
    description: 'Tableaux de bord et rapports personnalisables.'
  },
  {
    icon: FileText,
    title: 'Documents automatisés',
    description: 'Génération automatique de contrats, PV, décomptes.'
  },
  {
    icon: Bell,
    title: 'Notifications intelligentes',
    description: 'Alertes par email, SMS et push selon vos préférences.'
  },
];

// Testimonials with photo-like avatars
const testimonials = [
  {
    quote: "Realpro a transformé notre façon de gérer les copropriétés. Un gain de temps considérable au quotidien.",
    author: "Marc Schneider",
    role: "Directeur",
    company: "Schneider Immobilier SA",
    location: "Genève",
    // Professional man, 50s, grey hair
    avatarStyle: { bg: 'from-slate-600 to-slate-700', skin: '#E8BEAC', hair: '#9CA3AF', shirt: '#1E40AF' }
  },
  {
    quote: "Enfin une solution suisse qui comprend les spécificités de notre marché. L'équipe est très réactive.",
    author: "Sophie Durand",
    role: "Responsable gérance",
    company: "Régie du Léman",
    location: "Lausanne",
    // Professional woman, 40s, brown hair
    avatarStyle: { bg: 'from-rose-400 to-rose-500', skin: '#FDBCB4', hair: '#78350F', shirt: '#7C3AED' }
  },
  {
    quote: "Le module promoteur nous permet de suivre nos projets en temps réel avec une clarté inégalée.",
    author: "Pierre Müller",
    role: "CEO",
    company: "Müller Développement",
    location: "Zürich",
    // Professional man, 45s, dark hair
    avatarStyle: { bg: 'from-blue-500 to-blue-600', skin: '#DEB887', hair: '#1C1917', shirt: '#059669' }
  },
];

// Team members
const teamMembers = [
  {
    name: "Thomas Weber",
    role: "CEO & Fondateur",
    bio: "20 ans d'expérience dans l'immobilier suisse",
    avatarStyle: { bg: 'from-[#3DAABD] to-[#2E8A9A]', skin: '#E8BEAC', hair: '#44403C', shirt: '#1E293B' }
  },
  {
    name: "Marie Fontaine",
    role: "Directrice Produit",
    bio: "Ex-responsable digital chez une grande régie genevoise",
    avatarStyle: { bg: 'from-purple-500 to-purple-600', skin: '#FDBCB4', hair: '#7C2D12', shirt: '#0F766E' }
  },
  {
    name: "Lucas Bernasconi",
    role: "CTO",
    bio: "Architecte logiciel, spécialiste PropTech",
    avatarStyle: { bg: 'from-emerald-500 to-emerald-600', skin: '#DEB887', hair: '#1C1917', shirt: '#4338CA' }
  },
  {
    name: "Anna Keller",
    role: "Head of Customer Success",
    bio: "10 ans en gestion de copropriétés",
    avatarStyle: { bg: 'from-amber-500 to-amber-600', skin: '#E8BEAC', hair: '#B45309', shirt: '#BE185D' }
  },
];

// Avatar component for realistic portraits
function PersonAvatar({ style, size = 'md' }: {
  style: { bg: string; skin: string; hair: string; shirt: string };
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${style.bg} overflow-hidden relative`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background */}
        <defs>
          <linearGradient id={`bg-${style.hair}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={style.bg.includes('slate') ? '#475569' : '#3DAABD'} />
            <stop offset="100%" stopColor={style.bg.includes('slate') ? '#334155' : '#2E8A9A'} />
          </linearGradient>
        </defs>

        {/* Neck */}
        <ellipse cx="50" cy="95" rx="18" ry="15" fill={style.skin} />

        {/* Shirt/Collar */}
        <path d="M25 100 Q35 85 50 82 Q65 85 75 100 L75 100 L25 100 Z" fill={style.shirt} />
        <path d="M42 82 L50 90 L58 82" fill="none" stroke={style.shirt} strokeWidth="3" />

        {/* Face */}
        <ellipse cx="50" cy="50" rx="28" ry="32" fill={style.skin} />

        {/* Hair */}
        <ellipse cx="50" cy="28" rx="26" ry="18" fill={style.hair} />
        <path d="M24 35 Q24 20 50 18 Q76 20 76 35 Q76 45 50 42 Q24 45 24 35" fill={style.hair} />

        {/* Ears */}
        <ellipse cx="22" cy="52" rx="5" ry="8" fill={style.skin} />
        <ellipse cx="78" cy="52" rx="5" ry="8" fill={style.skin} />

        {/* Eyes */}
        <ellipse cx="38" cy="50" rx="5" ry="3" fill="white" />
        <ellipse cx="62" cy="50" rx="5" ry="3" fill="white" />
        <circle cx="38" cy="50" r="2" fill="#1E293B" />
        <circle cx="62" cy="50" r="2" fill="#1E293B" />

        {/* Eyebrows */}
        <path d="M32 44 Q38 42 44 44" fill="none" stroke={style.hair} strokeWidth="2" strokeLinecap="round" />
        <path d="M56 44 Q62 42 68 44" fill="none" stroke={style.hair} strokeWidth="2" strokeLinecap="round" />

        {/* Nose */}
        <path d="M50 52 L50 60 Q48 62 50 62 Q52 62 50 60" fill="none" stroke={style.skin} strokeWidth="1" opacity="0.5" />

        {/* Smile */}
        <path d="M40 68 Q50 75 60 68" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>
  );
}

// Trust badges
const trustBadges = [
  { icon: Lock, label: 'SSL/TLS' },
  { icon: Shield, label: 'ISO 27001' },
  { icon: Globe, label: '100% Swiss' },
  { icon: Server, label: 'RGPD/LPD' },
];

export function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3DAABD]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMXYxaC0xek0wIDBoMXYxSDB6TTYwIDBoMXYxaC0xek0wIDYwaDFWNjFIMHpNNjAgNjBoMXYxaC0xeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white/80 mb-8">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Solution 100% suisse
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                La suite logicielle
                <span className="block mt-2 bg-gradient-to-r from-[#3DAABD] to-[#5BC4D6] bg-clip-text text-transparent">
                  pour l'immobilier suisse
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-xl mx-auto lg:mx-0">
                3 applications indépendantes et spécialisées pour gérer vos copropriétés,
                projets de promotion et portefeuilles de gérance.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/apps"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3DAABD] to-[#2E8A9A] px-8 py-4 text-lg font-semibold text-white hover:shadow-lg hover:shadow-[#3DAABD]/25 transition-all duration-300"
                >
                  Découvrir les applications
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                >
                  <Play className="h-5 w-5" />
                  Voir la démo
                </button>
              </div>

              {/* Trust badges */}
              <div className="mt-12 flex flex-wrap gap-6 justify-center lg:justify-start">
                {trustBadges.map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 text-slate-400">
                    <badge.icon className="h-4 w-4" />
                    <span className="text-sm">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: App preview cards */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Floating app cards */}
                <div className="absolute top-0 left-0 w-64 bg-white rounded-2xl shadow-2xl p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">PPE Admin</div>
                      <div className="text-xs text-gray-500">12 immeubles</div>
                    </div>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg" />
                </div>

                <div className="absolute top-20 right-0 w-64 bg-white rounded-2xl shadow-2xl p-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Home className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Promoteur</div>
                      <div className="text-xs text-gray-500">3 projets actifs</div>
                    </div>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg" />
                </div>

                <div className="absolute top-48 left-10 w-64 bg-white rounded-2xl shadow-2xl p-4 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Régie</div>
                      <div className="text-xs text-gray-500">156 locataires</div>
                    </div>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg" />
                </div>

                {/* Central glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#3DAABD]/30 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#3DAABD]/10 text-[#3DAABD] mb-3 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apps Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[#3DAABD]/10 text-[#3DAABD] text-sm font-medium mb-4">
              Nos applications
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              3 applications, 1 suite complète
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Chaque application est indépendante et spécialisée pour son métier.
              Choisissez celles dont vous avez besoin.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {apps.map((app) => (
              <div
                key={app.id}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${app.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <app.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold">{app.name}</h3>
                    <p className="text-white/80 mt-1">{app.tagline}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6">{app.description}</p>

                  <ul className="space-y-3 mb-6">
                    {app.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle className={`h-5 w-5 ${app.textColor} flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={app.href}
                    className={`group/btn flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 ${app.borderColor} ${app.textColor} font-medium hover:bg-gradient-to-r ${app.color} hover:text-white hover:border-transparent transition-all duration-300`}
                  >
                    Accéder à {app.name}
                    <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-[#3DAABD]/10 text-[#3DAABD] text-sm font-medium mb-4">
                Plateforme
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Une infrastructure pensée pour les professionnels
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Realpro Suite est construite sur une architecture moderne, sécurisée
                et performante pour répondre aux exigences des professionnels de l'immobilier.
              </p>

              <div className="mt-10 grid sm:grid-cols-2 gap-6">
                {platformFeatures.map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#3DAABD]/10 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-[#3DAABD]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl overflow-hidden">
                {/* Dashboard mockup */}
                <div className="absolute inset-4 bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Top bar */}
                  <div className="h-12 bg-slate-800 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-slate-700 rounded-md px-4 py-1 text-xs text-slate-400">
                        app.realpro.ch
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <RealproLogo size="sm" theme="light" />
                      <div className="flex-1" />
                      <div className="w-8 h-8 rounded-full bg-[#3DAABD]" />
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-20 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100" />
                      <div className="h-20 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100" />
                      <div className="h-20 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100" />
                    </div>

                    {/* Chart placeholder */}
                    <div className="h-32 rounded-lg bg-gray-50 border border-gray-100" />

                    {/* Table placeholder */}
                    <div className="space-y-2">
                      <div className="h-8 rounded bg-gray-50" />
                      <div className="h-8 rounded bg-gray-50" />
                      <div className="h-8 rounded bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Synchronisé</span>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-[#3DAABD]" />
                  <span className="font-medium text-gray-700">Données chiffrées</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[#3DAABD]/20 text-[#3DAABD] text-sm font-medium mb-4">
              Témoignages
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ils nous font confiance
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Découvrez ce que nos clients disent de Realpro Suite
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-[#3DAABD]/50 transition-colors group"
              >
                {/* Stars at top */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <Quote className="h-10 w-10 text-[#3DAABD]/30 mb-4" />
                <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <PersonAvatar style={testimonial.avatarStyle} size="md" />
                  <div>
                    <div className="font-semibold text-white text-lg">{testimonial.author}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                    <div className="text-sm text-[#3DAABD]">{testimonial.company}</div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Client logos */}
          <div className="mt-16 pt-16 border-t border-slate-800">
            <p className="text-center text-slate-500 text-sm mb-8">
              Plus de 100 entreprises nous font confiance
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
              {['Régie Zimmermann', 'Naef Immobilier', 'SPG Intercity', 'Wincasa', 'Livit'].map((company) => (
                <div key={company} className="text-slate-400 font-semibold text-lg">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[#3DAABD]/10 text-[#3DAABD] text-sm font-medium mb-4">
              Notre équipe
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Des experts à votre service
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Une équipe passionnée qui combine expertise immobilière et innovation technologique
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group"
              >
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <PersonAvatar style={member.avatarStyle} size="lg" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                <p className="text-[#3DAABD] font-medium text-sm">{member.role}</p>
                <p className="text-gray-500 text-sm mt-2">{member.bio}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Basée à Genève, notre équipe de 15 personnes est dédiée à votre succès.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[#3DAABD] font-semibold hover:underline"
            >
              En savoir plus sur notre histoire
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Swiss Quality Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-12 relative overflow-hidden">
            {/* Swiss cross pattern */}
            <div className="absolute top-8 right-8 w-24 h-24">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-red-600 rounded-sm" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-14 bg-white rounded-sm" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-6 bg-white rounded-sm" />
                </div>
              </div>
            </div>

            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Qualité suisse, pour l'immobilier suisse
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Realpro est une solution 100% suisse, développée à Genève par des experts
                qui connaissent les spécificités du marché immobilier helvétique :
                PPE, gérance, droit du bail, et réglementations cantonales.
              </p>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                    <Server className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">Hébergement suisse</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">Conforme LPD</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">Support local</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3DAABD] to-[#2E8A9A]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMXYxaC0xek0wIDBoMXYxSDB6TTYwIDBoMXYxaC0xek0wIDYwaDFWNjFIMHpNNjAgNjBoMXYxaC0xeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Prêt à moderniser votre gestion immobilière ?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Essayez Realpro Suite gratuitement pendant 30 jours.
            Aucune carte de crédit requise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-[#3DAABD] hover:bg-gray-100 transition-colors"
            >
              Commencer l'essai gratuit
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Demander une démo
            </Link>
          </div>
          <p className="mt-6 text-white/60 text-sm">
            Plus de 500 professionnels nous font déjà confiance
          </p>
        </div>
      </section>
    </div>
  );
}
