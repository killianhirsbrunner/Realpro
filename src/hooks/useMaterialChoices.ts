import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface MaterialChoice {
  id: string;
  buyer_id: string;
  lot_id: string;
  material_option_id: string;
  quantity: number;
  chosen_at: string;
  locked: boolean;
  notes: string | null;
}

export interface MaterialChoiceWithDetails extends MaterialChoice {
  option: {
    id: string;
    name: string;
    price_delta: number;
    is_standard: boolean;
    image_url: string | null;
    category: {
      name: string;
    };
  };
}

export function useMaterialChoices(lotId: string) {
  const [choices, setChoices] = useState<MaterialChoiceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchChoices();
  }, [lotId]);

  const fetchChoices = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('buyer_choices')
        .select(`
          *,
          option:material_options(
            id,
            name,
            price_delta,
            is_standard,
            image_url,
            category:material_categories(name)
          )
        `)
        .eq('lot_id', lotId);

      if (fetchError) throw fetchError;

      setChoices(data || []);
    } catch (err) {
      console.error('Error fetching material choices:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const makeChoice = async (choice: {
    buyer_id: string;
    material_option_id: string;
    quantity?: number;
    notes?: string;
  }) => {
    try {
      const { data: existing } = await supabase
        .from('buyer_choices')
        .select('id')
        .eq('lot_id', lotId)
        .eq('material_option_id', choice.material_option_id)
        .maybeSingle();

      if (existing) {
        const { error: updateError } = await supabase
          .from('buyer_choices')
          .update({
            quantity: choice.quantity || 1,
            notes: choice.notes,
            chosen_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('buyer_choices')
          .insert({
            lot_id: lotId,
            ...choice,
            quantity: choice.quantity || 1,
          });

        if (insertError) throw insertError;
      }

      await fetchChoices();
    } catch (err) {
      console.error('Error making choice:', err);
      throw err;
    }
  };

  const removeChoice = async (choiceId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('buyer_choices')
        .delete()
        .eq('id', choiceId);

      if (deleteError) throw deleteError;

      await fetchChoices();
    } catch (err) {
      console.error('Error removing choice:', err);
      throw err;
    }
  };

  const lockChoice = async (choiceId: string, locked: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('buyer_choices')
        .update({ locked })
        .eq('id', choiceId);

      if (updateError) throw updateError;

      await fetchChoices();
    } catch (err) {
      console.error('Error locking choice:', err);
      throw err;
    }
  };

  const getTotalSurcharge = () => {
    return choices.reduce((total, choice) => {
      if (!choice.option.is_standard) {
        return total + (choice.option.price_delta * choice.quantity);
      }
      return total;
    }, 0);
  };

  return {
    choices,
    loading,
    error,
    totalSurcharge: getTotalSurcharge(),
    refresh: fetchChoices,
    makeChoice,
    removeChoice,
    lockChoice,
  };
}
