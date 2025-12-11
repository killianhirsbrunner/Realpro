/**
 * Systeme de permissions et roles RealPro
 *
 * Ce fichier definit les roles et permissions alignes avec la base de donnees.
 * Les roles correspondent exactement a la table `roles` de Supabase.
 */

// ============================================================================
// TYPES DE BASE
// ============================================================================

/**
 * Type d'utilisateur (interne a l'organisation, externe, acheteur)
 */
export type UserType = 'INTERNAL' | 'EXTERNAL' | 'BUYER';

/**
 * Roles systeme - correspondent aux roles en base de donnees
 */
export enum SystemRole {
  SAAS_ADMIN = 'saas_admin',
  ORG_ADMIN = 'org_admin',
  PROMOTER = 'promoter',
  GENERAL_CONTRACTOR = 'general_contractor',
  ARCHITECT = 'architect',
  ENGINEER = 'engineer',
  NOTARY = 'notary',
  BROKER = 'broker',
  BUYER = 'buyer',
  SUPPLIER = 'supplier',
}

/**
 * Alias pour retrocompatibilite avec l'ancien code
 * @deprecated Utiliser SystemRole a la place
 */
export enum UserRole {
  PROMOTEUR = 'promoter',
  EG = 'general_contractor',
  ARCHITECTE = 'architect',
  INGENIEUR = 'engineer',
  NOTAIRE = 'notary',
  COURTIER = 'broker',
  ACHETEUR = 'buyer',
  ADMIN = 'org_admin',
  SAAS_ADMIN = 'saas_admin',
  FOURNISSEUR = 'supplier',
}

/**
 * Roles de participant projet - correspondent a l'enum project_participant_role
 */
export enum ProjectParticipantRole {
  OWNER = 'OWNER',
  EG = 'EG',
  ARCHITECT = 'ARCHITECT',
  ENGINEER = 'ENGINEER',
  NOTARY = 'NOTARY',
  BROKER = 'BROKER',
  CONSULTANT = 'CONSULTANT',
}

// ============================================================================
// RESSOURCES ET ACTIONS
// ============================================================================

/**
 * Ressources du systeme
 */
export type Resource =
  | 'organizations'
  | 'projects'
  | 'lots'
  | 'crm'
  | 'notary'
  | 'brokers'
  | 'submissions'
  | 'finance'
  | 'documents'
  | 'choices'
  | 'construction'
  | 'communication'
  | 'settings'
  | 'reporting'
  | 'billing';

/**
 * Actions possibles sur les ressources
 */
export type Action =
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'export'
  | 'manage'
  | 'approve'
  | 'adjudicate'
  | 'bid'
  | 'manage_pricing'
  | 'manage_budget'
  | 'approve_payment';

/**
 * Permission au format resource.action
 */
export type PermissionString = `${Resource}.${Action}`;

/**
 * Permissions enum pour compatibilite
 */
export enum Permission {
  // Organizations
  ORGANIZATIONS_READ = 'organizations.read',
  ORGANIZATIONS_CREATE = 'organizations.create',
  ORGANIZATIONS_UPDATE = 'organizations.update',
  ORGANIZATIONS_DELETE = 'organizations.delete',

  // Projects
  PROJECTS_READ = 'projects.read',
  PROJECTS_CREATE = 'projects.create',
  PROJECTS_UPDATE = 'projects.update',
  PROJECTS_DELETE = 'projects.delete',
  PROJECTS_EXPORT = 'projects.export',

  // Lots
  LOTS_READ = 'lots.read',
  LOTS_CREATE = 'lots.create',
  LOTS_UPDATE = 'lots.update',
  LOTS_DELETE = 'lots.delete',
  LOTS_MANAGE_PRICING = 'lots.manage_pricing',

  // CRM
  CRM_READ = 'crm.read',
  CRM_CREATE = 'crm.create',
  CRM_UPDATE = 'crm.update',
  CRM_DELETE = 'crm.delete',
  CRM_EXPORT = 'crm.export',

  // Notary
  NOTARY_READ = 'notary.read',
  NOTARY_CREATE = 'notary.create',
  NOTARY_UPDATE = 'notary.update',
  NOTARY_MANAGE = 'notary.manage',

