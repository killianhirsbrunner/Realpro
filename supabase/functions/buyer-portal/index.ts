import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface RouteHandler {
  method: string;
  pattern: RegExp;
  handler: (req: Request, match: RegExpMatchArray) => Promise<Response>;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const path = url.pathname.replace('/buyer-portal', '');

    const routes: RouteHandler[] = [
      {
        method: 'GET',
        pattern: /^\/buyers\/([^\/]+)\/overview$/,
        handler: (req, match) => getOverview(supabase, match[1]),
      },
      {
        method: 'GET',
        pattern: /^\/buyers\/([^\/]+)\/progress$/,
        handler: (req, match) => getProgress(supabase, match[1]),
      },
      {
        method: 'GET',
        pattern: /^\/buyers\/([^\/]+)\/documents$/,
        handler: (req, match) => getDocuments(supabase, match[1]),
      },
      {
        method: 'GET',
        pattern: /^\/buyers\/([^\/]+)\/choices$/,
        handler: (req, match) => getChoices(supabase, match[1]),
      },
      {
        method: 'GET',
        pattern: /^\/buyers\/([^\/]+)\/payments$/,
        handler: (req, match) => getPayments(supabase, match[1]),
      },
      {
        method: 'GET',
        pattern: /^\/buyers\/([^\/]+)\/messages$/,
        handler: (req, match) => getMessages(supabase, match[1]),
      },
      {
        method: 'POST',
        pattern: /^\/buyers\/([^\/]+)\/messages$/,
        handler: (req, match) => postMessage(supabase, req, match[1]),
      },
    ];

    for (const route of routes) {
      if (req.method === route.method) {
        const match = path.match(route.pattern);
        if (match) {
          return await route.handler(req, match);
        }
      }
    }

    return jsonResponse({ error: 'Route not found' }, 404);
  } catch (error: any) {
    console.error('Error:', error);
    return jsonResponse(
      { error: error.message || 'Internal server error' },
      500
    );
  }
});

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

async function getOverview(supabase: any, buyerId: string): Promise<Response> {
  const { data: buyer, error: buyerError } = await supabase
    .from('buyers')
    .select(
      `
      id,
      first_name,
      last_name,
      email,
      project_id,
      projects (
        id,
        name,
        city,
        canton,
        expected_delivery
      )
    `
    )
    .eq('id', buyerId)
    .single();

  if (buyerError || !buyer) {
    return jsonResponse({ error: 'Acheteur introuvable' }, 404);
  }

  const { data: lot } = await supabase
    .from('lots')
    .select('*')
    .eq('buyer_id', buyerId)
    .single();

  if (!lot) {
    return jsonResponse({ error: 'Aucun lot associé à cet acheteur' }, 404);
  }

  const { data: salesContract } = await supabase
    .from('sales_contracts')
    .select('contract_signed_at, reservation_signed_at, sale_type')
    .eq('buyer_id', buyerId)
    .eq('lot_id', lot.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return jsonResponse({
    buyer: {
      id: buyer.id,
      firstName: buyer.first_name,
      lastName: buyer.last_name,
      email: buyer.email,
    },
    project: {
      id: buyer.projects.id,
      name: buyer.projects.name,
      city: buyer.projects.city,
      canton: buyer.projects.canton,
    },
    lot: {
      id: lot.id,
      lotNumber: lot.lot_number,
      roomsLabel: lot.rooms ? `${lot.rooms} pièces` : null,
      surfaceHabitable: lot.surface_habitable,
      status: lot.status,
      estimatedDeliveryDate: buyer.projects.expected_delivery,
    },
    sale: {
      totalPriceChf: lot.price_vat || 0,
      saleType: salesContract?.sale_type || 'PPE',
      contractSignedAt: salesContract?.contract_signed_at || null,
      reservationSignedAt: salesContract?.reservation_signed_at || null,
    },
  });
}

async function getProgress(supabase: any, buyerId: string): Promise<Response> {
  const { data: buyer } = await supabase
    .from('buyers')
    .select('project_id, projects(name)')
    .eq('id', buyerId)
    .single();

  if (!buyer) {
    return jsonResponse({ error: 'Acheteur introuvable' }, 404);
  }

  const { data: lot } = await supabase
    .from('lots')
    .select('lot_number')
    .eq('buyer_id', buyerId)
    .single();

  if (!lot) {
    return jsonResponse({ error: 'Lot introuvable' }, 404);
  }

  const { data: phases } = await supabase
    .from('project_phases')
    .select('*')
    .eq('project_id', buyer.project_id)
    .order('order_index');

  const avgProgress =
    phases && phases.length > 0
      ? phases.reduce((sum: number, p: any) => sum + (p.progress_percent || 0), 0) /
        phases.length
      : 0;

  const { data: updates } = await supabase
    .from('construction_updates')
    .select('id, created_at, message')
    .eq('project_id', buyer.project_id)
    .order('created_at', { ascending: false })
    .limit(5);

  return jsonResponse({
    project: {
      name: buyer.projects.name,
    },
    lot: {
      lotNumber: lot.lot_number,
    },
    progressPct: Math.round(avgProgress),
    phases: (phases || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      plannedStart: p.planned_start_date,
      plannedEnd: p.planned_end_date,
    })),
    updates: (updates || []).map((u: any) => ({
      id: u.id,
      date: u.created_at,
      message: u.message,
    })),
  });
}

