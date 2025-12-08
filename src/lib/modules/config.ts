import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Mail,
  Calendar,
  Wrench,
  DollarSign,
  Target,
  BarChart3,
  Settings,
  UserCog,
  Briefcase,
  ClipboardCheck,
  Home,
  Package,
  Truck,
  MessageSquare,
  Bell,
  Shield,
  Award,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

export interface ModuleRoute {
  path: string;
  label: string;
  icon?: LucideIcon;
  description?: string;
  badge?: string;
  requiredPermission?: string;
  requiredRole?: string[];
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  routes: ModuleRoute[];
  enabled: boolean;
  category: 'core' | 'business' | 'support' | 'admin';
}

export const MODULES: Record<string, Module> = {
  // ========== CORE MODULES ==========
  dashboard: {
    id: 'dashboard',
    name: 'Tableau de Bord',
    description: 'Vue d\'ensemble de votre activité',
    icon: LayoutDashboard,
    color: 'text-brand-600',
    bgColor: 'bg-brand-50',
    category: 'core',
    enabled: true,
    routes: [
      { path: '/dashboard', label: 'Accueil', icon: Home },
      { path: '/dashboard/global', label: 'Vue Globale', icon: BarChart3 },
      { path: '/dashboard/analytics', label: 'Analytics', icon: TrendingUp },
    ],
  },

  projects: {
    id: 'projects',
    name: 'Projets',
    description: 'Gestion des projets immobiliers',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    category: 'core',
    enabled: true,
    routes: [
      { path: '/projects', label: 'Liste des Projets', icon: Building2 },
      { path: '/projects/new', label: 'Nouveau Projet', icon: Building2 },
    ],
  },

  // ========== BUSINESS MODULES ==========
  crm: {
    id: 'crm',
    name: 'CRM',
    description: 'Gestion de la relation client',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    category: 'business',
    enabled: true,
    routes: [
      { path: '/crm', label: 'Dashboard CRM', icon: LayoutDashboard },
      { path: '/crm/prospects', label: 'Prospects', icon: Target, badge: 'new' },
      { path: '/crm/contacts', label: 'Contacts', icon: Users },
      { path: '/crm/buyers', label: 'Acheteurs', icon: Users },
      { path: '/crm/companies', label: 'Entreprises', icon: Briefcase },
      { path: '/crm/campaigns', label: 'Campagnes', icon: Target },
      { path: '/crm/activities', label: 'Activités', icon: Calendar },
      { path: '/crm/segments', label: 'Segments', icon: Users },
      { path: '/crm/lead-scoring', label: 'Lead Scoring', icon: Award },
      { path: '/crm/email-marketing', label: 'Email Marketing', icon: Mail },
      { path: '/crm/workflows', label: 'Workflows', icon: TrendingUp },
    ],
  },

  finance: {
    id: 'finance',
    name: 'Finances',
    description: 'Gestion financière et comptabilité',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    category: 'business',
    enabled: true,
    routes: [
      { path: '/finance', label: 'Dashboard Finance', icon: LayoutDashboard },
      { path: '/finance/invoices', label: 'Factures', icon: FileText },
      { path: '/finance/payments', label: 'Paiements', icon: DollarSign },
      { path: '/finance/cfc', label: 'CFC', icon: ClipboardCheck },
      { path: '/finance/budgets', label: 'Budgets', icon: DollarSign },
      { path: '/finance/contracts', label: 'Contrats', icon: FileText },
      { path: '/finance/scenarios', label: 'Scénarios', icon: TrendingUp },
      { path: '/finance/reporting', label: 'Reporting', icon: BarChart3 },
    ],
  },

  planning: {
    id: 'planning',
    name: 'Planning',
    description: 'Planification et suivi de chantier',
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    category: 'business',
    enabled: true,
    routes: [
      { path: '/planning', label: 'Planning Global', icon: Calendar },
      { path: '/planning/gantt', label: 'Gantt', icon: Calendar },
      { path: '/planning/milestones', label: 'Jalons', icon: Target },
      { path: '/planning/phases', label: 'Phases', icon: Package },
      { path: '/planning/resources', label: 'Ressources', icon: Users },
      { path: '/planning/diary', label: 'Journal de Chantier', icon: FileText },
      { path: '/planning/photos', label: 'Photos Chantier', icon: Building2 },
    ],
  },

  construction: {
    id: 'construction',
    name: 'Construction',
    description: 'Suivi des travaux de construction',
    icon: Wrench,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    category: 'business',
    enabled: true,
    routes: [
      { path: '/construction', label: 'Suivi Chantier', icon: Wrench },
      { path: '/construction/progress', label: 'Avancement', icon: TrendingUp },
      { path: '/construction/inspections', label: 'Inspections', icon: ClipboardCheck },
      { path: '/construction/materials', label: 'Matériaux', icon: Package },
      { path: '/construction/suppliers', label: 'Fournisseurs', icon: Truck },
      { path: '/construction/issues', label: 'Problèmes', icon: Shield },
    ],
  },

  lots: {
    id: 'lots',
    name: 'Lots',
    description: 'Gestion des lots et appartements',
    icon: Home,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    category: 'business',
    enabled: true,
    routes: [
      { path: '/lots', label: 'Liste des Lots', icon: Home },
      { path: '/lots/availability', label: 'Disponibilité', icon: ClipboardCheck },
      { path: '/lots/reservations', label: 'Réservations', icon: Calendar },
      { path: '/lots/sales', label: 'Ventes', icon: DollarSign },
    ],
  },

  documents: {
    id: 'documents',
    name: 'Documents',
    description: 'Gestion documentaire centralisée',
    icon: FileText,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    category: 'business',
    enabled: true,
    routes: [
      { path: '/documents', label: 'Tous les Documents', icon: FileText },
      { path: '/documents/templates', label: 'Modèles', icon: FileText },
      { path: '/documents/signatures', label: 'Signatures', icon: FileText },
      { path: '/documents/contracts', label: 'Contrats', icon: FileText },
      { path: '/documents/exports', label: 'Exports', icon: FileText },
    ],
  },

  // ========== SUPPORT MODULES ==========
  sav: {
    id: 'sav',
    name: 'SAV',
    description: 'Service après-vente et garanties',
    icon: Wrench,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    category: 'support',
    enabled: true,
    routes: [
      { path: '/sav', label: 'Dashboard SAV', icon: LayoutDashboard },
      { path: '/sav/tickets', label: 'Tickets', icon: ClipboardCheck },
      { path: '/sav/warranties', label: 'Garanties', icon: Shield },
      { path: '/sav/handovers', label: 'Réceptions', icon: ClipboardCheck },
      { path: '/sav/interventions', label: 'Interventions', icon: Wrench },
    ],
  },

  communication: {
    id: 'communication',
    name: 'Communication',
    description: 'Messagerie et notifications',
    icon: MessageSquare,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    category: 'support',
    enabled: true,
    routes: [
      { path: '/messages', label: 'Messages', icon: MessageSquare },
      { path: '/notifications', label: 'Notifications', icon: Bell },
      { path: '/communication/templates', label: 'Modèles', icon: FileText },
    ],
  },

  reporting: {
    id: 'reporting',
    name: 'Reporting',
    description: 'Rapports et analyses',
    icon: BarChart3,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    category: 'support',
    enabled: true,
    routes: [
      { path: '/reporting', label: 'Dashboard Reporting', icon: LayoutDashboard },
      { path: '/reporting/sales', label: 'Ventes', icon: DollarSign },
      { path: '/reporting/finance', label: 'Finance', icon: DollarSign },
      { path: '/reporting/cfc', label: 'CFC', icon: ClipboardCheck },
      { path: '/reporting/construction', label: 'Construction', icon: Wrench },
      { path: '/reporting/custom', label: 'Rapports Personnalisés', icon: BarChart3 },
    ],
  },

  // ========== ADMIN MODULES ==========
  settings: {
    id: 'settings',
    name: 'Paramètres',
    description: 'Configuration de la plateforme',
    icon: Settings,
    color: 'text-neutral-600',
    bgColor: 'bg-neutral-50',
    category: 'admin',
    enabled: true,
    routes: [
      { path: '/settings', label: 'Général', icon: Settings },
      { path: '/settings/organization', label: 'Organisation', icon: Briefcase },
      { path: '/settings/branding', label: 'Branding', icon: Settings },
      { path: '/settings/localization', label: 'Localisation', icon: Settings },
      { path: '/settings/security', label: 'Sécurité', icon: Shield },
      { path: '/settings/billing', label: 'Facturation', icon: DollarSign },
    ],
  },

  admin: {
    id: 'admin',
    name: 'Administration',
    description: 'Administration système',
    icon: UserCog,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    category: 'admin',
    enabled: true,
    routes: [
      { path: '/admin', label: 'Dashboard Admin', icon: LayoutDashboard },
      { path: '/admin/users', label: 'Utilisateurs', icon: Users },
      { path: '/admin/organizations', label: 'Organisations', icon: Briefcase },
      { path: '/admin/permissions', label: 'Permissions', icon: Shield },
      { path: '/admin/audit', label: 'Audit Log', icon: ClipboardCheck },
      { path: '/admin/feature-flags', label: 'Feature Flags', icon: Settings },
    ],
  },
};

// Helper functions
export function getModuleById(id: string): Module | undefined {
  return MODULES[id];
}

export function getModulesByCategory(category: Module['category']): Module[] {
  return Object.values(MODULES).filter((m) => m.category === category && m.enabled);
}

export function getAllEnabledModules(): Module[] {
  return Object.values(MODULES).filter((m) => m.enabled);
}

export function getModuleRoutes(moduleId: string): ModuleRoute[] {
  return MODULES[moduleId]?.routes || [];
}

export function findModuleByRoute(path: string): Module | undefined {
  return Object.values(MODULES).find((module) =>
    module.routes.some((route) => path.startsWith(route.path))
  );
}