  // Brokers
  BROKERS_READ = 'brokers.read',
  BROKERS_MANAGE = 'brokers.manage',

  // Submissions
  SUBMISSIONS_READ = 'submissions.read',
  SUBMISSIONS_CREATE = 'submissions.create',
  SUBMISSIONS_UPDATE = 'submissions.update',
  SUBMISSIONS_ADJUDICATE = 'submissions.adjudicate',
  SUBMISSIONS_BID = 'submissions.bid',

  // Finance
  FINANCE_READ = 'finance.read',
  FINANCE_CREATE = 'finance.create',
  FINANCE_UPDATE = 'finance.update',
  FINANCE_MANAGE_BUDGET = 'finance.manage_budget',
  FINANCE_APPROVE_PAYMENT = 'finance.approve_payment',

  // Documents
  DOCUMENTS_READ = 'documents.read',
  DOCUMENTS_CREATE = 'documents.create',
  DOCUMENTS_UPDATE = 'documents.update',
  DOCUMENTS_DELETE = 'documents.delete',

  // Choices (materiaux)
  CHOICES_READ = 'choices.read',
  CHOICES_CREATE = 'choices.create',
  CHOICES_UPDATE = 'choices.update',
  CHOICES_APPROVE = 'choices.approve',

  // Construction
  CONSTRUCTION_READ = 'construction.read',
  CONSTRUCTION_UPDATE = 'construction.update',
  CONSTRUCTION_MANAGE = 'construction.manage',

  // Communication
  COMMUNICATION_READ = 'communication.read',
  COMMUNICATION_CREATE = 'communication.create',

  // Settings
  SETTINGS_READ = 'settings.read',
  SETTINGS_UPDATE = 'settings.update',

  // Reporting
  REPORTING_READ = 'reporting.read',
  REPORTING_EXPORT = 'reporting.export',

  // Billing
  BILLING_READ = 'billing.read',
  BILLING_MANAGE = 'billing.manage',

  // Legacy aliases pour retrocompatibilite
  VIEW_PROJECTS = 'projects.read',
  CREATE_PROJECTS = 'projects.create',
  EDIT_PROJECTS = 'projects.update',
  DELETE_PROJECTS = 'projects.delete',
  VIEW_LOTS = 'lots.read',
  CREATE_LOTS = 'lots.create',
  EDIT_LOTS = 'lots.update',
  SELL_LOTS = 'lots.manage_pricing',
  VIEW_BUYERS = 'crm.read',
  MANAGE_BUYERS = 'crm.update',
  VIEW_BUYER_DETAILS = 'crm.read',
  VIEW_DOCUMENTS = 'documents.read',
  UPLOAD_DOCUMENTS = 'documents.create',
  SIGN_DOCUMENTS = 'documents.update',
  VIEW_SUBMISSIONS = 'submissions.read',
  CREATE_SUBMISSIONS = 'submissions.create',
  COMPARE_SUBMISSIONS = 'submissions.read',
  VIEW_CONSTRUCTION = 'construction.read',
  MANAGE_CONSTRUCTION = 'construction.manage',
  VIEW_SAV = 'construction.read',
  MANAGE_SAV = 'construction.manage',
  VIEW_BILLING = 'billing.read',
  MANAGE_BILLING = 'billing.manage',
  VIEW_REPORTING = 'reporting.read',
  EXPORT_DATA = 'reporting.export',
  MANAGE_USERS = 'organizations.update',
  MANAGE_SETTINGS = 'settings.update',
}

// ============================================================================
// MATRICE DES PERMISSIONS PAR ROLE
// ============================================================================

/**
 * Permissions attribuees a chaque role systeme
 * Aligne avec la table role_permissions en base de donnees
 */
