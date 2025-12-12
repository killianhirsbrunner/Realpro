import { Link } from 'react-router-dom';
import {
  BarChart3,
  GitBranch,
  FileText,
  Users,
  Calendar,
  Bell,
  MessageSquare,
  ClipboardList,
  Package,
  Wrench,
  TrendingUp,
  PieChart,
  Workflow,
  Zap
} from 'lucide-react';

interface QuickLaunchCard {
  title: string;
  description: string;
  href: string;
  icon: any;
  color: string;
  badge?: string;
}

export function QuickLaunch() {
  const modules: QuickLaunchCard[] = [
    {
      title: 'Analytics & BI',
      description: 'Dashboard analytics avec KPIs et graphiques en temps réel',
      href: '/analytics',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      badge: 'NEW'
    },
    {
      title: 'Workflows',
      description: 'Automatisations et processus métier configurables',
      href: '/admin/workflows',
      icon: Workflow,
      color: 'from-purple-500 to-pink-500',
      badge: 'NEW'
    },
    {
      title: 'Reporting',
      description: 'Rapports financiers, commerciaux et opérationnels',
      href: '/reporting',
      icon: PieChart,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Promoteur',
      description: 'Dashboard promoteur avec vue globale projets',
      href: '/promoter',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Courtiers',
      description: 'Gestion courtiers, commissions et contrats',
      href: '/broker',
      icon: Users,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Soumissions',
      description: 'Appels d\'offres, comparaisons et adjudications',
      href: '/submissions',
      icon: FileText,
      color: 'from-teal-500 to-green-500'
    },
    {
      title: 'Notifications',
      description: 'Centre de notifications temps réel',
      href: '/notifications',
      icon: Bell,
      color: 'from-yellow-500 to-orange-500',
      badge: 'Live'
    },
    {
      title: 'Messages',
      description: 'Messagerie instantanée équipe et clients',
      href: '/messages',
      icon: MessageSquare,
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Tâches',
      description: 'Gestionnaire de tâches et templates',
      href: '/tasks',
      icon: ClipboardList,
      color: 'from-violet-500 to-purple-500'
    },
    {
      title: 'SAV',
      description: 'Service après-vente et garanties',
      href: '/sav',
      icon: Wrench,
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Chantier',
      description: 'Suivi chantier et planning travaux',
      href: '/chantier',
      icon: Package,
      color: 'from-gray-600 to-gray-800'
    },
    {
      title: 'Facturation',
      description: 'Gestion abonnements et paiements',
      href: '/billing',
      icon: Calendar,
      color: 'from-emerald-500 to-teal-500'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-realpro-turquoise to-blue-500">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Accès Rapide aux Modules
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Tous vos outils professionnels en un clic
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.href}
              to={module.href}
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 hover:shadow-xl hover:border-transparent hover:-translate-y-1 transition-all duration-200"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`} />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${module.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {module.badge && (
                    <span className="px-2 py-1 text-xs font-semibold bg-green-500 text-white rounded-full">
                      {module.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-realpro-turquoise transition-colors">
                  {module.title}
                </h3>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {module.description}
                </p>

                {/* Arrow Icon */}
                <div className="mt-4 flex items-center text-sm font-medium text-realpro-turquoise opacity-0 group-hover:opacity-100 transition-opacity">
                  Ouvrir
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Help Card */}
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-900">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Besoin d'aide pour démarrer ?
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
              Consultez notre documentation complète ou contactez notre équipe de support pour une démonstration personnalisée.
            </p>
            <div className="flex gap-3">
              <Link
                to="/docs"
                className="px-4 py-2 text-sm font-medium bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Documentation
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Demander une démo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
