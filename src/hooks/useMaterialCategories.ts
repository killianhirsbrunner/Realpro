import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface MaterialCategory {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface MaterialCategoryWithOptions extends MaterialCategory {
  options: Array<{
    id: string;
    name: string;
    is_standard: boolean;
    price_delta: number;
  }>;
}

export function useMaterialCategories(projectId: string) {
  const [categories, setCategories] = useState<MaterialCategoryWithOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [projectId]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('material_categories')
        .select(`
          *,
          options:material_options(
            id,
            name,
            is_standard,
            price_delta
          )
        `)
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;

      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching material categories:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (category: {
    name: string;
    description?: string;
    order_index?: number;
  }) => {
    try {
      const { data, error: createError } = await supabase
        .from('material_categories')
        .insert({
          project_id: projectId,
          ...category,
        })
        .select()
        .single();

      if (createError) throw createError;

      await fetchCategories();
      return data;
    } catch (err) {
      console.error('Error creating category:', err);
      throw err;
    }
  };

  const updateCategory = async (categoryId: string, updates: Partial<MaterialCategory>) => {
    try {
      const { error: updateError } = await supabase
        .from('material_categories')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', categoryId);

      if (updateError) throw updateError;

      await fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('material_categories')
        .delete()
        .eq('id', categoryId);

      if (deleteError) throw deleteError;

      await fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
