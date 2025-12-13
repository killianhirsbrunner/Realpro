import { Link } from 'react-router-dom';
import {
  Target,
  Heart,
  Users,
  Award,
  Building2,
  Lightbulb,
  Shield,
  Globe,
  CheckCircle,
  ArrowRight,
  Calendar,
  TrendingUp,
  MapPin
} from 'lucide-react';

// Company timeline
const timeline = [
  {
    year: '2018',
    title: 'Création de Realpro',
    description: 'Fondation de la société à Genève par des professionnels de l\'immobilier et des experts en technologie.',
    icon: Lightbulb,
  },
  {
    year: '2019',
    title: 'Lancement de PPE Admin',
    description: 'Première application dédiée à la gestion des copropriétés suisses.',
    icon: Building2,
  },
  {
    year: '2020',
    title: 'Expansion et Régie',
    description: 'Lancement du module Régie pour la gérance immobilière. 100 clients actifs.',
    icon: TrendingUp,
  },
  {
    year: '2022',
    title: 'Promoteur & croissance',
    description: 'Ajout de l\'application Promoteur. L\'équipe passe à 15 collaborateurs.',
    icon: Users,
  },
  {
    year: '2024',
    title: 'Realpro Suite',
    description: 'Refonte complète de la plateforme. Plus de 500 entreprises clientes.',
    icon: Award,
  },
];

// Company values
const values = [
  {
    icon: Shield,
    title: 'Fiabilité',
    description: 'Nous construisons des solutions robustes et sécurisées sur lesquelles vous pouvez compter au quotidien.',
  },
  {
    icon: Heart,
    title: 'Proximité',
    description: 'Une équipe à l\'écoute, basée en Suisse, qui comprend vos défis métier et parle votre langue.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Nous intégrons les dernières technologies pour simplifier votre travail et vous faire gagner du temps.',
  },
  {
    icon: Globe,
    title: 'Expertise locale',
    description: 'Une connaissance approfondie du marché immobilier suisse et de ses spécificités cantonales.',
  },
];

// Team members with extended info
const teamMembers = [
  {
    name: 'Thomas Weber',
    role: 'CEO & Fondateur',
    bio: '20 ans d\'expérience dans l\'immobilier suisse. Ancien directeur chez une grande régie genevoise, Thomas a fondé Realpro pour moderniser les pratiques du secteur.',
    linkedin: '#',
    avatarBg: 'from-[#3DAABD] to-[#2E8A9A]',
  },
  {
    name: 'Marie Fontaine',
    role: 'Directrice Produit',
    bio: 'Ex-responsable digital chez Naef Immobilier. Marie dirige la vision produit et s\'assure que chaque fonctionnalité répond aux besoins réels des professionnels.',
    linkedin: '#',
    avatarBg: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Lucas Bernasconi',
    role: 'CTO',
    bio: 'Architecte logiciel avec 15 ans d\'expérience. Passionné par la PropTech, Lucas pilote le développement technique de la plateforme.',
    linkedin: '#',
    avatarBg: 'from-emerald-500 to-emerald-600',
  },
  {
    name: 'Anna Keller',
    role: 'Head of Customer Success',
    bio: '10 ans en gestion de copropriétés. Anna et son équipe accompagnent chaque client pour garantir leur succès avec Realpro.',
    linkedin: '#',
    avatarBg: 'from-amber-500 to-amber-600',
  },
  {
    name: 'David Moret',
    role: 'Directeur Commercial',
    bio: 'Expert en développement commercial B2B. David développe notre présence sur tout le territoire suisse.',
    linkedin: '#',
    avatarBg: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Sophie Roth',
    role: 'Responsable Support',
    bio: 'Spécialiste de la relation client. Sophie coordonne notre équipe support pour vous offrir une assistance réactive et efficace.',
    linkedin: '#',
    avatarBg: 'from-rose-500 to-rose-600',
  },
];

