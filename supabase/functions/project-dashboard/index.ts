import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

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
    const pathMatch = url.pathname.match(/\/projects\/([^\/]+)\/dashboard/);

    if (!pathMatch) {
      return jsonResponse({ error: 'Invalid route' }, 404);
    }

    const projectId = pathMatch[1];

    const dashboard = await getProjectDashboard(supabase, projectId);
    return jsonResponse(dashboard);
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

async function getProjectDashboard(supabase: any, projectId: string) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, name, type, city, canton, status')
    .eq('id', projectId)
    .maybeSingle();

  if (projectError || !project) {
    throw new Error('Projet introuvable');
  }

  const [
    lotsResult,
    buyerFilesResult,
    notaryFilesResult,
    contractsResult,
    cfcBudgetsResult,
    phasesResult,
    snapshotResult,
    submissionsResult,
    auditLogsResult,
  ] = await Promise.all([
    supabase.from('lots').select('id, status').eq('project_id', projectId),

    supabase
      .from('buyer_files')
      .select('id, status')
      .eq('project_id', projectId),

    supabase
      .from('notary_files')
      .select('id, status, buyer_file_id')
      .in(
        'buyer_file_id',
        supabase
          .from('buyer_files')
          .select('id')
          .eq('project_id', projectId)
      ),

    supabase
      .from('contracts')
      .select('id, type')
      .eq('project_id', projectId),

    supabase
      .from('cfc_budgets')
      .select(
        'id, cfc_code, label, budget_initial, budget_revised, engagement_total, invoiced_total, paid_total'
      )
      .eq('project_id', projectId),

    supabase
      .from('project_phases')
      .select(
        'id, name, planned_start_date, planned_end_date, actual_start_date, actual_end_date, status, order_index'
      )
      .eq('project_id', projectId)
      .order('order_index'),

    supabase
      .from('project_progress_snapshots')
      .select('progress_pct, date')
      .eq('project_id', projectId)
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from('submissions')
      .select('id, status')
      .eq('project_id', projectId),

    supabase
      .from('audit_logs')
      .select('id, created_at, action, entity_type, entity_id, description')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const lots = lotsResult.data || [];
  const totalLots = lots.length;
  const sold = lots.filter((l: any) => l.status === 'SOLD').length;
  const reserved = lots.filter((l: any) => l.status === 'RESERVED').length;
  const free = totalLots - sold - reserved;
  const soldRatio = totalLots > 0 ? sold / totalLots : 0;

  const buyerFiles = buyerFilesResult.data || [];
  const buyerFilesReady = buyerFiles.filter(
    (bf: any) => bf.status === 'READY_FOR_NOTARY'
  ).length;
  const buyerFilesSigned = buyerFiles.filter(
    (bf: any) => bf.status === 'SIGNED'
  ).length;

  const notaryFiles = notaryFilesResult.data || [];
  const notaryOpen = notaryFiles.filter(
    (nf: any) => nf.status === 'OPEN' || nf.status === 'AWAITING_APPOINTMENT'
  ).length;
  const notarySigned = notaryFiles.filter(
    (nf: any) => nf.status === 'SIGNED'
  ).length;

  const contracts = contractsResult.data || [];
  const egCount = contracts.filter((c: any) => c.type === 'EG').length;
  const subcontractorCount = contracts.filter(
    (c: any) => c.type === 'SUBCONTRACTOR'
  ).length;

  const cfcBudgets = cfcBudgetsResult.data || [];

  const phases = phasesResult.data || [];
  const snapshot = snapshotResult.data;

  const construction = phases.length
    ? {
        progressPct: snapshot?.progress_pct ?? 0,
        phases: phases.map((p: any) => ({
          id: p.id,
          name: p.name,
          plannedStart: p.planned_start_date,
          plannedEnd: p.planned_end_date,
          actualStart: p.actual_start_date,
          actualEnd: p.actual_end_date,
          status: p.status,
        })),
      }
    : undefined;

  const submissions = submissionsResult.data || [];
  const submissionsSummary = submissions.length
    ? {
        total: submissions.length,
        inProgress: submissions.filter(
          (s: any) =>
            s.status === 'IN_PROGRESS' ||
            s.status === 'INVITED' ||
            s.status === 'CLOSED'
        ).length,
        adjudicated: submissions.filter((s: any) => s.status === 'ADJUDICATED')
          .length,
        openClarifications: 0,
      }
    : undefined;

  const auditEvents = auditLogsResult.data || [];
  const activity = auditEvents.map((e: any) => ({
    id: e.id,
    createdAt: e.created_at,
    action: e.action,
    description:
      e.description || buildActivityDescription(e),
  }));

  return {
    project: {
      id: project.id,
      name: project.name,
      type: project.type,
      city: project.city,
      canton: project.canton,
      status: project.status,
      lotsCount: totalLots,
    },
    sales: {
      lots: {
        total: totalLots,
        sold,
        reserved,
        free,
        soldRatio,
      },
      buyerFiles: {
        readyForNotary: buyerFilesReady,
        signed: buyerFilesSigned,
      },
      notary: {
        open: notaryOpen,
        signed: notarySigned,
      },
    },
    contracts: {
      egCount,
      subcontractorCount,
    },
    cfc: cfcBudgets.map((b: any) => ({
      cfcCode: b.cfc_code,
      label: b.label,
      budgetInitial: Number(b.budget_initial ?? 0),
      budgetRevised: Number(b.budget_revised ?? 0),
      engagementTotal: Number(b.engagement_total ?? 0),
      invoicedTotal: Number(b.invoiced_total ?? 0),
      paidTotal: Number(b.paid_total ?? 0),
    })),
    construction,
    submissions: submissionsSummary,
    activity,
  };
}

function buildActivityDescription(event: any): string {
  const entity = event.entity_type?.toLowerCase() ?? 'élément';
  const action = event.action?.toLowerCase() ?? 'mis à jour';
  return `Événement ${action} sur ${entity} (${event.entity_id ?? 'N/A'})`;
}
