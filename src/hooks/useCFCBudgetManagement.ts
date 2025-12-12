import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================================
// Types
// ============================================================================

export type CFCStatus = 'on_track' | 'warning' | 'over_budget' | 'completed';
export type BudgetAlertLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface CFCLine {
  id: string;
  projectId: string;
  code: string;
  label: string;
  description: string | null;
  parentId: string | null;
  level: number;
  // Budget amounts
  budgetInitial: number;
  budgetCurrent: number;
  budgetRevisions: number;
  // Execution amounts
  engaged: number;
  invoiced: number;
  paid: number;
  // Calculated
  remaining: number;
  variance: number;
  variancePercent: number;
  // Status
  status: CFCStatus;
  alertLevel: BudgetAlertLevel;
  // Metadata
  order: number;
  createdAt: string;
  updatedAt: string;
  // Children for hierarchy
  children?: CFCLine[];
}

export interface CFCContract {
  id: string;
  cfcLineId: string;
  companyId: string;
  companyName: string;
  contractNumber: string;
  description: string;
  amount: number;
  amountWithAdditions: number;
  status: 'draft' | 'signed' | 'in_progress' | 'completed' | 'cancelled';
  signedDate: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface CFCInvoice {
  id: string;
  cfcLineId: string;
  contractId: string | null;
  invoiceNumber: string;
  companyName: string;
  description: string;
  amountHT: number;
  amountTVA: number;
  amountTTC: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  invoiceDate: string;
  dueDate: string;
  paidDate: string | null;
}

export interface BudgetRevision {
  id: string;
  cfcLineId: string;
  previousAmount: number;
  newAmount: number;
  difference: number;
  reason: string;
  createdAt: string;
  createdBy: string;
}

export interface CFCBudgetSummary {
  totalBudgetInitial: number;
  totalBudgetCurrent: number;
  totalRevisions: number;
  totalEngaged: number;
  totalInvoiced: number;
  totalPaid: number;
  totalRemaining: number;
  totalVariance: number;
  engagedPercent: number;
  invoicedPercent: number;
  paidPercent: number;
  linesCount: number;
  linesOnTrack: number;
  linesWarning: number;
  linesOverBudget: number;
  topOverBudgetLines: CFCLine[];
  recentRevisions: BudgetRevision[];
  monthlySpending: { month: string; engaged: number; paid: number }[];
}

export interface CFCLineDetail extends CFCLine {
  contracts: CFCContract[];
  invoices: CFCInvoice[];
  revisions: BudgetRevision[];
  monthlyProgress: { month: string; engaged: number; invoiced: number; paid: number }[];
}

// ============================================================================
// Swiss CFC Standard Codes
// ============================================================================

export const SWISS_CFC_CODES = [
  { code: '1', label: 'Travaux preparatoires', level: 0 },
  { code: '11', label: 'Demolition', level: 1 },
  { code: '12', label: 'Terrassement', level: 1 },
  { code: '13', label: 'Fondations speciales', level: 1 },
  { code: '2', label: 'Gros oeuvre', level: 0 },
  { code: '21', label: 'Gros oeuvre 1 (fondations)', level: 1 },
  { code: '22', label: 'Gros oeuvre 2 (structure)', level: 1 },
  { code: '23', label: 'Toiture', level: 1 },
  { code: '24', label: 'Etancheite, isolation', level: 1 },
  { code: '25', label: 'Facade', level: 1 },
  { code: '26', label: 'Parois, cloisons', level: 1 },
  { code: '27', label: 'Faux-plafonds', level: 1 },
  { code: '28', label: 'Revetements de sols', level: 1 },
  { code: '29', label: 'Autres gros oeuvre', level: 1 },
  { code: '3', label: 'Equipements', level: 0 },
  { code: '31', label: 'Electricite', level: 1 },
  { code: '32', label: 'Chauffage', level: 1 },
  { code: '33', label: 'Ventilation, climatisation', level: 1 },
  { code: '34', label: 'Sanitaire', level: 1 },
  { code: '35', label: 'Ascenseur', level: 1 },
  { code: '36', label: 'Automatismes', level: 1 },
  { code: '4', label: 'Amenagements interieurs', level: 0 },
  { code: '41', label: 'Menuiserie interieure', level: 1 },
  { code: '42', label: 'Serrurerie', level: 1 },
  { code: '43', label: 'Carrelage, faience', level: 1 },
  { code: '44', label: 'Peinture', level: 1 },
  { code: '45', label: 'Cuisine', level: 1 },
  { code: '46', label: 'Sanitaire apparents', level: 1 },
  { code: '5', label: 'Amenagements exterieurs', level: 0 },
  { code: '51', label: 'Amenagements exterieurs', level: 1 },
  { code: '52', label: 'Clotures', level: 1 },
  { code: '53', label: 'Plantations', level: 1 },
  { code: '6', label: 'Frais secondaires', level: 0 },
  { code: '61', label: 'Raccordements', level: 1 },
  { code: '62', label: 'Taxes et emoluments', level: 1 },
  { code: '63', label: 'Assurances', level: 1 },
  { code: '7', label: 'Honoraires', level: 0 },
  { code: '71', label: 'Architecte', level: 1 },
  { code: '72', label: 'Ingenieurs', level: 1 },
  { code: '73', label: 'Autres honoraires', level: 1 },
  { code: '9', label: 'Reserve et imprevus', level: 0 },
  { code: '91', label: 'Reserve', level: 1 },
  { code: '92', label: 'Imprevus', level: 1 },
];

// ============================================================================
// Configuration
// ============================================================================

export const CFC_STATUS_CONFIG: Record<CFCStatus, {
  label: string;
  color: string;
  icon: string;
}> = {
  on_track: {
    label: 'Dans le budget',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    icon: 'CheckCircle2',
  },
  warning: {
    label: 'Attention',
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    icon: 'AlertTriangle',
  },
  over_budget: {
    label: 'Depassement',
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    icon: 'AlertCircle',
  },
  completed: {
    label: 'Termine',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    icon: 'CheckCircle',
  },
};

export const ALERT_THRESHOLDS = {
  none: 0,
  low: 80,      // 80% du budget engage
  medium: 90,   // 90% du budget engage
  high: 100,    // 100% du budget engage
  critical: 110, // 110% du budget (depassement)
};

// ============================================================================
// Hook: useCFCBudgetManagement
// ============================================================================

export function useCFCBudgetManagement(projectId: string) {
  const [lines, setLines] = useState<CFCLine[]>([]);
  const [summary, setSummary] = useState<CFCBudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBudget = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch CFC lines
      const { data: linesData, error: linesError } = await supabase
        .from('cfc_lines')
        .select('*')
        .eq('project_id', projectId)
        .order('code');

      if (linesError) throw linesError;

      const mappedLines: CFCLine[] = (linesData || []).map((line: any) => {
        const budgetInitial = parseFloat(line.amount_budgeted) || 0;
        const budgetCurrent = parseFloat(line.amount_budgeted) || 0; // Would need revision column
        const engaged = parseFloat(line.amount_committed) || 0;
        const invoiced = parseFloat(line.amount_committed) || 0; // Simplified
        const paid = parseFloat(line.amount_spent) || 0;
        const remaining = budgetCurrent - engaged;
        const variance = budgetCurrent - engaged;
        const variancePercent = budgetCurrent > 0 ? (variance / budgetCurrent) * 100 : 0;

        // Calculate status
        let status: CFCStatus = 'on_track';
        let alertLevel: BudgetAlertLevel = 'none';
        const engagedPercent = budgetCurrent > 0 ? (engaged / budgetCurrent) * 100 : 0;

        if (engagedPercent >= ALERT_THRESHOLDS.critical) {
          status = 'over_budget';
          alertLevel = 'critical';
        } else if (engagedPercent >= ALERT_THRESHOLDS.high) {
          status = 'warning';
          alertLevel = 'high';
        } else if (engagedPercent >= ALERT_THRESHOLDS.medium) {
          status = 'warning';
          alertLevel = 'medium';
        } else if (engagedPercent >= ALERT_THRESHOLDS.low) {
          alertLevel = 'low';
        }

        if (paid >= budgetCurrent && engaged >= budgetCurrent) {
          status = 'completed';
        }

        return {
          id: line.id,
          projectId: line.project_id,
          code: line.code,
          label: line.label,
          description: line.description || null,
          parentId: line.parent_id || null,
          level: line.code.length <= 1 ? 0 : 1,
          budgetInitial,
          budgetCurrent,
          budgetRevisions: 0,
          engaged,
          invoiced,
          paid,
          remaining,
          variance,
          variancePercent,
          status,
          alertLevel,
          order: parseInt(line.code) || 0,
          createdAt: line.created_at,
          updatedAt: line.updated_at || line.created_at,
        };
      });

      // Build hierarchy
      const rootLines = mappedLines.filter((l) => l.level === 0);
      rootLines.forEach((parent) => {
        parent.children = mappedLines.filter((l) =>
          l.code.startsWith(parent.code) && l.code !== parent.code
        );
      });

      setLines(mappedLines);

      // Calculate summary
      const calculatedSummary = calculateSummary(mappedLines);
      setSummary(calculatedSummary);

    } catch (err) {
      console.error('Error loading CFC budget:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadBudget();
  }, [loadBudget]);

