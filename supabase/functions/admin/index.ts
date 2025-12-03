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
    const path = url.pathname.replace('/admin', '');

    if (method === 'GET' && path === '/organizations') {
      const result = await listOrganizationsWithUsage(supabase);
      return jsonResponse(result);
    }

    if (method === 'PATCH' && path.startsWith('/organizations/')) {
      const parts = path.split('/');
      const orgId = parts[2];

      if (parts[3] === 'plan') {
        const body = await req.json();
        const result = await changeOrganizationPlan(supabase, orgId, body.planSlug, body.billingCycle);
        return jsonResponse(result);
      }

      if (parts[3] === 'settings') {
        const body = await req.json();
        const result = await updateOrganizationSettings(supabase, orgId, body);
        return jsonResponse(result);
      }
    }

    if (method === 'GET' && path === '/plans') {
      const result = await listPlans(supabase);
      return jsonResponse(result);
    }

    if (method === 'GET' && path === '/stats') {
      const result = await getGlobalStats(supabase);
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

async function listOrganizationsWithUsage(supabase: any) {
  const { data: organizations, error: orgsError } = await supabase
    .from('organizations')
    .select(`
      id,
      name,
      default_language,
      created_at
    `)
    .order('name', { ascending: true });

  if (orgsError) throw orgsError;

  const results = [];

  for (const org of organizations) {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        status,
        billing_cycle,
        current_period_end,
        plan:plans(
          slug,
          name
        )
      `)
      .eq('organization_id', org.id)
      .maybeSingle();

    const { count: projectsCount } = await supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', org.id);

    const { count: usersCount } = await supabase
      .from('user_organizations')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', org.id);

    results.push({
      id: org.id,
      name: org.name,
      defaultLanguage: org.default_language,
      plan: subscription?.plan?.name || 'Aucun',
      planSlug: subscription?.plan?.slug || null,
      subscriptionStatus: subscription?.status || null,
      billingCycle: subscription?.billing_cycle || null,
      currentPeriodEnd: subscription?.current_period_end || null,
      projectsCount: projectsCount || 0,
      usersCount: usersCount || 0,
      createdAt: org.created_at,
    });
  }

  return results;
}

async function listPlans(supabase: any) {
  const { data: plans, error } = await supabase
    .from('plans')
    .select('id, slug, name, description, price_monthly, price_yearly, currency, is_active, limits, feature_flags')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return plans.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    priceMonthly: p.price_monthly,
    priceYearly: p.price_yearly,
    currency: p.currency,
    limits: p.limits,
    featureFlags: p.feature_flags,
  }));
}

async function changeOrganizationPlan(
  supabase: any,
  organizationId: string,
  planSlug: string,
  billingCycle: string = 'MONTHLY'
) {
  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('id, slug, name, price_monthly, price_yearly, trial_days')
    .eq('slug', planSlug)
    .eq('is_active', true)
    .maybeSingle();

  if (planError) throw planError;
  if (!plan) throw new Error('Plan non trouvé');

  const now = new Date().toISOString();
  const nextPeriodEnd = addInterval(now, billingCycle);

  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (existingSub) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        plan_id: plan.id,
        status: 'ACTIVE',
        billing_cycle: billingCycle,
        current_period_end: nextPeriodEnd,
        trial_end: null,
      })
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const trialEnd = plan.trial_days > 0 ? addDays(now, plan.trial_days) : null;

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        organization_id: organizationId,
        plan_id: plan.id,
        status: plan.trial_days > 0 ? 'TRIAL' : 'ACTIVE',
        billing_cycle: billingCycle,
        current_period_start: now,
        current_period_end: nextPeriodEnd,
        trial_start: plan.trial_days > 0 ? now : null,
        trial_end: trialEnd,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

async function updateOrganizationSettings(supabase: any, organizationId: string, settings: any) {
  const { data: existing } = await supabase
    .from('organization_settings')
    .select('id')
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('organization_settings')
      .update(settings)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('organization_settings')
      .insert({
        organization_id: organizationId,
        ...settings,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

async function getGlobalStats(supabase: any) {
  const { count: orgsCount } = await supabase
    .from('organizations')
    .select('id', { count: 'exact', head: true });

  const { count: projectsCount } = await supabase
    .from('projects')
    .select('id', { count: 'exact', head: true });

  const { count: usersCount } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true });

  const { count: activeSubsCount } = await supabase
    .from('subscriptions')
    .select('id', { count: 'exact', head: true })
    .in('status', ['TRIAL', 'ACTIVE']);

  return {
    organizations: orgsCount || 0,
    projects: projectsCount || 0,
    users: usersCount || 0,
    activeSubscriptions: activeSubsCount || 0,
  };
}

function addInterval(dateStr: string, cycle: string): string {
  const date = new Date(dateStr);
  if (cycle === 'MONTHLY') {
    date.setMonth(date.getMonth() + 1);
  } else if (cycle === 'YEARLY') {
    date.setFullYear(date.getFullYear() + 1);
  }
  return date.toISOString();
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
