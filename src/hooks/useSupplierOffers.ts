import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SupplierOffer {
  id: string;
  project_id: string;
  lot_number: string;
  supplier_name: string;
  supplier_email?: string | null;
  price?: number | null;
  description?: string | null;
  notes?: string | null;
  status: string;
  version: number;
  client_approved_at?: string | null;
  architect_approved_at?: string | null;
  finalized_at?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export function useSupplierOffers(projectId?: string) {
  const [offers, setOffers] = useState<SupplierOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    fetchOffers();
  }, [projectId]);

  async function fetchOffers() {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('supplier_offers')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setOffers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { offers, loading, error, refetch: fetchOffers };
}

export function useSupplierOfferDetail(offerId?: string) {
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!offerId) return;

    fetchOffer();
  }, [offerId]);

  async function fetchOffer() {
    try {
      setLoading(true);

      const { data: offerData, error: offerError } = await supabase
        .from('supplier_offers')
        .select('*')
        .eq('id', offerId)
        .single();

      if (offerError) throw offerError;

      const { data: commentsData } = await supabase
        .from('supplier_offer_comments')
        .select('*')
        .eq('offer_id', offerId)
        .order('created_at', { ascending: true });

      setOffer({
        ...offerData,
        comments: commentsData || [],
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { offer, loading, error, refetch: fetchOffer };
}
