import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Prospect {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  targetLot?: string;
  targetLotId?: string;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  createdAt: string;
  lastContact?: string;
  notes?: string;
  budget?: number;
  preferredRooms?: number;
  preferredFloor?: string;
}

export interface CreateProspectData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source: string;
  notes?: string;
  budget?: number;
  preferredRooms?: number;
  preferredFloor?: string;
  targetLotId?: string;
}

export function useProspects(projectId: string) {
  const [prospects, setProspects] = useState<Prospect[] | null>(null);
  const [project, setProject] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProspects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch project info
      const { data: projectData } = await supabase
        .from('projects')
        .select('id, name')
        .eq('id', projectId)
        .maybeSingle();

      if (projectData) {
        setProject(projectData);
      }

      const { data, error: fetchError } = await supabase
        .from('crm_prospects')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const transformedData = (data || []).map((p: any) => ({
        id: p.id,
        name: `${p.first_name} ${p.last_name}`,
        firstName: p.first_name,
        lastName: p.last_name,
        email: p.email,
        phone: p.phone,
        targetLot: p.target_lot,
        targetLotId: p.target_lot_id,
        source: p.source || 'website',
        status: p.status || 'NEW',
        createdAt: p.created_at,
        lastContact: p.last_contact_date,
        notes: p.notes,
        budget: p.budget,
        preferredRooms: p.preferred_rooms,
        preferredFloor: p.preferred_floor,
      }));

      setProspects(transformedData);
    } catch (err) {
      console.error('Error fetching prospects:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createProspect = async (data: CreateProspectData) => {
    try {
      const { data: newProspect, error: createError } = await supabase
        .from('crm_prospects')
        .insert({
          project_id: projectId,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone || null,
          source: data.source,
          status: 'NEW',
          notes: data.notes || null,
          budget: data.budget || null,
          preferred_rooms: data.preferredRooms || null,
          preferred_floor: data.preferredFloor || null,
          target_lot_id: data.targetLotId || null,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Refresh the list
      await fetchProspects();

      return newProspect;
    } catch (err) {
      console.error('Error creating prospect:', err);
      throw err;
    }
  };

  const updateProspectStatus = async (prospectId: string, status: Prospect['status']) => {
    try {
      const { error: updateError } = await supabase
        .from('crm_prospects')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', prospectId);

      if (updateError) throw updateError;

      await fetchProspects();
    } catch (err) {
      console.error('Error updating prospect status:', err);
      throw err;
    }
  };

  const deleteProspect = async (prospectId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('crm_prospects')
        .delete()
        .eq('id', prospectId);

      if (deleteError) throw deleteError;

      await fetchProspects();
    } catch (err) {
      console.error('Error deleting prospect:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProspects();
    }
  }, [projectId]);

  return {
    prospects,
    project,
    loading,
    error,
    refetch: fetchProspects,
    createProspect,
    updateProspectStatus,
    deleteProspect,
  };
}
