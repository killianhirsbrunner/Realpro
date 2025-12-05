import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey, x-user-locale',
};

const translations: Record<string, Record<string, any>> = {
  'fr-CH': {
    errors: {
      LOT_NOT_FOUND: 'Lot introuvable',
      PROJECT_NOT_FOUND: 'Projet introuvable',
      UNAUTHORIZED: 'Accès non autorisé',
      FORBIDDEN: 'Action interdite',
      VALIDATION_ERROR: 'Erreur de validation',
      GENERIC_ERROR: 'Une erreur est survenue',
    },
    common: {
      HELLO: 'Bonjour',
      YES: 'Oui',
      NO: 'Non',
      SAVE: 'Enregistrer',
      CANCEL: 'Annuler',
    },
  },
  'de-CH': {
    errors: {
      LOT_NOT_FOUND: 'Los nicht gefunden',
      PROJECT_NOT_FOUND: 'Projekt nicht gefunden',
      UNAUTHORIZED: 'Zugriff nicht autorisiert',
      FORBIDDEN: 'Aktion verboten',
      VALIDATION_ERROR: 'Validierungsfehler',
      GENERIC_ERROR: 'Ein Fehler ist aufgetreten',
    },
    common: {
      HELLO: 'Hallo',
      YES: 'Ja',
      NO: 'Nein',
      SAVE: 'Speichern',
      CANCEL: 'Abbrechen',
    },
  },
  'it-CH': {
    errors: {
      LOT_NOT_FOUND: 'Lotto non trovato',
      PROJECT_NOT_FOUND: 'Progetto non trovato',
      UNAUTHORIZED: 'Accesso non autorizzato',
      FORBIDDEN: 'Azione vietata',
      VALIDATION_ERROR: 'Errore di convalida',
      GENERIC_ERROR: 'Si è verificato un errore',
    },
    common: {
      HELLO: 'Ciao',
      YES: 'Sì',
      NO: 'No',
      SAVE: 'Salva',
      CANCEL: 'Annulla',
    },
  },
  'en-GB': {
    errors: {
      LOT_NOT_FOUND: 'Lot not found',
      PROJECT_NOT_FOUND: 'Project not found',
      UNAUTHORIZED: 'Unauthorized access',
      FORBIDDEN: 'Action forbidden',
      VALIDATION_ERROR: 'Validation error',
      GENERIC_ERROR: 'An error occurred',
    },
    common: {
      HELLO: 'Hello',
      YES: 'Yes',
      NO: 'No',
      SAVE: 'Save',
      CANCEL: 'Cancel',
    },
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const method = req.method;

    if (method === 'GET' && url.pathname.endsWith('/resolve')) {
      const userId = url.searchParams.get('userId');
      const projectId = url.searchParams.get('projectId');

      if (!userId) {
        return jsonResponse({ error: 'userId required' }, 400);
      }

      const locale = await resolveLocale(supabase, userId, projectId);
      return jsonResponse({ locale });
    }

    if (method === 'GET' && url.pathname.endsWith('/translate')) {
      const key = url.searchParams.get('key');
      const locale = url.searchParams.get('locale') || 'fr-CH';

      if (!key) {
        return jsonResponse({ error: 'key required' }, 400);
      }

      const translation = translate(key, locale);
      return jsonResponse({ translation, locale });
    }

    if (method === 'PUT' && url.pathname.endsWith('/user')) {
      const body = await req.json();
      const { userId, locale } = body;

      if (!userId || !locale) {
        return jsonResponse({ error: 'userId and locale required' }, 400);
      }

      const { error } = await supabase
        .from('users')
        .update({ locale })
        .eq('id', userId);

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ success: true, locale });
    }

    if (method === 'PUT' && url.pathname.endsWith('/organization')) {
      const body = await req.json();
      const { organizationId, defaultLang } = body;

      if (!organizationId || !defaultLang) {
        return jsonResponse({ error: 'organizationId and defaultLang required' }, 400);
      }

      const { error } = await supabase
        .from('organizations')
        .update({ default_lang: defaultLang })
        .eq('id', organizationId);

      if (error) {
        return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ success: true, defaultLang });
    }

    return jsonResponse({ error: 'Route not found' }, 404);

  } catch (error: any) {
    console.error('Error in i18n function:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function resolveLocale(
  supabase: any,
  userId: string,
  projectId?: string | null
): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('resolve_user_locale', {
      p_user_id: userId,
      p_project_id: projectId || null,
    });

    if (error) {
      console.error('Error resolving locale:', error);
      return 'fr-CH';
    }

    return data || 'fr-CH';
  } catch (err) {
    console.error('Error calling resolve_user_locale:', err);
    return 'fr-CH';
  }
}

function translate(key: string, locale: string): string {
  const normalizedLocale = locale || 'fr-CH';
  const lang = translations[normalizedLocale] || translations['fr-CH'];

  const keys = key.split('.');
  let value: any = lang;

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}
