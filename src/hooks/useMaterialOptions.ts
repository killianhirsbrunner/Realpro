import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface MaterialOption {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  manufacturer: string | null;
  reference: string | null;
  is_standard: boolean;
  price_delta: number;
  image_url: string | null;
  technical_sheet_id: string | null;
  available: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export function useMaterialOptions(categoryId?: string) {
  const [options, setOptions] = useState<MaterialOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (categoryId) {
      fetchOptions();
    }
  }, [categoryId]);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('material_options')
        .select('*')
        .order('order_index', { ascending: true });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setOptions(data || []);
    } catch (err) {
      console.error('Error fetching material options:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createOption = async (option: {
    category_id: string;
    name: string;
    description?: string;
    manufacturer?: string;
    reference?: string;
    is_standard?: boolean;
    price_delta?: number;
    image_url?: string;
    available?: boolean;
    order_index?: number;
  }) => {
    try {
      const { data, error: createError } = await supabase
        .from('material_options')
        .insert(option)
        .select()
        .single();

      if (createError) throw createError;

      await fetchOptions();
      return data;
    } catch (err) {
      console.error('Error creating option:', err);
      throw err;
    }
  };

  const updateOption = async (optionId: string, updates: Partial<MaterialOption>) => {
    try {
      const { error: updateError } = await supabase
        .from('material_options')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', optionId);

      if (updateError) throw updateError;

      await fetchOptions();
    } catch (err) {
      console.error('Error updating option:', err);
      throw err;
    }
  };

  const deleteOption = async (optionId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('material_options')
        .delete()
        .eq('id', optionId);

      if (deleteError) throw deleteError;

      await fetchOptions();
    } catch (err) {
      console.error('Error deleting option:', err);
      throw err;
    }
  };

  return {
    options,
    loading,
    error,
    refresh: fetchOptions,
    createOption,
    updateOption,
    deleteOption,
  };
}
