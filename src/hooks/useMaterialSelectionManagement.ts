import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

// ============================================================================
// Types
// ============================================================================

export type ChoiceStatus = 'pending' | 'confirmed' | 'approved' | 'ordered' | 'installed';
export type ModificationStatus = 'requested' | 'reviewing' | 'approved' | 'rejected' | 'completed';

export interface MaterialCategory {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  icon: string | null;
  order: number;
  isRequired: boolean;
  deadline: string | null;
}

export interface MaterialOption {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string | null;
  reference: string | null;
  supplierId: string | null;
  supplierName: string | null;
  isStandard: boolean;
  priceDelta: number;
  imageUrl: string | null;
  specifications: Record<string, any>;
  availability: 'in_stock' | 'on_order' | 'discontinued';
  leadTimeDays: number | null;
}

export interface LotChoice {
  id: string;
  lotId: string;
  optionId: string;
  optionName: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  status: ChoiceStatus;
  isStandard: boolean;
  priceDelta: number;
  totalPrice: number;
  chosenAt: string;
  lockedAt: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  notes: string | null;
  imageUrl: string | null;
}

export interface ModificationRequest {
  id: string;
  lotId: string;
  categoryId: string | null;
  categoryName: string | null;
  description: string;
  estimatedPrice: number | null;
  status: ModificationStatus;
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewNotes: string | null;
}

export interface SelectionSummary {
  totalCategories: number;
  completedCategories: number;
  pendingCategories: number;
  requiredCategories: number;
  completedRequired: number;
  totalChoices: number;
  standardChoices: number;
  upgradeChoices: number;
  totalSurcharge: number;
  totalSavings: number;
  lockedChoices: number;
  approvedChoices: number;
  pendingModifications: number;
  completionPercent: number;
  deadlineStatus: 'on_track' | 'approaching' | 'overdue' | 'none';
  nextDeadline: string | null;
}

export interface ProjectSelectionStats {
  totalLots: number;
  lotsWithChoices: number;
  lotsComplete: number;
  totalSurcharge: number;
  avgSurchargePerLot: number;
  popularUpgrades: { optionId: string; optionName: string; count: number; revenue: number }[];
  categoryCompletion: { categoryId: string; categoryName: string; completed: number; total: number }[];
  pendingApprovals: number;
}

// ============================================================================
// Configuration
// ============================================================================

export const CHOICE_STATUS_CONFIG: Record<ChoiceStatus, {
  label: string;
  color: string;
  order: number;
}> = {
  pending: {
    label: 'En attente',
    color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
    order: 1,
  },
  confirmed: {
    label: 'Confirme',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    order: 2,
  },
  approved: {
    label: 'Approuve',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    order: 3,
  },
  ordered: {
    label: 'Commande',
    color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    order: 4,
  },
  installed: {
    label: 'Installe',
    color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30',
    order: 5,
  },
};

export const MODIFICATION_STATUS_CONFIG: Record<ModificationStatus, {
  label: string;
  color: string;
}> = {
  requested: {
    label: 'Demande',
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
  },
  reviewing: {
    label: 'En revision',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
  },
  approved: {
    label: 'Approuve',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  },
  rejected: {
    label: 'Refuse',
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
  },
  completed: {
    label: 'Termine',
    color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30',
  },
};

export const CATEGORY_ICONS: Record<string, string> = {
  cuisine: 'UtensilsCrossed',
  salle_de_bain: 'Bath',
  sols: 'Grid3X3',
  peinture: 'Paintbrush',
  electricite: 'Zap',
  chauffage: 'Thermometer',
  menuiserie: 'DoorOpen',
  exterieur: 'Trees',
  default: 'Package',
};

// ============================================================================
// Hook: useMaterialSelectionManagement
// ============================================================================

