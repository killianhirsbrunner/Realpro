import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
    const path = url.pathname;

    if (method === 'GET' && path === '/overview') {
      const body = await req.json();
      const overview = await getOverview(supabase, body.organizationId);
      return jsonResponse(overview);
    }

    if (method === 'POST' && path === '/change-plan') {
      const body = await req.json();
      const result = await changePlan(supabase, body.organizationId, body);
      return jsonResponse(result);
    }

    if (method === 'POST' && path === '/payment-methods/init') {
      const body = await req.json();
      const result = await initPaymentMethodSetup(supabase, body.organizationId);
      return jsonResponse(result);
    }

    if (method === 'POST' && path === '/webhooks/datatrans') {
      const body = await req.json();
      await handleDatatransWebhook(supabase, body);
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ error: 'Route not found' }, 404);

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

function mapToDatatransLang(locale: string | null): string {
  if (!locale) return 'fr';
  const l = locale.toLowerCase();
  if (l.startsWith('de')) return 'de';
  if (l.startsWith('it')) return 'it';
  if (l.startsWith('en')) return 'en';
  return 'fr';
}

async function getOverview(supabase: any, organizationId: string) {
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('id', organizationId)
    .maybeSingle();

  if (orgError) throw orgError;
  if (!organization) throw new Error('Organisation introuvable');

  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select(`
      id,
      status,
      billing_cycle,
      current_period_start,
      current_period_end,
      trial_start,
      trial_end,
      plan:plans(
        id,
        slug,
        name,
        price_monthly,
        price_yearly,
        currency,
        features,
        limits
      )
    `)
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (subError) throw subError;

  const { data: plans, error: plansError } = await supabase
    .from('plans')
    .select('id, slug, name, description, price_monthly, price_yearly, currency, features, limits, trial_days')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (plansError) throw plansError;

  const { count: projectsCount } = await supabase
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', organizationId);

  const { count: usersCount } = await supabase
    .from('user_organizations')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', organizationId);

  return {
    organization: {
      id: organization.id,
      name: organization.name,
    },
    currentSubscription: subscription
      ? {
          planSlug: subscription.plan.slug,
          planName: subscription.plan.name,
          status: subscription.status,
          billingCycle: subscription.billing_cycle,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          trialStart: subscription.trial_start,
          trialEnd: subscription.trial_end,
          features: subscription.plan.features,
          limits: subscription.plan.limits,
        }
      : null,
    availablePlans: plans.map((p: any) => ({
      slug: p.slug,
      name: p.name,
      description: p.description,
      priceMonthly: p.price_monthly,
      priceYearly: p.price_yearly,
      currency: p.currency,
      features: p.features,
      limits: p.limits,
      trialDays: p.trial_days,
    })),
    usage: {
      projectsCount: projectsCount || 0,
      usersCount: usersCount || 0,
    },
  };
}

async function changePlan(supabase: any, organizationId: string, body: any) {
  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('id, slug, name, price_monthly, price_yearly, currency, is_active, trial_days')
    .eq('slug', body.planSlug)
    .maybeSingle();

  if (planError) throw planError;
  if (!plan || !plan.is_active) {
    throw new Error('Plan inconnu ou inactif');
  }

  const billingCycle = body.billingCycle || 'MONTHLY';
  const price = billingCycle === 'YEARLY' ? plan.price_yearly : plan.price_monthly;

  const now = new Date().toISOString();
  const nextPeriodEnd = addInterval(now, billingCycle);

  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('organization_id', organizationId)
    .maybeSingle();

  let subscription;

  if (!existingSub) {
    const trialEnd = plan.trial_days > 0 ? addDays(now, plan.trial_days) : null;

    const { data: newSub, error: createError } = await supabase
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

    if (createError) throw createError;
    subscription = newSub;
  } else {
    const { data: updatedSub, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        plan_id: plan.id,
        status: 'ACTIVE',
        billing_cycle: billingCycle,
        current_period_start: now,
        current_period_end: nextPeriodEnd,
      })
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (updateError) throw updateError;
    subscription = updatedSub;
  }

  await createSubscriptionInvoice(
    supabase,
    subscription.id,
    organizationId,
    price,
    plan.currency
  );

  return subscription;
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

