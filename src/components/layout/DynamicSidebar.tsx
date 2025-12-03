import {
  LayoutDashboard,
  Building2,
  Grid3x3,
  Users,
  DollarSign,
  FolderOpen,
  Hammer,
  Settings,
  CreditCard,
  FileText,
  ListTodo,
  Calendar,
  BarChart3,
  ClipboardList,
  Home,
  File,
} from 'lucide-react';
import clsx from 'clsx';

type Role = 'PROMOTER' | 'EG' | 'ARCHITECT' | 'BROKER' | 'NOTARY' | 'BUYER';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  projectScoped?: boolean;
}

const ROLE_NAV: Record<Role, NavItem[]> = {
  PROMOTER: [
    { name: 'Tableau de bord', href: '/reporting', icon: LayoutDashboard },
    { name: 'Projets', href: '/projects', icon: Building2 },
    { name: 'Facturation', href: '/billing', icon: CreditCard },
    { name: 'Templates', href: '/templates', icon: FileText },
    { name: 'Tâches', href: '/tasks', icon: ListTodo },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ],
  EG: [
    { name: 'Projets', href: '/projects', icon: Building2 },
    { name: 'Planning', href: '/planning', icon: Calendar, projectScoped: true },
    { name: 'Soumissions', href: '/submissions', icon: ClipboardList, projectScoped: true },
    { name: 'Chantier', href: '/construction', icon: Hammer, projectScoped: true },
    { name: 'Tâches', href: '/tasks', icon: ListTodo },
    { name: 'Documents', href: '/documents', icon: FolderOpen, projectScoped: true },
  ],
  ARCHITECT: [
    { name: 'Projets', href: '/projects', icon: Building2 },
    { name: 'Planning', href: '/planning', icon: Calendar, projectScoped: true },
    { name: 'Soumissions', href: '/submissions', icon: ClipboardList, projectScoped: true },
    { name: 'Matériaux', href: '/materials', icon: Grid3x3, projectScoped: true },
    { name: 'Documents', href: '/documents', icon: FolderOpen, projectScoped: true },
    { name: 'Tâches', href: '/tasks', icon: ListTodo },
  ],
  BROKER: [
    { name: 'Tableau de bord', href: '/broker/dashboard', icon: LayoutDashboard },
    { name: 'Projets', href: '/projects', icon: Building2 },
    { name: 'Programme vente', href: '/broker/lots', icon: Grid3x3, projectScoped: true },
    { name: 'Contrats', href: '/broker/contracts', icon: FileText, projectScoped: true },
    { name: 'Performance', href: '/reporting/brokers', icon: BarChart3 },
    { name: 'Tâches', href: '/tasks', icon: ListTodo },
  ],
  NOTARY: [
    { name: 'Dossiers notaire', href: '/notary/files', icon: FolderOpen },
    { name: 'Rendez-vous', href: '/notary/appointments', icon: Calendar },
    { name: 'Documents', href: '/notary/documents', icon: File },
    { name: 'Tâches', href: '/tasks', icon: ListTodo },
  ],
  BUYER: [
    { name: 'Mon espace', href: '/buyer/home', icon: Home },
    { name: 'Mon lot', href: '/buyer/lot', icon: Building2 },
    { name: 'Choix matériaux', href: '/buyer/materials', icon: Grid3x3 },
    { name: 'Documents', href: '/buyer/documents', icon: FolderOpen },
    { name: 'Paiements', href: '/buyer/payments', icon: DollarSign },
    { name: 'Avancement', href: '/buyer/progress', icon: BarChart3 },
  ],
};

interface DynamicSidebarProps {
  role: Role;
  currentPath?: string;
  currentProjectId?: string | null;
  onNavigate?: (path: string) => void;
}

export function DynamicSidebar({
  role = 'PROMOTER',
  currentPath = '/',
  currentProjectId = null,
  onNavigate,
}: DynamicSidebarProps) {
  const navigation = ROLE_NAV[role] || ROLE_NAV.PROMOTER;

  const resolvedNav = navigation.map((item) => {
    if (!item.projectScoped || !currentProjectId) return item;
    return {
      ...item,
      href: `/projects/${currentProjectId}${item.href}`,
    };
  });

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            R
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">RealtySuite</div>
            <div className="text-xs text-gray-500">Swiss PropTech</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {resolvedNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');

          return (
            <button
              key={item.name}
              onClick={() => onNavigate?.(item.href)}
              className={clsx(
                'w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150',
                {
                  'bg-blue-50 text-blue-700': isActive,
                  'text-gray-700 hover:bg-gray-50': !isActive,
                }
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div className="font-medium text-gray-700 mb-1">Connecté en tant que</div>
          <div className="px-2 py-1 bg-gray-100 rounded-lg text-center">
            {getRoleLabel(role)}
          </div>
        </div>
      </div>
    </aside>
  );
}

function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    PROMOTER: 'Promoteur',
    EG: 'Entreprise Générale',
    ARCHITECT: 'Architecte',
    BROKER: 'Courtier',
    NOTARY: 'Notaire',
    BUYER: 'Acquéreur',
  };
  return labels[role] || role;
}
