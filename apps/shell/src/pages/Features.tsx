import {
  Shield,
  Zap,
  Globe,
  Cloud,
  Lock,
  Smartphone,
  RefreshCw,
  BarChart3,
  Users,
  FileText,
  Bell,
  Calendar,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Securite suisse',
    description:
      'Donnees hebergees exclusivement en Suisse. Conformite LPD et RGPD garantie.',
  },
  {
    icon: Lock,
    title: 'Chiffrement bout-en-bout',
    description:
      'Vos donnees sont chiffrees en transit et au repos avec les standards les plus eleves.',
  },
  {
    icon: Cloud,
    title: 'Cloud natif',
    description:
      'Infrastructure moderne et scalable. Disponibilite 99.9% garantie.',
  },
  {
    icon: Smartphone,
    title: 'Responsive design',
    description:
      'Acces depuis n\'importe quel appareil : desktop, tablette ou smartphone.',
  },
  {
    icon: Globe,
    title: 'Multilingue',
    description:
      'Interface disponible en francais, allemand, anglais et italien.',
  },
  {
    icon: Zap,
    title: 'Performance',
    description:
      'Interface rapide et reactive pour une productivite maximale.',
  },
  {
    icon: RefreshCw,
    title: 'Mises a jour automatiques',
    description:
      'Beneficiez des dernieres fonctionnalites sans intervention technique.',
  },
  {
    icon: BarChart3,
    title: 'Tableaux de bord',
    description:
      'KPIs et rapports personnalisables pour piloter votre activite.',
  },
  {
    icon: Users,
    title: 'Multi-utilisateurs',
    description:
      'Gestion des droits et roles pour toute votre equipe.',
  },
  {
    icon: FileText,
    title: 'GED integree',
    description:
      'Stockage et gestion documentaire centralises pour tous vos fichiers.',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description:
      'Alertes email et in-app pour ne rien manquer d\'important.',
  },
  {
    icon: Calendar,
    title: 'Calendrier',
    description:
      'Planification et suivi des echeances integres a chaque application.',
  },
];

const integrations = [
  { name: 'Comptabilite', items: ['Abacus', 'Sage', 'Banana'] },
  { name: 'Banques', items: ['PostFinance', 'UBS', 'Credit Suisse'] },
  { name: 'Communication', items: ['Email', 'SMS', 'Courrier'] },
  { name: 'Stockage', items: ['OneDrive', 'Google Drive', 'Dropbox'] },
];

export function FeaturesPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gray-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Fonctionnalites</h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl">
            Decouvrez les fonctionnalites communes a toutes les applications Realpro Suite.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-50 mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Integrations</h2>
            <p className="mt-4 text-lg text-gray-600">
              Connectez Realpro Suite a vos outils existants.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrations.map((category) => (
              <div key={category.name} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">{category.name}</h3>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item} className="text-gray-600 text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 lg:p-12 text-white">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold">API RESTful</h2>
              <p className="mt-4 text-primary-100 text-lg">
                Integrez Realpro Suite a vos propres systemes grace a notre API complete
                et documentee. Automatisez vos workflows et synchronisez vos donnees.
              </p>
              <a
                href="/docs/api"
                className="mt-6 inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
              >
                Documentation API
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
