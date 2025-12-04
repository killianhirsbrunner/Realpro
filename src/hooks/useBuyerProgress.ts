import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface BuyerProgressSnapshot {
  id: string;
  lot_id: string;
  snapshot_date: string;
  global_progress: number;
  gros_oeuvre_progress: number;
  second_oeuvre_progress: number;
  finitions_progress: number;
  current_phase: string | null;
  milestone_reached: string | null;
  notes: string | null;
  created_at: string;
}

export interface BuyerProgressWithLot extends BuyerProgressSnapshot {
  lot: {
    code: string;
    type: string;
  };
  buyer: {
    first_name: string;
    last_name: string;
  };
}

export function useBuyerProgress(projectId: string) {
  const [progress, setProgress] = useState<BuyerProgressWithLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchProgress();
  }, [projectId]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: lots, error: lotsError } = await supabase
        .from('lots')
        .select(`
          id,
          code,
          type,
          buyers!inner (
            id,
            first_name,
            last_name
          )
        `)
        .eq('project_id', projectId)
        .eq('status', 'sold');

      if (lotsError) throw lotsError;

      if (!lots || lots.length === 0) {
        setProgress([]);
        setLoading(false);
        return;
      }

      const lotIds = lots.map(l => l.id);

      const { data: snapshots, error: snapshotsError } = await supabase
        .from('buyer_progress_snapshots')
        .select('*')
        .in('lot_id', lotIds)
        .order('snapshot_date', { ascending: false });

      if (snapshotsError) throw snapshotsError;

      const latestSnapshots = new Map<string, BuyerProgressSnapshot>();
      (snapshots || []).forEach(snapshot => {
        if (!latestSnapshots.has(snapshot.lot_id)) {
          latestSnapshots.set(snapshot.lot_id, snapshot);
        }
      });

      const progressWithLots = lots.map(lot => {
        const snapshot = latestSnapshots.get(lot.id) || {
          id: '',
          lot_id: lot.id,
          snapshot_date: new Date().toISOString().split('T')[0],
          global_progress: 0,
          gros_oeuvre_progress: 0,
          second_oeuvre_progress: 0,
          finitions_progress: 0,
          current_phase: null,
          milestone_reached: null,
          notes: null,
          created_at: new Date().toISOString(),
        };

        return {
          ...snapshot,
          lot: {
            code: lot.code,
            type: lot.type,
          },
          buyer: lot.buyers[0],
        };
      });

      setProgress(progressWithLots);
    } catch (err) {
      console.error('Error fetching buyer progress:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (lotId: string, updates: {
    global_progress?: number;
    gros_oeuvre_progress?: number;
    second_oeuvre_progress?: number;
    finitions_progress?: number;
    current_phase?: string;
    milestone_reached?: string;
    notes?: string;
  }) => {
    try {
      const { data, error: insertError } = await supabase
        .from('buyer_progress_snapshots')
        .insert({
          lot_id: lotId,
          snapshot_date: new Date().toISOString().split('T')[0],
          ...updates,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchProgress();
      return data;
    } catch (err) {
      console.error('Error updating buyer progress:', err);
      throw err;
    }
  };

  return {
    progress,
    loading,
    error,
    refresh: fetchProgress,
    updateProgress,
  };
}
