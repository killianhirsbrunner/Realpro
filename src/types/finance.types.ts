// Finance Types - Shared type definitions for finance module

/**
 * Payment status enum
 */
export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED'
  | 'PARTIAL';

/**
 * Invoice status enum
 */
export type InvoiceStatus =
  | 'DRAFT'
  | 'SENT'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED'
  | 'PARTIAL';

/**
 * Contract status enum
 */
export type ContractStatus =
  | 'DRAFT'
  | 'PENDING_SIGNATURE'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'TERMINATED'
  | 'CANCELLED';

/**
 * CFC (Code des frais de construction) code
 */
export interface CFCCode {
  id: string;
  code: string;
  label: string;
  description?: string;
  parent_code?: string;
  budget: number;
  spent: number;
  engaged: number;
  remaining: number;
  progress: number;
}

/**
 * CFC Budget item
 */
export interface CFCBudgetItem {
  id: string;
  project_id: string;
  cfc_code: string;
  cfc_label: string;
  budget_amount: number;
  engaged_amount: number;
  invoiced_amount: number;
  paid_amount: number;
  variance: number;
  variance_percent: number;
}

/**
 * Payment plan item
 */
export interface PaymentPlanItem {
  id: string;
  lot_id: string;
  buyer_id: string;
  description: string;
  amount: number;
  due_date: string;
  status: PaymentStatus;
  paid_date?: string;
  payment_reference?: string;
}

/**
 * Invoice data
 */
export interface Invoice {
  id: string;
  project_id: string;
  number: string;
  title: string;
  description?: string;
  amount: number;
  vat_amount: number;
  total_amount: number;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  paid_date?: string;
  recipient_type: 'buyer' | 'supplier' | 'contractor';
  recipient_id: string;
  recipient_name: string;
  cfc_code?: string;
  qr_reference?: string;
  pdf_url?: string;
}

/**
 * Contract data
 */
export interface Contract {
  id: string;
  project_id: string;
  number: string;
  title: string;
  description?: string;
  type: 'sales' | 'construction' | 'service' | 'other';
  status: ContractStatus;
  contractor_id?: string;
  contractor_name: string;
  amount: number;
  start_date: string;
  end_date?: string;
  signed_date?: string;
  milestones: ContractMilestone[];
}

/**
 * Contract milestone
 */
export interface ContractMilestone {
  id: string;
  contract_id: string;
  title: string;
  description?: string;
  amount: number;
  due_date: string;
  completed_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

/**
 * Finance KPIs data
 */
export interface FinanceKPIsData {
  totalBudget: number;
  spentBudget: number;
  engagedBudget: number;
  remainingBudget: number;
  totalRevenue: number;
  collectedRevenue: number;
  pendingRevenue: number;
  overduePayments: number;
  budgetVariance: number;
  budgetVariancePercent: number;
}

/**
 * Finance dashboard data
 */
export interface FinanceDashboardData {
  kpis: FinanceKPIsData;
  cfcSummary: CFCBudgetItem[];
  recentInvoices: Invoice[];
  upcomingPayments: PaymentPlanItem[];
  contractsOverview: {
    total: number;
    active: number;
    pending: number;
    completed: number;
  };
}

/**
 * Budget variance alert
 */
export interface BudgetVarianceAlert {
  id: string;
  cfc_code: string;
  cfc_label: string;
  variance_amount: number;
  variance_percent: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  created_at: string;
}

/**
 * Payment schedule item for Gantt
 */
export interface PaymentScheduleItem {
  id: string;
  buyer_name: string;
  lot_code: string;
  payments: Array<{
    id: string;
    amount: number;
    due_date: string;
    status: PaymentStatus;
  }>;
}

/**
 * Buyer finance summary
 */
export interface BuyerFinanceSummary {
  buyer_id: string;
  buyer_name: string;
  lot_id: string;
  lot_code: string;
  total_price: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  next_payment_date?: string;
  next_payment_amount?: number;
  payment_progress: number;
}

/**
 * UseFinance hook return type
 */
export interface UseFinanceReturn {
  data: FinanceDashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * UseCFC hook return type
 */
export interface UseCFCReturn {
  cfcItems: CFCBudgetItem[];
  totals: {
    budget: number;
    engaged: number;
    invoiced: number;
    paid: number;
  };
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
