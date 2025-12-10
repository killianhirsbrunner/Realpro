import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useOrganization } from './useOrganization';

interface LocalizationSettings {
  id?: string;
  language: string;
  country: string;
  canton: string;
  currency: string;
  vat_rate: number;
  date_format: string;
  number_format: string;
  time_zone: string;
  invoice_format: string;
}

interface BrandingSettings {
  id?: string;
  logo_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  accent_color: string;
  secondary_color: string | null;
  font_family: string | null;
  show_logo_on_documents: boolean;
  show_logo_in_emails: boolean;
  document_header_color: string;
  document_footer_text: string | null;
  email_signature_html: string | null;
  email_footer_text: string | null;
  custom_domain: string | null;
  terms_url: string | null;
  privacy_url: string | null;
  support_email: string | null;
  support_phone: string | null;
}

interface SecuritySettings {
  id?: string;
  enforce_2fa: boolean;
  session_timeout_minutes: number;
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_number: boolean;
  password_require_special: boolean;
  max_login_attempts: number;
  lockout_duration_minutes: number;
  ip_whitelist: string[];
  allowed_domains: string[];
  audit_retention_days: number;
}

interface Supplier {
  id: string;
  organization_id: string;
  name: string;
  category: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  canton: string | null;
  postal_code: string | null;
  country: string;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  notes: string | null;
  status: 'active' | 'inactive' | 'pending';
  appointments_enabled: boolean;
  appointment_duration_minutes: number;
  working_hours: Record<string, { start: string; end: string }>;
  rating: number | null;
  total_orders: number;
  created_at: string;
  updated_at: string;
}

