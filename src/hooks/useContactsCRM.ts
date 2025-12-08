import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../contexts/OrganizationContext';

export interface Contact {
  id: string;
  organization_id: string;
  company_id?: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  position?: string;
  department?: string;
  address_street?: string;
  address_city?: string;
  address_postal_code?: string;
  address_canton?: string;
  address_country?: string;
  notes?: string;
  tags?: string[];
  linkedin_url?: string;
  preferred_language?: string;
  contact_type?: string;
  is_primary?: boolean;
  status?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactInteraction {
  id: string;
  organization_id: string;
  contact_id?: string;
  company_id?: string;
  project_id?: string;
  interaction_type: string;
  subject: string;
  description?: string;
  interaction_date: string;
  duration_minutes?: number;
  outcome?: string;
  next_action?: string;
  next_action_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactTag {
  id: string;
  organization_id: string;
  name: string;
  color: string;
  category: string;
  created_at: string;
}

export function useContactsCRM() {
  const { currentOrganization } = useOrganization();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (currentOrganization?.id) {
      fetchContacts();
    }
  }, [currentOrganization?.id]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('contacts')
        .select('*')
        .eq('organization_id', currentOrganization!.id)
        .order('last_name');

      if (fetchError) throw fetchError;
      setContacts(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (contact: Partial<Contact>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      const { data, error: insertError } = await supabase
        .from('contacts')
        .insert({
          ...contact,
          organization_id: currentOrganization!.id,
          created_by: user.user?.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setContacts([...contacts, data]);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .eq('organization_id', currentOrganization!.id)
        .select()
        .single();

      if (updateError) throw updateError;
      setContacts(contacts.map((c) => (c.id === id ? data : c)));
      return data;
    } catch (err) {
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)
        .eq('organization_id', currentOrganization!.id);

      if (deleteError) throw deleteError;
      setContacts(contacts.filter((c) => c.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const searchContacts = async (query: string) => {
    try {
      const { data, error: searchError } = await supabase
        .from('contacts')
        .select('*')
        .eq('organization_id', currentOrganization!.id)
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('last_name')
        .limit(10);

      if (searchError) throw searchError;
      return data || [];
    } catch (err) {
      return [];
    }
  };

  const createInteraction = async (interaction: Partial<ContactInteraction>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      const { data, error: insertError } = await supabase
        .from('contact_interactions')
        .insert({
          ...interaction,
          organization_id: currentOrganization!.id,
          created_by: user.user?.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    } catch (err) {
      throw err;
    }
  };

  const getContactInteractions = async (contactId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('contact_interactions')
        .select('*')
        .eq('organization_id', currentOrganization!.id)
        .eq('contact_id', contactId)
        .order('interaction_date', { ascending: false });

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      return [];
    }
  };

  const getTags = async (category = 'contact') => {
    try {
      const { data, error: fetchError } = await supabase
        .from('contact_tags')
        .select('*')
        .eq('organization_id', currentOrganization!.id)
        .eq('category', category)
        .order('name');

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      return [];
    }
  };

  const createTag = async (tag: Partial<ContactTag>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('contact_tags')
        .insert({
          ...tag,
          organization_id: currentOrganization!.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    } catch (err) {
      throw err;
    }
  };

  return {
    contacts,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    searchContacts,
    createInteraction,
    getContactInteractions,
    getTags,
    createTag,
    refetch: fetchContacts,
  };
}
