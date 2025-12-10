// Project Types - Shared type definitions for project module

/**
 * Project status enum
 */
export type ProjectStatus =
  | 'DRAFT'
  | 'PLANNING'
  | 'ACTIVE'
  | 'CONSTRUCTION'
  | 'COMPLETED'
  | 'ARCHIVED';

/**
 * Project type enum
 */
export type ProjectType =
  | 'PPE'
  | 'QPT'
  | 'RENTAL'
  | 'COMMERCIAL'
  | 'MIXED';

/**
 * Core project data structure
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  canton: string;
  postal_code: string;
  country: string;
  status: ProjectStatus;
  type: ProjectType;
  organization_id: string;
  created_at: string;
  updated_at: string;
  start_date?: string;
  end_date?: string;
  cover_image_url?: string;
  total_lots?: number;
  sold_lots?: number;
  reserved_lots?: number;
  total_budget?: number;
  spent_budget?: number;
}

/**
 * Project summary for lists and cards
 */
export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  address: string;
  city: string;
  canton: string;
  total_lots: number;
  sold_lots: number;
  progress: number;
  cover_image_url?: string;
}

/**
 * Building within a project
 */
export interface Building {
  id: string;
  project_id: string;
  name: string;
  code: string;
  description?: string;
  floors_count: number;
  created_at: string;
}

/**
 * Floor within a building
 */
export interface Floor {
  id: string;
  building_id: string;
  name: string;
  level: number;
  description?: string;
  lots_count: number;
}

/**
 * Project structure tree
 */
export interface ProjectStructure {
  project: Project;
  buildings: Array<Building & { floors: Array<Floor & { lots_count: number }> }>;
}

/**
 * Project team member
 */
export interface ProjectTeamMember {
  id: string;
  user_id: string;
  project_id: string;
  role: string;
  permissions: string[];
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
  created_at: string;
}

/**
 * Project KPIs data
 */
export interface ProjectKPIsData {
  totalLots: number;
  soldLots: number;
  reservedLots: number;
  availableLots: number;
  salesProgress: number;
  constructionProgress: number;
  budgetUsed: number;
  budgetTotal: number;
  documentsCount: number;
  tasksCount: number;
  pendingTasks: number;
}

/**
 * Project health metrics
 */
export interface ProjectHealthData {
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  metrics: {
    sales: { value: number; trend: number };
    budget: { value: number; trend: number };
    schedule: { value: number; trend: number };
    quality: { value: number; trend: number };
  };
  alerts: ProjectAlert[];
}

/**
 * Project alert/notification
 */
export interface ProjectAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  created_at: string;
  resolved: boolean;
}

/**
 * Project activity item
 */
export interface ProjectActivityItem {
  id: string;
  type: string;
  action: string;
  description: string;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  created_at: string;
  entity_type?: string;
  entity_id?: string;
}

/**
 * Project milestone
 */
export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  type: 'construction' | 'sales' | 'admin' | 'legal';
  progress?: number;
}

/**
 * Project phase for planning
 */
export interface ProjectPhase {
  id: string;
  project_id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  color?: string;
}

/**
 * Project finance summary
 */
export interface ProjectFinanceSummary {
  totalBudget: number;
  spentBudget: number;
  remainingBudget: number;
  revenue: number;
  pendingPayments: number;
  overduePayments: number;
  cfcBreakdown: Array<{
    code: string;
    label: string;
    budget: number;
    spent: number;
  }>;
}

/**
 * Project CRM summary
 */
export interface ProjectCRMSummary {
  totalProspects: number;
  activeProspects: number;
  convertedProspects: number;
  conversionRate: number;
  pipeline: Array<{
    stage: string;
    count: number;
  }>;
}

/**
 * Project creation form data
 */
export interface ProjectCreationData {
  name: string;
  description?: string;
  type: ProjectType;
  address: string;
  city: string;
  canton: string;
  postal_code: string;
  country: string;
  start_date?: string;
  end_date?: string;
  buildings: Array<{
    name: string;
    code: string;
    floors: Array<{
      name: string;
      level: number;
      lots: Array<{
        code: string;
        type: string;
        surface: number;
        price: number;
      }>;
    }>;
  }>;
}

/**
 * UseProjects hook return type
 */
export interface UseProjectsReturn {
  projects: ProjectSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * UseProjectDashboard hook return type
 */
export interface UseProjectDashboardReturn {
  project: Project | null;
  kpis: ProjectKPIsData | null;
  health: ProjectHealthData | null;
  activities: ProjectActivityItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