interface DocumentTemplate {
  id: string;
  organization_id: string;
  name: string;
  template_type: string;
  config: Record<string, unknown>;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

const defaultLocalization: LocalizationSettings = {
  language: 'fr',
  country: 'CH',
  canton: '',
  currency: 'CHF',
  vat_rate: 7.7,
  date_format: 'DD.MM.YYYY',
  number_format: 'apostrophe',
  time_zone: 'Europe/Zurich',
  invoice_format: 'qr-bill'
};

const defaultBranding: BrandingSettings = {
  logo_url: null,
  logo_dark_url: null,
  favicon_url: null,
  primary_color: '#0891b2',
  accent_color: '#0e7490',
  secondary_color: null,
  font_family: null,
  show_logo_on_documents: true,
  show_logo_in_emails: true,
  document_header_color: '#0891b2',
  document_footer_text: null,
  email_signature_html: null,
  email_footer_text: null,
  custom_domain: null,
  terms_url: null,
  privacy_url: null,
  support_email: null,
  support_phone: null
};

const defaultSecurity: SecuritySettings = {
  enforce_2fa: false,
  session_timeout_minutes: 480,
  password_min_length: 12,
  password_require_uppercase: true,
  password_require_number: true,
  password_require_special: true,
  max_login_attempts: 5,
  lockout_duration_minutes: 15,
  ip_whitelist: [],
  allowed_domains: [],
  audit_retention_days: 365
};

export function useLocalizationSettings() {
  const { organization } = useOrganization();
  const [settings, setSettings] = useState<LocalizationSettings>(defaultLocalization);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organization_settings')
        .select('*')
        .eq('organization_id', organization.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          id: data.id,
          language: data.default_language || 'fr',
          country: 'CH',
          canton: '',
          currency: data.default_currency || 'CHF',
          vat_rate: 7.7,
          date_format: 'DD.MM.YYYY',
          number_format: 'apostrophe',
          time_zone: data.default_timezone || 'Europe/Zurich',
          invoice_format: 'qr-bill'
        });
      }
    } catch (err) {
      console.error('Error fetching localization settings:', err);
      setError('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  }, [organization?.id]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (newSettings: Partial<LocalizationSettings>) => {
    if (!organization?.id) return;

    try {
      setSaving(true);
      setError(null);

      const updateData = {
        default_language: newSettings.language || settings.language,
        default_currency: newSettings.currency || settings.currency,
        default_timezone: newSettings.time_zone || settings.time_zone,
        metadata: {
          country: newSettings.country || settings.country,
          canton: newSettings.canton || settings.canton,
          vat_rate: newSettings.vat_rate || settings.vat_rate,
          date_format: newSettings.date_format || settings.date_format,
          number_format: newSettings.number_format || settings.number_format,
          invoice_format: newSettings.invoice_format || settings.invoice_format
        }
      };

      const { error } = await supabase
        .from('organization_settings')
        .upsert({
          organization_id: organization.id,
          ...updateData
        }, { onConflict: 'organization_id' });

      if (error) throw error;

      setSettings({ ...settings, ...newSettings });
      return true;
    } catch (err) {
      console.error('Error saving localization settings:', err);
      setError('Erreur lors de la sauvegarde');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { settings, setSettings, loading, saving, error, saveSettings, refetch: fetchSettings };
}

export function useBrandingSettings() {
  const { organization } = useOrganization();
  const [settings, setSettings] = useState<BrandingSettings>(defaultBranding);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organization_branding')
        .select('*')
        .eq('organization_id', organization.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          id: data.id,
          logo_url: data.logo_url,
          logo_dark_url: null,
          favicon_url: null,
          primary_color: data.primary_color || '#0891b2',
          accent_color: data.accent_color || '#0e7490',
          secondary_color: data.secondary_color,
          font_family: data.font_family,
          show_logo_on_documents: true,
          show_logo_in_emails: true,
          document_header_color: data.primary_color || '#0891b2',
          document_footer_text: null,
          email_signature_html: null,
          email_footer_text: data.email_footer_text,
          custom_domain: data.custom_domain,
          terms_url: data.terms_url,
          privacy_url: data.privacy_url,
          support_email: data.support_email,
          support_phone: data.support_phone
        });
      }
    } catch (err) {
      console.error('Error fetching branding settings:', err);
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [organization?.id]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (newSettings: Partial<BrandingSettings>) => {
    if (!organization?.id) return;

    try {
      setSaving(true);
      setError(null);

      const { error } = await supabase
        .from('organization_branding')
        .upsert({
          organization_id: organization.id,
          logo_url: newSettings.logo_url ?? settings.logo_url,
          primary_color: newSettings.primary_color ?? settings.primary_color,
          accent_color: newSettings.accent_color ?? settings.accent_color,
          secondary_color: newSettings.secondary_color ?? settings.secondary_color,
          font_family: newSettings.font_family ?? settings.font_family,
          email_footer_text: newSettings.email_footer_text ?? settings.email_footer_text,
          custom_domain: newSettings.custom_domain ?? settings.custom_domain,
          terms_url: newSettings.terms_url ?? settings.terms_url,
          privacy_url: newSettings.privacy_url ?? settings.privacy_url,
          support_email: newSettings.support_email ?? settings.support_email,
          support_phone: newSettings.support_phone ?? settings.support_phone
        }, { onConflict: 'organization_id' });

      if (error) throw error;

      setSettings({ ...settings, ...newSettings });
      return true;
    } catch (err) {
      console.error('Error saving branding settings:', err);
      setError('Erreur lors de la sauvegarde');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (file: File) => {
    if (!organization?.id) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${organization.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('organization-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('organization-assets')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error uploading logo:', err);
      return null;
    }
  };

  return { settings, setSettings, loading, saving, error, saveSettings, uploadLogo, refetch: fetchSettings };
}

export function useSecuritySettings() {
  const { organization } = useOrganization();
  const [settings, setSettings] = useState<SecuritySettings>(defaultSecurity);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organization_settings')
        .select('*')
        .eq('organization_id', organization.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          ...defaultSecurity,
          enforce_2fa: data.enable_two_factor_auth || false,
          session_timeout_minutes: data.session_timeout_minutes || 480
        });
      }
    } catch (err) {
      console.error('Error fetching security settings:', err);
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [organization?.id]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (newSettings: Partial<SecuritySettings>) => {
    if (!organization?.id) return;

    try {
      setSaving(true);
      setError(null);

      const { error } = await supabase
        .from('organization_settings')
        .upsert({
          organization_id: organization.id,
          enable_two_factor_auth: newSettings.enforce_2fa ?? settings.enforce_2fa,
          session_timeout_minutes: newSettings.session_timeout_minutes ?? settings.session_timeout_minutes
        }, { onConflict: 'organization_id' });

      if (error) throw error;

      setSettings({ ...settings, ...newSettings });
      return true;
    } catch (err) {
      console.error('Error saving security settings:', err);
      setError('Erreur lors de la sauvegarde');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { settings, setSettings, loading, saving, error, saveSettings, refetch: fetchSettings };
}

export function useSuppliersSettings() {
  const { organization } = useOrganization();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('supplier_showrooms')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (error) throw error;

      const mapped: Supplier[] = (data || []).map(s => ({
        id: s.id,
        organization_id: s.organization_id,
        name: s.name,
        category: (s.categories || [])[0] || 'other',
        email: s.contact_email,
        phone: s.contact_phone,
        address: s.address,
        city: s.city,
        canton: '',
        postal_code: s.postal_code || s.zip,
        country: s.country || 'CH',
        contact_person: null,
        contact_email: s.contact_email,
        contact_phone: s.contact_phone,
        website: null,
        notes: s.notes,
        status: s.is_active ? 'active' : 'inactive',
        appointments_enabled: true,
        appointment_duration_minutes: 60,
        working_hours: {},
        rating: null,
        total_orders: 0,
        created_at: s.created_at,
        updated_at: s.updated_at
      }));

      setSuppliers(mapped);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [organization?.id]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const createSupplier = async (supplier: Omit<Supplier, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
    if (!organization?.id) return null;

    try {
      setSaving(true);
      setError(null);

      const { data, error } = await supabase
        .from('supplier_showrooms')
        .insert({
          organization_id: organization.id,
          name: supplier.name,
          categories: [supplier.category?.toUpperCase()].filter(Boolean),
          contact_email: supplier.email,
          contact_phone: supplier.phone,
          address: supplier.address,
          city: supplier.city,
          postal_code: supplier.postal_code,
          country: supplier.country || 'CH',
          notes: supplier.notes,
          is_active: supplier.status === 'active'
        })
        .select()
        .single();

      if (error) throw error;

      await fetchSuppliers();
      return data;
    } catch (err) {
      console.error('Error creating supplier:', err);
      setError('Erreur lors de la creation');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    try {
      setSaving(true);
      setError(null);

      const { error } = await supabase
        .from('supplier_showrooms')
        .update({
          name: updates.name,
          categories: updates.category ? [updates.category.toUpperCase()] : undefined,
          contact_email: updates.email,
          contact_phone: updates.phone,
          address: updates.address,
          city: updates.city,
          postal_code: updates.postal_code,
          notes: updates.notes,
          is_active: updates.status === 'active'
        })
        .eq('id', id);

      if (error) throw error;

      await fetchSuppliers();
      return true;
    } catch (err) {
      console.error('Error updating supplier:', err);
      setError('Erreur lors de la mise a jour');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      setSaving(true);
      setError(null);

      const { error } = await supabase
        .from('supplier_showrooms')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuppliers(suppliers.filter(s => s.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting supplier:', err);
      setError('Erreur lors de la suppression');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    suppliers,
    loading,
    saving,
    error,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refetch: fetchSuppliers
  };
}

export function useDocumentTemplates() {
  const { organization } = useOrganization();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('organization_id', organization.id)
        .order('template_type', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [organization?.id]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const createTemplate = async (template: Omit<DocumentTemplate, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
    if (!organization?.id) return null;

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('document_templates')
        .insert({
          organization_id: organization.id,
          ...template
        })
        .select()
        .single();

      if (error) throw error;
      await fetchTemplates();
      return data;
    } catch (err) {
      console.error('Error creating template:', err);
      setError('Erreur lors de la creation');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateTemplate = async (id: string, updates: Partial<DocumentTemplate>) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('document_templates')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchTemplates();
      return true;
    } catch (err) {
      console.error('Error updating template:', err);
      setError('Erreur lors de la mise a jour');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('document_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTemplates(templates.filter(t => t.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting template:', err);
      setError('Erreur lors de la suppression');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { templates, loading, saving, error, createTemplate, updateTemplate, deleteTemplate, refetch: fetchTemplates };
}

export function useUserSessions() {
  const [sessions, setSessions] = useState<Array<{
    id: string;
    device_info: string;
    ip_address: string;
    location: string;
    is_current: boolean;
    last_activity_at: string;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_activity_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const revokeSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      setSessions(sessions.filter(s => s.id !== sessionId));
      return true;
    } catch (err) {
      console.error('Error revoking session:', err);
      return false;
    }
  };

  return { sessions, loading, revokeSession, refetch: fetchSessions };
}

export function useAuditLogs() {
  const { organization } = useOrganization();
  const [logs, setLogs] = useState<Array<{
    id: string;
    action: string;
    entity_type: string;
    description: string;
    user_id: string;
    created_at: string;
    metadata: Record<string, unknown>;
  }>>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async (limit = 50) => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  }, [organization?.id]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, refetch: fetchLogs };
}
