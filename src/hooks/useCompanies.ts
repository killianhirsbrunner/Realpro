import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';

export interface Company {
  id: string;
  organization_id: string;
  name: string;
  type?: 'EG' | 'NOTARY' | 'BROKER' | 'ARCHITECT' | 'ENGINEER' | 'SUPPLIER' | 'OTHER';
  legal_form?: string;
  registration_number?: string;
  vat_number?: string;
  ide_number?: string;
  trade_register_number?: string;
  industry?: string;
  address?: string;
  address_street?: string;
  address_city?: string;
  address_postal_code?: string;
  address_canton?: string;
  address_country?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  notes?: string;
  tags?: string[];
  is_client?: boolean;
  is_supplier?: boolean;
  is_partner?: boolean;
  status?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export function useCompanies() {
  const { currentOrganization } = useOrganization();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (currentOrganization?.id) {
      fetchCompanies();
    }
  }, [currentOrganization?.id]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('companies')
        .select('*')
        .eq('organization_id', currentOrganization!.id)
        .order('name');

      if (fetchError) throw fetchError;
      setCompanies(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (company: Partial<Company>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      const { data, error: insertError } = await supabase
        .from('companies')
        .insert({
          ...company,
          organization_id: currentOrganization!.id,
          created_by: user.user?.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setCompanies([...companies, data]);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .eq('organization_id', currentOrganization!.id)
        .select()
        .single();

      if (updateError) throw updateError;
      setCompanies(companies.map((c) => (c.id === id ? data : c)));
      return data;
    } catch (err) {
      throw err;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)
        .eq('organization_id', currentOrganization!.id);

      if (deleteError) throw deleteError;
      setCompanies(companies.filter((c) => c.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const searchCompanies = async (query: string) => {
    try {
      const { data, error: searchError } = await supabase
        .from('companies')
        .select('*')
        .eq('organization_id', currentOrganization!.id)
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('name')
        .limit(10);

      if (searchError) throw searchError;
      return data || [];
    } catch (err) {
      return [];
    }
  };

  return {
    companies,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    searchCompanies,
    refetch: fetchCompanies,
  };
}
