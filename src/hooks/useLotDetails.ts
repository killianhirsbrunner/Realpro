import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface LotDetails {
  id: string;
  number: string;
  type: string;
  rooms: number;
  floor: number;
  building?: string;
  status: string;
  surface: number;
  surface_living?: number;
  surface_balcony?: number;
  price_vat?: number;
  sale_type?: string;
  cave?: string;
  parkings?: string[];
  buyer?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  documents?: Array<{
    id: string;
    name: string;
    url?: string;
  }>;
  plans?: Array<{
    id: string;
    name: string;
    url?: string;
  }>;
  history?: Array<{
    id: string;
    date: string;
    action: string;
  }>;
  materials?: Array<{
    id: string;
    category: string;
    choice: string;
  }>;
}

export function useLotDetails(projectId: string | undefined, lotId: string | undefined) {
  const [lot, setLot] = useState<LotDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId || !lotId) {
      setLoading(false);
      return;
    }

    async function fetchLotDetails() {
      try {
        setLoading(true);
        setError(null);

        // Fetch lot with sales contract and buyer info
        const { data: lotData, error: lotError } = await supabase
          .from('lots')
          .select(`
            *,
            sales_contracts (
              id,
              status,
              buyers:buyer_id (
                id,
                first_name,
                last_name,
                email,
                phone
              )
            )
          `)
          .eq('id', lotId)
          .eq('project_id', projectId)
          .maybeSingle();

        if (lotError) throw lotError;
        if (!lotData) {
          setError('Lot non trouvé');
          setLoading(false);
          return;
        }

        // Fetch documents
        const { data: documents } = await supabase
          .from('documents')
          .select('id, name, storage_path')
          .eq('lot_id', lotId)
          .order('created_at', { ascending: false });

        // Fetch material choices
        const { data: materials } = await supabase
          .from('material_choices')
          .select('id, category, choice_label, status')
          .eq('lot_id', lotId)
          .eq('status', 'confirmed')
          .order('created_at', { ascending: false });

        // Fetch audit log for history
        const { data: history } = await supabase
          .from('audit_logs')
          .select('id, created_at, action, details')
          .eq('resource_type', 'lot')
          .eq('resource_id', lotId)
          .order('created_at', { ascending: false })
          .limit(10);

        // Build lot details object
        const buyerInfo = lotData.sales_contracts?.[0]?.buyers
          ? {
              id: lotData.sales_contracts[0].buyers.id,
              name: `${lotData.sales_contracts[0].buyers.first_name} ${lotData.sales_contracts[0].buyers.last_name}`,
              email: lotData.sales_contracts[0].buyers.email,
              phone: lotData.sales_contracts[0].buyers.phone,
            }
          : undefined;

        const lotDetails: LotDetails = {
          id: lotData.id,
          number: lotData.number,
          type: lotData.type,
          rooms: lotData.rooms || 0,
          floor: lotData.floor || 0,
          building: lotData.building,
          status: lotData.status,
          surface: lotData.surface,
          surface_living: lotData.surface_living,
          surface_balcony: lotData.surface_balcony,
          price_vat: lotData.price_vat,
          sale_type: lotData.sale_type,
          cave: lotData.cave,
          parkings: lotData.parkings,
          buyer: buyerInfo,
          documents: (documents || []).map(doc => ({
            id: doc.id,
            name: doc.name,
            url: doc.storage_path,
          })),
          plans: [], // Plans would be filtered from documents by type
          history: (history || []).map(h => ({
            id: h.id,
            date: new Date(h.created_at).toLocaleDateString('fr-CH'),
            action: h.action,
          })),
          materials: (materials || []).map(m => ({
            id: m.id,
            category: m.category,
            choice: m.choice_label,
          })),
        };

        setLot(lotDetails);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching lot details:', err);
        setError('Erreur lors du chargement du lot');
        setLoading(false);
      }
    }

    fetchLotDetails();
  }, [projectId, lotId]);

  return { lot, loading, error };
}