async function getDocuments(
  supabase: any,
  buyerId: string
): Promise<Response> {
  const { data: buyer } = await supabase
    .from('buyers')
    .select('first_name, last_name')
    .eq('id', buyerId)
    .single();

  if (!buyer) {
    return jsonResponse({ error: 'Acheteur introuvable' }, 404);
  }

  const { data: documents } = await supabase
    .from('documents')
    .select('id, name, category, created_at, file_url')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false });

  return jsonResponse({
    buyer: {
      firstName: buyer.first_name,
      lastName: buyer.last_name,
    },
    documents: (documents || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      createdAt: d.created_at,
      downloadUrl: d.file_url,
    })),
  });
}

async function getChoices(supabase: any, buyerId: string): Promise<Response> {
  const { data: buyer } = await supabase
    .from('buyers')
    .select('project_id')
    .eq('id', buyerId)
    .single();

  if (!buyer) {
    return jsonResponse({ error: 'Acheteur introuvable' }, 404);
  }

  const { data: lot } = await supabase
    .from('lots')
    .select('id')
    .eq('buyer_id', buyerId)
    .single();

  if (!lot) {
    return jsonResponse({ error: 'Lot introuvable' }, 404);
  }

  const { data: categories } = await supabase
    .from('material_categories')
    .select(
      `
      id,
      name,
      material_options (
        id,
        name,
        description,
        extra_price,
        is_standard
      )
    `
    )
    .eq('project_id', buyer.project_id)
    .order('order_index');

  const { data: choices } = await supabase
    .from('buyer_choices')
    .select('option_id')
    .eq('buyer_id', buyerId)
    .eq('lot_id', lot.id);

  const selectedOptionIds = new Set(
    (choices || []).map((c: any) => c.option_id)
  );

  const { data: changeRequests } = await supabase
    .from('buyer_change_requests')
    .select('id, description, status, extra_price')
    .eq('buyer_id', buyerId)
    .eq('lot_id', lot.id)
    .order('created_at', { ascending: false });

  return jsonResponse({
    categories: (categories || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      options: (cat.material_options || []).map((opt: any) => ({
        id: opt.id,
        name: opt.name,
        description: opt.description,
        extraPrice: opt.extra_price || 0,
        isSelected: selectedOptionIds.has(opt.id),
        isStandard: opt.is_standard,
      })),
    })),
    changeRequests: (changeRequests || []).map((cr: any) => ({
      id: cr.id,
      description: cr.description,
      status: cr.status,
      extraPrice: cr.extra_price,
    })),
  });
}

