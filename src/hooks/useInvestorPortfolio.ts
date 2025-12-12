import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================================
// Types
// ============================================================================

export interface ProjectInvestment {
  id: string;
  name: string;
  city: string;
  status: string;
  totalLots: number;
  soldLots: number;
  availableLots: number;
  reservedLots: number;
  totalBudget: number;
  totalSalesValue: number;
  collectedAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  constructionProgress: number;
  projectedROI: number;
  currentROI: number;
  startDate: string | null;
  expectedEndDate: string | null;
  createdAt: string;
}

export interface LotInvestment {
  id: string;
  lotNumber: string;
  projectId: string;
  projectName: string;
  floor: string | null;
  surface: number | null;
  rooms: number | null;
  purchasePrice: number;
  currentValue: number;
  appreciation: number;
  appreciationPercent: number;
  status: string;
  buyerName: string | null;
  contractDate: string | null;
  totalInvoiced: number;
  totalPaid: number;
  remainingDue: number;
  nextPaymentDate: string | null;
  nextPaymentAmount: number;
}

export interface CashFlowEntry {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  projectId: string;
  projectName: string;
  status: 'completed' | 'pending' | 'overdue';
}

export interface PortfolioSummary {
  // Global metrics
  totalProjects: number;
  totalLots: number;
  totalLotsOwned: number;
  // Values
  totalInvestment: number;
  totalCurrentValue: number;
  totalAppreciation: number;
  appreciationPercent: number;
  // Cash flow
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  collectionRate: number;
  // ROI
  projectedROI: number;
  currentROI: number;
  avgProjectROI: number;
  // By status
  projectsByStatus: Record<string, number>;
  lotsByStatus: Record<string, number>;
  // Monthly metrics
  thisMonthCollected: number;
  thisMonthExpected: number;
  nextMonthExpected: number;
  // Performance
  bestPerformingProject: { name: string; roi: number } | null;
  worstPerformingProject: { name: string; roi: number } | null;
}

export interface MonthlyPerformance {
  month: string;
  collected: number;
  expected: number;
  cumulative: number;
}

// ============================================================================
// Configuration
// ============================================================================

export const PROJECT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PLANNING: { label: 'Planification', color: 'text-blue-600 bg-blue-100' },
  CONSTRUCTION: { label: 'En construction', color: 'text-amber-600 bg-amber-100' },
  COMMERCIALIZATION: { label: 'Commercialisation', color: 'text-purple-600 bg-purple-100' },
  DELIVERY: { label: 'Livraison', color: 'text-green-600 bg-green-100' },
  COMPLETED: { label: 'Termine', color: 'text-neutral-600 bg-neutral-100' },
};

export const LOT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  AVAILABLE: { label: 'Disponible', color: 'text-green-600 bg-green-100' },
  RESERVED: { label: 'Reserve', color: 'text-amber-600 bg-amber-100' },
  SOLD: { label: 'Vendu', color: 'text-blue-600 bg-blue-100' },
  DELIVERED: { label: 'Livre', color: 'text-purple-600 bg-purple-100' },
};

// ============================================================================
// Hook: useInvestorPortfolio
// ============================================================================

