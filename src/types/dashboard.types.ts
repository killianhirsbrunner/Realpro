// Dashboard Types - Shared type definitions for dashboard module

/**
 * KPI data structure for dashboard metrics
 */
export interface DashboardKpiData {
  projects: number;
  lotsSold: number;
  paid: number;
  delayedPayments: number;
  activeSoumissions: number;
  documentsRecent: number;
  unreadMessages: number;
}

/**
 * Sales chart data point
 */
export interface SalesChartDataPoint {
  month: string;
  sold: number;
}

/**
 * CFC budget chart data point
 */
export interface CfcChartDataPoint {
  cfc: string;
  budget: number;
  spent: number;
}

/**
 * Submission summary for dashboard
 */
export interface DashboardSubmission {
  id: string;
  label: string;
  deadline: string;
  status: string;
}

/**
 * Recent document for dashboard
 */
export interface DashboardDocument {
  id: string;
  name: string;
  created_at: string;
  type?: string;
  size?: number;
}

/**
 * Planning phase summary
 */
export interface DashboardPlanningPhase {
  id: string;
  phase: string;
  status: string;
  progress?: number;
}

/**
 * Activity feed item
 */
export interface ActivityFeedItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type?: 'create' | 'update' | 'delete' | 'comment' | 'upload';
  entityType?: string;
  entityId?: string;
}

/**
 * Timeline item for upcoming events
 */
export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  type: 'meeting' | 'deadline' | 'milestone' | 'task';
  status: 'today' | 'upcoming' | 'overdue';
  description?: string;
  project_name?: string;
  project_id?: string;
}

/**
 * Message preview for dashboard
 */
export interface MessagePreviewData {
  id: string;
  content: string;
  created_at: string;
  sender_name: string;
  sender_role?: string;
  thread_title?: string;
  unread: boolean;
}

/**
 * Complete dashboard data structure
 */
export interface DashboardData {
  kpis: DashboardKpiData;
  salesChart: SalesChartDataPoint[];
  cfcChart: CfcChartDataPoint[];
  soumissions: DashboardSubmission[];
  documentsRecent: DashboardDocument[];
  planning: DashboardPlanningPhase[];
  activityFeed: ActivityFeedItem[];
}

/**
 * Dashboard hook return type
 */
export interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Global statistics for organization dashboard
 */
export interface GlobalDashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalLots: number;
  soldLots: number;
  totalRevenue: number;
  pendingPayments: number;
  recentNotifications: number;
  unreadMessages: number;
  upcomingMeetings: number;
}

/**
 * KPI trend indicator
 */
export interface KpiTrend {
  value: number;
  isUp: boolean;
  period?: 'day' | 'week' | 'month' | 'quarter';
}

/**
 * Dashboard KPI item configuration
 */
export interface DashboardKpiItem {
  label: string;
  value: number | string;
  fullValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'brand' | 'primary' | 'green' | 'red' | 'blue' | 'neutral';
  trend?: KpiTrend;
  href?: string;
}
