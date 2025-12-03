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

    const getContractMatch = path.match(/^\/contracts\/([^\/]+)$/);
    if (method === 'GET' && getContractMatch) {
      const contractId = getContractMatch[1];
      const contract = await getContract(supabase, contractId);
      return jsonResponse(contract);
    }

    const listContractsMatch = path.match(/^\/projects\/([^\/]+)\/contracts$/);
    if (method === 'GET' && listContractsMatch) {
      const projectId = listContractsMatch[1];
      const contracts = await listContracts(supabase, projectId);
      return jsonResponse(contracts);
    }

    if (method === 'POST' && listContractsMatch) {
      const projectId = listContractsMatch[1];
      const body = await req.json();
      const contract = await createContract(supabase, projectId, body);
      return jsonResponse(contract, 201);
    }

    const changeOrderMatch = path.match(/^\/contracts\/([^\/]+)\/change-orders$/);
    if (method === 'POST' && changeOrderMatch) {
      const contractId = changeOrderMatch[1];
      const body = await req.json();
      const changeOrder = await addChangeOrder(supabase, contractId, body);
      return jsonResponse(changeOrder, 201);
    }

    const progressMatch = path.match(/^\/contracts\/([^\/]+)\/progress$/);
    if (method === 'POST' && progressMatch) {
      const contractId = progressMatch[1];
      const body = await req.json();
      const progress = await addWorkProgress(supabase, contractId, body);
      return jsonResponse(progress, 201);
    }

    const invoiceMatch = path.match(/^\/contracts\/([^\/]+)\/invoices$/);
    if (method === 'POST' && invoiceMatch) {
      const contractId = invoiceMatch[1];
      const body = await req.json();
      const invoice = await addInvoice(supabase, contractId, body);
      return jsonResponse(invoice, 201);
    }

    const paymentMatch = path.match(/^\/contracts\/invoices\/([^\/]+)\/payments$/);
    if (method === 'POST' && paymentMatch) {
      const invoiceId = paymentMatch[1];
      const body = await req.json();
      const payment = await addPayment(supabase, invoiceId, body);
      return jsonResponse(payment, 201);
    }

    return jsonResponse({ error: 'Route not found' }, 404);
  } catch (error: any) {
    console.error('Error:', error);
    return jsonResponse({ error: error.message || 'Internal server error' }, 500);
  }
});

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getContract(supabase: any, contractId: string) {
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .select(`
      *,
      company:companies(*),
      allocations:contract_cfc_allocations(*, cfc_budget:cfc_budgets(*)),
      change_orders:contract_change_orders(*),
      work_progresses:contract_work_progresses(*),
      invoices:contract_invoices(*, payments:contract_payments(*))
    `)
    .eq('id', contractId)
    .maybeSingle();

  if (contractError || !contract) {
    throw new Error('Contrat introuvable');
  }

  return contract;
}

