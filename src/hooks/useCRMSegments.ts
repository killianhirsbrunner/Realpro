import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { useOrganizationContext } from '../contexts/OrganizationContext';

export interface CRMSegment {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  type: 'static' | 'dynamic';
  entity_type: 'prospects' | 'contacts' | 'buyers';
  filter_criteria: any;
  member_count: number;
  last_calculated_at?: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export function useCRMSegments() {
  const { currentOrganization } = useOrganizationContext();
  const [segments, setSegments] = useState<CRMSegment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSegments = useCallback(async () => {
    if (!currentOrganization) {
      setSegments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crm_segments')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSegments(data || []);
    } catch (error) {
      console.error('Error fetching segments:', error);
      toast.error('Erreur lors du chargement des segments');
    } finally {
      setLoading(false);
    }
  }, [currentOrganization]);

  useEffect(() => {
    fetchSegments();
  }, [fetchSegments]);

  const createSegment = async (segmentData: Partial<CRMSegment>) => {
    try {
      const { data, error } = await supabase
        .from('crm_segments')
        .insert([segmentData])
        .select()
        .single();

      if (error) throw error;

      setSegments((prev) => [data, ...prev]);
      toast.success('Segment créé avec succès');
      return data;
    } catch (error) {
      console.error('Error creating segment:', error);
      toast.error('Erreur lors de la création du segment');
      throw error;
    }
  };

  const updateSegment = async (id: string, updates: Partial<CRMSegment>) => {
    try {
      const { data, error } = await supabase
        .from('crm_segments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSegments((prev) =>
        prev.map((segment) => (segment.id === id ? data : segment))
      );
      toast.success('Segment mis à jour');
      return data;
    } catch (error) {
      console.error('Error updating segment:', error);
      toast.error('Erreur lors de la mise à jour');
      throw error;
    }
  };

  const deleteSegment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crm_segments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSegments((prev) => prev.filter((segment) => segment.id !== id));
      toast.success('Segment supprimé');
    } catch (error) {
      console.error('Error deleting segment:', error);
      toast.error('Erreur lors de la suppression');
      throw error;
    }
  };

  const getSegmentMembers = async (segmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('crm_segment_members')
        .select('*')
        .eq('segment_id', segmentId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching segment members:', error);
      toast.error('Erreur lors du chargement des membres');
      return [];
    }
  };

  const addMemberToSegment = async (
    segmentId: string,
    memberId: string,
    memberType: 'prospect' | 'contact' | 'buyer'
  ) => {
    try {
      const memberData: any = { segment_id: segmentId };

      switch (memberType) {
        case 'prospect':
          memberData.prospect_id = memberId;
          break;
        case 'contact':
          memberData.contact_id = memberId;
          break;
        case 'buyer':
          memberData.buyer_id = memberId;
          break;
      }

      const { data, error } = await supabase
        .from('crm_segment_members')
        .insert([memberData])
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le compteur
      await supabase.rpc('increment_segment_count', { segment_id: segmentId });

      toast.success('Membre ajouté au segment');
      return data;
    } catch (error) {
      console.error('Error adding member to segment:', error);
      toast.error('Erreur lors de l\'ajout');
      throw error;
    }
  };

  const removeMemberFromSegment = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('crm_segment_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Membre retiré du segment');
    } catch (error) {
      console.error('Error removing member from segment:', error);
      toast.error('Erreur lors du retrait');
      throw error;
    }
  };

  const calculateSegment = async (segmentId: string) => {
    try {
      const segment = segments.find((s) => s.id === segmentId);
      if (!segment) {
        throw new Error('Segment non trouvé');
      }

      // Pour les segments dynamiques, recalculer les membres
      if (segment.type === 'dynamic') {
        // Appeler une edge function pour recalculer
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/crm-segments/calculate`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ segmentId }),
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors du calcul du segment');
        }

        const result = await response.json();

        // Mettre à jour le segment
        await updateSegment(segmentId, {
          member_count: result.memberCount,
          last_calculated_at: new Date().toISOString(),
        });

        toast.success(`Segment recalculé: ${result.memberCount} membres`);
        return result;
      }
    } catch (error) {
      console.error('Error calculating segment:', error);
      toast.error('Erreur lors du calcul');
      throw error;
    }
  };

  return {
    segments,
    loading,
    createSegment,
    updateSegment,
    deleteSegment,
    getSegmentMembers,
    addMemberToSegment,
    removeMemberFromSegment,
    calculateSegment,
    refetch: fetchSegments,
  };
}
