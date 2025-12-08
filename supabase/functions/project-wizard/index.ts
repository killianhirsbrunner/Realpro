import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
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

    if (req.method === 'POST') {
      const body = await req.json();
      const { organizationId, userId, projectData } = body;

      if (!organizationId || !userId || !projectData) {
        return jsonResponse({ error: 'Données manquantes' }, 400);
      }

      const { data: membership } = await supabase
        .from('user_organizations')
        .select('role')
        .eq('user_id', userId)
        .eq('organization_id', organizationId)
        .maybeSingle();

      if (!membership) {
        return jsonResponse({ error: 'Accès non autorisé' }, 403);
      }

      const result = await createCompleteProject(supabase, organizationId, userId, projectData);
      return jsonResponse(result);
    }

    return jsonResponse({ error: 'Méthode non supportée' }, 405);

  } catch (error) {
    console.error('Error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function createCompleteProject(
  supabase: any,
  organizationId: string,
  userId: string,
  projectData: any
) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      organization_id: organizationId,
      name: projectData.name,
      address: projectData.address,
      city: projectData.city,
      canton: projectData.canton,
      type: projectData.type || 'PPE',
      status: 'ACTIVE',
      language: projectData.defaultLanguage || 'fr',
      vat_rate: parseFloat(projectData.vatRate || '8.1'),
      description: projectData.description || null,
      start_date: projectData.startDate || null,
      end_date: projectData.endDate || null,
    })
    .select()
    .single();

  if (projectError) throw projectError;

  await createDocumentFolders(supabase, project.id);

  if (projectData.lots && projectData.lots.length > 0) {
    await createLots(supabase, project.id, projectData.lots);
  }

  if (projectData.actors && projectData.actors.length > 0) {
    await inviteActors(supabase, project.id, organizationId, projectData.actors);
  }

  if (projectData.totalBudget) {
    await createBudgets(supabase, project.id, parseFloat(projectData.totalBudget));
  }

  if (projectData.startDate && projectData.endDate) {
    await createPlanningPhases(supabase, project.id, projectData.startDate, projectData.endDate);
  }

  return {
    projectId: project.id,
    success: true,
  };
}

async function createDocumentFolders(supabase: any, projectId: string) {
  const folders = [
    '01 - Juridique',
    '02 - Plans',
    '03 - Contrats',
    '04 - Soumissions',
    '05 - Commercial',
    '06 - Dossiers acheteurs',
    '07 - Chantier / PV',
    '08 - Factures & Finances',
  ];

  for (const folderName of folders) {
    await supabase.from('document_folders').insert({
      project_id: projectId,
      name: folderName,
      parent_id: null,
    });
  }
}

async function createLots(supabase: any, projectId: string, lots: any[]) {
  const lotsToInsert = lots.map((lot) => ({
    project_id: projectId,
    number: lot.number || '',
    type: lot.type || 'APPARTEMENT',
    floor: lot.floor || '1',
    surface: parseFloat(lot.surface) || 0,
    price: parseFloat(lot.price) || 0,
    status: 'AVAILABLE',
  }));

  await supabase.from('lots').insert(lotsToInsert);
}

async function inviteActors(supabase: any, projectId: string, organizationId: string, actors: any[]) {
  for (const actor of actors) {
    if (!actor.email || !actor.sendInvite) continue;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', actor.email)
      .maybeSingle();

    if (existingUser) {
      await supabase.from('project_participants').insert({
        project_id: projectId,
        user_id: existingUser.id,
        role: actor.role || 'VIEWER',
      });
    }
  }
}

async function createBudgets(supabase: any, projectId: string, totalBudget: number) {
  const { data: budget, error: budgetError } = await supabase
    .from('cfc_budgets')
    .insert({
      project_id: projectId,
      name: 'Budget principal',
      version: 'V1',
      total_amount: totalBudget,
      status: 'DRAFT',
    })
    .select()
    .single();

  if (budgetError) throw budgetError;

  const cfcCategories = [
    { code: '0', label: 'Terrain', percent: 0 },
    { code: '1', label: 'Travaux préparatoires', percent: 5 },
    { code: '2', label: 'Bâtiment', percent: 60 },
    { code: '3', label: 'Équipements d\'exploitation', percent: 10 },
    { code: '4', label: 'Aménagements extérieurs', percent: 10 },
    { code: '5', label: 'Frais annexes', percent: 15 },
  ];

  for (const cfc of cfcCategories) {
    const amount = (totalBudget * cfc.percent) / 100;

    await supabase.from('cfc_lines').insert({
      budget_id: budget.id,
      code: cfc.code,
      label: cfc.label,
      amount_budgeted: amount,
      amount_committed: 0,
      amount_spent: 0,
    });
  }
}

async function createPlanningPhases(supabase: any, projectId: string, startDate: string, endDate: string) {
  const phases = [
    { name: 'Travaux préparatoires', duration: 30, order: 1 },
    { name: 'Gros œuvre', duration: 180, order: 2 },
    { name: 'Second œuvre', duration: 120, order: 3 },
    { name: 'Finitions', duration: 90, order: 4 },
    { name: 'Aménagements extérieurs', duration: 60, order: 5 },
    { name: 'Réception', duration: 30, order: 6 },
  ];

  const start = new Date(startDate);
  let currentStart = new Date(start);

  for (const phase of phases) {
    const phaseEnd = new Date(currentStart);
    phaseEnd.setDate(phaseEnd.getDate() + phase.duration);

    await supabase.from('planning_phases').insert({
      project_id: projectId,
      name: phase.name,
      start_date: currentStart.toISOString(),
      end_date: phaseEnd.toISOString(),
      status: 'NOT_STARTED',
      progress: 0,
      sort_order: phase.order,
    });

    currentStart = new Date(phaseEnd);
  }
}
