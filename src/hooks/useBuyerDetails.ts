import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface BuyerDetails {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  status: string;
  lotId?: string;
  lotNumber?: string;
  saleType?: string;
  documents: Array<{
    id: string;
    name: string;
    provided: boolean;
    url?: string;
  }>;
  payments: Array<{
    id: string;
    label: string;
    amount: number;
    status: string;
    due_date?: string;
  }>;
  notary?: {
    name: string;
    email?: string;
  };
  notaryStatus?: string;
  notaryDocuments: Array<{
    id: string;
    name: string;
  }>;
  messages: Array<{
    id: string;
    author: string;
    content: string;
    created_at: string;
  }>;
  history: Array<{
    id: string;
    date: string;
    action: string;
  }>;
}

export function useBuyerDetails(projectId: string | undefined, buyerId: string | undefined) {
  const [buyer, setBuyer] = useState<BuyerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId || !buyerId) {
      setLoading(false);
      return;
    }

    async function fetchBuyerDetails() {
      try {
        setLoading(true);
        setError(null);

        // Fetch buyer with sales contract and lot info
        const { data: buyerData, error: buyerError } = await supabase
          .from('buyers')
          .select(`
            *,
            sales_contracts (
              id,
              status,
              sale_type,
              lots:lot_id (
                id,
                number,
                type
              )
            )
          `)
          .eq('id', buyerId)
          .maybeSingle();

        if (buyerError) throw buyerError;
        if (!buyerData) {
          setError('Acheteur non trouvé');
          setLoading(false);
          return;
        }

        // Fetch documents required
        const { data: documents } = await supabase
          .from('documents')
          .select('id, name, storage_path, status')
          .eq('buyer_id', buyerId)
          .order('created_at', { ascending: false });

        // Fetch payment schedules
        const { data: payments } = await supabase
          .from('payment_schedules')
          .select('id, description, amount, status, due_date')
          .eq('buyer_id', buyerId)
          .order('due_date', { ascending: true });

        // Fetch messages
        const { data: messages } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            sender:sender_id (
              first_name,
              last_name
            )
          `)
          .eq('buyer_id', buyerId)
          .order('created_at', { ascending: false })
          .limit(10);

        // Fetch audit log for history
        const { data: history } = await supabase
          .from('audit_logs')
          .select('id, created_at, action, details')
          .eq('resource_type', 'buyer')
          .eq('resource_id', buyerId)
          .order('created_at', { ascending: false })
          .limit(10);

        // Fetch notary documents
        const { data: notaryDocs } = await supabase
          .from('notary_files')
          .select('id, name, status')
          .eq('buyer_id', buyerId)
          .order('created_at', { ascending: false });

        // Build buyer details object
        const lotInfo = buyerData.sales_contracts?.[0]?.lots;
        const saleContract = buyerData.sales_contracts?.[0];

        const buyerDetails: BuyerDetails = {
          id: buyerData.id,
          first_name: buyerData.first_name,
          last_name: buyerData.last_name,
          name: `${buyerData.first_name} ${buyerData.last_name}`,
          email: buyerData.email,
          phone: buyerData.phone,
          address: buyerData.address,
          status: buyerData.status,
          lotId: lotInfo?.id,
          lotNumber: lotInfo?.number,
          saleType: saleContract?.sale_type,
          documents: (documents || []).map(doc => ({
            id: doc.id,
            name: doc.name,
            provided: doc.status === 'approved',
            url: doc.storage_path,
          })),
          payments: (payments || []).map(p => ({
            id: p.id,
            label: p.description,
            amount: p.amount,
            status: p.status,
            due_date: p.due_date,
          })),
          notary: undefined, // Would need notary relation
          notaryStatus: 'En attente',
          notaryDocuments: (notaryDocs || []).map(doc => ({
            id: doc.id,
            name: doc.name,
          })),
          messages: (messages || []).map(msg => ({
            id: msg.id,
            author: msg.sender ? `${msg.sender.first_name} ${msg.sender.last_name}` : 'Système',
            content: msg.content,
            created_at: msg.created_at,
          })),
          history: (history || []).map(h => ({
            id: h.id,
            date: new Date(h.created_at).toLocaleDateString('fr-CH'),
            action: h.action,
          })),
        };

        setBuyer(buyerDetails);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching buyer details:', err);
        setError('Erreur lors du chargement de l\'acheteur');
        setLoading(false);
      }
    }

    fetchBuyerDetails();
  }, [projectId, buyerId]);

  return { buyer, loading, error };
}