async function listContracts(supabase: any, projectId: string) {
  const { data: contracts, error } = await supabase
    .from('contracts')
    .select(`
      *,
      company:companies(*),
      allocations:contract_cfc_allocations(*)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return contracts || [];
}

async function createContract(supabase: any, projectId: string, body: any) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('organization_id')
    .eq('id', projectId)
    .maybeSingle();

  if (projectError || !project) {
    throw new Error('Projet introuvable');
  }

  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .insert({
      organization_id: project.organization_id,
      project_id: projectId,
      company_id: body.companyId,
      title: body.title,
      type: body.type || 'EG',
      amount_initial: body.amountInitial || 0,
      vat_rate: body.vatRate || 8.1,
      cfc_main_code: body.cfcMainCode || null,
      status: 'DRAFT',
    })
    .select()
    .single();

  if (contractError) throw new Error(contractError.message);

  if (body.allocations && body.allocations.length > 0) {
    const allocationsData = body.allocations.map((a: any) => ({
      contract_id: contract.id,
      cfc_budget_id: a.cfcBudgetId,
      amount: a.amount || 0,
    }));

    const { error: allocError } = await supabase
      .from('contract_cfc_allocations')
      .insert(allocationsData);

    if (allocError) throw new Error(allocError.message);
  }

  await updateCfcTotals(supabase, projectId);

  return contract;
}

async function addChangeOrder(supabase: any, contractId: string, body: any) {
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .select('project_id')
    .eq('id', contractId)
    .maybeSingle();

  if (contractError || !contract) {
    throw new Error('Contrat introuvable');
  }

  const { data: changeOrder, error } = await supabase
    .from('contract_change_orders')
    .insert({
      contract_id: contractId,
      reference: body.reference || null,
      title: body.title,
      amount_delta: body.amountDelta || 0,
      cfc_budget_id: body.cfcBudgetId || null,
      status: 'DRAFT',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await updateCfcTotals(supabase, contract.project_id);

  return changeOrder;
}

async function addWorkProgress(supabase: any, contractId: string, body: any) {
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .select('project_id')
    .eq('id', contractId)
    .maybeSingle();

  if (contractError || !contract) {
    throw new Error('Contrat introuvable');
  }

  const { data: progress, error } = await supabase
    .from('contract_work_progresses')
    .insert({
      contract_id: contractId,
      description: body.description || '',
      progress_percent: body.progressPercent || null,
      status: 'SUBMITTED',
      submitted_by_id: body.submittedById || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return progress;
}

async function addInvoice(supabase: any, contractId: string, body: any) {
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .select('project_id')
    .eq('id', contractId)
    .maybeSingle();

  if (contractError || !contract) {
    throw new Error('Contrat introuvable');
  }

  const retentionAmount = body.retentionAmount || 0;
  const amountPayable = body.amountInclVat - retentionAmount;

  const { data: invoice, error } = await supabase
    .from('contract_invoices')
    .insert({
      contract_id: contractId,
      invoice_number: body.invoiceNumber || null,
      issue_date: body.issueDate || null,
      due_date: body.dueDate || null,
      amount_excl_vat: body.amountExclVat || 0,
      vat_amount: body.vatAmount || 0,
      amount_incl_vat: body.amountInclVat || 0,
      retention_amount: retentionAmount,
      amount_payable: amountPayable,
      status: 'SENT',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await updateCfcTotals(supabase, contract.project_id);

  return invoice;
}

async function addPayment(supabase: any, invoiceId: string, body: any) {
  const { data: invoice, error: invoiceError } = await supabase
    .from('contract_invoices')
    .select('*, contract:contracts(project_id)')
    .eq('id', invoiceId)
    .maybeSingle();

  if (invoiceError || !invoice) {
    throw new Error('Facture introuvable');
  }

  const { data: payment, error } = await supabase
    .from('contract_payments')
    .insert({
      contract_invoice_id: invoiceId,
      payment_date: body.paymentDate || new Date().toISOString().split('T')[0],
      amount: body.amount || 0,
      payment_reference: body.paymentReference || null,
      method: body.method || 'BANK_TRANSFER',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const { data: payments } = await supabase
    .from('contract_payments')
    .select('amount')
    .eq('contract_invoice_id', invoiceId);

  const totalPaid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  if (totalPaid >= Number(invoice.amount_payable)) {
    await supabase
      .from('contract_invoices')
      .update({ status: 'PAID' })
      .eq('id', invoiceId);
  }

  await updateCfcTotals(supabase, invoice.contract.project_id);

  return payment;
}

async function updateCfcTotals(supabase: any, projectId: string) {
  const { data: contracts } = await supabase
    .from('contracts')
    .select(`
      id,
      allocations:contract_cfc_allocations(cfc_budget_id, amount),
      invoices:contract_invoices(amount_incl_vat, payments:contract_payments(amount))
    `)
    .eq('project_id', projectId);

  if (!contracts) return;

  const { data: cfcBudgets } = await supabase
    .from('cfc_budgets')
    .select('id')
    .eq('project_id', projectId);

  if (!cfcBudgets) return;

  for (const cfc of cfcBudgets) {
    const relatedContracts = contracts.filter((ct: any) =>
      ct.allocations?.some((a: any) => a.cfc_budget_id === cfc.id)
    );

    const engagement = relatedContracts.reduce((acc, ct: any) => {
      const allocAmount = ct.allocations
        ?.filter((a: any) => a.cfc_budget_id === cfc.id)
        .reduce((s: number, a: any) => s + Number(a.amount || 0), 0) || 0;
      return acc + allocAmount;
    }, 0);

    const invoiced = relatedContracts.reduce((acc, ct: any) => {
      const invAmount = ct.invoices?.reduce(
        (s: number, inv: any) => s + Number(inv.amount_incl_vat || 0),
        0
      ) || 0;
      return acc + invAmount;
    }, 0);

    const paid = relatedContracts.reduce((acc, ct: any) => {
      const paidAmount = ct.invoices?.reduce((s: number, inv: any) => {
        const invPaid = inv.payments?.reduce(
          (p: number, pay: any) => p + Number(pay.amount || 0),
          0
        ) || 0;
        return s + invPaid;
      }, 0) || 0;
      return acc + paidAmount;
    }, 0);

    await supabase
      .from('cfc_budgets')
      .update({
        engagement_total: engagement,
        invoiced_total: invoiced,
        paid_total: paid,
      })
      .eq('id', cfc.id);
  }
}