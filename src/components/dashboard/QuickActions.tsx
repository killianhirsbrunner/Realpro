import { Link } from 'react-router-dom';
import { Plus, FileText, MessageSquare, Calendar, Building2, UserPlus, Package } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

interface QuickActionsProps {
  projectId?: string;
}

export function QuickActions({ projectId }: QuickActionsProps) {
  const { t } = useI18n();

  const actions = [
    {
      label: 'Ajouter un document',
      icon: FileText,
      href: projectId ? `/projects/${projectId}/documents` : '/documents',
      color: 'from-brand-500 to-brand-600',
    },
    {
      label: 'Envoyer un message',
      icon: MessageSquare,
      href: projectId ? `/projects/${projectId}/messages` : '/projects',
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Créer une réservation',
      icon: Building2,
      href: projectId ? `/projects/${projectId}/lots` : '/projects',
      color: 'from-brand-500 to-brand-600',
    },
    {
      label: 'Nouveau projet',
      icon: Plus,
      href: '/projects/new',
      color: 'from-secondary-500 to-secondary-600',
    },
    {
      label: 'Ajouter un acheteur',
      icon: UserPlus,
      href: projectId ? `/projects/${projectId}/buyers` : '/projects',
      color: 'from-pink-500 to-pink-600',
    },
    {
      label: 'Rendez-vous fournisseur',
      icon: Calendar,
      href: projectId ? `/projects/${projectId}/materials/suppliers` : '/projects',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Actions rapides</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Gagnez du temps avec ces raccourcis</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.href}
              className="group relative p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg hover:scale-105 transition-all duration-200 flex flex-col items-center text-center gap-3"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
