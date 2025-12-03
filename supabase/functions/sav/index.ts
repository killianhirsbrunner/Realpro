import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface CreateTicketRequest {
  projectId: string;
  lotId: string;
  buyerId?: string;
  title: string;
  description: string;
  location?: string;
  severity?: 'MINOR' | 'MAJOR' | 'CRITICAL' | 'BLOCKING';
  category?: string;
  warrantyType?: string;
  warrantyEndDate?: string;
  dueDate?: string;
}

interface UpdateTicketRequest {
  title?: string;
  description?: string;
  location?: string;
  severity?: string;
  status?: string;
  category?: string;
  warrantyEndDate?: string;
  dueDate?: string;
  internalNotes?: string;
}

interface AssignTicketRequest {
  companyId: string;
  userId?: string;
}

interface AddMessageRequest {
  body: string;
  isInternal?: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return jsonResponse({ error: 'Missing authorization header' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const url = new URL(req.url);
    const path = url.pathname.replace('/sav', '');
    const method = req.method;

    // GET /sav/tickets?projectId=X&status=Y
    if (method === 'GET' && path === '/tickets') {
      const projectId = url.searchParams.get('projectId');
      const status = url.searchParams.get('status');
      const lotId = url.searchParams.get('lotId');
      const buyerId = url.searchParams.get('buyerId');
      return await listTickets(supabase, user.id, { projectId, status, lotId, buyerId });
    }

    // POST /sav/tickets - Create ticket
    if (method === 'POST' && path === '/tickets') {
      return await createTicket(supabase, user.id, req);
    }

    // GET /sav/tickets/:id - Get ticket details
    if (method === 'GET' && path.match(/^\/tickets\/[^/]+$/)) {
      const ticketId = path.split('/')[2];
      return await getTicket(supabase, user.id, ticketId);
    }

    // PATCH /sav/tickets/:id - Update ticket
    if (method === 'PATCH' && path.match(/^\/tickets\/[^/]+$/)) {
      const ticketId = path.split('/')[2];
      return await updateTicket(supabase, user.id, ticketId, req);
    }

    // POST /sav/tickets/:id/assign - Assign ticket to company
    if (method === 'POST' && path.match(/^\/tickets\/[^/]+\/assign$/)) {
      const ticketId = path.split('/')[2];
      return await assignTicket(supabase, user.id, ticketId, req);
    }

    // POST /sav/tickets/:id/status - Update status
    if (method === 'POST' && path.match(/^\/tickets\/[^/]+\/status$/)) {
      const ticketId = path.split('/')[2];
      return await updateStatus(supabase, user.id, ticketId, req);
    }

    // POST /sav/tickets/:id/messages - Add message
    if (method === 'POST' && path.match(/^\/tickets\/[^/]+\/messages$/)) {
      const ticketId = path.split('/')[2];
      return await addMessage(supabase, user.id, ticketId, req);
    }

    // GET /sav/tickets/:id/messages - Get messages
    if (method === 'GET' && path.match(/^\/tickets\/[^/]+\/messages$/)) {
      const ticketId = path.split('/')[2];
      return await getMessages(supabase, ticketId);
    }

    // GET /sav/tickets/:id/history - Get history
    if (method === 'GET' && path.match(/^\/tickets\/[^/]+\/history$/)) {
      const ticketId = path.split('/')[2];
      return await getHistory(supabase, ticketId);
    }

    // GET /sav/projects/:projectId/statistics
    if (method === 'GET' && path.match(/^\/projects\/[^/]+\/statistics$/)) {
      const projectId = path.split('/')[2];
      return await getStatistics(supabase, projectId);
    }

    return jsonResponse({ error: 'Route not found' }, 404);

  } catch (error: any) {
    console.error('Error in SAV function:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getUserOrganization(supabase: any, userId: string) {
  const { data } = await supabase
    .from('user_organizations')
    .select('organization_id')
    .eq('user_id', userId)
    .single();
  
  return data?.organization_id;
}

async function listTickets(supabase: any, userId: string, filters: any) {
  const organizationId = await getUserOrganization(supabase, userId);
  if (!organizationId) {
    return jsonResponse({ error: 'Organization not found' }, 404);
  }

  let query = supabase
    .from('sav_tickets')
    .select(`
      *,
      project:projects(id, name, code),
      lot:lots(id, lot_number),
      buyer:buyers(id, first_name, last_name, email),
      assigned_company:companies!assigned_to_company_id(id, name),
      reported_by:users!reported_by_id(id, first_name, last_name, email)
    `)
    .eq('organization_id', organizationId);

  if (filters.projectId) {
    query = query.eq('project_id', filters.projectId);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.lotId) {
    query = query.eq('lot_id', filters.lotId);
  }

  if (filters.buyerId) {
    query = query.eq('buyer_id', filters.buyerId);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse(data);
}

async function createTicket(supabase: any, userId: string, req: Request) {
  const organizationId = await getUserOrganization(supabase, userId);
  if (!organizationId) {
    return jsonResponse({ error: 'Organization not found' }, 404);
  }

  const body: CreateTicketRequest = await req.json();

  // Verify project belongs to organization
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', body.projectId)
    .eq('organization_id', organizationId)
    .single();

  if (!project) {
    return jsonResponse({ error: 'Project not found' }, 404);
  }

  // Verify lot belongs to project
  const { data: lot } = await supabase
    .from('lots')
    .select('id')
    .eq('id', body.lotId)
    .eq('project_id', body.projectId)
    .single();

  if (!lot) {
    return jsonResponse({ error: 'Lot not found' }, 404);
  }

  const { data: ticket, error } = await supabase
    .from('sav_tickets')
    .insert({
      organization_id: organizationId,
      project_id: body.projectId,
      lot_id: body.lotId,
      buyer_id: body.buyerId || null,
      reported_by_id: userId,
      title: body.title,
      description: body.description,
      location: body.location || null,
      severity: body.severity || 'MINOR',
      category: body.category || null,
      warranty_type: body.warrantyType || null,
      warranty_end_date: body.warrantyEndDate || null,
      due_date: body.dueDate || null,
      status: 'NEW',
    })
    .select()
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  // Log history
  await supabase.from('sav_history').insert({
    ticket_id: ticket.id,
    action: 'created',
    details: `Ticket created by user ${userId}`,
    created_by_id: userId,
  });

  // Create notification for promoter/managers
  const { data: managers } = await supabase
    .from('user_organizations')
    .select('user_id')
    .eq('organization_id', organizationId);

  for (const manager of managers || []) {
    if (manager.user_id !== userId) {
      await supabase.from('notifications').insert({
        user_id: manager.user_id,
        type: 'SAV_NEW_TICKET',
        i18n_key: 'notifications.sav.newTicket',
        title: `Nouveau ticket SAV - ${body.title}`,
        body: `Un nouveau ticket SAV a été créé pour le lot ${lot.id}`,
        project_id: body.projectId,
        link_url: `/sav/tickets/${ticket.id}`,
      });
    }
  }

  return jsonResponse(ticket);
}

async function getTicket(supabase: any, userId: string, ticketId: string) {
  const organizationId = await getUserOrganization(supabase, userId);
  if (!organizationId) {
    return jsonResponse({ error: 'Organization not found' }, 404);
  }

  const { data: ticket, error } = await supabase
    .from('sav_tickets')
    .select(`
      *,
      project:projects(id, name, code),
      lot:lots(id, lot_number),
      buyer:buyers(id, first_name, last_name, email, phone),
      assigned_company:companies!assigned_to_company_id(id, name, email, phone),
      assigned_user:users!assigned_to_user_id(id, first_name, last_name, email),
      reported_by:users!reported_by_id(id, first_name, last_name, email),
      messages:sav_messages(
        id,
        body,
        is_internal,
        created_at,
        author:users(id, first_name, last_name, email)
      ),
      attachments:sav_attachments(
        id,
        file_name,
        file_url,
        file_type,
        file_size,
        created_at
      )
    `)
    .eq('id', ticketId)
    .eq('organization_id', organizationId)
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  if (!ticket) {
    return jsonResponse({ error: 'Ticket not found' }, 404);
  }

  return jsonResponse(ticket);
}

async function updateTicket(supabase: any, userId: string, ticketId: string, req: Request) {
  const organizationId = await getUserOrganization(supabase, userId);
  if (!organizationId) {
    return jsonResponse({ error: 'Organization not found' }, 404);
  }

  const body: UpdateTicketRequest = await req.json();

  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.location !== undefined) updateData.location = body.location;
  if (body.severity !== undefined) updateData.severity = body.severity;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.warrantyEndDate !== undefined) updateData.warranty_end_date = body.warrantyEndDate;
  if (body.dueDate !== undefined) updateData.due_date = body.dueDate;
  if (body.internalNotes !== undefined) updateData.internal_notes = body.internalNotes;

  const { data: ticket, error } = await supabase
    .from('sav_tickets')
    .update(updateData)
    .eq('id', ticketId)
    .eq('organization_id', organizationId)
    .select()
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse(ticket);
}

async function assignTicket(supabase: any, userId: string, ticketId: string, req: Request) {
  const organizationId = await getUserOrganization(supabase, userId);
  if (!organizationId) {
    return jsonResponse({ error: 'Organization not found' }, 404);
  }

  const body: AssignTicketRequest = await req.json();

  const { data: ticket, error } = await supabase
    .from('sav_tickets')
    .update({
      assigned_to_company_id: body.companyId,
      assigned_to_user_id: body.userId || null,
      status: 'ASSIGNED',
      updated_at: new Date().toISOString(),
    })
    .eq('id', ticketId)
    .eq('organization_id', organizationId)
    .select(`
      *,
      assigned_company:companies!assigned_to_company_id(name)
    `)
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  // Create notification for assigned company users
  const { data: companyUsers } = await supabase
    .from('company_users')
    .select('user_id')
    .eq('company_id', body.companyId);

  for (const cu of companyUsers || []) {
    await supabase.from('notifications').insert({
      user_id: cu.user_id,
      type: 'SAV_ASSIGNED',
      i18n_key: 'notifications.sav.assigned',
      title: 'Nouveau ticket SAV assigné',
      body: `Un ticket SAV vous a été assigné`,
      project_id: ticket.project_id,
      link_url: `/sav/tickets/${ticket.id}`,
    });
  }

  return jsonResponse(ticket);
}

async function updateStatus(supabase: any, userId: string, ticketId: string, req: Request) {
  const organizationId = await getUserOrganization(supabase, userId);
  if (!organizationId) {
    return jsonResponse({ error: 'Organization not found' }, 404);
  }

  const { status, note } = await req.json();

  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'FIXED') {
    updateData.fixed_at = new Date().toISOString();
  } else if (status === 'VALIDATED') {
    updateData.validated_at = new Date().toISOString();
  } else if (status === 'CLOSED') {
    updateData.closed_at = new Date().toISOString();
  }

  const { data: ticket, error } = await supabase
    .from('sav_tickets')
    .update(updateData)
    .eq('id', ticketId)
    .eq('organization_id', organizationId)
    .select()
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  // Add optional note as message
  if (note) {
    await supabase.from('sav_messages').insert({
      ticket_id: ticketId,
      author_id: userId,
      body: note,
      is_internal: false,
    });
  }

  return jsonResponse(ticket);
}

async function addMessage(supabase: any, userId: string, ticketId: string, req: Request) {
  const body: AddMessageRequest = await req.json();

  const { data: message, error } = await supabase
    .from('sav_messages')
    .insert({
      ticket_id: ticketId,
      author_id: userId,
      body: body.body,
      is_internal: body.isInternal || false,
    })
    .select(`
      *,
      author:users(id, first_name, last_name, email)
    `)
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  // Log history
  await supabase.from('sav_history').insert({
    ticket_id: ticketId,
    action: 'message_added',
    details: `Message added by user ${userId}`,
    created_by_id: userId,
  });

  return jsonResponse(message);
}

async function getMessages(supabase: any, ticketId: string) {
  const { data, error } = await supabase
    .from('sav_messages')
    .select(`
      *,
      author:users(id, first_name, last_name, email),
      attachments:sav_attachments(
        id,
        file_name,
        file_url,
        file_type,
        created_at
      )
    `)
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse(data);
}

async function getHistory(supabase: any, ticketId: string) {
  const { data, error } = await supabase
    .from('sav_history')
    .select(`
      *,
      created_by:users(id, first_name, last_name)
    `)
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: false });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse(data);
}

async function getStatistics(supabase: any, projectId: string) {
  const { data, error } = await supabase
    .rpc('get_sav_statistics', { p_project_id: projectId });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse(data);
}
