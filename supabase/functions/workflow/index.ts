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
    const method = req.method;
    const pathSegments = url.pathname.split('/').filter(Boolean);

    // GET /workflow/definitions - List workflow definitions
    if (method === 'GET' && pathSegments.length === 1 && pathSegments[0] === 'definitions') {
      const organizationId = url.searchParams.get('organizationId');
      const workflowType = url.searchParams.get('type');
      
      const result = await listWorkflowDefinitions(supabase, user.id, organizationId, workflowType);
      return jsonResponse(result);
    }

    // POST /workflow/start - Start a new workflow instance
    if (method === 'POST' && pathSegments.length === 1 && pathSegments[0] === 'start') {
      const body = await req.json();
      const result = await startWorkflow(supabase, user.id, body);
      return jsonResponse(result);
    }

    // GET /workflow/instances/:id - Get workflow instance details
    if (method === 'GET' && pathSegments.length === 2 && pathSegments[0] === 'instances') {
      const instanceId = pathSegments[1];
      const result = await getWorkflowInstance(supabase, user.id, instanceId);
      return jsonResponse(result);
    }

    // GET /workflow/instances - List workflow instances
    if (method === 'GET' && pathSegments.length === 1 && pathSegments[0] === 'instances') {
      const organizationId = url.searchParams.get('organizationId');
      const projectId = url.searchParams.get('projectId');
      const status = url.searchParams.get('status');
      
      const result = await listWorkflowInstances(supabase, user.id, { organizationId, projectId, status });
      return jsonResponse(result);
    }

    // POST /workflow/transition - Transition to next step
    if (method === 'POST' && pathSegments.length === 1 && pathSegments[0] === 'transition') {
      const body = await req.json();
      const result = await transitionWorkflow(supabase, user.id, body);
      return jsonResponse(result);
    }

    // POST /workflow/approve - Approve current step
    if (method === 'POST' && pathSegments.length === 1 && pathSegments[0] === 'approve') {
      const body = await req.json();
      const result = await approveWorkflowStep(supabase, user.id, body);
      return jsonResponse(result);
    }

    // POST /workflow/reject - Reject current step
    if (method === 'POST' && pathSegments.length === 1 && pathSegments[0] === 'reject') {
      const body = await req.json();
      const result = await rejectWorkflowStep(supabase, user.id, body);
      return jsonResponse(result);
    }

    // POST /workflow/cancel - Cancel workflow instance
    if (method === 'POST' && pathSegments.length === 1 && pathSegments[0] === 'cancel') {
      const body = await req.json();
      const result = await cancelWorkflow(supabase, user.id, body);
      return jsonResponse(result);
    }

    // GET /workflow/actions - Execute workflow actions
    if (method === 'POST' && pathSegments.length === 1 && pathSegments[0] === 'execute-actions') {
      const body = await req.json();
      const result = await executeWorkflowActions(supabase, body);
      return jsonResponse(result);
    }

    return jsonResponse({ error: 'Route not found' }, 404);

  } catch (error) {
    console.error('Workflow function error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

// ===== HELPER FUNCTIONS =====

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function listWorkflowDefinitions(supabase: any, userId: string, organizationId?: string | null, workflowType?: string | null) {
  let query = supabase
    .from('workflow_definitions')
    .select('*')
    .eq('is_active', true);

  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }

  if (workflowType) {
    query = query.eq('workflow_type', workflowType);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return { data };
}

async function startWorkflow(supabase: any, userId: string, body: any) {
  const { workflowType, entityType, entityId, projectId, organizationId } = body;

  if (!workflowType || !entityType || !entityId || !organizationId) {
    throw new Error('Missing required fields: workflowType, entityType, entityId, organizationId');
  }

  // Call the database function to start workflow
  const { data, error } = await supabase.rpc('start_workflow_instance', {
    p_workflow_type: workflowType,
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_project_id: projectId,
    p_organization_id: organizationId,
    p_initiator_id: userId,
  });

  if (error) throw error;

  // Get the created workflow instance
  const { data: instance, error: instanceError } = await supabase
    .from('workflow_instances')
    .select('*, workflow_steps(*)')
    .eq('id', data)
    .single();

  if (instanceError) throw instanceError;

  return { data: instance };
}

async function getWorkflowInstance(supabase: any, userId: string, instanceId: string) {
  const { data, error } = await supabase
    .from('workflow_instances')
    .select(`
      *,
      workflow_definition:workflow_definitions(*),
      project:projects(id, name),
      initiator:users!workflow_instances_initiator_id_fkey(id, first_name, last_name, email),
      assigned_user:users!workflow_instances_assigned_to_fkey(id, first_name, last_name, email),
      workflow_steps(
        *,
        assigned_user:users(id, first_name, last_name, email),
        approved_user:users!workflow_steps_approved_by_fkey(id, first_name, last_name, email)
      ),
      workflow_transitions(
        *,
        triggered_user:users(id, first_name, last_name, email)
      )
    `)
    .eq('id', instanceId)
    .single();

  if (error) throw error;
  return { data };
}

async function listWorkflowInstances(supabase: any, userId: string, filters: any) {
  let query = supabase
    .from('workflow_instances')
    .select(`
      *,
      workflow_definition:workflow_definitions(name, workflow_type),
      project:projects(id, name),
      initiator:users!workflow_instances_initiator_id_fkey(id, first_name, last_name)
    `);

  if (filters.organizationId) {
    query = query.eq('organization_id', filters.organizationId);
  }

  if (filters.projectId) {
    query = query.eq('project_id', filters.projectId);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return { data };
}

async function transitionWorkflow(supabase: any, userId: string, body: any) {
  const { instanceId, currentStepKey, nextStepKey, comment } = body;

  if (!instanceId || !currentStepKey) {
    throw new Error('Missing required fields: instanceId, currentStepKey');
  }

  const { data, error } = await supabase.rpc('transition_workflow_step', {
    p_workflow_instance_id: instanceId,
    p_current_step_key: currentStepKey,
    p_next_step_key: nextStepKey || null,
    p_user_id: userId,
    p_comment: comment || null,
  });

  if (error) throw error;

  // Get updated instance
  const instance = await getWorkflowInstance(supabase, userId, instanceId);
  return instance;
}

async function approveWorkflowStep(supabase: any, userId: string, body: any) {
  const { instanceId, stepId, comment } = body;

  if (!instanceId || !stepId) {
    throw new Error('Missing required fields: instanceId, stepId');
  }

  // Update step with approval
  const { error } = await supabase
    .from('workflow_steps')
    .update({
      approved_by: userId,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', stepId);

  if (error) throw error;

  // Get step details for transition
  const { data: step, error: stepError } = await supabase
    .from('workflow_steps')
    .select('*, workflow_instance:workflow_instances(*)')
    .eq('id', stepId)
    .single();

  if (stepError) throw stepError;

  // Get config to find next step
  const { data: definition } = await supabase
    .from('workflow_definitions')
    .select('config')
    .eq('id', step.workflow_instance.workflow_definition_id)
    .single();

  const steps = definition.config.steps || [];
  const currentIndex = steps.findIndex((s: any) => s.key === step.step_key);
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;

  // Transition to next step
  await transitionWorkflow(supabase, userId, {
    instanceId,
    currentStepKey: step.step_key,
    nextStepKey: nextStep?.key,
    comment: comment || 'Step approved',
  });

  return { success: true, message: 'Step approved successfully' };
}

async function rejectWorkflowStep(supabase: any, userId: string, body: any) {
  const { instanceId, stepId, reason } = body;

  if (!instanceId || !stepId || !reason) {
    throw new Error('Missing required fields: instanceId, stepId, reason');
  }

  // Update step with rejection
  const { error } = await supabase
    .from('workflow_steps')
    .update({
      status: 'failed',
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', stepId);

  if (error) throw error;

  // Update instance status
  const { error: instanceError } = await supabase
    .from('workflow_instances')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', instanceId);

  if (instanceError) throw instanceError;

  // Log transition
  await supabase.from('workflow_transitions').insert({
    workflow_instance_id: instanceId,
    workflow_step_id: stepId,
    from_status: 'in_progress',
    to_status: 'failed',
    triggered_by: userId,
    transition_type: 'manual',
    comment: `Step rejected: ${reason}`,
  });

  return { success: true, message: 'Step rejected' };
}

async function cancelWorkflow(supabase: any, userId: string, body: any) {
  const { instanceId, reason } = body;

  if (!instanceId) {
    throw new Error('Missing required field: instanceId');
  }

  const { error } = await supabase
    .from('workflow_instances')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', instanceId);

  if (error) throw error;

  // Log cancellation
  await supabase.from('workflow_transitions').insert({
    workflow_instance_id: instanceId,
    from_status: 'active',
    to_status: 'cancelled',
    triggered_by: userId,
    transition_type: 'manual',
    comment: reason || 'Workflow cancelled by user',
  });

  return { success: true, message: 'Workflow cancelled' };
}

async function executeWorkflowActions(supabase: any, body: any) {
  const { workflowInstanceId, triggerEvent, stepKey } = body;

  if (!workflowInstanceId || !triggerEvent) {
    throw new Error('Missing required fields: workflowInstanceId, triggerEvent');
  }

  // Get workflow instance and definition
  const { data: instance, error: instanceError } = await supabase
    .from('workflow_instances')
    .select('*, workflow_definition:workflow_definitions(*)')
    .eq('id', workflowInstanceId)
    .single();

  if (instanceError) throw instanceError;

  // Get actions to execute
  let query = supabase
    .from('workflow_actions')
    .select('*')
    .eq('workflow_definition_id', instance.workflow_definition_id)
    .eq('trigger_event', triggerEvent)
    .eq('is_active', true);

  if (stepKey) {
    query = query.eq('trigger_step_key', stepKey);
  }

  const { data: actions, error: actionsError } = await query.order('execution_order');

  if (actionsError) throw actionsError;

  const results = [];

  for (const action of actions) {
    try {
      let result;
      
      switch (action.action_type) {
        case 'create_notification':
          result = await executeNotificationAction(supabase, action, instance);
          break;
        case 'create_task':
          result = await executeTaskAction(supabase, action, instance);
          break;
        case 'send_email':
          result = await executeEmailAction(action, instance);
          break;
        case 'update_status':
          result = await executeStatusUpdateAction(supabase, action, instance);
          break;
        default:
          result = { skipped: true, reason: `Action type ${action.action_type} not implemented` };
      }
      
      results.push({ action: action.action_name, success: true, result });
    } catch (error) {
      results.push({ action: action.action_name, success: false, error: error.message });
    }
  }

  return { executed: results.length, results };
}

async function executeNotificationAction(supabase: any, action: any, instance: any) {
  const config = action.config;
  const { data, error } = await supabase.from('notifications').insert({
    user_id: instance.assigned_to || instance.initiator_id,
    organization_id: instance.organization_id,
    type: config.type || 'PROJECT',
    priority: config.priority || 'MEDIUM',
    title: config.title || 'Workflow Notification',
    message: config.message || '',
    metadata: { workflow_instance_id: instance.id },
  });

  if (error) throw error;
  return { notificationCreated: true };
}

async function executeTaskAction(supabase: any, action: any, instance: any) {
  const config = action.config;
  const { data, error } = await supabase.from('tasks').insert({
    organization_id: instance.organization_id,
    project_id: instance.project_id,
    title: config.title || 'Workflow Task',
    description: config.description || '',
    type: config.task_type || 'GENERIC',
    status: 'OPEN',
    assigned_to: instance.assigned_to,
    due_date: config.due_date,
  });

  if (error) throw error;
  return { taskCreated: true };
}

async function executeEmailAction(action: any, instance: any) {
  // Placeholder for email sending
  return { emailQueued: true, config: action.config };
}

async function executeStatusUpdateAction(supabase: any, action: any, instance: any) {
  const config = action.config;
  const { entityType, entityId } = instance;
  
  if (!config.new_status) {
    throw new Error('Missing new_status in action config');
  }

  // Update entity status based on entity type
  const tableName = entityType === 'supplier_offer' ? 'supplier_offers' : 
                    entityType === 'avenant' ? 'avenants' : null;
  
  if (!tableName) {
    throw new Error(`Cannot update status for entity type: ${entityType}`);
  }

  const { error } = await supabase
    .from(tableName)
    .update({ status: config.new_status, updated_at: new Date().toISOString() })
    .eq('id', entityId);

  if (error) throw error;
  return { statusUpdated: true, newStatus: config.new_status };
}
