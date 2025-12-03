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

    if (method === 'GET' && pathSegments[0] === 'me') {
      const body = await req.json().catch(() => ({}));
      const tasks = await listMyTasks(supabase, body.userId);
      return jsonResponse(tasks);
    }

    if (method === 'GET' && pathSegments[0] === 'projects' && pathSegments[1]) {
      const projectId = pathSegments[1];
      const tasks = await listProjectTasks(supabase, projectId);
      return jsonResponse(tasks);
    }

    if (method === 'POST' && !pathSegments[0]) {
      const body = await req.json();
      const task = await createTask(supabase, body);
      return jsonResponse(task);
    }

    if (method === 'PATCH' && pathSegments[0]) {
      const taskId = pathSegments[0];
      const body = await req.json();
      const task = await updateTask(supabase, taskId, body);
      return jsonResponse(task);
    }

    if (method === 'POST' && pathSegments[0] && pathSegments[1] === 'complete') {
      const taskId = pathSegments[0];
      const body = await req.json();
      const task = await completeTask(supabase, taskId, body);
      return jsonResponse(task);
    }

    if (method === 'DELETE' && pathSegments[0]) {
      const taskId = pathSegments[0];
      await deleteTask(supabase, taskId);
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: 'Route introuvable' }, 404);

  } catch (error) {
    console.error('Error in tasks function:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function listMyTasks(supabase: any, userId: string) {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select(`
      *,
      project:projects(id, name),
      assignedTo:users!tasks_assigned_to_id_fkey(id, first_name, last_name),
      createdBy:users!tasks_created_by_id_fkey(id, first_name, last_name)
    `)
    .or(`assigned_to_id.eq.${userId},created_by_id.eq.${userId}`)
    .order('due_date', { ascending: true, nullsFirst: false })
    .limit(100);

  if (error) throw error;

  return tasks?.map((t: any) => ({
    id: t.id,
    organizationId: t.organization_id,
    projectId: t.project_id,
    project: t.project ? {
      id: t.project.id,
      name: t.project.name,
    } : null,
    title: t.title,
    description: t.description,
    type: t.type,
    status: t.status,
    dueDate: t.due_date,
    assignedToId: t.assigned_to_id,
    assignedTo: t.assignedTo ? {
      id: t.assignedTo.id,
      firstName: t.assignedTo.first_name,
      lastName: t.assignedTo.last_name,
    } : null,
    createdById: t.created_by_id,
    createdBy: t.createdBy ? {
      id: t.createdBy.id,
      firstName: t.createdBy.first_name,
      lastName: t.createdBy.last_name,
    } : null,
    completedAt: t.completed_at,
    createdAt: t.created_at,
  })) || [];
}

async function listProjectTasks(supabase: any, projectId: string) {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignedTo:users!tasks_assigned_to_id_fkey(id, first_name, last_name),
      createdBy:users!tasks_created_by_id_fkey(id, first_name, last_name)
    `)
    .eq('project_id', projectId)
    .order('due_date', { ascending: true, nullsFirst: false });

  if (error) throw error;

  return tasks?.map((t: any) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    type: t.type,
    status: t.status,
    dueDate: t.due_date,
    assignedToId: t.assigned_to_id,
    assignedTo: t.assignedTo ? {
      id: t.assignedTo.id,
      firstName: t.assignedTo.first_name,
      lastName: t.assignedTo.last_name,
    } : null,
    completedAt: t.completed_at,
    createdAt: t.created_at,
  })) || [];
}

async function createTask(supabase: any, data: any) {
  const {
    userId,
    organizationId,
    projectId,
    title,
    description,
    dueDate,
    assignedToId,
    type,
  } = data;

  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      organization_id: organizationId,
      project_id: projectId || null,
      title,
      description: description || null,
      due_date: dueDate || null,
      assigned_to_id: assignedToId || null,
      type: type || 'GENERIC',
      status: 'OPEN',
      created_by_id: userId,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: task.id,
    organizationId: task.organization_id,
    projectId: task.project_id,
    title: task.title,
    description: task.description,
    type: task.type,
    status: task.status,
    dueDate: task.due_date,
    assignedToId: task.assigned_to_id,
    createdById: task.created_by_id,
    completedAt: task.completed_at,
    createdAt: task.created_at,
  };
}

async function updateTask(supabase: any, taskId: string, data: any) {
  const { title, description, dueDate, status, assignedToId } = data;

  const updates: any = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (dueDate !== undefined) updates.due_date = dueDate;
  if (status !== undefined) updates.status = status;
  if (assignedToId !== undefined) updates.assigned_to_id = assignedToId;

  const { data: task, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;

  return {
    id: task.id,
    organizationId: task.organization_id,
    projectId: task.project_id,
    title: task.title,
    description: task.description,
    type: task.type,
    status: task.status,
    dueDate: task.due_date,
    assignedToId: task.assigned_to_id,
    createdById: task.created_by_id,
    completedAt: task.completed_at,
    createdAt: task.created_at,
  };
}

async function completeTask(supabase: any, taskId: string, data: any) {
  const completedAt = data.completedAt || new Date().toISOString();

  const { data: task, error } = await supabase
    .from('tasks')
    .update({
      status: 'DONE',
      completed_at: completedAt,
    })
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;

  return {
    id: task.id,
    organizationId: task.organization_id,
    projectId: task.project_id,
    title: task.title,
    description: task.description,
    type: task.type,
    status: task.status,
    dueDate: task.due_date,
    assignedToId: task.assigned_to_id,
    createdById: task.created_by_id,
    completedAt: task.completed_at,
    createdAt: task.created_at,
  };
}

async function deleteTask(supabase: any, taskId: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
}