  function calculateSummary(linesList: CFCLine[]): CFCBudgetSummary {
    const totalBudgetInitial = linesList.reduce((sum, l) => sum + l.budgetInitial, 0);
    const totalBudgetCurrent = linesList.reduce((sum, l) => sum + l.budgetCurrent, 0);
    const totalEngaged = linesList.reduce((sum, l) => sum + l.engaged, 0);
    const totalInvoiced = linesList.reduce((sum, l) => sum + l.invoiced, 0);
    const totalPaid = linesList.reduce((sum, l) => sum + l.paid, 0);
    const totalRemaining = totalBudgetCurrent - totalEngaged;
    const totalVariance = totalBudgetCurrent - totalEngaged;

    const linesOnTrack = linesList.filter((l) => l.status === 'on_track').length;
    const linesWarning = linesList.filter((l) => l.status === 'warning').length;
    const linesOverBudget = linesList.filter((l) => l.status === 'over_budget').length;

    const topOverBudgetLines = linesList
      .filter((l) => l.variance < 0)
      .sort((a, b) => a.variance - b.variance)
      .slice(0, 5);

    // Monthly spending (would need historical data)
    const now = new Date();
    const monthlySpending: CFCBudgetSummary['monthlySpending'] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = monthDate.toLocaleDateString('fr-CH', { month: 'short', year: 'numeric' });
      monthlySpending.push({
        month: monthLabel,
        engaged: 0, // Would need monthly data
        paid: 0,
      });
    }

