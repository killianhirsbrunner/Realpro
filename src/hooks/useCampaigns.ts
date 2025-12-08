import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface Campaign {
  id: string;
  organization_id: string;
  project_id?: string;
  name: string;
  description?: string;
  type: 'email' | 'sms' | 'multi_channel' | 'social' | 'event';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  target_segment_id?: string;
  budget?: number;
  actual_cost?: number;
  goal_type?: string;
  goal_value?: number;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  converted_count: number;
  bounced_count: number;
  unsubscribed_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export function useCampaigns(projectId?: string) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('crm_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Erreur lors du chargement des campagnes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [projectId]);

  const createCampaign = async (campaignData: Partial<Campaign>) => {
    try {
      const { data, error } = await supabase
        .from('crm_campaigns')
        .insert([campaignData])
        .select()
        .single();

      if (error) throw error;

      setCampaigns((prev) => [data, ...prev]);
      toast.success('Campagne créée avec succès');
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Erreur lors de la création de la campagne');
      throw error;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    try {
      const { data, error } = await supabase
        .from('crm_campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCampaigns((prev) =>
        prev.map((campaign) => (campaign.id === id ? data : campaign))
      );
      toast.success('Campagne mise à jour');
      return data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast.error('Erreur lors de la mise à jour');
      throw error;
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crm_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
      toast.success('Campagne supprimée');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Erreur lors de la suppression');
      throw error;
    }
  };

  const launchCampaign = async (id: string) => {
    try {
      const { data, error} = await supabase
        .from('crm_campaigns')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCampaigns((prev) =>
        prev.map((campaign) => (campaign.id === id ? data : campaign))
      );
      toast.success('Campagne lancée');
      return data;
    } catch (error) {
      console.error('Error launching campaign:', error);
      toast.error('Erreur lors du lancement');
      throw error;
    }
  };

  const pauseCampaign = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('crm_campaigns')
        .update({ status: 'paused' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCampaigns((prev) =>
        prev.map((campaign) => (campaign.id === id ? data : campaign))
      );
      toast.success('Campagne mise en pause');
      return data;
    } catch (error) {
      console.error('Error pausing campaign:', error);
      toast.error('Erreur lors de la pause');
      throw error;
    }
  };

  return {
    campaigns,
    loading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    launchCampaign,
    pauseCampaign,
    refetch: fetchCampaigns,
  };
}