async function getPayments(supabase: any, buyerId: string): Promise<Response> {
  const { data: buyer } = await supabase
    .from('buyers')
    .select('id')
    .eq('id', buyerId)
    .single();

  if (!buyer) {
    return jsonResponse({ error: 'Acheteur introuvable' }, 404);
  }

  const { data: lot } = await supabase
    .from('lots')
    .select('price_vat')
    .eq('buyer_id', buyerId)
    .single();

  if (!lot) {
    return jsonResponse({ error: 'Lot introuvable' }, 404);
  }

  const { data: installments } = await supabase
    .from('buyer_installments')
    .select(
      `
      id,
      label,
      due_date,
      amount,
      status,
      installment_number,
      invoice_id
    `
    )
    .eq('buyer_id', buyerId)
    .order('installment_number');

  const totalPrice = lot.price_vat || 0;
  const paid = (installments || [])
    .filter((i: any) => i.status === 'PAID')
    .reduce((acc: number, i: any) => acc + (i.amount || 0), 0);

  return jsonResponse({
    summary: {
      totalPrice,
      paid,
      remaining: totalPrice - paid,
    },
    installments: (installments || []).map((i: any) => ({
      id: i.id,
      label: i.label,
      dueDate: i.due_date,
      amount: i.amount || 0,
      status: i.status,
      invoiceId: i.invoice_id,
      invoiceDownloadUrl: i.invoice_id
        ? `/api/invoices/${i.invoice_id}/download`
        : null,
    })),
  });
}

async function getMessages(supabase: any, buyerId: string): Promise<Response> {
  const { data: buyer } = await supabase
    .from('buyers')
    .select('id, first_name, last_name, project_id')
    .eq('id', buyerId)
    .single();

  if (!buyer) {
    return jsonResponse({ error: 'Acheteur introuvable' }, 404);
  }

  let { data: thread } = await supabase
    .from('message_threads')
    .select('id')
    .eq('context_type', 'BUYER')
    .eq('context_id', buyerId)
    .maybeSingle();

  if (!thread) {
    const { data: newThread } = await supabase
      .from('message_threads')
      .insert({
        project_id: buyer.project_id,
        context_type: 'BUYER',
        context_id: buyerId,
        title: 'Communication acheteur',
      })
      .select()
      .single();

    thread = newThread;
  }

  const { data: messages } = await supabase
    .from('messages')
    .select(
      `
      id,
      body,
      created_at,
      author_id,
      users!messages_author_id_fkey (
        first_name,
        last_name
      )
    `
    )
    .eq('thread_id', thread.id)
    .order('created_at', { ascending: true });

  return jsonResponse({
    buyer: {
      id: buyer.id,
      firstName: buyer.first_name,
      lastName: buyer.last_name,
    },
    messages: (messages || []).map((m: any) => ({
      id: m.id,
      authorType: m.author_id === buyer.id ? 'BUYER' : 'PROMOTER',
      authorName: m.users
        ? `${m.users.first_name} ${m.users.last_name}`
        : 'Équipe',
      body: m.body,
      createdAt: m.created_at,
    })),
  });
}

async function postMessage(
  supabase: any,
  req: Request,
  buyerId: string
): Promise<Response> {
  const { body } = await req.json();

  if (!body || !body.trim()) {
    return jsonResponse({ error: 'Le message ne peut pas être vide' }, 400);
  }

  const { data: buyer } = await supabase
    .from('buyers')
    .select('id, first_name, last_name, project_id, user_id')
    .eq('id', buyerId)
    .single();

  if (!buyer) {
    return jsonResponse({ error: 'Acheteur introuvable' }, 404);
  }

  let { data: thread } = await supabase
    .from('message_threads')
    .select('id')
    .eq('context_type', 'BUYER')
    .eq('context_id', buyerId)
    .maybeSingle();

  if (!thread) {
    const { data: newThread } = await supabase
      .from('message_threads')
      .insert({
        project_id: buyer.project_id,
        context_type: 'BUYER',
        context_id: buyerId,
        title: 'Communication acheteur',
      })
      .select()
      .single();

    thread = newThread;
  }

  const { data: message, error: messageError } = await supabase
    .from('messages')
    .insert({
      thread_id: thread.id,
      author_id: buyer.user_id,
      body: body.trim(),
    })
    .select()
    .single();

  if (messageError) {
    return jsonResponse({ error: messageError.message }, 500);
  }

  return jsonResponse({
    id: message.id,
    authorType: 'BUYER',
    authorName: `${buyer.first_name} ${buyer.last_name}`,
    body: message.body,
    createdAt: message.created_at,
  });
}
