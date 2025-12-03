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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return jsonResponse({ error: 'Non authentifié' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return jsonResponse({ error: 'Non autorisé' }, 401);
    }

    const url = new URL(req.url);
    const method = req.method;
    const path = url.pathname.replace('/project-wizard', '');

    const projectIdMatch = path.match(/^\/projects\/([^/]+)/);
    if (!projectIdMatch) {
      return jsonResponse({ error: 'ID projet manquant' }, 400);
    }

    const projectId = projectIdMatch[1];

    const { data: project } = await supabase
      .from('projects')
      .select('id, organization_id')
      .eq('id', projectId)
      .maybeSingle();

    if (!project) {
      return jsonResponse({ error: 'Projet introuvable' }, 404);
    }

    const { data: membership } = await supabase
      .from('user_organizations')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', project.organization_id)
      .maybeSingle();

    if (!membership) {
      return jsonResponse({ error: 'Accès non autorisé' }, 403);
    }

    if (method === 'GET' && path.endsWith('/wizard')) {
      const result = await getWizardState(supabase, projectId);
      return jsonResponse(result);
    }

    if (method === 'POST' && path.match(/\/wizard\/step\/\d+$/)) {
      const stepMatch = path.match(/\/step\/(\d+)$/);
      const stepIndex = parseInt(stepMatch![1]);
      const body = await req.json();
      const result = await updateWizardStep(supabase, projectId, stepIndex, body);
      return jsonResponse(result);
    }

    if (method === 'POST' && path.endsWith('/wizard/complete')) {
      const result = await completeWizard(supabase, projectId);
      return jsonResponse(result);
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404);

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

async function getWizardState(supabase: any, projectId: string) {
  let { data: state, error } = await supabase
    .from('project_setup_wizard_states')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle();

  if (error) throw error;

  if (!state) {
    const { data: newState, error: createError } = await supabase
      .from('project_setup_wizard_states')
      .insert({
        project_id: projectId,
        current_step: 1,
        completed: false,
        data: {},
      })
      .select()
      .single();

    if (createError) throw createError;
    state = newState;
  }

  return {
    projectId: state.project_id,
    currentStep: state.current_step,
    completed: state.completed,
    data: state.data || {},
    updatedAt: state.updated_at,
  };
}

async function updateWizardStep(supabase: any, projectId: string, stepIndex: number, stepData: any) {
  const { data: state } = await supabase
    .from('project_setup_wizard_states')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle();

  if (!state) {
    throw new Error('État du wizard non trouvé');
  }

  const wizardData = state.data || {};

  if (stepIndex === 1) {
    wizardData.step1 = { ...(wizardData.step1 || {}), ...stepData };

    await supabase
      .from('projects')
      .update({
        name: stepData.name || wizardData.step1.name,
        city: stepData.city || wizardData.step1.city || null,
        language: stepData.language || wizardData.step1.language || null,
      })
      .eq('id', projectId);
  }

  if (stepIndex === 2) {
    wizardData.step2 = { ...(wizardData.step2 || {}), ...stepData };

    if (stepData.buildings && Array.isArray(stepData.buildings)) {
      for (const building of stepData.buildings) {
        if (building.name && building.name.trim()) {
          await supabase
            .from('buildings')
            .upsert({
              project_id: projectId,
              name: building.name,
            }, {
              onConflict: 'project_id,name',
            });
        }
      }
    }
  }

  if (stepIndex === 3) {
    wizardData.step3 = { ...(wizardData.step3 || {}), ...stepData };

    const updateData: any = {};
    if (stepData.vatRate !== undefined) updateData.vat_rate = stepData.vatRate;
    if (stepData.saleMode) updateData.sale_mode = stepData.saleMode;

    if (Object.keys(updateData).length > 0) {
      await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId);
    }
  }

  if (stepIndex === 4) {
    wizardData.step4 = { ...(wizardData.step4 || {}), ...stepData };
  }

  if (stepIndex === 5) {
    wizardData.step5 = { ...(wizardData.step5 || {}), ...stepData };
  }

  const nextStep = Math.max(state.current_step, stepIndex + 1);

  const { data: updatedState, error: updateError } = await supabase
    .from('project_setup_wizard_states')
    .update({
      data: wizardData,
      current_step: nextStep,
    })
    .eq('project_id', projectId)
    .select()
    .single();

  if (updateError) throw updateError;

  return {
    projectId: updatedState.project_id,
    currentStep: updatedState.current_step,
    completed: updatedState.completed,
    data: updatedState.data || {},
    updatedAt: updatedState.updated_at,
  };
}

async function completeWizard(supabase: any, projectId: string) {
  const { data: state } = await supabase
    .from('project_setup_wizard_states')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle();

  if (!state) {
    throw new Error('État du wizard non trouvé');
  }

  if (state.completed) {
    return {
      projectId: state.project_id,
      currentStep: state.current_step,
      completed: true,
      data: state.data || {},
      updatedAt: state.updated_at,
    };
  }

  const { data: updatedState, error } = await supabase
    .from('project_setup_wizard_states')
    .update({
      completed: true,
    })
    .eq('project_id', projectId)
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from('projects')
    .update({
      status: 'ACTIVE',
    })
    .eq('id', projectId);

  return {
    projectId: updatedState.project_id,
    currentStep: updatedState.current_step,
    completed: true,
    data: updatedState.data || {},
    updatedAt: updatedState.updated_at,
  };
}
