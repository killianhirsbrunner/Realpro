import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================================
// Types
// ============================================================================

export type CFCBudgetStatus = 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'CLOSED';

export interface CFCBudget {
  id: string;
  project_id: string;
  name: string;
  version: number;
  total_amount: number;
  status: CFCBudgetStatus;
  created_by_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CFCLine {
  id: string;
  budget_id: string;
  code: string;
  label: string;
  amount_budgeted: number;
  amount_committed: number;
  amount_invoiced: number;
  amount_paid: number;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  // Computed
  variance: number;
  variance_percent: number;
  remaining: number;
  children?: CFCLine[];
}

export interface CFCSummary {
  totalBudget: number;
  totalCommitted: number;
  totalInvoiced: number;
  totalPaid: number;
  totalVariance: number;
  totalRemaining: number;
  percentCommitted: number;
  percentInvoiced: number;
  percentPaid: number;
  linesCount: number;
  overBudgetCount: number;
}

export interface CFCLineWithContracts extends CFCLine {
  contracts: CFCContract[];
  invoices: CFCInvoice[];
}

export interface CFCContract {
  id: string;
  number: string;
  name: string;
  company_name: string;
  amount: number;
  status: string;
  signed_at: string | null;
}

export interface CFCInvoice {
  id: string;
  invoice_number: string;
  company_name: string;
  amount: number;
  status: string;
  issued_at: string;
  due_at: string | null;
  paid_at: string | null;
}

export interface CreateCFCLineData {
  code: string;
  label: string;
  amountBudgeted: number;
  parentId?: string;
}

export interface UpdateCFCLineData {
  label?: string;
  amountBudgeted?: number;
  amountCommitted?: number;
  amountInvoiced?: number;
  amountPaid?: number;
}

// ============================================================================
// Status Configuration
// ============================================================================

export const CFC_BUDGET_STATUS_CONFIG: Record<CFCBudgetStatus, { label: string; color: string }> = {
  DRAFT: {
    label: 'Brouillon',
    color: 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-800',
  },
  APPROVED: {
    label: 'Approuve',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
  },
  ACTIVE: {
    label: 'Actif',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  },
  CLOSED: {
    label: 'Cloture',
    color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
  },
};

// ============================================================================
// Standard Swiss CFC Codes
// ============================================================================

export const STANDARD_CFC_CODES = [
  { code: '1', label: 'Travaux preparatoires', children: [
    { code: '11', label: 'Demolition' },
    { code: '12', label: 'Terrassement' },
    { code: '13', label: 'Fouilles speciales' },
  ]},
  { code: '2', label: 'Batiment', children: [
    { code: '21', label: 'Gros oeuvre', children: [
      { code: '211', label: 'Maconnerie' },
      { code: '212', label: 'Beton arme' },
      { code: '213', label: 'Charpente' },
      { code: '214', label: 'Couverture' },
      { code: '215', label: 'Ferblanterie' },
      { code: '216', label: 'Etancheite' },
    ]},
    { code: '22', label: 'Installations techniques', children: [
      { code: '221', label: 'Sanitaire' },
      { code: '222', label: 'Chauffage' },
      { code: '223', label: 'Ventilation' },
      { code: '224', label: 'Electricite' },
      { code: '225', label: 'Ascenseur' },
    ]},
    { code: '23', label: 'Amenagement interieur', children: [
      { code: '231', label: 'Platrerie' },
      { code: '232', label: 'Carrelage' },
      { code: '233', label: 'Revetements sols' },
      { code: '234', label: 'Peinture' },
      { code: '235', label: 'Menuiserie' },
      { code: '236', label: 'Serrurerie' },
    ]},
    { code: '24', label: 'Facades', children: [
      { code: '241', label: 'Isolation' },
      { code: '242', label: 'Crepis' },
      { code: '243', label: 'Fenêtres' },
    ]},
  ]},
  { code: '3', label: 'Equipements', children: [
    { code: '31', label: 'Cuisine' },
    { code: '32', label: 'Mobilier' },
  ]},
  { code: '4', label: 'Amenagements exterieurs', children: [
    { code: '41', label: 'Jardinage' },
    { code: '42', label: 'Clotures' },
    { code: '43', label: 'Voirie' },
  ]},
  { code: '5', label: 'Frais secondaires', children: [
    { code: '51', label: 'Honoraires' },
    { code: '52', label: 'Assurances' },
    { code: '53', label: 'Taxes' },
    { code: '54', label: 'Financement' },
  ]},
];

// ============================================================================
// Hook: useCFCManagement
// ============================================================================

export function useCFCManagement(projectId: string) {
  const [budget, setBudget] = useState<CFCBudget | null>(null);
  const [lines, setLines] = useState<CFCLine[]>([]);
  const [summary, setSummary] = useState<CFCSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCFCData = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);

