// Planning Types - Shared type definitions for planning/construction module

/**
 * Phase status enum
 */
export type PhaseStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DELAYED'
  | 'ON_HOLD';

/**
 * Task status enum
 */
export type TaskStatus =
  | 'TODO'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | 'COMPLETED'
  | 'CANCELLED';

/**
 * Task priority enum
 */
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

/**
 * Planning phase
 */
export interface PlanningPhase {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  actual_start_date?: string;
  actual_end_date?: string;
  status: PhaseStatus;
  progress: number;
  order: number;
  color?: string;
  parent_id?: string;
  dependencies: string[];
  tasks: PlanningTask[];
}

/**
 * Planning task
 */
export interface PlanningTask {
  id: string;
  phase_id: string;
  project_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  assigned_to?: string;
  assigned_to_name?: string;
  dependencies: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Milestone
 */
export interface Milestone {
  id: string;
  project_id: string;
  phase_id?: string;
  title: string;
  description?: string;
  date: string;
  type: 'construction' | 'sales' | 'admin' | 'legal' | 'delivery';
  status: 'pending' | 'achieved' | 'missed';
  is_critical: boolean;
  created_at: string;
}

/**
 * Gantt chart item (for rendering)
 */
export interface GanttItem {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  type: 'phase' | 'task' | 'milestone';
  color?: string;
  dependencies: string[];
  children?: GanttItem[];
}

/**
 * Site diary entry
 */
export interface SiteDiaryEntry {
  id: string;
  project_id: string;
  date: string;
  weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  temperature?: number;
  workers_count?: number;
  description: string;
  activities: string[];
  issues?: string;
  photos: string[];
  created_by: string;
  created_at: string;
}

/**
 * Construction photo
 */
export interface ConstructionPhoto {
  id: string;
  project_id: string;
  phase_id?: string;
  url: string;
  thumbnail_url?: string;
  caption?: string;
  location?: string;
  taken_at: string;
  uploaded_by: string;
  created_at: string;
}

/**
 * Planning alert
 */
export interface PlanningAlert {
  id: string;
  project_id: string;
  type: 'delay' | 'milestone' | 'resource' | 'budget';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  related_id?: string;
  is_resolved: boolean;
  created_at: string;
}

/**
 * Progress report
 */
export interface ProgressReport {
  project_id: string;
  report_date: string;
  overall_progress: number;
  phases_summary: Array<{
    id: string;
    name: string;
    planned_progress: number;
    actual_progress: number;
    variance: number;
  }>;
  milestones_achieved: number;
  milestones_total: number;
  delayed_tasks: number;
  upcoming_milestones: Milestone[];
}

/**
 * Buyer progress tracking
 */
export interface BuyerProgress {
  buyer_id: string;
  buyer_name: string;
  lot_id: string;
  lot_code: string;
  construction_progress: number;
  materials_progress: number;
  payments_progress: number;
  documents_progress: number;
  next_milestone?: string;
  estimated_delivery?: string;
}

/**
 * UsePlanning hook return type
 */
export interface UsePlanningReturn {
  phases: PlanningPhase[];
  milestones: Milestone[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updatePhase: (id: string, data: Partial<PlanningPhase>) => Promise<void>;
  addTask: (phaseId: string, task: Partial<PlanningTask>) => Promise<void>;
}

/**
 * UseSiteDiary hook return type
 */
export interface UseSiteDiaryReturn {
  entries: SiteDiaryEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (entry: Partial<SiteDiaryEntry>) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * UseConstructionPhotos hook return type
 */
export interface UseConstructionPhotosReturn {
  photos: ConstructionPhoto[];
  loading: boolean;
  error: string | null;
  uploadPhoto: (file: File, caption?: string) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}
