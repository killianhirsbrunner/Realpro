import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface MaterialSelection {
  id: string;
  lot_id: string;
  option_id: string;
  status: string;
  validated_at?: string;
}

interface SelectionStatus {
  [lotId: string]: string;
}

export function useMaterialSelections(projectId: string) {
  const [selections, setSelections] = useState<MaterialSelection[]>([]);
  const [status, setStatus] = useState<SelectionStatus>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSelections();
  }, [projectId]);

  async function fetchSelections() {
    try {
      setLoading(true);

      const { data: lots, error: lotsError } = await supabase
        .from('lots')
        .select('id')
        .eq('project_id', projectId);

      if (lotsError) throw lotsError;

      if (!lots || lots.length === 0) {
        setSelections([]);
        setStatus({});
        return;
      }

      const lotIds = lots.map(l => l.id);

      const { data, error: selectionsError } = await supabase
        .from('material_choices')
        .select('*')
        .in('lot_id', lotIds);

      if (selectionsError) throw selectionsError;

      setSelections(data || []);

      const statusMap: SelectionStatus = {};
      lots.forEach(lot => {
        const lotSelections = (data || []).filter(s => s.lot_id === lot.id);
        if (lotSelections.length === 0) {
          statusMap[lot.id] = 'À faire';
        } else if (lotSelections.every(s => s.status === 'validated')) {
          statusMap[lot.id] = 'Validé';
        } else {
          statusMap[lot.id] = 'En cours';
        }
      });
      setStatus(statusMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  return { selections, status, loading, error, refetch: fetchSelections };
}

export function useLotChoices(lotId: string) {
  const [choices, setChoices] = useState<MaterialSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChoices();
  }, [lotId]);

  async function fetchChoices() {
    try {
      setLoading(true);

      const { data, error: choicesError } = await supabase
        .from('material_choices')
        .select('*')
        .eq('lot_id', lotId);

      if (choicesError) throw choicesError;

      setChoices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  async function updateChoice(optionId: string, selected: boolean) {
    try {
      if (selected) {
        const { error } = await supabase
          .from('material_choices')
          .insert({
            lot_id: lotId,
            option_id: optionId,
            status: 'pending'
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('material_choices')
          .delete()
          .eq('lot_id', lotId)
          .eq('option_id', optionId);

        if (error) throw error;
      }

      await fetchChoices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  }

  return { choices, loading, error, updateChoice, refetch: fetchChoices };
}

interface ModificationRequest {
  id: string;
  lot_id: string;
  description: string;
  estimated_price?: number;
  status: string;
  created_at: string;
}

export function useModificationRequests(lotId: string) {
  const [requests, setRequests] = useState<ModificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [lotId]);

  async function fetchRequests() {
    try {
      setLoading(true);

      const { data, error: requestsError } = await supabase
        .from('modification_requests')
        .select('*')
        .eq('lot_id', lotId)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      setRequests(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  async function createRequest(description: string, estimatedPrice?: number) {
    try {
      const { error } = await supabase
        .from('modification_requests')
        .insert({
          lot_id: lotId,
          description,
          estimated_price: estimatedPrice,
          status: 'pending'
        });

      if (error) throw error;

      await fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    }
  }

  return { requests, loading, error, createRequest, refetch: fetchRequests };
}
