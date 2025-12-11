import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface OrganizationSettings {
  default_language: string;
  default_currency: string;
  vat_rate: number;
  date_format: string;
  number_format: string;
}

interface InitializationResult {
  success: boolean;
  organization_id: string;
  initialized_modules: string[];
  errors: string[];
}

const DEFAULT_SETTINGS: OrganizationSettings = {
  default_language: 'fr-CH',
  default_currency: 'CHF',
  vat_rate: 8.1,
  date_format: 'DD.MM.YYYY',
  number_format: 'fr-CH',
};

/**
 * Hook pour initialiser une nouvelle organisation avec les données de base
 * Crée la structure nécessaire pour que tous les modules fonctionnent correctement
 */
export function useInitializeOrganization() {
  const [initializing, setInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialise une organisation avec ses données de base
   */
  const initializeOrganization = useCallback(async (
    organizationId: string,
    userId: string,
    settings?: Partial<OrganizationSettings>
  ): Promise<InitializationResult> => {
    setInitializing(true);
    setError(null);

    const result: InitializationResult = {
      success: true,
      organization_id: organizationId,
      initialized_modules: [],
      errors: [],
    };

    const orgSettings = { ...DEFAULT_SETTINGS, ...settings };

    try {
      // 1. Mettre à jour les settings de l'organisation
      const { error: settingsError } = await supabase
        .from('organizations')
        .update({
          settings: {
            ...orgSettings,
            initialized_at: new Date().toISOString(),
          },
        })
        .eq('id', organizationId);

      if (settingsError) {
        result.errors.push(`Settings: ${settingsError.message}`);
      } else {
        result.initialized_modules.push('settings');
      }

      // 2. Assigner le rôle par défaut à l'utilisateur (promoteur)
      const { data: promoteurRole } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'promoteur')
        .single();

      if (promoteurRole) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            organization_id: organizationId,
            role_id: promoteurRole.id,
          }, {
            onConflict: 'user_id,organization_id,role_id',
          });

        if (roleError) {
          result.errors.push(`Role: ${roleError.message}`);
        } else {
          result.initialized_modules.push('user_role');
        }
      }

      // 3. Créer les tags de contact par défaut pour le CRM
      const defaultTags = [
        { name: 'VIP', color: '#FFD700', category: 'contact' },
        { name: 'Prospect Chaud', color: '#FF4500', category: 'contact' },
        { name: 'Prospect Froid', color: '#4169E1', category: 'contact' },
        { name: 'Client', color: '#32CD32', category: 'contact' },
        { name: 'Partenaire', color: '#9370DB', category: 'contact' },
      ];

      const { error: tagsError } = await supabase
        .from('contact_tags')
        .insert(defaultTags.map(tag => ({
          ...tag,
          organization_id: organizationId,
        })));

      if (tagsError && !tagsError.message.includes('duplicate')) {
        result.errors.push(`Tags: ${tagsError.message}`);
      } else {
        result.initialized_modules.push('contact_tags');
      }

      // 4. Créer les règles de scoring par défaut
      const defaultScoringRules = [
        {
          name: 'Budget élevé',
          description: 'Le prospect a un budget supérieur à 1M CHF',
          category: 'demographic',
          field_name: 'budget',
          operator: 'greater_than',
          value: '1000000',
          score_points: 25,
          is_active: true,
        },
        {
          name: 'Email professionnel',
          description: 'Le prospect utilise un email professionnel',
          category: 'firmographic',
          field_name: 'email',
          operator: 'not_contains',
          value: '@gmail.com',
          score_points: 10,
          is_active: true,
        },
        {
          name: 'Téléphone renseigné',
          description: 'Le prospect a fourni son numéro de téléphone',
          category: 'engagement',
          field_name: 'phone',
          operator: 'exists',
          value: '',
          score_points: 15,
          is_active: true,
        },
      ];

      const { error: scoringError } = await supabase
        .from('crm_lead_scoring_rules')
        .insert(defaultScoringRules.map(rule => ({
          ...rule,
          organization_id: organizationId,
        })));

      if (scoringError && !scoringError.message.includes('duplicate')) {
        result.errors.push(`Scoring: ${scoringError.message}`);
      } else {
        result.initialized_modules.push('lead_scoring');
      }

      // 5. Créer un log d'audit pour l'initialisation
      await supabase
        .from('audit_logs')
        .insert({
          organization_id: organizationId,
          user_id: userId,
          action_type: 'ORGANIZATION_INITIALIZED',
          entity_type: 'organization',
          entity_id: organizationId,
          old_values: null,
          new_values: { settings: orgSettings, modules: result.initialized_modules },
        });

      result.initialized_modules.push('audit_log');

      // Déterminer le succès global
      result.success = result.errors.length === 0;

    } catch (err: any) {
      console.error('Error initializing organization:', err);
      setError(err.message || 'Erreur lors de l\'initialisation');
      result.success = false;
      result.errors.push(err.message || 'Unknown error');
    } finally {
      setInitializing(false);
    }

    return result;
  }, []);

  /**
   * Réinitialise les données d'une organisation (supprime toutes les données)
   * ATTENTION: Opération destructive !
   */
  const resetOrganizationData = useCallback(async (
    organizationId: string,
    userId: string,
    confirmPhrase: string
  ): Promise<{ success: boolean; message: string }> => {
    if (confirmPhrase !== 'RESET_ALL_DATA') {
      return {
        success: false,
        message: 'Phrase de confirmation incorrecte',
      };
    }

    setInitializing(true);
    setError(null);

    try {
      // Supprimer les données dans l'ordre correct (relations)
      const tablesToReset = [
        'crm_activities',
        'crm_campaigns',
        'crm_segments',
        'crm_lead_scores',
        'crm_email_sends',
        'crm_email_templates',
        'prospects',
        'contacts',
        'contact_interactions',
        'documents',
        'message_threads',
        'messages',
        'notifications',
        'sav_tickets',
        'payments',
        'invoices',
        'reservations',
        'lots',
        'floors',
        'entrances',
        'buildings',
        'projects',
      ];

      for (const table of tablesToReset) {
        try {
          await supabase
            .from(table)
            .delete()
            .eq('organization_id', organizationId);
        } catch (err) {
          // Ignorer les erreurs pour les tables qui n'existent peut-être pas
          console.warn(`Could not reset table ${table}:`, err);
        }
      }

      // Log l'opération de reset
      await supabase
        .from('audit_logs')
        .insert({
          organization_id: organizationId,
          user_id: userId,
          action_type: 'ORGANIZATION_DATA_RESET',
          entity_type: 'organization',
          entity_id: organizationId,
          old_values: { tables_reset: tablesToReset },
          new_values: null,
        });

      return {
        success: true,
        message: 'Toutes les données ont été réinitialisées',
      };
    } catch (err: any) {
      console.error('Error resetting organization data:', err);
      setError(err.message);
      return {
        success: false,
        message: err.message || 'Erreur lors de la réinitialisation',
      };
    } finally {
      setInitializing(false);
    }
  }, []);

  /**
   * Vérifie si une organisation a été correctement initialisée
   */
  const checkOrganizationSetup = useCallback(async (
    organizationId: string
  ): Promise<{
    isComplete: boolean;
    missingModules: string[];
    recommendations: string[];
  }> => {
    const missingModules: string[] = [];
    const recommendations: string[] = [];

    try {
      // Vérifier les settings
      const { data: org } = await supabase
        .from('organizations')
        .select('settings')
        .eq('id', organizationId)
        .single();

      if (!org?.settings?.initialized_at) {
        missingModules.push('settings');
        recommendations.push('Initialisez les paramètres de l\'organisation');
      }

      // Vérifier s'il y a au moins un projet
      const { count: projectCount } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId);

      if (!projectCount || projectCount === 0) {
        recommendations.push('Créez votre premier projet pour commencer');
      }

      // Vérifier les tags CRM
      const { count: tagCount } = await supabase
        .from('contact_tags')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId);

      if (!tagCount || tagCount === 0) {
        missingModules.push('contact_tags');
        recommendations.push('Les tags de contact n\'ont pas été créés');
      }

      return {
        isComplete: missingModules.length === 0,
        missingModules,
        recommendations,
      };
    } catch (err) {
      console.error('Error checking organization setup:', err);
      return {
        isComplete: false,
        missingModules: ['unknown'],
        recommendations: ['Impossible de vérifier la configuration'],
      };
    }
  }, []);

  return {
    initializeOrganization,
    resetOrganizationData,
    checkOrganizationSetup,
    initializing,
    error,
  };
}
