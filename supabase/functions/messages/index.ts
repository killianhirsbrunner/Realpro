import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface CreateThreadRequest {
  contextType: 'PROJECT' | 'LOT' | 'BUYER' | 'SUBMISSION' | 'SAV' | 'GENERIC';
  projectId?: string;
  lotId?: string;
  buyerId?: string;
  submissionId?: string;
  savTicketId?: string;
  title?: string;
}

interface PostMessageRequest {
  threadId: string;
  body: string;
  bodyLang?: string;
}

interface TranslateRequest {
  text: string;
  fromLang: string;
  toLang: string;
}

async function translateText(text: string, fromLang: string, toLang: string): Promise<string> {
  if (fromLang === toLang) {
    return text;
  }

  const deeplApiKey = Deno.env.get('DEEPL_API_KEY');

  if (!deeplApiKey) {
    return `[Translation unavailable: ${fromLang} → ${toLang}] ${text}`;
  }

  try {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${deeplApiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text,
        source_lang: fromLang.split('-')[0].toUpperCase(),
        target_lang: toLang.split('-')[0].toUpperCase(),
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    return `[Translation failed: ${fromLang} → ${toLang}] ${text}`;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean);

    if (req.method === 'POST' && path[path.length - 1] === 'threads') {
      const body: CreateThreadRequest = await req.json();

      const { data: userOrgs } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1);

      if (!userOrgs || userOrgs.length === 0) {
        return new Response(JSON.stringify({ error: 'No organization access' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: thread, error } = await supabase
        .from('message_threads')
        .insert({
          organization_id: userOrgs[0].organization_id,
          context_type: body.contextType,
          project_id: body.projectId || null,
          lot_id: body.lotId || null,
          buyer_id: body.buyerId || null,
          submission_id: body.submissionId || null,
          sav_ticket_id: body.savTicketId || null,
          title: body.title || null,
        })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(thread), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET' && path[path.length - 2] === 'threads') {
      const threadId = path[path.length - 1];

      const { data: thread } = await supabase
        .from('message_threads')
        .select('*')
        .eq('id', threadId)
        .single();

      if (!thread) {
        return new Response(JSON.stringify({ error: 'Thread not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: messages } = await supabase
        .from('messages')
        .select(`
          *,
          author:users!messages_author_id_fkey(id, email)
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      return new Response(JSON.stringify({ thread, messages: messages || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET' && path[path.length - 1] === 'threads') {
      const contextType = url.searchParams.get('contextType');
      const projectId = url.searchParams.get('projectId');
      const lotId = url.searchParams.get('lotId');
      const buyerId = url.searchParams.get('buyerId');

      const { data: userOrgs } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id);

      if (!userOrgs || userOrgs.length === 0) {
        return new Response(JSON.stringify({ threads: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let query = supabase
        .from('message_threads')
        .select('*')
        .eq('organization_id', userOrgs[0].organization_id);

      if (contextType) query = query.eq('context_type', contextType);
      if (projectId) query = query.eq('project_id', projectId);
      if (lotId) query = query.eq('lot_id', lotId);
      if (buyerId) query = query.eq('buyer_id', buyerId);

      const { data: threads } = await query.order('updated_at', { ascending: false });

      return new Response(JSON.stringify({ threads: threads || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && path.includes('messages')) {
      const body: PostMessageRequest = await req.json();

      const { data: userProfile } = await supabase
        .from('users')
        .select('preferred_language')
        .eq('id', user.id)
        .single();

      const detectedLang = body.bodyLang || userProfile?.preferred_language || 'en-GB';

      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          thread_id: body.threadId,
          author_id: user.id,
          body: body.body,
          body_lang: detectedLang,
        })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      await supabase
        .from('message_threads')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', body.threadId);

      return new Response(JSON.stringify(message), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST' && path[path.length - 1] === 'translate') {
      const body: TranslateRequest = await req.json();

      const translatedText = await translateText(body.text, body.fromLang, body.toLang);

      return new Response(JSON.stringify({ translatedText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
