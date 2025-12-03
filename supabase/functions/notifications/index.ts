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
      const notifications = await listMyNotifications(supabase, body.userId);
      return jsonResponse(notifications);
    }

    if (method === 'POST' && pathSegments[0] === 'read') {
      const body = await req.json();
      const result = await markAsRead(supabase, body.userId, body.notificationIds);
      return jsonResponse(result);
    }

    if (method === 'POST' && pathSegments[0] === 'read-all') {
      const body = await req.json();
      const result = await markAllAsRead(supabase, body.userId);
      return jsonResponse(result);
    }

    if (method === 'POST' && pathSegments[0] === 'create') {
      const body = await req.json();
      const notification = await createNotification(supabase, body);
      return jsonResponse(notification);
    }

    if (method === 'GET' && pathSegments[0] && pathSegments[0] !== 'me') {
      const notificationId = pathSegments[0];
      const body = await req.json().catch(() => ({}));
      const notification = await getNotification(supabase, notificationId, body.userId);
      return jsonResponse(notification);
    }

    return jsonResponse({ error: 'Route introuvable' }, 404);

  } catch (error) {
    console.error('Error in notifications function:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function listMyNotifications(supabase: any, userId: string) {
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;

  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('read_at', null);

  return {
    unreadCount: unreadCount || 0,
    notifications: notifications?.map((n: any) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      projectId: n.project_id,
      linkUrl: n.link_url,
      readAt: n.read_at,
      createdAt: n.created_at,
    })) || [],
  };
}

async function markAsRead(supabase: any, userId: string, notificationIds: string[]) {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .in('id', notificationIds)
    .eq('user_id', userId);

  if (error) throw error;

  return listMyNotifications(supabase, userId);
}

async function markAllAsRead(supabase: any, userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('read_at', null);

  if (error) throw error;

  return listMyNotifications(supabase, userId);
}

async function createNotification(supabase: any, data: any) {
  const { userId, type, title, body, projectId, linkUrl } = data;

  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      body: body || null,
      project_id: projectId || null,
      link_url: linkUrl || null,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    projectId: notification.project_id,
    linkUrl: notification.link_url,
    createdAt: notification.created_at,
  };
}

async function getNotification(supabase: any, notificationId: string, userId: string) {
  const { data: notification, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('id', notificationId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!notification) throw new Error('Notification introuvable');

  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    projectId: notification.project_id,
    linkUrl: notification.link_url,
    readAt: notification.read_at,
    createdAt: notification.created_at,
  };
}