export function useInvestorPortfolio(organizationId: string) {
  const [projects, setProjects] = useState<ProjectInvestment[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPortfolio = useCallback(async () => {
    if (!organizationId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all projects for the organization
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          city,
          status,
          total_lots,
          start_date,
          expected_end_date,
          created_at
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // For each project, fetch lots and financial data
      const projectInvestments: ProjectInvestment[] = await Promise.all(
        (projectsData || []).map(async (project: any) => {
          // Fetch lots
          const { data: lotsData } = await supabase
            .from('lots')
            .select('id, status, price_chf')
            .eq('project_id', project.id);

          const lots = lotsData || [];
          const soldLots = lots.filter((l: any) => l.status === 'SOLD' || l.status === 'DELIVERED');
          const reservedLots = lots.filter((l: any) => l.status === 'RESERVED');
          const availableLots = lots.filter((l: any) => l.status === 'AVAILABLE');

          const totalSalesValue = lots.reduce((sum: number, l: any) => sum + (l.price_chf || 0), 0);
          const soldValue = soldLots.reduce((sum: number, l: any) => sum + (l.price_chf || 0), 0);

          // Fetch CFC budget
          const { data: budgetData } = await supabase
            .from('cfc_budgets')
            .select('id')
            .eq('project_id', project.id)
            .maybeSingle();

          let totalBudget = 0;
          if (budgetData) {
            const { data: linesData } = await supabase
              .from('cfc_lines')
              .select('amount_budgeted')
              .eq('budget_id', budgetData.id);

            totalBudget = (linesData || []).reduce(
              (sum: number, l: any) => sum + (parseFloat(l.amount_budgeted) || 0),
              0
            );
          }

          // Fetch invoices
          const { data: invoicesData } = await supabase
            .from('buyer_invoices')
            .select('amount, amount_paid, status, due_date')
            .eq('project_id', project.id);

          const invoices = invoicesData || [];
          const collectedAmount = invoices.reduce((sum: number, inv: any) => sum + (inv.amount_paid || 0), 0);
          const totalInvoiced = invoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
          const pendingAmount = totalInvoiced - collectedAmount;
          const now = new Date();
          const overdueAmount = invoices
            .filter((inv: any) => inv.due_date && new Date(inv.due_date) < now && inv.amount > (inv.amount_paid || 0))
            .reduce((sum: number, inv: any) => sum + (inv.amount - (inv.amount_paid || 0)), 0);

          // Calculate ROI
          const projectedROI = totalBudget > 0 ? ((totalSalesValue - totalBudget) / totalBudget) * 100 : 0;
          const currentROI = totalBudget > 0 ? ((collectedAmount - totalBudget * 0.5) / (totalBudget * 0.5)) * 100 : 0;

          // Estimate construction progress based on status
          let constructionProgress = 0;
          switch (project.status) {
            case 'PLANNING':
              constructionProgress = 5;
              break;
            case 'CONSTRUCTION':
              constructionProgress = 50;
              break;
            case 'COMMERCIALIZATION':
              constructionProgress = 80;
              break;
            case 'DELIVERY':
              constructionProgress = 95;
              break;
            case 'COMPLETED':
              constructionProgress = 100;
              break;
          }

          return {
            id: project.id,
            name: project.name,
            city: project.city || '',
            status: project.status || 'PLANNING',
            totalLots: lots.length,
            soldLots: soldLots.length,
            availableLots: availableLots.length,
            reservedLots: reservedLots.length,
            totalBudget,
            totalSalesValue,
            collectedAmount,
            pendingAmount,
            overdueAmount,
            constructionProgress,
            projectedROI,
            currentROI,
            startDate: project.start_date,
            expectedEndDate: project.expected_end_date,
            createdAt: project.created_at,
          };
        })
      );

      setProjects(projectInvestments);

      // Calculate portfolio summary
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);

      const totalInvestment = projectInvestments.reduce((sum, p) => sum + p.totalBudget, 0);
      const totalCurrentValue = projectInvestments.reduce((sum, p) => sum + p.totalSalesValue, 0);
      const totalCollected = projectInvestments.reduce((sum, p) => sum + p.collectedAmount, 0);
      const totalPending = projectInvestments.reduce((sum, p) => sum + p.pendingAmount, 0);
      const totalOverdue = projectInvestments.reduce((sum, p) => sum + p.overdueAmount, 0);

      const projectsByStatus: Record<string, number> = {};
      const lotsByStatus: Record<string, number> = {};

      projectInvestments.forEach((p) => {
        projectsByStatus[p.status] = (projectsByStatus[p.status] || 0) + 1;
      });

      // Get all lots status count
      const { data: allLotsData } = await supabase
        .from('lots')
        .select('status, project_id')
        .in(
          'project_id',
          projectInvestments.map((p) => p.id)
        );

      (allLotsData || []).forEach((l: any) => {
        lotsByStatus[l.status] = (lotsByStatus[l.status] || 0) + 1;
      });

      // Find best and worst performing projects
      const sortedByROI = [...projectInvestments].sort((a, b) => b.projectedROI - a.projectedROI);
      const bestProject = sortedByROI[0];
      const worstProject = sortedByROI[sortedByROI.length - 1];

      const portfolioSummary: PortfolioSummary = {
        totalProjects: projectInvestments.length,
        totalLots: projectInvestments.reduce((sum, p) => sum + p.totalLots, 0),
        totalLotsOwned: projectInvestments.reduce((sum, p) => sum + p.soldLots, 0),
        totalInvestment,
        totalCurrentValue,
        totalAppreciation: totalCurrentValue - totalInvestment,
        appreciationPercent: totalInvestment > 0 ? ((totalCurrentValue - totalInvestment) / totalInvestment) * 100 : 0,
        totalCollected,
        totalPending,
        totalOverdue,
        collectionRate: totalCollected + totalPending > 0 ? (totalCollected / (totalCollected + totalPending)) * 100 : 0,
        projectedROI:
          projectInvestments.length > 0
            ? projectInvestments.reduce((sum, p) => sum + p.projectedROI, 0) / projectInvestments.length
            : 0,
        currentROI:
          projectInvestments.length > 0
            ? projectInvestments.reduce((sum, p) => sum + p.currentROI, 0) / projectInvestments.length
            : 0,
        avgProjectROI:
          projectInvestments.length > 0
            ? projectInvestments.reduce((sum, p) => sum + p.projectedROI, 0) / projectInvestments.length
            : 0,
        projectsByStatus,
        lotsByStatus,
        thisMonthCollected: 0, // Would need payment dates to calculate
        thisMonthExpected: 0,
        nextMonthExpected: 0,
        bestPerformingProject: bestProject ? { name: bestProject.name, roi: bestProject.projectedROI } : null,
        worstPerformingProject: worstProject ? { name: worstProject.name, roi: worstProject.projectedROI } : null,
      };

      setSummary(portfolioSummary);
    } catch (err) {
      console.error('Error loading portfolio:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du portfolio');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  // Filter helpers
  const getProjectsByStatus = useCallback(
    (status: string) => projects.filter((p) => p.status === status),
    [projects]
  );

  const getHighROIProjects = useCallback(
    (minROI: number = 10) => projects.filter((p) => p.projectedROI >= minROI),
    [projects]
  );

  const getProjectsWithOverdue = useCallback(
    () => projects.filter((p) => p.overdueAmount > 0),
    [projects]
  );

  return {
    projects,
    summary,
    loading,
    error,
    refresh: loadPortfolio,
    getProjectsByStatus,
    getHighROIProjects,
    getProjectsWithOverdue,
  };
}

// ============================================================================
// Hook: useProjectInvestmentDetail
// ============================================================================

export function useProjectInvestmentDetail(projectId: string | undefined) {
  const [lots, setLots] = useState<LotInvestment[]>([]);
  const [cashFlow, setCashFlow] = useState<CashFlowEntry[]>([]);
  const [monthlyPerformance, setMonthlyPerformance] = useState<MonthlyPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch project
      const { data: projectData } = await supabase
        .from('projects')
        .select('id, name')
        .eq('id', projectId)
        .single();

      // Fetch lots with buyer info
      const { data: lotsData, error: lotsError } = await supabase
        .from('lots')
        .select(`
          id,
          lot_number,
          floor,
          surface_m2,
          rooms,
          price_chf,
          status
        `)
        .eq('project_id', projectId)
        .order('lot_number');

      if (lotsError) throw lotsError;

      // Fetch buyers with their lots
      const { data: buyersData } = await supabase
        .from('buyers')
        .select(`
          id,
          first_name,
          last_name,
          lot_id
        `)
        .eq('project_id', projectId);

      const buyersByLot: Record<string, any> = {};
      (buyersData || []).forEach((b: any) => {
        if (b.lot_id) {
          buyersByLot[b.lot_id] = b;
        }
      });

      // Fetch invoices for cash flow
      const { data: invoicesData } = await supabase
        .from('buyer_invoices')
        .select(`
          id,
          amount,
          amount_paid,
          status,
          due_date,
          issue_date,
          buyer_id,
          buyer:buyer_id(first_name, last_name, lot_id)
        `)
        .eq('project_id', projectId)
        .order('due_date');

      // Calculate installments per lot
      const invoicesByBuyer: Record<string, any[]> = {};
      (invoicesData || []).forEach((inv: any) => {
        if (inv.buyer_id) {
          if (!invoicesByBuyer[inv.buyer_id]) {
            invoicesByBuyer[inv.buyer_id] = [];
          }
          invoicesByBuyer[inv.buyer_id].push(inv);
        }
      });

      // Map lots with investment info
      const lotInvestments: LotInvestment[] = (lotsData || []).map((lot: any) => {
        const buyer = buyersByLot[lot.id];
        const buyerInvoices = buyer ? invoicesByBuyer[buyer.id] || [] : [];

        const totalInvoiced = buyerInvoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
        const totalPaid = buyerInvoices.reduce((sum: number, inv: any) => sum + (inv.amount_paid || 0), 0);

        const pendingInvoices = buyerInvoices.filter(
          (inv: any) => inv.amount > (inv.amount_paid || 0) && inv.due_date
        );
        const nextPayment = pendingInvoices.sort(
          (a: any, b: any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        )[0];

        // Simple appreciation estimation (5% per year for sold lots)
        const appreciation = lot.status === 'SOLD' || lot.status === 'DELIVERED' ? lot.price_chf * 0.05 : 0;

        return {
          id: lot.id,
          lotNumber: lot.lot_number,
          projectId,
          projectName: projectData?.name || '',
          floor: lot.floor,
          surface: lot.surface_m2,
          rooms: lot.rooms,
          purchasePrice: lot.price_chf || 0,
          currentValue: (lot.price_chf || 0) + appreciation,
          appreciation,
          appreciationPercent: lot.price_chf > 0 ? (appreciation / lot.price_chf) * 100 : 0,
          status: lot.status || 'AVAILABLE',
          buyerName: buyer ? `${buyer.first_name} ${buyer.last_name}` : null,
          contractDate: null, // Would need sales_contracts data
          totalInvoiced,
          totalPaid,
          remainingDue: totalInvoiced - totalPaid,
          nextPaymentDate: nextPayment?.due_date || null,
          nextPaymentAmount: nextPayment ? nextPayment.amount - (nextPayment.amount_paid || 0) : 0,
        };
      });

      setLots(lotInvestments);

      // Build cash flow entries
      const cashFlowEntries: CashFlowEntry[] = (invoicesData || []).map((inv: any) => {
        const now = new Date();
        const dueDate = inv.due_date ? new Date(inv.due_date) : null;
        const isPaid = inv.amount_paid >= inv.amount;
        const isOverdue = dueDate && dueDate < now && !isPaid;

        return {
          id: inv.id,
          date: inv.due_date || inv.issue_date,
          type: 'income' as const,
          category: 'Versement acheteur',
          description: `Facture ${inv.buyer?.first_name || ''} ${inv.buyer?.last_name || ''}`,
          amount: inv.amount || 0,
          projectId,
          projectName: projectData?.name || '',
          status: isPaid ? 'completed' : isOverdue ? 'overdue' : 'pending',
        };
      });

      setCashFlow(cashFlowEntries);

      // Calculate monthly performance (last 12 months)
      const performance: MonthlyPerformance[] = [];
      const now = new Date();
      let cumulative = 0;

      for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const monthKey = monthDate.toISOString().substring(0, 7);

        const monthInvoices = (invoicesData || []).filter((inv: any) => {
          const invDate = inv.due_date ? new Date(inv.due_date) : null;
          return invDate && invDate >= monthDate && invDate <= monthEnd;
        });

        const collected = monthInvoices.reduce((sum: number, inv: any) => sum + (inv.amount_paid || 0), 0);
        const expected = monthInvoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
        cumulative += collected;

        performance.push({
          month: monthKey,
          collected,
          expected,
          cumulative,
        });
      }

      setMonthlyPerformance(performance);
    } catch (err) {
      console.error('Error loading project investment detail:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  // Computed values
  const totalLotValue = lots.reduce((sum, l) => sum + l.purchasePrice, 0);
  const totalCurrentValue = lots.reduce((sum, l) => sum + l.currentValue, 0);
  const totalAppreciation = totalCurrentValue - totalLotValue;
  const soldLots = lots.filter((l) => l.status === 'SOLD' || l.status === 'DELIVERED');
  const totalCollected = lots.reduce((sum, l) => sum + l.totalPaid, 0);
  const totalPending = lots.reduce((sum, l) => sum + l.remainingDue, 0);

  return {
    lots,
    cashFlow,
    monthlyPerformance,
    loading,
    error,
    refresh: loadDetail,
    // Computed
    totalLotValue,
    totalCurrentValue,
    totalAppreciation,
    soldLots: soldLots.length,
    totalCollected,
    totalPending,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format currency in CHF
 */
export function formatCHF(amount: number): string {
  return `CHF ${amount.toLocaleString('fr-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

/**
 * Get ROI color class based on value
 */
export function getROIColorClass(roi: number): string {
  if (roi >= 15) return 'text-green-600';
  if (roi >= 10) return 'text-emerald-600';
  if (roi >= 5) return 'text-amber-600';
  if (roi >= 0) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Calculate IRR (simplified approximation)
 */
export function calculateSimpleIRR(
  initialInvestment: number,
  finalValue: number,
  years: number
): number {
  if (initialInvestment <= 0 || years <= 0) return 0;
  return (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100;
}

/**
 * Get investment health status
 */
export function getInvestmentHealth(project: ProjectInvestment): {
  status: 'excellent' | 'good' | 'fair' | 'poor';
  label: string;
  color: string;
} {
  const score =
    (project.projectedROI > 15 ? 25 : project.projectedROI > 10 ? 20 : project.projectedROI > 5 ? 15 : 10) +
    (project.overdueAmount === 0 ? 25 : project.overdueAmount < project.collectedAmount * 0.1 ? 15 : 5) +
    (project.soldLots / project.totalLots > 0.7 ? 25 : project.soldLots / project.totalLots > 0.4 ? 20 : 10) +
    (project.constructionProgress > 50 ? 25 : project.constructionProgress > 25 ? 20 : 15);

  if (score >= 85) return { status: 'excellent', label: 'Excellent', color: 'text-green-600 bg-green-100' };
  if (score >= 70) return { status: 'good', label: 'Bon', color: 'text-emerald-600 bg-emerald-100' };
  if (score >= 50) return { status: 'fair', label: 'Correct', color: 'text-amber-600 bg-amber-100' };
  return { status: 'poor', label: 'A surveiller', color: 'text-red-600 bg-red-100' };
}