export const ROLE_PERMISSIONS: Record<SystemRole, Permission[]> = {
  // SaaS Admin - Acces complet
  [SystemRole.SAAS_ADMIN]: [
    Permission.ORGANIZATIONS_READ,
    Permission.ORGANIZATIONS_CREATE,
    Permission.ORGANIZATIONS_UPDATE,
    Permission.ORGANIZATIONS_DELETE,
    Permission.PROJECTS_READ,
    Permission.PROJECTS_CREATE,
    Permission.PROJECTS_UPDATE,
    Permission.PROJECTS_DELETE,
    Permission.PROJECTS_EXPORT,
    Permission.LOTS_READ,
    Permission.LOTS_CREATE,
    Permission.LOTS_UPDATE,
    Permission.LOTS_DELETE,
    Permission.LOTS_MANAGE_PRICING,
    Permission.CRM_READ,
    Permission.CRM_CREATE,
    Permission.CRM_UPDATE,
    Permission.CRM_DELETE,
    Permission.CRM_EXPORT,
    Permission.NOTARY_READ,
    Permission.NOTARY_CREATE,
    Permission.NOTARY_UPDATE,
    Permission.NOTARY_MANAGE,
    Permission.BROKERS_READ,
    Permission.BROKERS_MANAGE,
    Permission.SUBMISSIONS_READ,
    Permission.SUBMISSIONS_CREATE,
    Permission.SUBMISSIONS_UPDATE,
    Permission.SUBMISSIONS_ADJUDICATE,
    Permission.SUBMISSIONS_BID,
    Permission.FINANCE_READ,
    Permission.FINANCE_CREATE,
    Permission.FINANCE_UPDATE,
    Permission.FINANCE_MANAGE_BUDGET,
    Permission.FINANCE_APPROVE_PAYMENT,
    Permission.DOCUMENTS_READ,
    Permission.DOCUMENTS_CREATE,
    Permission.DOCUMENTS_UPDATE,
    Permission.DOCUMENTS_DELETE,
    Permission.CHOICES_READ,
    Permission.CHOICES_CREATE,
    Permission.CHOICES_UPDATE,
    Permission.CHOICES_APPROVE,
    Permission.CONSTRUCTION_READ,
    Permission.CONSTRUCTION_UPDATE,
    Permission.CONSTRUCTION_MANAGE,
    Permission.COMMUNICATION_READ,
    Permission.COMMUNICATION_CREATE,
    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE,
    Permission.REPORTING_READ,
    Permission.REPORTING_EXPORT,
    Permission.BILLING_READ,
    Permission.BILLING_MANAGE,
  ],

  // Org Admin - Tout sauf billing.manage
  [SystemRole.ORG_ADMIN]: [
    Permission.ORGANIZATIONS_READ,
    Permission.ORGANIZATIONS_UPDATE,
    Permission.PROJECTS_READ,
    Permission.PROJECTS_CREATE,
    Permission.PROJECTS_UPDATE,
    Permission.PROJECTS_DELETE,
    Permission.PROJECTS_EXPORT,
    Permission.LOTS_READ,
    Permission.LOTS_CREATE,
    Permission.LOTS_UPDATE,
    Permission.LOTS_DELETE,
    Permission.LOTS_MANAGE_PRICING,
    Permission.CRM_READ,
    Permission.CRM_CREATE,
    Permission.CRM_UPDATE,
    Permission.CRM_DELETE,
    Permission.CRM_EXPORT,
    Permission.NOTARY_READ,
    Permission.NOTARY_CREATE,
    Permission.NOTARY_UPDATE,
    Permission.NOTARY_MANAGE,
    Permission.BROKERS_READ,
    Permission.BROKERS_MANAGE,
    Permission.SUBMISSIONS_READ,
    Permission.SUBMISSIONS_CREATE,
    Permission.SUBMISSIONS_UPDATE,
    Permission.SUBMISSIONS_ADJUDICATE,
    Permission.FINANCE_READ,
    Permission.FINANCE_CREATE,
    Permission.FINANCE_UPDATE,
    Permission.FINANCE_MANAGE_BUDGET,
    Permission.FINANCE_APPROVE_PAYMENT,
    Permission.DOCUMENTS_READ,
    Permission.DOCUMENTS_CREATE,
    Permission.DOCUMENTS_UPDATE,
    Permission.DOCUMENTS_DELETE,
    Permission.CHOICES_READ,
    Permission.CHOICES_CREATE,
    Permission.CHOICES_UPDATE,
    Permission.CHOICES_APPROVE,
    Permission.CONSTRUCTION_READ,
    Permission.CONSTRUCTION_UPDATE,
    Permission.CONSTRUCTION_MANAGE,
    Permission.COMMUNICATION_READ,
    Permission.COMMUNICATION_CREATE,
    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE,
    Permission.REPORTING_READ,
    Permission.REPORTING_EXPORT,
    Permission.BILLING_READ,
  ],

  // Promoter - Projets, CRM, finance, documents, reporting
  [SystemRole.PROMOTER]: [
    Permission.PROJECTS_READ,
    Permission.PROJECTS_CREATE,
    Permission.PROJECTS_UPDATE,
    Permission.PROJECTS_DELETE,
    Permission.PROJECTS_EXPORT,
    Permission.LOTS_READ,
    Permission.LOTS_CREATE,
    Permission.LOTS_UPDATE,
    Permission.LOTS_DELETE,
    Permission.LOTS_MANAGE_PRICING,
    Permission.CRM_READ,
    Permission.CRM_CREATE,
    Permission.CRM_UPDATE,
    Permission.CRM_DELETE,
    Permission.CRM_EXPORT,
    Permission.FINANCE_READ,
    Permission.FINANCE_CREATE,
    Permission.FINANCE_UPDATE,
    Permission.FINANCE_MANAGE_BUDGET,
    Permission.FINANCE_APPROVE_PAYMENT,
    Permission.DOCUMENTS_READ,
    Permission.DOCUMENTS_CREATE,
    Permission.DOCUMENTS_UPDATE,
    Permission.DOCUMENTS_DELETE,
    Permission.REPORTING_READ,
    Permission.REPORTING_EXPORT,
    Permission.COMMUNICATION_READ,
    Permission.COMMUNICATION_CREATE,
    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE,
    Permission.BROKERS_READ,
    Permission.BROKERS_MANAGE,
    Permission.SUBMISSIONS_READ,
    Permission.SUBMISSIONS_ADJUDICATE,
    Permission.CONSTRUCTION_READ,
    Permission.CHOICES_READ,
    Permission.CHOICES_APPROVE,
    Permission.NOTARY_READ,
    Permission.BILLING_READ,
  ],

  // General Contractor (EG) - Construction, soumissions, documents
  [SystemRole.GENERAL_CONTRACTOR]: [
    Permission.CONSTRUCTION_READ,
    Permission.CONSTRUCTION_UPDATE,
    Permission.CONSTRUCTION_MANAGE,
    Permission.DOCUMENTS_READ,
    Permission.DOCUMENTS_CREATE,
    Permission.DOCUMENTS_UPDATE,
    Permission.DOCUMENTS_DELETE,
    Permission.COMMUNICATION_READ,
    Permission.COMMUNICATION_CREATE,
    Permission.PROJECTS_READ,
    Permission.LOTS_READ,
    Permission.SUBMISSIONS_READ,
    Permission.SUBMISSIONS_CREATE,
    Permission.SUBMISSIONS_UPDATE,
    Permission.FINANCE_READ,
  ],

  // Architect - Projets, plans, documents, choix materiaux
  [SystemRole.ARCHITECT]: [
    Permission.DOCUMENTS_READ,
    Permission.DOCUMENTS_CREATE,
    Permission.DOCUMENTS_UPDATE,
    Permission.DOCUMENTS_DELETE,
    Permission.CHOICES_READ,
    Permission.CHOICES_CREATE,
    Permission.CHOICES_UPDATE,
    Permission.CHOICES_APPROVE,
    Permission.COMMUNICATION_READ,
    Permission.COMMUNICATION_CREATE,
    Permission.PROJECTS_READ,
    Permission.PROJECTS_UPDATE,
    Permission.LOTS_READ,
    Permission.LOTS_UPDATE,
    Permission.CONSTRUCTION_READ,
  ],

  // Engineer - Focus technique
  [SystemRole.ENGINEER]: [
    Permission.DOCUMENTS_READ,
    Permission.DOCUMENTS_CREATE,
    Permission.DOCUMENTS_UPDATE,
    Permission.COMMUNICATION_READ,
    Permission.COMMUNICATION_CREATE,
    Permission.PROJECTS_READ,
    Permission.LOTS_READ,
    Permission.CONSTRUCTION_READ,
    Permission.CONSTRUCTION_UPDATE,
    Permission.SUBMISSIONS_READ,
  ],

  // Notary - Dossiers notaire, actes
  [SystemRole.NOTARY]: [
    Permission.NOTARY_READ,
    Permission.NOTARY_CREATE,
    Permission.NOTARY_UPDATE,
    Permission.NOTARY_MANAGE,
    Permission.COMMUNICATION_READ,
    Permission.COMMUNICATION_CREATE,
    Permission.CRM_READ,
    Permission.DOCUMENTS_READ,
    Permission.DOCUMENTS_CREATE,
    Permission.LOTS_READ,
  ],

  // Broker - CRM, reservations, commissions
  [SystemRole.BROKER]: [
    Permission.CRM_READ,
    Permission.CRM_CREATE,
    Permission.CRM_UPDATE,
    Permission.CRM_DELETE,
    Permission.CRM_EXPORT,
    Permission.BROKERS_READ,
    Permission.BROKERS_MANAGE,
    Permission.COMMUNICATION_READ,
    Permission.COMMUNICATION_CREATE,
    Permission.PROJECTS_READ,
    Permission.LOTS_READ,
    Permission.DOCUMENTS_READ,
  ],

  // Buyer - Lecture limitee
  [SystemRole.BUYER]: [
    Permission.LOTS_READ,
    Permission.CHOICES_READ,
    Permission.CHOICES_CREATE,
    Permission.DOCUMENTS_READ,
    Permission.CONSTRUCTION_READ,
    Permission.COMMUNICATION_READ,
    Permission.COMMUNICATION_CREATE,
    Permission.FINANCE_READ,
  ],

  // Supplier - Soumissions uniquement
  [SystemRole.SUPPLIER]: [
    Permission.SUBMISSIONS_READ,
    Permission.SUBMISSIONS_BID,
    Permission.COMMUNICATION_READ,
    Permission.COMMUNICATION_CREATE,
    Permission.DOCUMENTS_READ,
  ],
};

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Normalise un role vers SystemRole
 */
