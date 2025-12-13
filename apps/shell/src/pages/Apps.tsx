import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Home,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Lock,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  checkAppAccess,
  startTrial,
  getTrialDaysRemaining,
  type AppId,
  type AccessCheckResult
} from '../../../../src/subscriptions';

const apps = [
  {
    id: 'ppe-admin' as AppId,
    name: 'PPE Admin',
    subtitle: 'Administrateur de copropriétés',
    description:
      'Solution complète pour les syndics et administrateurs de PPE. Gérez vos assemblées générales, charges, fonds de rénovation et communications avec les copropriétaires.',
    icon: Building2,
    href: '/ppe',
    color: 'blue',
    modules: [
      'Immeubles & lots',
      'Copropriétaires',
      'Assemblées générales',
      'Budget prévisionnel',
      'Comptabilité PPE',
      'Charges & décomptes',
      'Fonds de rénovation',
      'Travaux & entretien',
      'Portail copropriétaires',
    ],
  },
  {
    id: 'promoteur' as AppId,
    name: 'Promoteur',
    subtitle: 'Promotion immobilière',
    description:
      'Pilotez vos projets immobiliers de A à Z. CRM, ventes, suivi chantier, finance CFC, soumissions et gestion des acquéreurs dans une seule plateforme.',
    icon: Home,
    href: '/promoteur',
    color: 'emerald',
    modules: [
      'Gestion de projets',
      'Lots & inventaire',
      'CRM & prospects',
      'Acquéreurs',
      'Finance & CFC',
      'Suivi chantier',
      'Matériaux & choix',
      'Soumissions',
      'Notaire & legal',
      'SAV',
    ],
  },
  {
    id: 'regie' as AppId,
    name: 'Régie',
    subtitle: 'Gérance immobilière',
    description:
      'Gérez votre portefeuille locatif avec efficacité. Baux, loyers, états des lieux, maintenance et comptabilité mandants pour une gérance professionnelle.',
    icon: Users,
    href: '/regie',
    color: 'purple',
    modules: [
      'Immeubles & objets',
      'Propriétaires',
      'Locataires',
      'Baux & contrats',
      'Loyers & encaissements',
      'Charges & décomptes',
      'États des lieux',
      'Maintenance',
      'Comptabilité gérance',
      'Portails locataires/propriétaires',
    ],
  },
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    bgGradient: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    ring: 'ring-blue-500',
  },
  emerald: {
    bg: 'bg-emerald-500',
    bgGradient: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    ring: 'ring-emerald-500',
  },
  purple: {
    bg: 'bg-purple-500',
    bgGradient: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
    ring: 'ring-purple-500',
  },
};

function AppCard({ app, accessResult, onStartTrial }: {
  app: typeof apps[0];
  accessResult: AccessCheckResult;
  onStartTrial: (appId: AppId) => void;
}) {
  const colors = colorClasses[app.color as keyof typeof colorClasses];
  const hasAccess = accessResult.hasAccess;
  const subscription = accessResult.subscription;
  const trialDays = getTrialDaysRemaining(app.id);

  return (
    <div className={`bg-white rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 ${
      hasAccess ? 'border-gray-100 hover:shadow-xl' : 'border-gray-200 opacity-90'
    }`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.bgGradient} p-6 text-white relative`}>
        {/* Status badge */}
        <div className="absolute top-4 right-4">
          {hasAccess ? (
            subscription?.status === 'trial' ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
                <Clock className="h-4 w-4" />
                Essai: {trialDays}j restants
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                Actif
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm text-sm font-medium">
              <Lock className="h-4 w-4" />
              Non souscrit
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <app.icon className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{app.name}</h2>
            <p className="text-white/80">{app.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 mb-6">{app.description}</p>

        {/* Modules */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Modules inclus
          </h3>
          <div className="flex flex-wrap gap-2">
            {app.modules.slice(0, hasAccess ? app.modules.length : 5).map((module) => (
              <span
                key={module}
                className={`px-3 py-1 rounded-lg ${colors.bgLight} ${colors.text} text-sm`}
              >
                {module}
              </span>
            ))}
            {!hasAccess && app.modules.length > 5 && (
              <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-500 text-sm">
                +{app.modules.length - 5} autres
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {hasAccess ? (
            <a
              href={app.href}
              className={`flex items-center justify-center gap-2 bg-gradient-to-r ${colors.bgGradient} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all`}
            >
              Accéder à {app.name}
              <ArrowRight className="h-5 w-5" />
            </a>
          ) : (
            <>
              <button
                onClick={() => onStartTrial(app.id)}
                className={`flex items-center justify-center gap-2 bg-gradient-to-r ${colors.bgGradient} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all`}
              >
                <Sparkles className="h-5 w-5" />
                Essai gratuit 30 jours
              </button>
              <Link
                to="/pricing"
                className={`flex items-center justify-center gap-2 border-2 ${colors.border} ${colors.text} px-6 py-3 rounded-xl font-semibold hover:${colors.bgLight} transition-all`}
              >
                Voir les tarifs
              </Link>
            </>
          )}
        </div>

        {/* Subscription info */}
        {subscription && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Plan: <strong className="text-gray-700 capitalize">{subscription.tier}</strong></span>
              {subscription.status === 'active' && subscription.endDate && (
                <span>Expire: {new Date(subscription.endDate).toLocaleDateString('fr-CH')}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AppsPage() {
  const [accessMap, setAccessMap] = useState<Record<AppId, AccessCheckResult>>({
    'ppe-admin': { hasAccess: false, reason: 'no_subscription' },
    'promoteur': { hasAccess: false, reason: 'no_subscription' },
    'regie': { hasAccess: false, reason: 'no_subscription' },
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Check access for all apps
    const newAccessMap: Record<AppId, AccessCheckResult> = {
      'ppe-admin': checkAppAccess('ppe-admin'),
      'promoteur': checkAppAccess('promoteur'),
      'regie': checkAppAccess('regie'),
    };
    setAccessMap(newAccessMap);
  }, [refreshKey]);

  const handleStartTrial = (appId: AppId) => {
    startTrial(appId, 'pro');
    setRefreshKey(k => k + 1);
  };

  const activeCount = Object.values(accessMap).filter(a => a.hasAccess).length;

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold">Mes applications</h1>
            <p className="mt-4 text-xl text-slate-300">
              {activeCount > 0 ? (
                <>Vous avez accès à {activeCount} application{activeCount > 1 ? 's' : ''}. Gérez vos abonnements ci-dessous.</>
              ) : (
                <>Découvrez nos 3 applications spécialisées. Commencez un essai gratuit de 30 jours.</>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {apps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                accessResult={accessMap[app.id]}
                onStartTrial={handleStartTrial}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Points communs à toutes les applications
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[#3DAABD]/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-[#3DAABD]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Sécurité suisse</h3>
              <p className="mt-2 text-gray-600">
                Données hébergées en Suisse, conforme LPD/RGPD.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[#3DAABD]/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-[#3DAABD]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
              <p className="mt-2 text-gray-600">
                Interface rapide et réactive pour une productivité maximale.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[#3DAABD]/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-[#3DAABD]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Multilingue</h3>
              <p className="mt-2 text-gray-600">
                Disponible en FR, DE, EN et IT pour toute la Suisse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Help section */}
      {activeCount === 0 && (
        <section className="bg-[#3DAABD] py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Besoin d'aide pour choisir ?
            </h2>
            <p className="text-white/80 mb-6">
              Nos experts sont disponibles pour vous guider vers la solution adaptée à vos besoins.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-[#3DAABD] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Demander une démo personnalisée
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
