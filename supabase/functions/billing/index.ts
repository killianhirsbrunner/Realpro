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
      current_period_start,
      current_period_end,
      plan:billing_plans(
        id,
        code,
        name,
        price_cents,
        currency,
        interval,
        features
      )
    `)
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (subError) throw subError;

  const { data: plans, error: plansError } = await supabase
    .from('billing_plans')
    .select('id, code, name, price_cents, currency, interval, features')
    .eq('active', true)
    .order('price_cents', { ascending: true });

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
          planCode: subscription.plan.code,
          planName: subscription.plan.name,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
        }
      : null,
    availablePlans: plans.map((p: any) => ({
      code: p.code,
      name: p.name,
      priceCents: p.price_cents,
      currency: p.currency,
      interval: p.interval,
      features: p.features,
    })),
    usage: {
      projectsCount: projectsCount || 0,
      usersCount: usersCount || 0,
    },
  };
}

async function changePlan(supabase: any, organizationId: string, body: any) {
  const { data: plan, error: planError } = await supabase
    .from('billing_plans')
    .select('id, code, name, price_cents, currency, interval, active')
    .eq('code', body.planCode)
    .maybeSingle();

  if (planError) throw planError;
  if (!plan || !plan.active) {
    throw new Error('Plan inconnu ou inactif');
  }

  const now = new Date().toISOString();
  const nextPeriodEnd = addInterval(now, plan.interval);

  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('organization_id', organizationId)
    .maybeSingle();

  let subscription;

  if (!existingSub) {
    const { data: newSub, error: createError } = await supabase
      .from('subscriptions')
      .insert({
        organization_id: organizationId,
        plan_id: plan.id,
        status: 'ACTIVE',
        current_period_start: now,
        current_period_end: nextPeriodEnd,
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
    plan.price_cents,
    plan.currency
  );

  return subscription;
}

function addInterval(dateStr: string, interval: string): string {
  const date = new Date(dateStr);
  if (interval === 'month') {
    date.setMonth(date.getMonth() + 1);
  } else if (interval === 'year') {
    date.setFullYear(date.getFullYear() + 1);
  }
  return date.toISOString();
}

async function createSubscriptionInvoice(
  supabase: any,
  subscriptionId: string,
  organizationId: string,
  amountCents: number,
  currency: string
) {
  const { count } = await supabase
    .from('subscription_invoices')
    .select('id', { count: 'exact', head: true })
    .eq('subscription_id', subscriptionId);

  const invoiceNumber = `SUB-${organizationId.slice(0, 6).toUpperCase()}-${String(
    (count || 0) + 1
  ).padStart(3, '0')}`;

  const now = new Date().toISOString();
  const dueDate = addInterval(now, 'month');

  await supabase.from('subscription_invoices').insert({
    subscription_id: subscriptionId,
    invoice_number: invoiceNumber,
    amount_cents: amountCents,
    currency: currency,
    issued_at: now,
    due_at: dueDate,
    status: 'OPEN',
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