export function normalizeRole(role: string): SystemRole {
  const roleMapping: Record<string, SystemRole> = {
    // Anciens noms francais
    promoteur: SystemRole.PROMOTER,
    eg: SystemRole.GENERAL_CONTRACTOR,
    architecte: SystemRole.ARCHITECT,
    ingenieur: SystemRole.ENGINEER,
    notaire: SystemRole.NOTARY,
    courtier: SystemRole.BROKER,
    acheteur: SystemRole.BUYER,
    admin: SystemRole.ORG_ADMIN,
    fournisseur: SystemRole.SUPPLIER,
    // Noms systeme
    saas_admin: SystemRole.SAAS_ADMIN,
    org_admin: SystemRole.ORG_ADMIN,
    promoter: SystemRole.PROMOTER,
    general_contractor: SystemRole.GENERAL_CONTRACTOR,
    architect: SystemRole.ARCHITECT,
    engineer: SystemRole.ENGINEER,
    notary: SystemRole.NOTARY,
    broker: SystemRole.BROKER,
    buyer: SystemRole.BUYER,
    supplier: SystemRole.SUPPLIER,
  };

  const normalized = role.toLowerCase();
  return roleMapping[normalized] || (role as SystemRole);
}

/**
 * Verifie si un role possede une permission specifique
 */