async function createSubscriptionInvoice(
  supabase: any,
  subscriptionId: string,
  organizationId: string,
  amount: number,
  currency: string
) {
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('current_period_start, current_period_end')
    .eq('id', subscriptionId)
    .single();

  const { count } = await supabase
    .from('subscription_invoices')
    .select('id', { count: 'exact', head: true });

  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(
    (count || 0) + 1
  ).padStart(5, '0')}`;

  const now = new Date().toISOString();
  const dueDate = addDays(now, 30);

  await supabase.from('subscription_invoices').insert({
    subscription_id: subscriptionId,
    organization_id: organizationId,
    invoice_number: invoiceNumber,
    amount: amount,
    currency: currency,
    status: 'PENDING',
    issued_at: now,
    due_at: dueDate,
    period_start: subscription?.current_period_start || now,
    period_end: subscription?.current_period_end || addInterval(now, 'MONTHLY'),
  });
}

async function initPaymentMethodSetup(supabase: any, organizationId: string) {
  let customer = await supabase
    .from('datatrans_customers')
    .select('id, customer_ref')
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (!customer.data) {
    const { data: newCustomer, error } = await supabase
      .from('datatrans_customers')
      .insert({
        organization_id: organizationId,
        customer_ref: `ORG-${organizationId}`,
      })
      .select()
      .single();

    if (error) throw error;
    customer.data = newCustomer;
  }

  const transactionId = `dt_${Math.random().toString(36).substring(2, 10)}`;

  const { data: tx, error: txError } = await supabase
    .from('datatrans_transactions')
    .insert({
      organization_id: organizationId,
      transaction_id: transactionId,
      type: 'PAYMENT_METHOD_SETUP',
      status: 'PENDING',
    })
    .select()
    .single();

  if (txError) throw txError;

  const fakeRedirectUrl = `https://pay.sandbox.datatrans.com/upp/payment?tid=${transactionId}`;

  return {
    transactionId: tx.transaction_id,
    redirectUrl: fakeRedirectUrl,
  };
}

async function handleDatatransWebhook(supabase: any, payload: any) {
  const eventId = payload.eventId || payload.id || `evt_${Date.now()}`;
  const transactionId = payload.transactionId || payload.tid;
  const status = payload.status || payload.transactionStatus || 'unknown';

  const { data: existing } = await supabase
    .from('datatrans_webhook_events')
    .select('id')
    .eq('event_id', eventId)
    .maybeSingle();

  if (existing) {
    return;
  }

  await supabase.from('datatrans_webhook_events').insert({
    event_id: eventId,
    payload: payload,
  });

  const { data: tx } = await supabase
    .from('datatrans_transactions')
    .select('id, type, organization_id')
    .eq('transaction_id', transactionId)
    .maybeSingle();

  if (!tx) {
    return;
  }

  const finalStatus = status.toUpperCase() === 'SUCCESS' ? 'SUCCESS' : 'FAILED';

  await supabase
    .from('datatrans_transactions')
    .update({
      status: finalStatus,
      amount_cents: payload.amountCents || null,
      currency: payload.currency || null,
      raw_payload: payload,
    })
    .eq('id', tx.id);

  if (tx.type === 'INVOICE_PAYMENT' && finalStatus === 'SUCCESS') {
    // TODO: Update invoice status to PAID
    // Would need to link transaction to invoice via metadata
  }

  if (tx.type === 'PAYMENT_METHOD_SETUP' && finalStatus === 'SUCCESS') {
    // TODO: Mark payment method as ready in organization or subscription
  }
}
