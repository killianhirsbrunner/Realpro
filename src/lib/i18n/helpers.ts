import { supabase } from '../supabase';
import { Locale, defaultLocale } from './config';

export async function resolveUserLocale(
  userId: string,
  projectId?: string | null
): Promise<Locale> {
  try {
    const { data, error } = await supabase
      .rpc('resolve_user_locale', {
        p_user_id: userId,
        p_project_id: projectId || null,
      });

    if (error) {
      console.error('Error resolving user locale:', error);
      return defaultLocale;
    }

    return (data as Locale) || defaultLocale;
  } catch (err) {
    console.error('Error calling resolve_user_locale:', err);
    return defaultLocale;
  }
}

export function mapToDatatransLang(locale: Locale): string {
  if (locale.startsWith('de')) return 'de';
  if (locale.startsWith('it')) return 'it';
  if (locale.startsWith('en')) return 'en';
  return 'fr';
}

export async function updateUserLocale(userId: string, locale: Locale): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ locale })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user locale:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error updating user locale:', err);
    return false;
  }
}

export async function updateOrganizationDefaultLang(
  organizationId: string,
  defaultLang: Locale
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('organizations')
      .update({ default_lang: defaultLang })
      .eq('id', organizationId);

    if (error) {
      console.error('Error updating organization default lang:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error updating organization default lang:', err);
    return false;
  }
}

export async function updateProjectLanguage(
  projectId: string,
  language: Locale | null
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .update({ language })
      .eq('id', projectId);

    if (error) {
      console.error('Error updating project language:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error updating project language:', err);
    return false;
  }
}

export interface CreateI18nNotificationParams {
  userId: string;
  type: string;
  i18nKey: string;
  i18nParams?: Record<string, any>;
  projectId?: string;
  linkUrl?: string;
}

export async function createI18nNotification(
  params: CreateI18nNotificationParams
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: params.userId,
        type: params.type,
        i18n_key: params.i18nKey,
        i18n_params: params.i18nParams || {},
        project_id: params.projectId,
        link_url: params.linkUrl,
        title: '',
        body: '',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating i18n notification:', error);
      return null;
    }

    return data?.id || null;
  } catch (err) {
    console.error('Error creating i18n notification:', err);
    return null;
  }
}
