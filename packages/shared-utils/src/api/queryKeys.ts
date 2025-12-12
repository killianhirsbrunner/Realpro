/**
 * Query Key Factory for React Query
 * Provides consistent query keys across all applications
 */

export const queryKeys = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PPE ADMIN
  // ═══════════════════════════════════════════════════════════════════════════
  ppe: {
    all: ['ppe'] as const,

    // Buildings (Immeubles)
    buildings: {
      all: () => [...queryKeys.ppe.all, 'buildings'] as const,
      lists: () => [...queryKeys.ppe.buildings.all(), 'list'] as const,
      list: (filters?: Record<string, unknown>) => [...queryKeys.ppe.buildings.lists(), filters] as const,
      details: () => [...queryKeys.ppe.buildings.all(), 'detail'] as const,
      detail: (id: string) => [...queryKeys.ppe.buildings.details(), id] as const,
    },

    // Lots (Units)
    lots: {
      all: () => [...queryKeys.ppe.all, 'lots'] as const,
      byBuilding: (buildingId: string) => [...queryKeys.ppe.lots.all(), 'building', buildingId] as const,
      detail: (id: string) => [...queryKeys.ppe.lots.all(), 'detail', id] as const,
    },

    // Co-owners (Copropriétaires)
    coowners: {
      all: () => [...queryKeys.ppe.all, 'coowners'] as const,
      lists: () => [...queryKeys.ppe.coowners.all(), 'list'] as const,
      list: (filters?: Record<string, unknown>) => [...queryKeys.ppe.coowners.lists(), filters] as const,
      detail: (id: string) => [...queryKeys.ppe.coowners.all(), 'detail', id] as const,
    },

    // General Assemblies (AG)
    assemblies: {
      all: () => [...queryKeys.ppe.all, 'assemblies'] as const,
      lists: () => [...queryKeys.ppe.assemblies.all(), 'list'] as const,
      list: (filters?: Record<string, unknown>) => [...queryKeys.ppe.assemblies.lists(), filters] as const,
      detail: (id: string) => [...queryKeys.ppe.assemblies.all(), 'detail', id] as const,
      votes: (assemblyId: string) => [...queryKeys.ppe.assemblies.detail(assemblyId), 'votes'] as const,
    },

    // Budget
    budget: {
      all: () => [...queryKeys.ppe.all, 'budget'] as const,
      current: (buildingId: string) => [...queryKeys.ppe.budget.all(), 'current', buildingId] as const,
      calls: (buildingId: string) => [...queryKeys.ppe.budget.all(), 'calls', buildingId] as const,
    },

    // Claims (Sinistres)
    claims: {
      all: () => [...queryKeys.ppe.all, 'claims'] as const,
      lists: () => [...queryKeys.ppe.claims.all(), 'list'] as const,
      list: (filters?: Record<string, unknown>) => [...queryKeys.ppe.claims.lists(), filters] as const,
      detail: (id: string) => [...queryKeys.ppe.claims.all(), 'detail', id] as const,
    },

    // Documents
    documents: {
      all: () => [...queryKeys.ppe.all, 'documents'] as const,
      byBuilding: (buildingId: string) => [...queryKeys.ppe.documents.all(), 'building', buildingId] as const,
      byFolder: (folderId: string) => [...queryKeys.ppe.documents.all(), 'folder', folderId] as const,
    },

    // Tickets
    tickets: {
      all: () => [...queryKeys.ppe.all, 'tickets'] as const,
      lists: () => [...queryKeys.ppe.tickets.all(), 'list'] as const,
      list: (filters?: Record<string, unknown>) => [...queryKeys.ppe.tickets.lists(), filters] as const,
      detail: (id: string) => [...queryKeys.ppe.tickets.all(), 'detail', id] as const,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROMOTEUR
  // ═══════════════════════════════════════════════════════════════════════════
  promoteur: {
    all: ['promoteur'] as const,

    // Projects
    projects: {
      all: () => [...queryKeys.promoteur.all, 'projects'] as const,
      lists: () => [...queryKeys.promoteur.projects.all(), 'list'] as const,
      list: (filters?: Record<string, unknown>) => [...queryKeys.promoteur.projects.lists(), filters] as const,
      detail: (id: string) => [...queryKeys.promoteur.projects.all(), 'detail', id] as const,
    },

    // Lots
    lots: {
      all: () => [...queryKeys.promoteur.all, 'lots'] as const,
      byProject: (projectId: string) => [...queryKeys.promoteur.lots.all(), 'project', projectId] as const,
      detail: (id: string) => [...queryKeys.promoteur.lots.all(), 'detail', id] as const,
    },

    // Buyers
    buyers: {
      all: () => [...queryKeys.promoteur.all, 'buyers'] as const,
      byProject: (projectId: string) => [...queryKeys.promoteur.buyers.all(), 'project', projectId] as const,
      detail: (id: string) => [...queryKeys.promoteur.buyers.all(), 'detail', id] as const,
    },

    // CRM
    crm: {
      all: () => [...queryKeys.promoteur.all, 'crm'] as const,
      contacts: (projectId: string) => [...queryKeys.promoteur.crm.all(), 'contacts', projectId] as const,
      activities: (projectId: string) => [...queryKeys.promoteur.crm.all(), 'activities', projectId] as const,
    },

    // Finance
    finance: {
      all: () => [...queryKeys.promoteur.all, 'finance'] as const,
      byProject: (projectId: string) => [...queryKeys.promoteur.finance.all(), 'project', projectId] as const,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REGIE
  // ═══════════════════════════════════════════════════════════════════════════
  regie: {
    all: ['regie'] as const,

    // Properties (Objets)
    properties: {
      all: () => [...queryKeys.regie.all, 'properties'] as const,
      lists: () => [...queryKeys.regie.properties.all(), 'list'] as const,
      list: (filters?: Record<string, unknown>) => [...queryKeys.regie.properties.lists(), filters] as const,
      detail: (id: string) => [...queryKeys.regie.properties.all(), 'detail', id] as const,
    },

    // Units
    units: {
      all: () => [...queryKeys.regie.all, 'units'] as const,
      byProperty: (propertyId: string) => [...queryKeys.regie.units.all(), 'property', propertyId] as const,
      detail: (id: string) => [...queryKeys.regie.units.all(), 'detail', id] as const,
    },

    // Owners (Propriétaires)
    owners: {
      all: () => [...queryKeys.regie.all, 'owners'] as const,
      lists: () => [...queryKeys.regie.owners.all(), 'list'] as const,
      list: (filters?: Record<string, unknown>) => [...queryKeys.regie.owners.lists(), filters] as const,
      detail: (id: string) => [...queryKeys.regie.owners.all(), 'detail', id] as const,
    },

    // Tenants (Locataires)
    tenants: {
      all: () => [...queryKeys.regie.all, 'tenants'] as const,
      lists: () => [...queryKeys.regie.tenants.all(), 'list'] as const,
      list: (filters?: Record<string, unknown>) => [...queryKeys.regie.tenants.lists(), filters] as const,
      detail: (id: string) => [...queryKeys.regie.tenants.all(), 'detail', id] as const,
    },

    // Leases (Baux)
    leases: {
      all: () => [...queryKeys.regie.all, 'leases'] as const,
      lists: () => [...queryKeys.regie.leases.all(), 'list'] as const,
      list: (filters?: Record<string, unknown>) => [...queryKeys.regie.leases.lists(), filters] as const,
      detail: (id: string) => [...queryKeys.regie.leases.all(), 'detail', id] as const,
    },

    // Payments (Encaissements)
    payments: {
      all: () => [...queryKeys.regie.all, 'payments'] as const,
      schedule: (propertyId?: string) => [...queryKeys.regie.payments.all(), 'schedule', propertyId] as const,
      receipts: (leaseId: string) => [...queryKeys.regie.payments.all(), 'receipts', leaseId] as const,
    },

    // Inspections (Entrées/Sorties)
    inspections: {
      all: () => [...queryKeys.regie.all, 'inspections'] as const,
      byUnit: (unitId: string) => [...queryKeys.regie.inspections.all(), 'unit', unitId] as const,
      detail: (id: string) => [...queryKeys.regie.inspections.all(), 'detail', id] as const,
    },

    // Tickets
    tickets: {
      all: () => [...queryKeys.regie.all, 'tickets'] as const,
      lists: () => [...queryKeys.regie.tickets.all(), 'list'] as const,
      list: (filters?: Record<string, unknown>) => [...queryKeys.regie.tickets.lists(), filters] as const,
      detail: (id: string) => [...queryKeys.regie.tickets.all(), 'detail', id] as const,
    },

    // Documents
    documents: {
      all: () => [...queryKeys.regie.all, 'documents'] as const,
      byProperty: (propertyId: string) => [...queryKeys.regie.documents.all(), 'property', propertyId] as const,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMMON
  // ═══════════════════════════════════════════════════════════════════════════
  common: {
    user: () => ['user'] as const,
    organization: () => ['organization'] as const,
    notifications: () => ['notifications'] as const,
  },
} as const;
