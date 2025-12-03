import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

    if (method === 'GET' && pathSegments[0] === 'organization' && pathSegments[1] === 'overview') {
      const body = await req.json().catch(() => ({}));
      const overview = await getOrganizationOverview(supabase, body.organizationId);
      return jsonResponse(overview);
    }

    if (method === 'GET' && pathSegments[0] === 'organization' && pathSegments[1] === 'brokers') {
      const body = await req.json().catch(() => ({}));
      const brokers = await getBrokerPerformance(supabase, body.organizationId);
      return jsonResponse(brokers);
    }

    return jsonResponse({ error: 'Route introuvable' }, 404);

  } catch (error) {
    console.error('Error in reporting function:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getOrganizationOverview(supabase: any, organizationId: string) {
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, name, city, status, type')
    .eq('organization_id', organizationId);

  if (projectsError) throw projectsError;

  const { data: lots, error: lotsError } = await supabase
    .from('lots')
    .select('id, project_id, status, price_vat, price_qpt')
    .in('project_id', projects.map((p: any) => p.id));

  if (lotsError) throw lotsError;

  const { data: cfcBudgets, error: cfcError } = await supabase
    .from('cfc_budgets')
    .select('project_id, cfc_code, budget_revised, engagement_total, invoiced_total, paid_total')
    .in('project_id', projects.map((p: any) => p.id));

  if (cfcError) throw cfcError;

  const { data: buyerFiles, error: bfError } = await supabase
    .from('buyer_files')
    .select('id, project_id, status')
    .in('project_id', projects.map((p: any) => p.id));

  if (bfError) throw bfError;

  const { data: submissions, error: subError } = await supabase
    .from('submissions')
    .select('id, project_id, status')
    .in('project_id', projects.map((p: any) => p.id));

  if (subError) throw subError;

  const projectsCount = projects.length;

  const lotsPerProject = new Map<
    string,
    { total: number; sold: number; reserved: number; free: number }
  >();

  let totalSalesChf = 0;

  for (const lot of lots) {
    const key = lot.project_id;
    if (!lotsPerProject.has(key)) {
      lotsPerProject.set(key, { total: 0, sold: 0, reserved: 0, free: 0 });
    }
    const p = lotsPerProject.get(key)!;
    p.total += 1;
    if (lot.status === 'SOLD') p.sold += 1;
    if (lot.status === 'RESERVED') p.reserved += 1;
    if (lot.status === 'FREE') p.free += 1;

    if (lot.status === 'SOLD') {
      totalSalesChf += Number(lot.price_vat ?? lot.price_qpt ?? 0);
    }
  }

  const cfcByProject = new Map<
    string,
    { budget: number; engagement: number; invoiced: number; paid: number }
  >();

  for (const cfc of cfcBudgets) {
    const key = cfc.project_id;
    if (!cfcByProject.has(key)) {
      cfcByProject.set(key, { budget: 0, engagement: 0, invoiced: 0, paid: 0 });
    }
    const agg = cfcByProject.get(key)!;
    agg.budget += Number(cfc.budget_revised ?? 0);
    agg.engagement += Number(cfc.engagement_total ?? 0);
    agg.invoiced += Number(cfc.invoiced_total ?? 0);
    agg.paid += Number(cfc.paid_total ?? 0);
  }

  const buyerFilesStats = buyerFiles.reduce(
    (acc: any, bf: any) => {
      acc.total += 1;
      if (bf.status === 'READY_FOR_NOTARY') acc.readyForNotary += 1;
      if (bf.status === 'SIGNED') acc.signed += 1;
      return acc;
    },
    { total: 0, readyForNotary: 0, signed: 0 }
  );

  const submissionsStats = submissions.reduce(
    (acc: any, s: any) => {
      acc.total += 1;
      if (['IN_PROGRESS', 'INVITED', 'DRAFT'].includes(s.status)) acc.inProgress += 1;
      if (s.status === 'ADJUDICATED') acc.adjudicated += 1;
      return acc;
    },
    { total: 0, inProgress: 0, adjudicated: 0 }
  );

  return {
    projectsSummary: {
      totalProjects: projectsCount,
      byStatus: {
        planning: projects.filter((p: any) => p.status === 'PLANNING').length,
        sales: projects.filter((p: any) => p.status === 'SALES').length,
        construction: projects.filter((p: any) => p.status === 'CONSTRUCTION').length,
        delivered: projects.filter((p: any) => p.status === 'DELIVERED').length,
      },
    },
    salesSummary: {
      totalLots: lots.length,
      totalSalesChf,
    },
    buyerFilesSummary: buyerFilesStats,
    submissionsSummary: submissionsStats,
    projects: projects.map((p: any) => {
      const lotsData = lotsPerProject.get(p.id) ?? {
        total: 0,
        sold: 0,
        reserved: 0,
        free: 0,
      };
      const cfc = cfcByProject.get(p.id) ?? {
        budget: 0,
        engagement: 0,
        invoiced: 0,
        paid: 0,
      };
      const soldRatio = lotsData.total > 0 ? lotsData.sold / lotsData.total : 0;

      return {
        id: p.id,
        name: p.name,
        city: p.city,
        status: p.status,
        type: p.type,
        lots: lotsData,
        cfc,
        soldRatio,
      };
    }),
  };
}

async function getBrokerPerformance(supabase: any, organizationId: string) {
  const { data: brokerLinks, error: linksError } = await supabase
    .from('user_organizations')
    .select(`
      user_id,
      user:users(id, first_name, last_name, email)
    `)
    .eq('organization_id', organizationId)
    .eq('role', 'BROKER');

  if (linksError) throw linksError;

  const brokers = brokerLinks.map((b: any) => b.user);

  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .eq('organization_id', organizationId);

  const projectIds = projects?.map((p: any) => p.id) || [];

  const { data: reservations } = await supabase
    .from('reservations')
    .select(`
      id,
      lot_id,
      prospect:prospects(id, assigned_broker_id)
    `)
    .in('lot_id', await getLotIdsFromProjects(supabase, projectIds));

  const { data: lots } = await supabase
    .from('lots')
    .select('id, status, buyer_id')
    .in('project_id', projectIds);

  const statsMap = new Map<string, any>();

  for (const broker of brokers) {
    statsMap.set(broker.id, {
      brokerId: broker.id,
      firstName: broker.first_name,
      lastName: broker.last_name,
      email: broker.email,
      reservedLots: 0,
      soldLots: 0,
    });
  }

  if (reservations) {
    for (const res of reservations) {
      const brokerId = res.prospect?.assigned_broker_id;
      if (!brokerId || !statsMap.has(brokerId)) continue;
      statsMap.get(brokerId)!.reservedLots += 1;
    }
  }

  if (lots) {
    for (const lot of lots) {
      if (lot.status === 'SOLD' && lot.buyer_id) {
        for (const [brokerId] of statsMap) {
          statsMap.get(brokerId)!.soldLots += 1;
        }
      }
    }
  }

  return {
    brokers: Array.from(statsMap.values()).map((s: any) => ({
      ...s,
      conversionRate: s.reservedLots > 0 ? s.soldLots / s.reservedLots : 0,
    })),
  };
}

async function getLotIdsFromProjects(supabase: any, projectIds: string[]): Promise<string[]> {
  if (projectIds.length === 0) return [];

  const { data: lots } = await supabase
    .from('lots')
    .select('id')
    .in('project_id', projectIds);

  return lots?.map((l: any) => l.id) || [];
}
