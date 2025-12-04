import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Buyer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  lot_number?: string;
  status: string;
  documents_complete?: boolean;
}

export function useBuyers(projectId: string | undefined) {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchBuyers() {
      try {
        setLoading(true);
        setError(null);

        const { data: salesContracts, error: contractsError } = await supabase
          .from('sales_contracts')
          .select(`
            id,
            lot_id,
            status,
            lots (
              number
            ),
            buyers:buyer_id (
              id,
              first_name,
              last_name,
              email,
              phone
            )
          `)
          .eq('project_id', projectId);

        if (contractsError) throw contractsError;

        const buyersData: Buyer[] = (salesContracts || [])
          .filter(contract => contract.buyers)
          .map(contract => ({
            id: contract.buyers.id,
            first_name: contract.buyers.first_name,
            last_name: contract.buyers.last_name,
            email: contract.buyers.email,
            phone: contract.buyers.phone,
            lot_number: contract.lots?.number,
            status: contract.status || 'PROSPECT',
            documents_complete: false
          }));

        setBuyers(buyersData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching buyers:', err);
        setError('Erreur lors du chargement des acheteurs');
        setLoading(false);
      }
    }

    fetchBuyers();
  }, [projectId]);

  return { buyers, loading, error };
}
