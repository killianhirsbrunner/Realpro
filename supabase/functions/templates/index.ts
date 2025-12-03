import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
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
    const pathSegments = url.pathname.split('/').filter(Boolean);

    if (method === 'GET' && !pathSegments[0]) {
      const body = await req.json().catch(() => ({}));
      const templates = await listTemplates(supabase, body.organizationId);
      return jsonResponse(templates);
    }

    if (method === 'POST' && pathSegments[0] === 'create') {
      const body = await req.json();
      const template = await createTemplate(supabase, body);
      return jsonResponse(template);
    }

    if (method === 'PATCH' && pathSegments[0]) {
      const templateId = pathSegments[0];
      const body = await req.json();
      const template = await updateTemplate(supabase, templateId, body);
      return jsonResponse(template);
    }

    if (method === 'POST' && pathSegments[0] === 'generate') {
      const body = await req.json();
      const result = await generateFromTemplate(supabase, body);
      return jsonResponse(result);
    }

    if (method === 'DELETE' && pathSegments[0]) {
      const templateId = pathSegments[0];
      const body = await req.json().catch(() => ({}));
      await deleteTemplate(supabase, templateId, body.organizationId);
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: 'Route introuvable' }, 404);

  } catch (error) {
    console.error('Error in templates function:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function listTemplates(supabase: any, organizationId: string) {
  const { data: templates, error } = await supabase
    .from('document_templates')
    .select('*')
    .eq('organization_id', organizationId)
    .order('name', { ascending: true });

  if (error) throw error;

  return templates?.map((t: any) => ({
    id: t.id,
    name: t.name,
    code: t.code,
    scope: t.scope,
    language: t.language,
    content: t.content,
    createdAt: t.created_at,
  })) || [];
}

async function createTemplate(supabase: any, data: any) {
  const { organizationId, name, code, scope, language, content } = data;

  const { data: existing } = await supabase
    .from('document_templates')
    .select('id')
    .eq('organization_id', organizationId)
    .eq('code', code)
    .eq('language', language)
    .maybeSingle();

  if (existing) {
    throw new Error('Un template avec ce code et cette langue existe déjà');
  }

  const { data: template, error } = await supabase
    .from('document_templates')
    .insert({
      organization_id: organizationId,
      name,
      code,
      scope,
      language,
      content,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: template.id,
    name: template.name,
    code: template.code,
    scope: template.scope,
    language: template.language,
    content: template.content,
    createdAt: template.created_at,
  };
}

async function updateTemplate(supabase: any, templateId: string, data: any) {
  const { organizationId, name, content, language } = data;

  const { data: template, error: fetchError } = await supabase
    .from('document_templates')
    .select('*')
    .eq('id', templateId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!template || template.organization_id !== organizationId) {
    throw new Error('Template introuvable ou accès non autorisé');
  }

  const updates: any = {};
  if (name !== undefined) updates.name = name;
  if (content !== undefined) updates.content = content;
  if (language !== undefined) updates.language = language;

  const { data: updated, error } = await supabase
    .from('document_templates')
    .update(updates)
    .eq('id', templateId)
    .select()
    .single();

  if (error) throw error;

  return {
    id: updated.id,
    name: updated.name,
    code: updated.code,
    scope: updated.scope,
    language: updated.language,
    content: updated.content,
    createdAt: updated.created_at,
  };
}

async function generateFromTemplate(supabase: any, data: any) {
  const { organizationId, userId, templateId, projectId, lotId, buyerId, contractId } = data;

  const { data: template, error: templateError } = await supabase
    .from('document_templates')
    .select('*')
    .eq('id', templateId)
    .maybeSingle();

  if (templateError) throw templateError;
  if (!template || template.organization_id !== organizationId) {
    throw new Error('Template introuvable ou accès non autorisé');
  }

  const queries = [
    supabase.from('projects').select('*').eq('id', projectId).maybeSingle(),
    lotId ? supabase.from('lots').select('*').eq('id', lotId).maybeSingle() : Promise.resolve({ data: null }),
    buyerId ? supabase.from('buyers').select('*').eq('id', buyerId).maybeSingle() : Promise.resolve({ data: null }),
    contractId ? supabase.from('contracts').select('*').eq('id', contractId).maybeSingle() : Promise.resolve({ data: null }),
  ];

  const [projectRes, lotRes, buyerRes, contractRes] = await Promise.all(queries);

  const project = projectRes.data;
  const lot = lotRes.data;
  const buyer = buyerRes.data;
  const contract = contractRes.data;

  if (!project) throw new Error('Projet introuvable');

  const context = {
    project: {
      id: project.id,
      name: project.name,
      address: project.address,
      city: project.city,
      postalCode: project.postal_code,
      status: project.status,
    },
    lot: lot ? {
      id: lot.id,
      lotNumber: lot.lot_number,
      roomsLabel: lot.rooms_label,
      livingArea: lot.living_area,
      price: lot.price,
      floor: lot.floor,
    } : null,
    buyer: buyer ? {
      id: buyer.id,
      firstName: buyer.first_name,
      lastName: buyer.last_name,
      email: buyer.email,
      phone: buyer.phone,
      address: buyer.address,
    } : null,
    contract: contract ? {
      id: contract.id,
      contractNumber: contract.contract_number,
      signedAt: contract.signed_at,
      totalAmount: contract.total_amount,
    } : null,
    now: new Date().toISOString(),
  };

  const renderedText = renderTemplate(template.content, context);

  const { data: document, error: docError } = await supabase
    .from('documents')
    .insert({
      organization_id: organizationId,
      project_id: projectId,
      category: 'JURIDICAL',
      name: `${template.name} – ${project.name}`,
      generated_from_template_id: templateId,
    })
    .select()
    .single();

  if (docError) throw docError;

  const fileName = `${template.code}-${projectId}.txt`;
  const storageKey = `generated/${document.id}.txt`;

  const { data: version, error: versionError } = await supabase
    .from('document_versions')
    .insert({
      document_id: document.id,
      file_name: fileName,
      storage_key: storageKey,
      mime_type: 'text/plain',
      size: renderedText.length,
      version_number: 1,
      uploaded_by_id: userId,
    })
    .select()
    .single();

  if (versionError) throw versionError;

  return {
    documentId: document.id,
    versionId: version.id,
    contentPreview: renderedText.slice(0, 2000),
    fullContent: renderedText,
  };
}

async function deleteTemplate(supabase: any, templateId: string, organizationId: string) {
  const { data: template } = await supabase
    .from('document_templates')
    .select('organization_id')
    .eq('id', templateId)
    .maybeSingle();

  if (!template || template.organization_id !== organizationId) {
    throw new Error('Template introuvable ou accès non autorisé');
  }

  const { error } = await supabase
    .from('document_templates')
    .delete()
    .eq('id', templateId);

  if (error) throw error;
}

function renderTemplate(content: string, context: any): string {
  return content.replace(/{{\s*([^}]+)\s*}}/g, (match, expr) => {
    const path = String(expr).trim().split('.');
    let value: any = context;

    for (const segment of path) {
      if (value == null) break;
      value = value[segment];
    }

    if (value == null) return '';
    if (typeof value === 'object' && value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return value.slice(0, 10);
    }
    if (typeof value === 'number') {
      return value.toLocaleString('fr-CH');
    }

    return String(value);
  });
}
