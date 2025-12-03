import {
  Package, Users, FileText, DollarSign, Hammer,
  Calendar, MessageSquare, Settings, Upload, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';

interface QuickAction {
  label: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

interface ProjectQuickActionsProps {
  projectId: string;
}

export function ProjectQuickActions({ projectId }: ProjectQuickActionsProps) {
  const actions: QuickAction[] = [
    {
      label: 'Gérer les lots',
      description: 'Ajouter, modifier ou supprimer des lots',
      icon: Package,
      href: `/projects/${projectId}/lots`,
      color: 'blue',
    },
    {
      label: 'Acheteurs',
      description: 'Gérer les acheteurs et le pipeline',
      icon: Users,
      href: `/projects/${projectId}/buyers`,
      color: 'green',
    },
    {
      label: 'Documents',
      description: 'Accéder aux documents du projet',
      icon: FileText,
      href: `/projects/${projectId}/documents`,
      color: 'purple',
    },
    {
      label: 'Budget CFC',
      description: 'Gérer le budget et les finances',
      icon: DollarSign,
      href: `/projects/${projectId}/cfc`,
      color: 'yellow',
    },
    {
      label: 'Soumissions',
      description: 'Créer et gérer les appels d\'offres',
      icon: Hammer,
      href: `/projects/${projectId}/submissions`,
      color: 'orange',
    },
    {
      label: 'Rendez-vous',
      description: 'Planning des rendez-vous',
      icon: Calendar,
      href: `/projects/${projectId}/appointments`,
      color: 'indigo',
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
    const colors: Record<string, { icon: string; hover: string }> = {
      blue: { icon: 'text-blue-600', hover: 'hover:bg-blue-50' },
      green: { icon: 'text-green-600', hover: 'hover:bg-green-50' },
      purple: { icon: 'text-purple-600', hover: 'hover:bg-purple-50' },
      yellow: { icon: 'text-yellow-600', hover: 'hover:bg-yellow-50' },
      orange: { icon: 'text-orange-600', hover: 'hover:bg-orange-50' },
      indigo: { icon: 'text-indigo-600', hover: 'hover:bg-indigo-50' },
      pink: { icon: 'text-pink-600', hover: 'hover:bg-pink-50' },
      gray: { icon: 'text-gray-600', hover: 'hover:bg-gray-50' },
    };
    return colors[color] || colors.gray;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          const colors = getColorClasses(action.color);

          return (
            <Link key={action.href} to={action.href}>
              <Card
                hover
                className={`h-full transition-all duration-200 cursor-pointer ${colors.hover}`}
              >
                <Card.Content>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gray-50 ${colors.icon}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-0.5 truncate">
                        {action.label}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
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
  );
}
