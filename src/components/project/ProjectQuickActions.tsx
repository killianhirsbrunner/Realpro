import {
  Package, Users, FileText, DollarSign, Hammer,
  Calendar, MessageSquare, Settings, Plus, ArrowRight,
  BarChart3, Truck, ClipboardList
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface QuickAction {
  label: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  badge?: string;
}

interface ProjectQuickActionsProps {
  projectId: string;
}

export function ProjectQuickActions({ projectId }: ProjectQuickActionsProps) {
  const primaryActions: QuickAction[] = [
    {
      label: 'Créer un lot',
      description: 'Ajouter un nouveau lot au projet',
      icon: Plus,
      href: `/projects/${projectId}/lots/new`,
      color: 'blue',
    },
    {
      label: 'Nouvelle soumission',
      description: 'Lancer un appel d\'offres',
      icon: Hammer,
      href: `/projects/${projectId}/submissions/new`,
      color: 'orange',
    },
    {
      label: 'Uploader document',
      description: 'Ajouter des fichiers au projet',
      icon: FileText,
      href: `/projects/${projectId}/documents/upload`,
      color: 'green',
    },
    {
      label: 'Rendez-vous',
      description: 'Planifier un rendez-vous',
      icon: Calendar,
      href: `/projects/${projectId}/appointments/new`,
      color: 'purple',
    },
  ];

  const navigationActions: QuickAction[] = [
    {
      label: 'Tous les lots',
      description: 'Gérer le programme de vente',
      icon: Package,
      href: `/projects/${projectId}/lots`,
      color: 'blue',
    },
    {
      label: 'Acheteurs',
      description: 'Pipeline commercial',
      icon: Users,
      href: `/projects/${projectId}/buyers`,
      color: 'green',
    },
    {
      label: 'Budget CFC',
      description: 'Gestion financière',
      icon: DollarSign,
      href: `/projects/${projectId}/cfc`,
      color: 'yellow',
    },
    {
      label: 'Planning',
      description: 'Planning de construction',
      icon: ClipboardList,
      href: `/projects/${projectId}/planning`,
      color: 'indigo',
    },
    {
      label: 'Chantier',
      description: 'Suivi des travaux',
      icon: Truck,
      href: `/projects/${projectId}/construction`,
      color: 'orange',
    },
    {
      label: 'Reporting',
      description: 'Tableaux de bord',
      icon: BarChart3,
      href: `/projects/${projectId}/reporting`,
      color: 'teal',
    },
    {
      label: 'Communication',
      description: 'Messages et notifications',
      icon: MessageSquare,
      href: `/projects/${projectId}/communication`,
      color: 'pink',
    },
    {
      label: 'Paramètres',
      description: 'Configuration du projet',
      icon: Settings,
      href: `/projects/${projectId}/settings`,
      color: 'gray',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; hover: string; border: string }> = {
      blue: { bg: 'bg-brand-50', text: 'text-brand-600', hover: 'hover:bg-brand-100 hover:border-brand-300', border: 'border-brand-200' },
      green: { bg: 'bg-green-50', text: 'text-green-600', hover: 'hover:bg-green-100 hover:border-green-300', border: 'border-green-200' },
      purple: { bg: 'bg-brand-50', text: 'text-brand-600', hover: 'hover:bg-brand-100 hover:border-brand-300', border: 'border-brand-200' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', hover: 'hover:bg-yellow-100 hover:border-yellow-300', border: 'border-yellow-200' },
      orange: { bg: 'bg-brand-50', text: 'text-brand-600', hover: 'hover:bg-brand-100 hover:border-brand-300', border: 'border-brand-200' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', hover: 'hover:bg-indigo-100 hover:border-indigo-300', border: 'border-indigo-200' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-600', hover: 'hover:bg-pink-100 hover:border-pink-300', border: 'border-pink-200' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-600', hover: 'hover:bg-teal-100 hover:border-teal-300', border: 'border-teal-200' },
      gray: { bg: 'bg-gray-50', text: 'text-gray-600', hover: 'hover:bg-gray-100 hover:border-gray-300', border: 'border-gray-200' },
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {primaryActions.map((action) => {
            const Icon = action.icon;
            const colors = getColorClasses(action.color);

            return (
              <Link key={action.href} to={action.href}>
                <button className={`w-full p-4 rounded-xl border-2 ${colors.border} ${colors.bg} ${colors.hover} transition-all duration-200 group`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg bg-white shadow-sm ${colors.text}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900 mb-0.5">
                        {action.label}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Modules du projet</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
          {navigationActions.map((action) => {
            const Icon = action.icon;
            const colors = getColorClasses(action.color);

            return (
              <Link key={action.href} to={action.href}>
                <Card hover className="h-full cursor-pointer group">
                  <Card.Content className="p-4">
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-0.5 group-hover:text-brand-600 transition-colors">
                          {action.label}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