      // Load active budget
      const { data: budgetData, error: budgetError } = await supabase
        .from('cfc_budgets')
        .select('*')
        .eq('project_id', projectId)
        .eq('status', 'ACTIVE')
        .maybeSingle();

      if (budgetError) throw budgetError;

      if (!budgetData) {
        // No active budget, check for any budget
        const { data: anyBudget } = await supabase
          .from('cfc_budgets')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        setBudget(anyBudget);

        if (!anyBudget) {
          setLines([]);
          setSummary(null);
          setLoading(false);
          return;
        }
      } else {
        setBudget(budgetData);
      }

      const activeBudget = budgetData || budget;
      if (!activeBudget) {
        setLines([]);
        setSummary(null);
        setLoading(false);
        return;
      }

      // Load lines
      const { data: linesData, error: linesError } = await supabase
        .from('cfc_lines')
        .select('*')
        .eq('budget_id', activeBudget.id)
        .order('code');

      if (linesError) throw linesError;

      // Process lines with computed fields
      const processedLines: CFCLine[] = (linesData || []).map((line: any) => {
        const budgeted = parseFloat(line.amount_budgeted) || 0;
        const committed = parseFloat(line.amount_committed) || 0;
        const invoiced = parseFloat(line.amount_invoiced) || parseFloat(line.amount_committed) || 0;
        const paid = parseFloat(line.amount_paid) || parseFloat(line.amount_spent) || 0;
        const variance = budgeted - committed;

        return {
          id: line.id,
          budget_id: line.budget_id,
          code: line.code,
          label: line.label,
          amount_budgeted: budgeted,
          amount_committed: committed,
          amount_invoiced: invoiced,
          amount_paid: paid,
          parent_id: line.parent_id,
          created_at: line.created_at,
          updated_at: line.updated_at,
          variance,
          variance_percent: budgeted > 0 ? (variance / budgeted) * 100 : 0,
          remaining: budgeted - paid,
        };
      });

      // Build hierarchy
      const hierarchicalLines = buildHierarchy(processedLines);
      setLines(hierarchicalLines);

      // Calculate summary
      const rootLines = processedLines.filter((l) => !l.parent_id);
      const calculatedSummary: CFCSummary = {
        totalBudget: rootLines.reduce((sum, l) => sum + l.amount_budgeted, 0),
        totalCommitted: rootLines.reduce((sum, l) => sum + l.amount_committed, 0),
        totalInvoiced: rootLines.reduce((sum, l) => sum + l.amount_invoiced, 0),
        totalPaid: rootLines.reduce((sum, l) => sum + l.amount_paid, 0),
        totalVariance: 0,
        totalRemaining: 0,
        percentCommitted: 0,
        percentInvoiced: 0,
        percentPaid: 0,
        linesCount: processedLines.length,
        overBudgetCount: processedLines.filter((l) => l.variance < 0).length,
      };

      calculatedSummary.totalVariance = calculatedSummary.totalBudget - calculatedSummary.totalCommitted;
      calculatedSummary.totalRemaining = calculatedSummary.totalBudget - calculatedSummary.totalPaid;
      calculatedSummary.percentCommitted =
        calculatedSummary.totalBudget > 0
          ? (calculatedSummary.totalCommitted / calculatedSummary.totalBudget) * 100
          : 0;
      calculatedSummary.percentInvoiced =
        calculatedSummary.totalBudget > 0
          ? (calculatedSummary.totalInvoiced / calculatedSummary.totalBudget) * 100
          : 0;
      calculatedSummary.percentPaid =
        calculatedSummary.totalBudget > 0
          ? (calculatedSummary.totalPaid / calculatedSummary.totalBudget) * 100
          : 0;