export function hasPermission(
  role: SystemRole | UserRole | string,
  permission: Permission | PermissionString
): boolean {
  const normalizedRole = normalizeRole(String(role));
  const permissions = ROLE_PERMISSIONS[normalizedRole];

  if (!permissions) {
    return false;
  }

  return permissions.includes(permission as Permission);
}

/**
 * Verifie si un role possede au moins une des permissions
 */
export function hasAnyPermission(
  role: SystemRole | UserRole | string,
  permissions: (Permission | PermissionString)[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Verifie si un role possede toutes les permissions
 */
export function hasAllPermissions(
  role: SystemRole | UserRole | string,
  permissions: (Permission | PermissionString)[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Verifie si un role peut acceder a un module
 */
export function canAccessModule(role: SystemRole | UserRole | string, module: string): boolean {
  const modulePermissions: Record<string, Permission[]> = {
    organizations: [Permission.ORGANIZATIONS_READ],
    projects: [Permission.PROJECTS_READ],
    lots: [Permission.LOTS_READ],
    crm: [Permission.CRM_READ],
    buyers: [Permission.CRM_READ],
    notary: [Permission.NOTARY_READ],
    brokers: [Permission.BROKERS_READ],
    submissions: [Permission.SUBMISSIONS_READ],
    finance: [Permission.FINANCE_READ],
    documents: [Permission.DOCUMENTS_READ],
    choices: [Permission.CHOICES_READ],
    construction: [Permission.CONSTRUCTION_READ],
    communication: [Permission.COMMUNICATION_READ],
    settings: [Permission.SETTINGS_READ],
    reporting: [Permission.REPORTING_READ],
    billing: [Permission.BILLING_READ],
    sav: [Permission.CONSTRUCTION_READ],
  };

  const requiredPermissions = modulePermissions[module];
  if (!requiredPermissions) {
    return false;
  }

  return hasAnyPermission(role, requiredPermissions);
}

/**
 * Verifie si un role peut modifier un module
 */
export function canEditModule(role: SystemRole | UserRole | string, module: Resource): boolean {
  const updatePermission = `${module}.update` as Permission;
  return hasPermission(role, updatePermission);
}

// ============================================================================
// LABELS ET AFFICHAGE
// ============================================================================

type Language = 'fr' | 'de' | 'en' | 'it';

/**
 * Labels multilingues pour les roles
 */
export const ROLE_LABELS: Record<SystemRole, Record<Language, string>> = {
  [SystemRole.SAAS_ADMIN]: {
    fr: 'Administrateur SaaS',
    de: 'SaaS-Administrator',
    en: 'SaaS Administrator',
    it: 'Amministratore SaaS',
  },
  [SystemRole.ORG_ADMIN]: {
    fr: 'Administrateur',
    de: 'Administrator',
    en: 'Administrator',
    it: 'Amministratore',
  },
  [SystemRole.PROMOTER]: {
    fr: 'Promoteur',
    de: 'Bautrager',
    en: 'Developer',
    it: 'Promotore',
  },
  [SystemRole.GENERAL_CONTRACTOR]: {
    fr: 'Entreprise Generale',
    de: 'Generalunternehmer',
    en: 'General Contractor',
    it: 'Impresa Generale',
  },
  [SystemRole.ARCHITECT]: {
    fr: 'Architecte',
    de: 'Architekt',
    en: 'Architect',
    it: 'Architetto',
  },
  [SystemRole.ENGINEER]: {
    fr: 'Ingenieur',
    de: 'Ingenieur',
    en: 'Engineer',
    it: 'Ingegnere',
  },
  [SystemRole.NOTARY]: {
    fr: 'Notaire',
    de: 'Notar',
    en: 'Notary',
    it: 'Notaio',
  },
  [SystemRole.BROKER]: {
    fr: 'Courtier',
    de: 'Makler',
    en: 'Broker',
    it: 'Mediatore',
  },
  [SystemRole.BUYER]: {
    fr: 'Acheteur',
    de: 'Kaufer',
    en: 'Buyer',
    it: 'Acquirente',
  },
  [SystemRole.SUPPLIER]: {
    fr: 'Soumissionnaire',
    de: 'Bieter',
    en: 'Bidder',
    it: 'Offerente',
  },
};

/**
 * Labels pour les roles de participant projet
 */
export const PROJECT_PARTICIPANT_LABELS: Record<ProjectParticipantRole, Record<Language, string>> = {
  [ProjectParticipantRole.OWNER]: {
    fr: 'Proprietaire',
    de: 'Eigentumer',
    en: 'Owner',
    it: 'Proprietario',
  },
  [ProjectParticipantRole.EG]: {
    fr: 'Entreprise Generale',
    de: 'Generalunternehmer',
    en: 'General Contractor',
    it: 'Impresa Generale',
  },
  [ProjectParticipantRole.ARCHITECT]: {
    fr: 'Architecte',
    de: 'Architekt',
    en: 'Architect',
    it: 'Architetto',
  },
  [ProjectParticipantRole.ENGINEER]: {
    fr: 'Ingenieur',
    de: 'Ingenieur',
    en: 'Engineer',
    it: 'Ingegnere',
  },
  [ProjectParticipantRole.NOTARY]: {
    fr: 'Notaire',
    de: 'Notar',
    en: 'Notary',
    it: 'Notaio',
  },
  [ProjectParticipantRole.BROKER]: {
    fr: 'Courtier',
    de: 'Makler',
    en: 'Broker',
    it: 'Mediatore',
  },
  [ProjectParticipantRole.CONSULTANT]: {
    fr: 'Consultant',
    de: 'Berater',
    en: 'Consultant',
    it: 'Consulente',
  },
};

/**
 * Obtient le label d'affichage d'un role
 */
export function getRoleDisplayName(role: SystemRole | UserRole | string, lang: Language = 'fr'): string {
  const normalizedRole = normalizeRole(String(role));
  const labels = ROLE_LABELS[normalizedRole];
  return labels?.[lang] || String(role);
}

/**
 * Obtient la couleur associee a un role
 */
export function getRoleColor(role: SystemRole | UserRole | string): string {
  const normalizedRole = normalizeRole(String(role));

  const colors: Record<SystemRole, string> = {
    [SystemRole.SAAS_ADMIN]: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    [SystemRole.ORG_ADMIN]: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    [SystemRole.PROMOTER]: 'text-brand-600 bg-brand-100 dark:text-brand-400 dark:bg-brand-900/30',
    [SystemRole.GENERAL_CONTRACTOR]: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
    [SystemRole.ARCHITECT]: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    [SystemRole.ENGINEER]: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    [SystemRole.NOTARY]: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    [SystemRole.BROKER]: 'text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/30',
    [SystemRole.BUYER]: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30',
    [SystemRole.SUPPLIER]: 'text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/30',
  };

  return colors[normalizedRole] || 'text-gray-600 bg-gray-100';
}

// ============================================================================
// CLASSIFICATION DES ROLES
// ============================================================================

/**
 * Liste des roles internes (employes de l'organisation)
 */
export const INTERNAL_ROLES: SystemRole[] = [
  SystemRole.SAAS_ADMIN,
  SystemRole.ORG_ADMIN,
  SystemRole.PROMOTER,
];

/**
 * Liste des roles externes (partenaires, intervenants)
 */
export const EXTERNAL_ROLES: SystemRole[] = [
  SystemRole.GENERAL_CONTRACTOR,
  SystemRole.ARCHITECT,
  SystemRole.ENGINEER,
  SystemRole.NOTARY,
  SystemRole.BROKER,
  SystemRole.SUPPLIER,
];

/**
 * Liste des roles acheteurs
 */
export const BUYER_ROLES: SystemRole[] = [SystemRole.BUYER];

/**
 * Determine le type d'utilisateur en fonction de son role
 */
export function getUserTypeFromRole(role: SystemRole | string): UserType {
  const normalizedRole = normalizeRole(String(role));

  if (BUYER_ROLES.includes(normalizedRole)) {
    return 'BUYER';
  }
  if (EXTERNAL_ROLES.includes(normalizedRole)) {
    return 'EXTERNAL';
  }
  return 'INTERNAL';
}

/**
 * Obtient tous les roles pour un type d'utilisateur
 */
export function getRolesForUserType(userType: UserType): SystemRole[] {
  switch (userType) {
    case 'INTERNAL':
      return INTERNAL_ROLES;
    case 'EXTERNAL':
      return EXTERNAL_ROLES;
    case 'BUYER':
      return BUYER_ROLES;
    default:
      return [];
  }
}

/**
 * Liste de tous les roles selectionnables pour invitation
 */
export function getInvitableRoles(): SystemRole[] {
  return [
    SystemRole.ORG_ADMIN,
    SystemRole.PROMOTER,
    SystemRole.GENERAL_CONTRACTOR,
    SystemRole.ARCHITECT,
    SystemRole.ENGINEER,
    SystemRole.NOTARY,
    SystemRole.BROKER,
    SystemRole.BUYER,
    SystemRole.SUPPLIER,
  ];
}

/**
 * Verifie si un role est un admin (SaaS ou Org)
 */
export function isAdminRole(role: SystemRole | string): boolean {
  const normalizedRole = normalizeRole(String(role));
  return normalizedRole === SystemRole.SAAS_ADMIN || normalizedRole === SystemRole.ORG_ADMIN;
}

/**
 * Verifie si un role peut gerer d'autres utilisateurs
 */
export function canManageUsers(role: SystemRole | string): boolean {
  return hasPermission(role, Permission.ORGANIZATIONS_UPDATE);
}
