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

    if (method === 'POST' && url.pathname.endsWith('/run')) {
      const results = await runDailyChecks(supabase);
      return jsonResponse(results);
    }

    return jsonResponse({ error: 'Route introuvable' }, 404);

  } catch (error) {
    console.error('Error in scheduler function:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function runDailyChecks(supabase: any) {
  console.log('Starting daily checks...');

  const results = {
    materialChoices: 0,
    buyerInvoices: 0,
    submissionsClarifications: 0,
    latePhases: 0,
    errors: [] as string[],
  };

  try {
    results.materialChoices = await checkMaterialChoices(supabase);
  } catch (error) {
    console.error('Error checking material choices:', error);
    results.errors.push(`Material choices: ${error.message}`);
  }

  try {
    results.buyerInvoices = await checkBuyerInvoices(supabase);
  } catch (error) {
    console.error('Error checking buyer invoices:', error);
    results.errors.push(`Buyer invoices: ${error.message}`);
  }

  try {
    results.submissionsClarifications = await checkSubmissionsClarifications(supabase);
  } catch (error) {
    console.error('Error checking submissions:', error);
    results.errors.push(`Submissions: ${error.message}`);
  }

  try {
    results.latePhases = await checkLateProjectPhases(supabase);
  } catch (error) {
    console.error('Error checking late phases:', error);
    results.errors.push(`Late phases: ${error.message}`);
  }

  console.log('Daily checks completed:', results);
  return results;
}

async function checkMaterialChoices(supabase: any): Promise<number> {
  const now = new Date().toISOString();
  let notificationCount = 0;

  const { data: lots, error } = await supabase
    .from('lots')
    .select(`
      id,
      lot_number,
      project_id,
      buyer_id,
      choice_deadline_at,
      status,
      projects(id, name, organization_id),
      buyers(id, first_name, last_name)
    `)
    .in('status', ['RESERVED', 'SOLD'])
    .not('choice_deadline_at', 'is', null)
    .lt('choice_deadline_at', now);

  if (error) throw error;
  if (!lots || lots.length === 0) return 0;

  for (const lot of lots) {
    if (!lot.buyer_id || !lot.buyers) continue;

    const { count: choicesCount } = await supabase
      .from('buyer_choices')
      .select('*', { count: 'exact', head: true })
      .eq('buyer_id', lot.buyer_id)
      .eq('lot_id', lot.id);

    if (choicesCount && choicesCount > 0) continue;

    const { data: orgUsers } = await supabase
      .from('user_organizations')
      .select('user_id')
      .eq('organization_id', lot.projects.organization_id)
      .in('role', ['PROMOTER', 'EG', 'ARCHITECT']);

    if (!orgUsers || orgUsers.length === 0) continue;

    for (const ou of orgUsers) {
      await supabase.from('notifications').insert({
        user_id: ou.user_id,
        type: 'CHOICE_MATERIAL',
        title: `Choix matériaux en retard – Lot ${lot.lot_number}`,
        body: `Les choix matériaux pour le lot ${lot.lot_number} (projet ${lot.projects.name}) sont en retard.`,
        project_id: lot.project_id,
        link_url: `/projects/${lot.project_id}/buyers/${lot.buyer_id}/lots/${lot.id}/choices`,
      });

      await supabase.from('tasks').insert({
        organization_id: lot.projects.organization_id,
        project_id: lot.project_id,
        title: `Relancer l'acquéreur – choix matériaux lot ${lot.lot_number}`,
        description: `Les choix matériaux n'ont pas été complétés avant la date limite.`,
        type: 'MATERIAL_CHOICE',
        status: 'OPEN',
        due_date: now,
        assigned_to_id: ou.user_id,
        created_by_id: ou.user_id,
      });

      notificationCount++;
    }
  }

  return notificationCount;
}

async function checkBuyerInvoices(supabase: any): Promise<number> {
  const now = new Date().toISOString();
  let notificationCount = 0;

  const { data: invoices, error } = await supabase
    .from('buyer_invoices')
    .select(`
      id,
      invoice_number,
      buyer_id,
      lot_id,
      due_at,
      lots(id, lot_number, project_id, projects(id, name, organization_id)),
      buyers(id, first_name, last_name)
    `)
    .eq('status', 'OPEN')
    .not('due_at', 'is', null)
    .lt('due_at', now);

  if (error) throw error;
  if (!invoices || invoices.length === 0) return 0;

  for (const inv of invoices) {
    if (!inv.lots || !inv.lots.projects) continue;

    const project = inv.lots.projects;

    const { data: promoters } = await supabase
      .from('user_organizations')
      .select('user_id')
      .eq('organization_id', project.organization_id)
      .eq('role', 'PROMOTER');

    if (!promoters || promoters.length === 0) continue;

    for (const promoter of promoters) {
      await supabase.from('notifications').insert({
        user_id: promoter.user_id,
        type: 'PAYMENT',
        title: `Acompte en retard – ${inv.invoice_number}`,
        body: `L'acompte ${inv.invoice_number} pour le lot ${inv.lots.lot_number} est en retard.`,
        project_id: project.id,
        link_url: `/projects/${project.id}/finance/buyers/${inv.buyer_id}/invoices`,
      });

      await supabase.from('tasks').insert({
        organization_id: project.organization_id,
        project_id: project.id,
        title: `Suivi acompte en retard – ${inv.invoice_number}`,
        description: `Relancer l'acquéreur ${inv.buyers?.first_name} ${inv.buyers?.last_name}.`,
        type: 'PAYMENT',
        status: 'OPEN',
        due_date: now,
        assigned_to_id: promoter.user_id,
        created_by_id: promoter.user_id,
      });

      notificationCount++;
    }
  }

  return notificationCount;
}

async function checkSubmissionsClarifications(supabase: any): Promise<number> {
  let notificationCount = 0;

  const { data: submissions, error } = await supabase
    .from('submissions')
    .select(`
      id,
      title,
      project_id,
      clarifications_open,
      projects(id, name, organization_id)
    `)
    .gt('clarifications_open', 0);

  if (error) throw error;
  if (!submissions || submissions.length === 0) return 0;

  for (const sub of submissions) {
    if (!sub.projects) continue;

    const { data: orgUsers } = await supabase
      .from('user_organizations')
      .select('user_id')
      .eq('organization_id', sub.projects.organization_id)
      .in('role', ['PROMOTER', 'ARCHITECT', 'EG']);

    if (!orgUsers || orgUsers.length === 0) continue;

    for (const ou of orgUsers) {
      await supabase.from('notifications').insert({
        user_id: ou.user_id,
        type: 'SUBMISSION',
        title: `Clarifications ouvertes – ${sub.title}`,
        body: `Des clarifications sont en attente sur la soumission "${sub.title}".`,
        project_id: sub.project_id,
        link_url: `/projects/${sub.project_id}/submissions/${sub.id}`,
      });

      await supabase.from('tasks').insert({
        organization_id: sub.projects.organization_id,
        project_id: sub.project_id,
        title: `Répondre aux clarifications – ${sub.title}`,
        description: 'Clarifications en attente de réponse',
        type: 'SUBMISSION',
        status: 'OPEN',
        due_date: new Date().toISOString(),
        assigned_to_id: ou.user_id,
        created_by_id: ou.user_id,
      });

      notificationCount++;
    }
  }

  return notificationCount;
}

async function checkLateProjectPhases(supabase: any): Promise<number> {
  const now = new Date().toISOString();
  let notificationCount = 0;

  const { data: phases, error } = await supabase
    .from('project_phases')
    .select(`
      id,
      name,
      project_id,
      status,
      planned_end,
      projects(id, name, organization_id)
    `)
    .in('status', ['NOT_STARTED', 'IN_PROGRESS'])
    .not('planned_end', 'is', null)
    .lt('planned_end', now);

  if (error) throw error;
  if (!phases || phases.length === 0) return 0;

  for (const phase of phases) {
    if (!phase.projects) continue;

    const project = phase.projects;

    const { data: egUsers } = await supabase
      .from('user_organizations')
      .select('user_id')
      .eq('organization_id', project.organization_id)
      .in('role', ['EG', 'PROMOTER']);

    if (!egUsers || egUsers.length === 0) continue;

    for (const ou of egUsers) {
      await supabase.from('notifications').insert({
        user_id: ou.user_id,
        type: 'DEADLINE',
        title: `Phase en retard – ${phase.name}`,
        body: `La phase "${phase.name}" du projet ${project.name} est en retard par rapport au planning.`,
        project_id: project.id,
        link_url: `/projects/${project.id}/planning`,
      });

      await supabase.from('tasks').insert({
        organization_id: project.organization_id,
        project_id: project.id,
        title: `Analyser le retard – ${phase.name}`,
        description: `Phase en retard par rapport au planning prévu`,
        type: 'PLANNING',
        status: 'OPEN',
        due_date: now,
        assigned_to_id: ou.user_id,
        created_by_id: ou.user_id,
      });

      notificationCount++;
    }
  }

  return notificationCount;
}