export function useMaterialSelectionManagement(projectId: string) {
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [options, setOptions] = useState<MaterialOption[]>([]);
  const [stats, setStats] = useState<ProjectSelectionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const { data: categoriesData, error: catError } = await supabase
        .from('material_categories')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index');

      if (catError) throw catError;

      const mappedCategories: MaterialCategory[] = (categoriesData || []).map((c: any) => ({
        id: c.id,
        projectId: c.project_id,
        name: c.name,
        description: c.description,
        icon: c.icon,
        order: c.order_index,
        isRequired: c.is_required || false,
        deadline: c.deadline,
      }));

      setCategories(mappedCategories);

      // Fetch options
      const { data: optionsData, error: optError } = await supabase
        .from('material_options')
        .select(`
          *,
          category:category_id(id, name),
          supplier:supplier_id(id, name)
        `)
        .eq('project_id', projectId)
        .order('name');

      if (optError) throw optError;

      const mappedOptions: MaterialOption[] = (optionsData || []).map((o: any) => ({
        id: o.id,
        categoryId: o.category_id,
        categoryName: o.category?.name || '',
        name: o.name,
        description: o.description,
        reference: o.reference,
        supplierId: o.supplier_id,
        supplierName: o.supplier?.name || null,
        isStandard: o.is_standard || false,
        priceDelta: parseFloat(o.price_delta) || 0,
        imageUrl: o.image_url,
        specifications: o.specifications || {},
        availability: o.availability || 'in_stock',
        leadTimeDays: o.lead_time_days,
      }));

      setOptions(mappedOptions);

      // Calculate project stats
      const projectStats = await calculateProjectStats(projectId, mappedCategories);
      setStats(projectStats);

    } catch (err) {
      console.error('Error loading material data:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function calculateProjectStats(projectId: string, cats: MaterialCategory[]): Promise<ProjectSelectionStats> {
    // Get all lots for project
    const { data: lots } = await supabase
      .from('lots')
      .select('id')
      .eq('project_id', projectId)
      .in('status', ['sold', 'reserved']);

    const lotIds = (lots || []).map((l: any) => l.id);
    const totalLots = lotIds.length;

    if (totalLots === 0) {
      return {
        totalLots: 0,
        lotsWithChoices: 0,
        lotsComplete: 0,
        totalSurcharge: 0,
        avgSurchargePerLot: 0,
        popularUpgrades: [],
        categoryCompletion: [],
        pendingApprovals: 0,
      };
    }

    // Get all choices
    const { data: choices } = await supabase
      .from('buyer_choices')
      .select(`
        *,
        option:option_id(id, name, price_delta, is_standard, category_id)
      `)
      .in('lot_id', lotIds);

    const allChoices = choices || [];

    // Lots with choices
    const lotsWithChoices = new Set(allChoices.map((c: any) => c.lot_id)).size;

    // Total surcharge
    const totalSurcharge = allChoices.reduce((sum: number, c: any) => {
      if (c.option && !c.option.is_standard) {
        return sum + (parseFloat(c.option.price_delta) || 0) * (c.quantity || 1);
      }
      return sum;
    }, 0);

    // Popular upgrades
    const upgradeCount: Record<string, { name: string; count: number; revenue: number }> = {};
    allChoices.forEach((c: any) => {
      if (c.option && !c.option.is_standard) {
        const optId = c.option.id;
        if (!upgradeCount[optId]) {
          upgradeCount[optId] = { name: c.option.name, count: 0, revenue: 0 };
        }
        upgradeCount[optId].count++;
        upgradeCount[optId].revenue += (parseFloat(c.option.price_delta) || 0) * (c.quantity || 1);
      }
    });

    const popularUpgrades = Object.entries(upgradeCount)
      .map(([optionId, data]) => ({
        optionId,
        optionName: data.name,
        count: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Category completion
    const categoryCompletion = cats.map((cat) => {
      const catChoices = allChoices.filter((c: any) => c.option?.category_id === cat.id);
      const lotsWithCatChoice = new Set(catChoices.map((c: any) => c.lot_id)).size;
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        completed: lotsWithCatChoice,
        total: totalLots,
      };
    });

    // Lots complete (have choice in all required categories)
    const requiredCatIds = cats.filter((c) => c.isRequired).map((c) => c.id);
    let lotsComplete = 0;
    if (requiredCatIds.length > 0) {
      lotIds.forEach((lotId) => {
        const lotChoices = allChoices.filter((c: any) => c.lot_id === lotId);
        const lotCatIds = new Set(lotChoices.map((c: any) => c.option?.category_id));
        const hasAllRequired = requiredCatIds.every((catId) => lotCatIds.has(catId));
        if (hasAllRequired) lotsComplete++;
      });
    }

    // Pending approvals
    const pendingApprovals = allChoices.filter((c: any) => c.status === 'pending' || c.status === 'confirmed').length;

    return {
      totalLots,
      lotsWithChoices,
      lotsComplete,
      totalSurcharge,
      avgSurchargePerLot: lotsWithChoices > 0 ? totalSurcharge / lotsWithChoices : 0,
      popularUpgrades,
      categoryCompletion,
      pendingApprovals,
    };
  }

  // Filter helpers
  const getOptionsByCategory = useCallback(
    (categoryId: string) => options.filter((o) => o.categoryId === categoryId),
    [options]
  );

  const getStandardOptions = useCallback(
    () => options.filter((o) => o.isStandard),
    [options]
  );

  const getUpgradeOptions = useCallback(
    () => options.filter((o) => !o.isStandard && o.priceDelta > 0),
    [options]
  );

  const getDowngradeOptions = useCallback(
    () => options.filter((o) => !o.isStandard && o.priceDelta < 0),
    [options]
  );

  return {
    categories,
    options,
    stats,
    loading,
    error,
    refresh: loadData,
    getOptionsByCategory,
    getStandardOptions,
    getUpgradeOptions,
    getDowngradeOptions,
  };
}

// ============================================================================
// Hook: useLotMaterialSelection
// ============================================================================

export function useLotMaterialSelection(lotId: string | undefined) {
  const [choices, setChoices] = useState<LotChoice[]>([]);
  const [modifications, setModifications] = useState<ModificationRequest[]>([]);
  const [summary, setSummary] = useState<SelectionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!lotId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get lot info to find project
      const { data: lotData, error: lotError } = await supabase
        .from('lots')
        .select('id, project_id')
        .eq('id', lotId)
        .single();

      if (lotError) throw lotError;

      const projectId = lotData.project_id;

      // Fetch choices with options
      const { data: choicesData, error: choicesError } = await supabase
        .from('buyer_choices')
        .select(`
          *,
          option:option_id(
            id,
            name,
            category_id,
            price_delta,
            is_standard,
            image_url
          )
        `)
        .eq('lot_id', lotId)
        .order('chosen_at', { ascending: false });

      if (choicesError) throw choicesError;

      // Get category names
      const categoryIds = [...new Set((choicesData || []).map((c: any) => c.option?.category_id).filter(Boolean))];
      let categoryMap: Record<string, string> = {};

      if (categoryIds.length > 0) {
        const { data: catsData } = await supabase
          .from('material_categories')
          .select('id, name')
          .in('id', categoryIds);

        (catsData || []).forEach((cat: any) => {
          categoryMap[cat.id] = cat.name;
        });
      }

      const mappedChoices: LotChoice[] = (choicesData || []).map((c: any) => ({
        id: c.id,
        lotId: c.lot_id,
        optionId: c.option_id,
        optionName: c.option?.name || '',
        categoryId: c.option?.category_id || '',
        categoryName: categoryMap[c.option?.category_id] || '',
        quantity: c.quantity || 1,
        status: c.status || 'pending',
        isStandard: c.option?.is_standard || false,
        priceDelta: parseFloat(c.option?.price_delta) || 0,
        totalPrice: (parseFloat(c.option?.price_delta) || 0) * (c.quantity || 1),
        chosenAt: c.chosen_at,
        lockedAt: c.locked_at,
        approvedAt: c.approved_at,
        approvedBy: c.approved_by,
        notes: c.notes,
        imageUrl: c.option?.image_url,
      }));

      setChoices(mappedChoices);

      // Fetch modification requests
      const { data: modsData } = await supabase
        .from('modification_requests')
        .select(`
          *,
          category:category_id(id, name)
        `)
        .eq('lot_id', lotId)
        .order('created_at', { ascending: false });

      const mappedMods: ModificationRequest[] = (modsData || []).map((m: any) => ({
        id: m.id,
        lotId: m.lot_id,
        categoryId: m.category_id,
        categoryName: m.category?.name || null,
        description: m.description,
        estimatedPrice: m.estimated_price,
        status: m.status || 'requested',
        createdAt: m.created_at,
        reviewedAt: m.reviewed_at,
        reviewedBy: m.reviewed_by,
        reviewNotes: m.review_notes,
      }));

      setModifications(mappedMods);

      // Calculate summary
      const { data: allCategories } = await supabase
        .from('material_categories')
        .select('*')
        .eq('project_id', projectId);

      const cats = allCategories || [];
      const requiredCats = cats.filter((c: any) => c.is_required);
      const choiceCatIds = new Set(mappedChoices.map((c) => c.categoryId));

      const completedCategories = cats.filter((c: any) => choiceCatIds.has(c.id)).length;
      const completedRequired = requiredCats.filter((c: any) => choiceCatIds.has(c.id)).length;

      const totalSurcharge = mappedChoices
        .filter((c) => !c.isStandard && c.priceDelta > 0)
        .reduce((sum, c) => sum + c.totalPrice, 0);

      const totalSavings = Math.abs(
        mappedChoices
          .filter((c) => !c.isStandard && c.priceDelta < 0)
          .reduce((sum, c) => sum + c.totalPrice, 0)
      );

      // Find next deadline
      const now = new Date();
      const upcomingDeadlines = cats
        .filter((c: any) => c.deadline && new Date(c.deadline) > now)
        .sort((a: any, b: any) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

      let deadlineStatus: SelectionSummary['deadlineStatus'] = 'none';
      let nextDeadline: string | null = null;

      if (upcomingDeadlines.length > 0) {
        nextDeadline = upcomingDeadlines[0].deadline;
        const daysUntil = Math.ceil((new Date(nextDeadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntil <= 7) {
          deadlineStatus = 'approaching';
        } else {
          deadlineStatus = 'on_track';
        }
      }

      // Check for overdue
      const overdueDeadlines = cats.filter((c: any) => c.deadline && new Date(c.deadline) < now && !choiceCatIds.has(c.id));
      if (overdueDeadlines.length > 0) {
        deadlineStatus = 'overdue';
      }

      const calculatedSummary: SelectionSummary = {
        totalCategories: cats.length,
        completedCategories,
        pendingCategories: cats.length - completedCategories,
        requiredCategories: requiredCats.length,
        completedRequired,
        totalChoices: mappedChoices.length,
        standardChoices: mappedChoices.filter((c) => c.isStandard).length,
        upgradeChoices: mappedChoices.filter((c) => !c.isStandard && c.priceDelta > 0).length,
        totalSurcharge,
        totalSavings,
        lockedChoices: mappedChoices.filter((c) => c.lockedAt).length,
        approvedChoices: mappedChoices.filter((c) => c.status === 'approved' || c.status === 'ordered' || c.status === 'installed').length,
        pendingModifications: mappedMods.filter((m) => m.status === 'requested' || m.status === 'reviewing').length,
        completionPercent: cats.length > 0 ? (completedCategories / cats.length) * 100 : 0,
        deadlineStatus,
        nextDeadline,
      };

      setSummary(calculatedSummary);

    } catch (err) {
      console.error('Error loading lot material selection:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [lotId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Actions
  const selectOption = useCallback(
    async (optionId: string, quantity: number = 1, notes?: string): Promise<void> => {
      if (!lotId) return;

      try {
        // Check if already selected
        const existing = choices.find((c) => c.optionId === optionId);

        if (existing) {
          const { error } = await supabase
            .from('buyer_choices')
            .update({
              quantity,
              notes,
              chosen_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('buyer_choices')
            .insert({
              lot_id: lotId,
              option_id: optionId,
              quantity,
              notes,
              status: 'pending',
            });

          if (error) throw error;
        }

        await loadData();
      } catch (err) {
        console.error('Error selecting option:', err);
        throw err;
      }
    },
    [lotId, choices, loadData]
  );

  const removeChoice = useCallback(
    async (choiceId: string): Promise<void> => {
      try {
        const choice = choices.find((c) => c.id === choiceId);
        if (choice?.lockedAt) {
          throw new Error('Ce choix est verrouille et ne peut pas etre supprime');
        }

        const { error } = await supabase
          .from('buyer_choices')
          .delete()
          .eq('id', choiceId);

        if (error) throw error;

        await loadData();
      } catch (err) {
        console.error('Error removing choice:', err);
        throw err;
      }
    },
    [choices, loadData]
  );

  const lockChoice = useCallback(
    async (choiceId: string): Promise<void> => {
      try {
        const { error } = await supabase
          .from('buyer_choices')
          .update({
            locked_at: new Date().toISOString(),
            status: 'confirmed',
          })
          .eq('id', choiceId);

        if (error) throw error;

        await loadData();
      } catch (err) {
        console.error('Error locking choice:', err);
        throw err;
      }
    },
    [loadData]
  );

  const approveChoice = useCallback(
    async (choiceId: string, userId: string): Promise<void> => {
      try {
        const { error } = await supabase
          .from('buyer_choices')
          .update({
            status: 'approved',
            approved_at: new Date().toISOString(),
            approved_by: userId,
          })
          .eq('id', choiceId);

        if (error) throw error;

        await loadData();
      } catch (err) {
        console.error('Error approving choice:', err);
        throw err;
      }
    },
    [loadData]
  );

  const createModificationRequest = useCallback(
    async (description: string, categoryId?: string, estimatedPrice?: number): Promise<void> => {
      if (!lotId) return;

      try {
        const { error } = await supabase
          .from('modification_requests')
          .insert({
            lot_id: lotId,
            category_id: categoryId || null,
            description,
            estimated_price: estimatedPrice || null,
            status: 'requested',
          });

        if (error) throw error;

        await loadData();
      } catch (err) {
        console.error('Error creating modification request:', err);
        throw err;
      }
    },
    [lotId, loadData]
  );

  const updateModificationStatus = useCallback(
    async (modificationId: string, status: ModificationStatus, userId: string, reviewNotes?: string): Promise<void> => {
      try {
        const { error } = await supabase
          .from('modification_requests')
          .update({
            status,
            reviewed_at: new Date().toISOString(),
            reviewed_by: userId,
            review_notes: reviewNotes || null,
          })
          .eq('id', modificationId);

        if (error) throw error;

        await loadData();
      } catch (err) {
        console.error('Error updating modification status:', err);
        throw err;
      }
    },
    [loadData]
  );

  // Filter helpers
  const getChoicesByCategory = useCallback(
    (categoryId: string) => choices.filter((c) => c.categoryId === categoryId),
    [choices]
  );

  const getUpgradeChoices = useCallback(
    () => choices.filter((c) => !c.isStandard && c.priceDelta > 0),
    [choices]
  );

  const getPendingChoices = useCallback(
    () => choices.filter((c) => c.status === 'pending' || c.status === 'confirmed'),
    [choices]
  );

  return {
    choices,
    modifications,
    summary,
    loading,
    error,
    refresh: loadData,
    // Actions
    selectOption,
    removeChoice,
    lockChoice,
    approveChoice,
    createModificationRequest,
    updateModificationStatus,
    // Filters
    getChoicesByCategory,
    getUpgradeChoices,
    getPendingChoices,
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

export function formatPriceDelta(delta: number): string {
  if (delta === 0) return 'Standard';
  const formatted = formatCHF(Math.abs(delta));
  return delta > 0 ? `+${formatted}` : `-${formatted}`;
}

export function getDeadlineStatus(deadline: string | null): {
  label: string;
  color: string;
  daysRemaining: number | null;
} {
  if (!deadline) {
    return { label: '', color: '', daysRemaining: null };
  }

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const daysRemaining = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return { label: 'En retard', color: 'text-red-600 bg-red-100', daysRemaining };
  }
  if (daysRemaining <= 3) {
    return { label: `${daysRemaining}j restants`, color: 'text-red-600 bg-red-100', daysRemaining };
  }
  if (daysRemaining <= 7) {
    return { label: `${daysRemaining}j restants`, color: 'text-amber-600 bg-amber-100', daysRemaining };
  }
  return { label: `${daysRemaining}j restants`, color: 'text-green-600 bg-green-100', daysRemaining };
}

export function getCategoryIcon(categoryName: string): string {
  const normalized = categoryName.toLowerCase().replace(/\s+/g, '_').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return CATEGORY_ICONS[normalized] || CATEGORY_ICONS.default;
}

export function calculateCompletionStatus(summary: SelectionSummary): {
  status: 'complete' | 'in_progress' | 'not_started';
  message: string;
  color: string;
} {
  if (summary.completionPercent >= 100 && summary.completedRequired === summary.requiredCategories) {
    return {
      status: 'complete',
      message: 'Selection complete',
      color: 'text-green-600 bg-green-100',
    };
  }
  if (summary.totalChoices > 0) {
    return {
      status: 'in_progress',
      message: `${summary.completedCategories}/${summary.totalCategories} categories`,
      color: 'text-blue-600 bg-blue-100',
    };
  }
  return {
    status: 'not_started',
    message: 'Non commence',
    color: 'text-gray-600 bg-gray-100',
  };
}