// Key figures
const keyFigures = [
  { value: '500+', label: 'Entreprises clientes' },
  { value: '15', label: 'Collaborateurs' },
  { value: '10\'000+', label: 'Utilisateurs actifs' },
  { value: '6', label: 'Années d\'expérience' },
];

// Partners/certifications
const certifications = [
  'ISO 27001',
  'Conforme LPD',
  'Conforme RGPD',
  'Swiss Made Software',
  'Swiss Hosting',
];

export function AboutPage() {
  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3DAABD]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1 rounded-full bg-[#3DAABD]/20 text-[#3DAABD] text-sm font-medium mb-6">
              À propos de Realpro
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Nous simplifions la gestion immobilière en Suisse
            </h1>
            <p className="mt-6 text-xl text-slate-300">
              Depuis 2018, Realpro développe des solutions logicielles innovantes
              pour les professionnels de l'immobilier suisse. Notre mission : vous
              faire gagner du temps et de l'efficacité au quotidien.
            </p>
          </div>
        </div>
      </section>

      {/* Key figures */}
      <section className="relative -mt-12 z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {keyFigures.map((figure) => (
              <div key={figure.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#3DAABD]">{figure.value}</div>
                <div className="text-sm text-gray-600 mt-1">{figure.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#3DAABD]/10 mb-6">
                <Target className="h-8 w-8 text-[#3DAABD]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                Fournir aux professionnels de l'immobilier suisse des outils modernes,
                intuitifs et parfaitement adaptés aux spécificités de leur métier.
              </p>
              <p className="text-lg text-gray-600">
                Nous croyons que la technologie doit simplifier le travail, pas le compliquer.
                C'est pourquoi nous développons des solutions qui s'intègrent naturellement
                dans vos processus existants.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ce qui nous différencie</h3>
              <ul className="space-y-4">
                {[
                  'Conçu en Suisse, pour la Suisse',
                  'Support local et réactif en FR/DE/EN/IT',
                  'Hébergement 100% suisse',
                  'Expertise métier immobilier',
                  'Mises à jour continues incluses',
                  'Formation et accompagnement personnalisé',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#3DAABD] flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[#3DAABD]/10 text-[#3DAABD] text-sm font-medium mb-4">
              Nos valeurs
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Les principes qui nous guident
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#3DAABD]/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-[#3DAABD]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[#3DAABD]/10 text-[#3DAABD] text-sm font-medium mb-4">
              Notre histoire
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              6 ans d'innovation
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 hidden lg:block" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${
                      index % 2 === 0 ? 'lg:ml-auto' : ''
                    } max-w-md`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[#3DAABD]/10 flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-[#3DAABD]" />
                        </div>
                        <span className="text-2xl font-bold text-[#3DAABD]">{item.year}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>

                  {/* Center dot - only on desktop */}
                  <div className="hidden lg:flex w-4 h-4 rounded-full bg-[#3DAABD] border-4 border-white shadow-sm flex-shrink-0" />

                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[#3DAABD]/10 text-[#3DAABD] text-sm font-medium mb-4">
              Notre équipe
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Des experts passionnés
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Une équipe qui combine expertise immobilière et excellence technologique
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white text-xl font-bold`}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                    <p className="text-[#3DAABD] text-sm font-medium">{member.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
              <MapPin className="h-5 w-5 text-[#3DAABD]" />
              <span>Basés à Genève, nous servons toute la Suisse</span>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-[#3DAABD] font-semibold hover:underline"
            >
              Rejoindre notre équipe
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-900">Certifications & conformité</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {certifications.map((cert) => (
              <div
                key={cert}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-gray-700"
              >
                <Shield className="h-4 w-4 text-[#3DAABD]" />
                <span className="font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#3DAABD] to-[#2E8A9A] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à découvrir Realpro ?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Contactez-nous pour une démonstration personnalisée de nos solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/apps"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-[#3DAABD] hover:bg-gray-100 transition-colors"
            >
              Découvrir les applications
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