    return {
      totalBudgetInitial,
      totalBudgetCurrent,
      totalRevisions: totalBudgetCurrent - totalBudgetInitial,
      totalEngaged,
      totalInvoiced,
      totalPaid,
      totalRemaining,
      totalVariance,
      engagedPercent: totalBudgetCurrent > 0 ? (totalEngaged / totalBudgetCurrent) * 100 : 0,
      invoicedPercent: totalBudgetCurrent > 0 ? (totalInvoiced / totalBudgetCurrent) * 100 : 0,
      paidPercent: totalBudgetCurrent > 0 ? (totalPaid / totalBudgetCurrent) * 100 : 0,
      linesCount: linesList.length,
      linesOnTrack,
      linesWarning,
      linesOverBudget,
      topOverBudgetLines,
      recentRevisions: [],
      monthlySpending,
    };
  }

  // ============================================================================
  // Actions
  // ============================================================================

  const createCFCLine = useCallback(
    async (data: {
      code: string;
      label: string;
      description?: string;
      budgetAmount: number;
      parentId?: string;
    }): Promise<CFCLine> => {
      try {
        const { data: newLine, error: insertError } = await supabase
          .from('cfc_lines')
          .insert({
            project_id: projectId,
            code: data.code,
            label: data.label,
            description: data.description || null,
            amount_budgeted: data.budgetAmount,
            amount_committed: 0,
            amount_spent: 0,
            parent_id: data.parentId || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        await loadBudget();
        return newLine;
      } catch (err) {
        console.error('Error creating CFC line:', err);
        throw err;
      }
    },
    [projectId, loadBudget]
  );

  const updateCFCLine = useCallback(
    async (lineId: string, updates: {
      label?: string;
      description?: string;
      budgetAmount?: number;
    }): Promise<void> => {
      try {
        const updateData: any = {
          updated_at: new Date().toISOString(),
        };

        if (updates.label) updateData.label = updates.label;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.budgetAmount !== undefined) updateData.amount_budgeted = updates.budgetAmount;

        const { error: updateError } = await supabase
          .from('cfc_lines')
          .update(updateData)
          .eq('id', lineId);

        if (updateError) throw updateError;

        await loadBudget();
      } catch (err) {
        console.error('Error updating CFC line:', err);
        throw err;
      }
    },
    [loadBudget]
  );

  const deleteCFCLine = useCallback(
    async (lineId: string): Promise<void> => {
      try {
        const { error: deleteError } = await supabase
          .from('cfc_lines')
          .delete()
          .eq('id', lineId);

        if (deleteError) throw deleteError;

        await loadBudget();
      } catch (err) {
        console.error('Error deleting CFC line:', err);
        throw err;
      }
    },
    [loadBudget]
  );

  const reviseBudget = useCallback(
    async (lineId: string, newAmount: number, reason: string): Promise<void> => {
      try {
        const line = lines.find((l) => l.id === lineId);
        if (!line) throw new Error('Ligne CFC non trouvee');

        // Update the line
        const { error: updateError } = await supabase
          .from('cfc_lines')
          .update({
            amount_budgeted: newAmount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', lineId);

        if (updateError) throw updateError;

        // Note: Would need a budget_revisions table to store history

        await loadBudget();
      } catch (err) {
        console.error('Error revising budget:', err);
        throw err;
      }
    },
    [lines, loadBudget]
  );

  // ============================================================================
  // Filter Helpers
  // ============================================================================

  const getByStatus = useCallback(
    (status: CFCStatus) => lines.filter((l) => l.status === status),
    [lines]
  );

  const getOverBudget = useCallback(
    () => lines.filter((l) => l.variance < 0),
    [lines]
  );

  const getByLevel = useCallback(
    (level: number) => lines.filter((l) => l.level === level),
    [lines]
  );

  const getByCode = useCallback(
    (codePrefix: string) => lines.filter((l) => l.code.startsWith(codePrefix)),
    [lines]
  );

  // Hierarchical data for tree view
  const hierarchicalLines = useMemo(() => {
    const rootLines = lines.filter((l) => l.level === 0);
    return rootLines.map((parent) => ({
      ...parent,
      children: lines.filter((l) =>
        l.code.startsWith(parent.code) && l.code !== parent.code && l.level === 1
      ),
    }));
  }, [lines]);

  return {
    lines,
    hierarchicalLines,
    summary,
    loading,
    error,
    refresh: loadBudget,
    // Actions
    createCFCLine,
    updateCFCLine,
    deleteCFCLine,
    reviseBudget,
    // Filters
    getByStatus,
    getOverBudget,
    getByLevel,
    getByCode,
  };
}

// ============================================================================
// Hook: useCFCLineDetail
// ============================================================================

export function useCFCLineDetail(lineId: string | undefined) {
  const [lineDetail, setLineDetail] = useState<CFCLineDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!lineId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch line
      const { data: lineData, error: lineError } = await supabase
        .from('cfc_lines')
        .select('*')
        .eq('id', lineId)
        .single();

      if (lineError) throw lineError;

      // Map to CFCLine
      const budgetInitial = parseFloat(lineData.amount_budgeted) || 0;
      const budgetCurrent = parseFloat(lineData.amount_budgeted) || 0;
      const engaged = parseFloat(lineData.amount_committed) || 0;
      const invoiced = parseFloat(lineData.amount_committed) || 0;
      const paid = parseFloat(lineData.amount_spent) || 0;
      const remaining = budgetCurrent - engaged;
      const variance = budgetCurrent - engaged;
      const variancePercent = budgetCurrent > 0 ? (variance / budgetCurrent) * 100 : 0;

      let status: CFCStatus = 'on_track';
      let alertLevel: BudgetAlertLevel = 'none';
      const engagedPercent = budgetCurrent > 0 ? (engaged / budgetCurrent) * 100 : 0;

      if (engagedPercent >= ALERT_THRESHOLDS.critical) {
        status = 'over_budget';
        alertLevel = 'critical';
      } else if (engagedPercent >= ALERT_THRESHOLDS.high) {
        status = 'warning';
        alertLevel = 'high';
      }

      const detail: CFCLineDetail = {
        id: lineData.id,
        projectId: lineData.project_id,
        code: lineData.code,
        label: lineData.label,
        description: lineData.description || null,
        parentId: lineData.parent_id || null,
        level: lineData.code.length <= 1 ? 0 : 1,
        budgetInitial,
        budgetCurrent,
        budgetRevisions: 0,
        engaged,
        invoiced,
        paid,
        remaining,
        variance,
        variancePercent,
        status,
        alertLevel,
        order: parseInt(lineData.code) || 0,
        createdAt: lineData.created_at,
        updatedAt: lineData.updated_at || lineData.created_at,
        contracts: [], // Would fetch from contracts table
        invoices: [], // Would fetch from invoices table
        revisions: [], // Would fetch from revisions table
        monthlyProgress: [], // Would calculate from historical data
      };

      setLineDetail(detail);

    } catch (err) {
      console.error('Error loading CFC line detail:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [lineId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  return {
    lineDetail,
    loading,
    error,
    refresh: loadDetail,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

export function formatCHF(amount: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getVarianceColor(variance: number): string {
  if (variance > 0) return 'text-green-600';
  if (variance < 0) return 'text-red-600';
  return 'text-gray-600';
}

export function getProgressColor(percent: number): string {
  if (percent >= 100) return 'bg-red-500';
  if (percent >= 90) return 'bg-amber-500';
  if (percent >= 80) return 'bg-yellow-500';
  return 'bg-green-500';
}

export function getCFCGroupLabel(code: string): string {
  const firstDigit = code.charAt(0);
  const groups: Record<string, string> = {
    '1': 'Travaux preparatoires',
    '2': 'Gros oeuvre',
    '3': 'Equipements',
    '4': 'Amenagements interieurs',
    '5': 'Amenagements exterieurs',
    '6': 'Frais secondaires',
    '7': 'Honoraires',
    '9': 'Reserve et imprevus',
  };
  return groups[firstDigit] || 'Autre';
}

export function calculateBudgetHealth(summary: CFCBudgetSummary): {
  score: number;
  label: string;
  color: string;
} {
  // Score based on variance, over-budget lines, and engagement
  let score = 100;

  // Penalize for over-budget lines
  score -= summary.linesOverBudget * 5;

  // Penalize for warning lines
  score -= summary.linesWarning * 2;

  // Penalize for negative variance
  if (summary.totalVariance < 0) {
    const overagePercent = Math.abs(summary.totalVariance / summary.totalBudgetCurrent) * 100;
    score -= overagePercent;
  }

  score = Math.max(0, Math.min(100, score));

  if (score >= 80) {
    return { score, label: 'Excellent', color: 'text-green-600 bg-green-100' };
  }
  if (score >= 60) {
    return { score, label: 'Bon', color: 'text-blue-600 bg-blue-100' };
  }
  if (score >= 40) {
    return { score, label: 'Attention', color: 'text-amber-600 bg-amber-100' };
  }
  return { score, label: 'Critique', color: 'text-red-600 bg-red-100' };
}
