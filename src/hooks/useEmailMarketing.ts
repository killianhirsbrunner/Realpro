import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface EmailTemplate {
  id: string;
  organization_id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  category?: string;
  thumbnail_url?: string;
  variables: string[];
  is_active: boolean;
  usage_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailSend {
  id: string;
  organization_id: string;
  campaign_id?: string;
  template_id?: string;
  contact_id?: string;
  prospect_id?: string;
  to_email: string;
  from_email: string;
  subject: string;
  html_content: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  first_clicked_at?: string;
  bounced_at?: string;
  open_count: number;
  click_count: number;
  bounce_type?: string;
  bounce_reason?: string;
  tracking_id?: string;
  metadata: any;
  created_at: string;
}

export function useEmailMarketing() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [sends, setSends] = useState<EmailSend[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crm_email_templates')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Erreur lors du chargement des templates');
    } finally {
      setLoading(false);
    }
  };

  const fetchSends = async (campaignId?: string) => {
    try {
      let query = supabase
        .from('crm_email_sends')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSends(data || []);
    } catch (error) {
      console.error('Error fetching sends:', error);
      toast.error('Erreur lors du chargement des envois');
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const createTemplate = async (templateData: Partial<EmailTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('crm_email_templates')
        .insert([{
          ...templateData,
          is_active: true,
          usage_count: 0,
        }])
        .select()
        .single();

      if (error) throw error;

      setTemplates((prev) => [data, ...prev]);
      toast.success('Template créé avec succès');
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Erreur lors de la création du template');
      throw error;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<EmailTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('crm_email_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTemplates((prev) =>
        prev.map((template) => (template.id === id ? data : template))
      );
      toast.success('Template mis à jour');
      return data;
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Erreur lors de la mise à jour');
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crm_email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTemplates((prev) => prev.filter((template) => template.id !== id));
      toast.success('Template supprimé');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erreur lors de la suppression');
      throw error;
    }
  };

  const sendEmail = async (emailData: {
    templateId: string;
    to: string;
    variables?: Record<string, string>;
    campaignId?: string;
    contactId?: string;
    prospectId?: string;
  }) => {
    try {
      const template = templates.find((t) => t.id === emailData.templateId);
      if (!template) {
        throw new Error('Template non trouvé');
      }

      // Remplacer les variables dans le template
      let htmlContent = template.html_content;
      let subject = template.subject;

      if (emailData.variables) {
        Object.entries(emailData.variables).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          htmlContent = htmlContent.replace(regex, value);
          subject = subject.replace(regex, value);
        });
      }

      // Appeler l'edge function pour envoyer l'email
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/email-marketing/send`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: emailData.to,
            subject,
            html_content: htmlContent,
            template_id: emailData.templateId,
            campaign_id: emailData.campaignId,
            contact_id: emailData.contactId,
            prospect_id: emailData.prospectId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }

      const result = await response.json();

      toast.success('Email envoyé avec succès');
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Erreur lors de l\'envoi');
      throw error;
    }
  };

  const sendBulkEmails = async (emailsData: {
    templateId: string;
    recipients: Array<{
      email: string;
      variables?: Record<string, string>;
      contactId?: string;
      prospectId?: string;
    }>;
    campaignId?: string;
  }) => {
    try {
      const template = templates.find((t) => t.id === emailsData.templateId);
      if (!template) {
        throw new Error('Template non trouvé');
      }

      // Appeler l'edge function pour envoi en masse
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/email-marketing/send-bulk`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailsData),
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi en masse');
      }

      const result = await response.json();

      toast.success(`${result.sent} emails envoyés avec succès`);
      return result;
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      toast.error('Erreur lors de l\'envoi en masse');
      throw error;
    }
  };

  const getEmailStats = async (emailSendId: string) => {
    try {
      const { data, error } = await supabase
        .from('crm_email_sends')
        .select('*')
        .eq('id', emailSendId)
        .single();

      if (error) throw error;

      // Récupérer les clics
      const { data: clicks, error: clicksError } = await supabase
        .from('crm_email_clicks')
        .select('*')
        .eq('email_send_id', emailSendId);

      if (clicksError) throw clicksError;

      return {
        ...data,
        clicks: clicks || [],
      };
    } catch (error) {
      console.error('Error fetching email stats:', error);
      throw error;
    }
  };

  return {
    templates,
    sends,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    sendEmail,
    sendBulkEmails,
    getEmailStats,
    fetchSends,
    refetchTemplates: fetchTemplates,
  };
}