      setSummary(calculatedSummary);
    } catch (err) {
      console.error('Error loading CFC data:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadCFCData();
  }, [loadCFCData]);

  /**
   * Create a new budget
   */
  const createBudget = useCallback(
    async (name: string) => {
      try {
        const { data, error: insertError } = await supabase
          .from('cfc_budgets')
          .insert({
            project_id: projectId,
            name,
            version: 1,
            total_amount: 0,
            status: 'DRAFT',
          })
          .select()
          .single();

        if (insertError) throw insertError;

        await loadCFCData();
        return data;
      } catch (err) {
        console.error('Error creating budget:', err);
        throw err;
      }
    },
    [projectId, loadCFCData]
  );

  /**
   * Update budget status
   */
  const updateBudgetStatus = useCallback(
    async (status: CFCBudgetStatus) => {
      if (!budget) return;

      try {
        const { error: updateError } = await supabase
          .from('cfc_budgets')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', budget.id);

        if (updateError) throw updateError;

        await loadCFCData();
      } catch (err) {
        console.error('Error updating budget status:', err);
        throw err;
      }
    },
    [budget, loadCFCData]
  );

  /**
   * Create a new CFC line
   */
  const createLine = useCallback(
    async (data: CreateCFCLineData) => {
      if (!budget) throw new Error('Aucun budget actif');

      try {
        const { error: insertError } = await supabase.from('cfc_lines').insert({
          budget_id: budget.id,
          code: data.code,
          label: data.label,
          amount_budgeted: data.amountBudgeted,
          amount_committed: 0,
          amount_spent: 0,
          parent_id: data.parentId || null,
        });

        if (insertError) throw insertError;

        await loadCFCData();
      } catch (err) {
        console.error('Error creating line:', err);
        throw err;
      }
    },
    [budget, loadCFCData]
  );

  /**
   * Update a CFC line
   */
  const updateLine = useCallback(
    async (lineId: string, data: UpdateCFCLineData) => {
      try {
        const updateData: any = { updated_at: new Date().toISOString() };

        if (data.label !== undefined) updateData.label = data.label;
        if (data.amountBudgeted !== undefined) updateData.amount_budgeted = data.amountBudgeted;
        if (data.amountCommitted !== undefined) updateData.amount_committed = data.amountCommitted;
        if (data.amountInvoiced !== undefined) updateData.amount_invoiced = data.amountInvoiced;
        if (data.amountPaid !== undefined) {
          updateData.amount_paid = data.amountPaid;
          updateData.amount_spent = data.amountPaid; // Legacy field compatibility
        }

        const { error: updateError } = await supabase
          .from('cfc_lines')
          .update(updateData)
          .eq('id', lineId);

        if (updateError) throw updateError;

        await loadCFCData();
      } catch (err) {
        console.error('Error updating line:', err);
        throw err;
      }
    },
    [loadCFCData]
  );

  /**
   * Delete a CFC line
   */
  const deleteLine = useCallback(
    async (lineId: string) => {
      try {
        const { error: deleteError } = await supabase.from('cfc_lines').delete().eq('id', lineId);

        if (deleteError) throw deleteError;

        await loadCFCData();
      } catch (err) {
        console.error('Error deleting line:', err);
        throw err;
      }
    },
    [loadCFCData]
  );

  /**
   * Import standard CFC structure
   */
  const importStandardCFC = useCallback(
    async (codes: typeof STANDARD_CFC_CODES) => {
      if (!budget) throw new Error('Aucun budget actif');

      try {
        const linesToInsert: any[] = [];

        const processCode = (item: any, parentId: string | null = null) => {
          const line = {
            budget_id: budget.id,
            code: item.code,
            label: item.label,
            amount_budgeted: 0,
            amount_committed: 0,
            amount_spent: 0,
            parent_id: parentId,
          };
          linesToInsert.push(line);

          if (item.children) {
            item.children.forEach((child: any) => processCode(child, null)); // Parent IDs will be resolved after insert
          }
        };

        codes.forEach((code) => processCode(code));

        const { error: insertError } = await supabase.from('cfc_lines').insert(linesToInsert);

        if (insertError) throw insertError;

        await loadCFCData();
      } catch (err) {
        console.error('Error importing standard CFC:', err);
        throw err;
      }
    },
    [budget, loadCFCData]
  );

  /**
   * Get lines that are over budget
   */
  const getOverBudgetLines = useCallback(() => {
    return lines.filter((l) => l.variance < 0);
  }, [lines]);

  /**
   * Get lines by code prefix
   */
  const getLinesByPrefix = useCallback(
    (prefix: string) => {
      return lines.filter((l) => l.code.startsWith(prefix));
    },
    [lines]
  );

  return {
    budget,
    lines,
    summary,
    loading,
    error,
    refresh: loadCFCData,
    createBudget,
    updateBudgetStatus,
    createLine,
    updateLine,
    deleteLine,
    importStandardCFC,
    getOverBudgetLines,
    getLinesByPrefix,
  };
}

