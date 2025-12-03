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

    if (method === 'GET' && pathSegments[0] === 'projects' && pathSegments[1]) {
      const projectId = pathSegments[1];
      const body = await req.json().catch(() => ({}));
      const planning = await getPlanning(supabase, projectId, body.organizationId);
      return jsonResponse(planning);
    }

    if (method === 'POST' && pathSegments[0] === 'projects' && pathSegments[2] === 'phases') {
      const projectId = pathSegments[1];
      const body = await req.json();
      const phase = await createPhase(supabase, projectId, body);
      return jsonResponse(phase);
    }

    if (method === 'PATCH' && pathSegments[0] === 'phases' && pathSegments[1]) {
      const phaseId = pathSegments[1];
      const body = await req.json();
      const phase = await updatePhase(supabase, phaseId, body);
      return jsonResponse(phase);
    }

    return jsonResponse({ error: 'Route introuvable' }, 404);

  } catch (error) {
    console.error('Error in planning function:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function ensureProjectAccess(supabase: any, projectId: string, organizationId: string) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('id, name, organization_id')
    .eq('id', projectId)
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (error) throw error;
  if (!project) throw new Error('Projet introuvable ou accès non autorisé');

  return project;
}

async function getPlanning(supabase: any, projectId: string, organizationId: string) {
  await ensureProjectAccess(supabase, projectId, organizationId);

  const { data: phases, error } = await supabase
    .from('project_phases')
    .select('id, name, planned_start, planned_end, actual_start, actual_end, status, order_index')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true });

  if (error) throw error;

  const { data: snapshot } = await supabase
    .from('project_progress_snapshots')
    .select('progress_pct, date')
    .eq('project_id', projectId)
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle();

  let start: Date | null = null;
  let end: Date | null = null;

  if (phases && phases.length > 0) {
    const allDates: Date[] = [];
    phases.forEach((p: any) => {
      if (p.planned_start) allDates.push(new Date(p.planned_start));
      if (p.planned_end) allDates.push(new Date(p.planned_end));
    });

    if (allDates.length > 0) {
      start = new Date(Math.min(...allDates.map(d => d.getTime())));
      end = new Date(Math.max(...allDates.map(d => d.getTime())));
    }
  }

  return {
    progressPct: snapshot?.progress_pct || 0,
    start: start?.toISOString() || null,
    end: end?.toISOString() || null,
    phases: phases?.map((p: any) => ({
      id: p.id,
      name: p.name,
      plannedStart: p.planned_start,
      plannedEnd: p.planned_end,
      actualStart: p.actual_start,
      actualEnd: p.actual_end,
      status: p.status,
      order: p.order_index,
    })) || [],
  };
}

async function createPhase(supabase: any, projectId: string, body: any) {
  const { organizationId, name, plannedStart, plannedEnd, order } = body;

  await ensureProjectAccess(supabase, projectId, organizationId);

  let orderIndex = order;
  if (orderIndex === undefined || orderIndex === null) {
    const { data: maxData } = await supabase
      .from('project_phases')
      .select('order_index')
      .eq('project_id', projectId)
      .order('order_index', { ascending: false })
      .limit(1)
      .maybeSingle();

    orderIndex = maxData ? maxData.order_index + 1 : 0;
  }

  const { data: phase, error } = await supabase
    .from('project_phases')
    .insert({
      project_id: projectId,
      name,
      planned_start: plannedStart || null,
      planned_end: plannedEnd || null,
      order_index: orderIndex,
      status: 'NOT_STARTED',
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: phase.id,
    name: phase.name,
    plannedStart: phase.planned_start,
    plannedEnd: phase.planned_end,
    actualStart: phase.actual_start,
    actualEnd: phase.actual_end,
    status: phase.status,
    order: phase.order_index,
  };
}

async function updatePhase(supabase: any, phaseId: string, body: any) {
  const { organizationId, name, plannedStart, plannedEnd, status, order } = body;

  const { data: phase, error: fetchError } = await supabase
    .from('project_phases')
    .select(`
      id,
      project:projects(id, organization_id)
    `)
    .eq('id', phaseId)
    .single();

  if (fetchError) throw fetchError;
  if (!phase || phase.project.organization_id !== organizationId) {
    throw new Error('Phase introuvable ou accès non autorisé');
  }

  const updates: any = {};
  if (name !== undefined) updates.name = name;
  if (plannedStart !== undefined) updates.planned_start = plannedStart;
  if (plannedEnd !== undefined) updates.planned_end = plannedEnd;
  if (status !== undefined) updates.status = status;
  if (order !== undefined) updates.order_index = order;

  const { data: updated, error } = await supabase
    .from('project_phases')
    .update(updates)
    .eq('id', phaseId)
    .select()
    .single();

  if (error) throw error;

  return {
    id: updated.id,
    name: updated.name,
    plannedStart: updated.planned_start,
    plannedEnd: updated.planned_end,
    actualStart: updated.actual_start,
    actualEnd: updated.actual_end,
    status: updated.status,
    order: updated.order_index,
  };
}