// ============================================================================
// Hook: useCFCLineDetail
// ============================================================================

export function useCFCLineDetail(lineId: string | undefined) {
  const [line, setLine] = useState<CFCLineWithContracts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLineDetail = useCallback(async () => {
    if (!lineId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load line
      const { data: lineData, error: lineError } = await supabase
        .from('cfc_lines')
        .select('*')
        .eq('id', lineId)
        .single();

      if (lineError) throw lineError;

      // Load related contracts
      const { data: contractsData } = await supabase
        .from('contracts')
        .select(`
          id,
          number,
          name,
          amount,
          status,
          signed_at,
          company:company_id(name)
        `)
        .eq('cfc_line_id', lineId);

      // Load related invoices
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          amount,
          status,
          issued_at,
          due_at,
          paid_at,
          company:company_id(name)
        `)
        .eq('cfc_line_id', lineId);

      const budgeted = parseFloat(lineData.amount_budgeted) || 0;
      const committed = parseFloat(lineData.amount_committed) || 0;
      const invoiced = parseFloat(lineData.amount_invoiced) || committed;
      const paid = parseFloat(lineData.amount_paid) || parseFloat(lineData.amount_spent) || 0;

      setLine({
        ...lineData,
        amount_budgeted: budgeted,
        amount_committed: committed,
        amount_invoiced: invoiced,
        amount_paid: paid,
        variance: budgeted - committed,
        variance_percent: budgeted > 0 ? ((budgeted - committed) / budgeted) * 100 : 0,
        remaining: budgeted - paid,
        contracts:
          contractsData?.map((c: any) => ({
            id: c.id,
            number: c.number,
            name: c.name,
            company_name: c.company?.name || 'N/A',
            amount: c.amount,
            status: c.status,
            signed_at: c.signed_at,
          })) || [],
        invoices:
          invoicesData?.map((i: any) => ({
            id: i.id,
            invoice_number: i.invoice_number,
            company_name: i.company?.name || 'N/A',
            amount: i.amount,
            status: i.status,
            issued_at: i.issued_at,
            due_at: i.due_at,
            paid_at: i.paid_at,
          })) || [],
      });
    } catch (err) {
      console.error('Error loading CFC line detail:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [lineId]);

  useEffect(() => {
    loadLineDetail();
  }, [loadLineDetail]);

  return { line, loading, error, refresh: loadLineDetail };
}

// ============================================================================
// Helper Functions
// ============================================================================

function buildHierarchy(lines: CFCLine[]): CFCLine[] {
  const lineMap = new Map<string, CFCLine>();
  const rootLines: CFCLine[] = [];

  // First pass: create map
  lines.forEach((line) => {
    lineMap.set(line.id, { ...line, children: [] });
  });

  // Second pass: build tree
  lines.forEach((line) => {
    const current = lineMap.get(line.id)!;
    if (line.parent_id && lineMap.has(line.parent_id)) {
      const parent = lineMap.get(line.parent_id)!;
      parent.children = parent.children || [];
      parent.children.push(current);
    } else {
      rootLines.push(current);
    }
  });

  return rootLines;
}

/**
 * Format currency for display
 */
export function formatCHF(amount: number | null | undefined): string {
  if (amount == null) return '-';
  return `CHF ${amount.toLocaleString('fr-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Get variance status
 */
export function getVarianceStatus(variance: number): { label: string; color: string } {
  if (variance > 0) {
    return { label: 'Sous budget', color: 'text-green-600 dark:text-green-400' };
  } else if (variance < 0) {
    return { label: 'Depassement', color: 'text-red-600 dark:text-red-400' };
  } else {
    return { label: 'Conforme', color: 'text-neutral-600 dark:text-neutral-400' };
  }
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
}
