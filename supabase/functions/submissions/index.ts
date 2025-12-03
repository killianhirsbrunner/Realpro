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

    const listByProjectMatch = path.match(/^\/project\/([^\/]+)$/);
    if (method === 'GET' && listByProjectMatch) {
      const projectId = listByProjectMatch[1];
      const submissions = await listByProject(supabase, projectId);
      return jsonResponse(submissions);
    }

    const submissionDetailMatch = path.match(/^\/([^\/]+)$/);
    if (method === 'GET' && submissionDetailMatch && !path.includes('project') && !path.includes('comparison')) {
      const submissionId = submissionDetailMatch[1];
      const submission = await getSubmission(supabase, submissionId);
      return jsonResponse(submission);
    }

    if (method === 'POST' && listByProjectMatch) {
      const projectId = listByProjectMatch[1];
      const body = await req.json();
      const submission = await createSubmission(supabase, projectId, body);
      return jsonResponse(submission, 201);
    }

    const inviteMatch = path.match(/^\/([^\/]+)\/invite$/);
    if (method === 'POST' && inviteMatch) {
      const submissionId = inviteMatch[1];
      const body = await req.json();
      const result = await inviteCompanies(supabase, submissionId, body);
      return jsonResponse(result);
    }

    const offersMatch = path.match(/^\/([^\/]+)\/offers$/);
    if (method === 'POST' && offersMatch) {
      const submissionId = offersMatch[1];
      const body = await req.json();
      const offer = await submitOffer(supabase, submissionId, body);
      return jsonResponse(offer, 201);
    }

    const statusMatch = path.match(/^\/([^\/]+)\/status$/);
    if (method === 'POST' && statusMatch) {
      const submissionId = statusMatch[1];
      const body = await req.json();
      const result = await updateStatus(supabase, submissionId, body);
      return jsonResponse(result);
    }

    const adjudicateMatch = path.match(/^\/([^\/]+)\/adjudicate$/);
    if (method === 'POST' && adjudicateMatch) {
      const submissionId = adjudicateMatch[1];
      const body = await req.json();
      const result = await adjudicateOffer(supabase, submissionId, body);
      return jsonResponse(result);
    }

    const clarificationsMatch = path.match(/^\/([^\/]+)\/clarifications$/);
    if (method === 'POST' && clarificationsMatch) {
      const submissionId = clarificationsMatch[1];
      const body = await req.json();
      const result = await addClarification(supabase, submissionId, body);
      return jsonResponse(result);
    }

    const comparisonMatch = path.match(/^\/([^\/]+)\/comparison$/);
    if (method === 'GET' && comparisonMatch) {
      const submissionId = comparisonMatch[1];
      const comparison = await getComparison(supabase, submissionId);
      return jsonResponse(comparison);
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

async function listByProject(supabase: any, projectId: string) {
  const { data: submissions, error } = await supabase
    .from('submissions')
    .select(`
      id,
      title,
      cfc_code,
      description,
      question_deadline,
      offer_deadline,
      status,
      clarifications_open,
      created_at,
      offers:submission_offers(
        id,
        company:companies(id, name, type)
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return submissions;
}

async function getSubmission(supabase: any, submissionId: string) {
  const { data: submission, error } = await supabase
    .from('submissions')
    .select(`
      id,
      project_id,
      title,
      cfc_code,
      description,
      question_deadline,
      offer_deadline,
      status,
      clarifications_open,
      created_at,
      updated_at,
      project:projects(id, name, city),
      invites:submission_invites(
        id,
        company:companies(id, name, type, email, phone, city)
      ),
      offers:submission_offers(
        id,
        total_excl_vat,
        total_incl_vat,
        delay_proposal,
        status,
        created_at,
        company:companies(id, name, type, city),
        items:submission_offer_items(
          id,
          label,
          quantity,
          unit_price
        )
      )
    `)
    .eq('id', submissionId)
    .maybeSingle();

  if (error) throw error;
  if (!submission) throw new Error('Soumission introuvable');

  return submission;
}

async function createSubmission(supabase: any, projectId: string, body: any) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('organization_id')
    .eq('id', projectId)
    .maybeSingle();

  if (projectError) throw projectError;
  if (!project) throw new Error('Projet introuvable');

  const status = body.invitedCompanyIds?.length ? 'INVITED' : 'DRAFT';

  const { data: submission, error } = await supabase
    .from('submissions')
    .insert({
      project_id: projectId,
      title: body.title,
      cfc_code: body.cfcCode || null,
      description: body.description || null,
      question_deadline: body.questionDeadline || null,
      offer_deadline: body.offerDeadline || null,
      status,
    })
    .select()
    .single();

  if (error) throw error;

  if (body.invitedCompanyIds?.length) {
    const invites = body.invitedCompanyIds.map((companyId: string) => ({
      submission_id: submission.id,
      company_id: companyId,
    }));

    await supabase.from('submission_invites').insert(invites);
  }

  if (body.userId) {
    await supabase.from('audit_logs').insert({
      organization_id: project.organization_id,
      project_id: projectId,
      user_id: body.userId,
      action: 'SUBMISSION_CREATED',
      entity_type: 'SUBMISSION',
      entity_id: submission.id,
      metadata: {
        title: submission.title,
        cfc_code: submission.cfc_code,
      },
    });
  }

  return submission;
}

async function inviteCompanies(supabase: any, submissionId: string, body: any) {
  const { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .select('id, status, project_id')
    .eq('id', submissionId)
    .maybeSingle();

  if (submissionError) throw submissionError;
  if (!submission) throw new Error('Soumission introuvable');

  const { data: existing } = await supabase
    .from('submission_invites')
    .select('company_id')
    .eq('submission_id', submissionId)
    .in('company_id', body.companyIds);

  const alreadyInvited = new Set(existing?.map((e: any) => e.company_id) || []);
  const toCreate = body.companyIds.filter((id: string) => !alreadyInvited.has(id));

  if (toCreate.length > 0) {
    const invites = toCreate.map((companyId: string) => ({
      submission_id: submissionId,
      company_id: companyId,
    }));

    await supabase.from('submission_invites').insert(invites);
  }

  if (submission.status === 'DRAFT' && toCreate.length > 0) {
    await supabase
      .from('submissions')
      .update({ status: 'INVITED' })
      .eq('id', submissionId);
  }

  if (body.userId) {
    const { data: project } = await supabase
      .from('projects')
      .select('organization_id')
      .eq('id', submission.project_id)
      .maybeSingle();

    if (project) {
      await supabase.from('audit_logs').insert({
        organization_id: project.organization_id,
        project_id: submission.project_id,
        user_id: body.userId,
        action: 'SUBMISSION_COMPANIES_INVITED',
        entity_type: 'SUBMISSION',
        entity_id: submissionId,
        metadata: { companyIds: body.companyIds },
      });
    }
  }

  return await getSubmission(supabase, submissionId);
}

async function submitOffer(supabase: any, submissionId: string, body: any) {
  const { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .select('id, status, invites:submission_invites(company_id)')
    .eq('id', submissionId)
    .maybeSingle();

  if (submissionError) throw submissionError;
  if (!submission) throw new Error('Soumission introuvable');

  const invitedCompanyIds = new Set(
    submission.invites?.map((i: any) => i.company_id) || []
  );

  if (!invitedCompanyIds.has(body.companyId)) {
    throw new Error("Cette entreprise n'a pas été invitée à soumissionner");
  }

  const { data: offer, error: offerError } = await supabase
    .from('submission_offers')
    .insert({
      submission_id: submissionId,
      company_id: body.companyId,
      total_excl_vat: body.totalExclVat,
      total_incl_vat: body.totalInclVat,
      delay_proposal: body.delayProposal || null,
      status: 'SUBMITTED',
    })
    .select()
    .single();

  if (offerError) throw offerError;

  if (body.items?.length) {
    const items = body.items.map((item: any) => ({
      submission_offer_id: offer.id,
      label: item.label,
      quantity: item.quantity || null,
      unit_price: item.unitPrice || null,
    }));

    await supabase.from('submission_offer_items').insert(items);
  }

  if (submission.status === 'INVITED' || submission.status === 'DRAFT') {
    await supabase
      .from('submissions')
      .update({ status: 'IN_PROGRESS' })
      .eq('id', submissionId);
  }

  return offer;
}

async function updateStatus(supabase: any, submissionId: string, body: any) {
  const { data: submission, error: checkError } = await supabase
    .from('submissions')
    .select('id')
    .eq('id', submissionId)
    .maybeSingle();

  if (checkError) throw checkError;
  if (!submission) throw new Error('Soumission introuvable');

  const { data: updated, error } = await supabase
    .from('submissions')
    .update({ status: body.status })
    .eq('id', submissionId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

async function adjudicateOffer(supabase: any, submissionId: string, body: any) {
  const { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .select('id, project_id, title, cfc_code')
    .eq('id', submissionId)
    .maybeSingle();

  if (submissionError) throw submissionError;
  if (!submission) throw new Error('Soumission introuvable');

  const { data: offer, error: offerError } = await supabase
    .from('submission_offers')
    .select('id, submission_id, company_id, total_incl_vat, company:companies(name)')
    .eq('id', body.offerId)
    .maybeSingle();

  if (offerError) throw offerError;
  if (!offer || offer.submission_id !== submissionId) {
    throw new Error('Offre invalide pour cette soumission');
  }

  const { data: project } = await supabase
    .from('projects')
    .select('organization_id, tva_rate')
    .eq('id', submission.project_id)
    .maybeSingle();

  if (!project) throw new Error('Projet introuvable');

  await supabase
    .from('submission_offers')
    .update({ status: 'REJECTED' })
    .eq('submission_id', submissionId);

  await supabase
    .from('submission_offers')
    .update({ status: 'WINNER' })
    .eq('id', offer.id);

  await supabase
    .from('submissions')
    .update({ status: 'ADJUDICATED' })
    .eq('id', submissionId);

  let cfcBudget = null;
  if (submission.cfc_code) {
    const { data } = await supabase
      .from('cfc_budgets')
      .select('id')
      .eq('project_id', submission.project_id)
      .eq('cfc_code', submission.cfc_code)
      .maybeSingle();
    cfcBudget = data;
  }

  const contractTitle = submission.title ||
    `Contrat ${offer.company.name} – CFC ${submission.cfc_code || ''}`;

  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .insert({
      organization_id: project.organization_id,
      project_id: submission.project_id,
      company_id: offer.company_id,
      type: 'SUBCONTRACTOR',
      title: contractTitle,
      amount_initial: offer.total_incl_vat,
      vat_rate: project.tva_rate || 7.7,
      cfc_main_code: submission.cfc_code || null,
      status: 'DRAFT',
    })
    .select()
    .single();

  if (contractError) throw contractError;

  if (cfcBudget) {
    await supabase.from('contract_cfc_allocations').insert({
      contract_id: contract.id,
      cfc_budget_id: cfcBudget.id,
      amount: offer.total_incl_vat,
    });
  }

  if (body.userId) {
    await supabase.from('audit_logs').insert({
      organization_id: project.organization_id,
      project_id: submission.project_id,
      user_id: body.userId,
      action: 'SUBMISSION_ADJUDICATED',
      entity_type: 'SUBMISSION',
      entity_id: submission.id,
      metadata: {
        offer_id: offer.id,
        contract_id: contract.id,
        company_id: offer.company_id,
        cfc_code: submission.cfc_code,
      },
    });
  }

  return await getSubmission(supabase, submissionId);
}

async function addClarification(supabase: any, submissionId: string, body: any) {
  const { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .select('id, project_id, clarifications_open')
    .eq('id', submissionId)
    .maybeSingle();

  if (submissionError) throw submissionError;
  if (!submission) throw new Error('Soumission introuvable');

  const { data: project } = await supabase
    .from('projects')
    .select('organization_id')
    .eq('id', submission.project_id)
    .maybeSingle();

  if (body.userId && project) {
    await supabase.from('audit_logs').insert({
      organization_id: project.organization_id,
      project_id: submission.project_id,
      user_id: body.userId,
      action: 'SUBMISSION_CLARIFICATION_ADDED',
      entity_type: 'SUBMISSION',
      entity_id: submission.id,
      metadata: {
        company_id: body.companyId,
        message: body.message,
      },
    });
  }

  await supabase
    .from('submissions')
    .update({
      clarifications_open: (submission.clarifications_open || 0) + 1,
    })
    .eq('id', submissionId);

  return await getSubmission(supabase, submissionId);
}

async function getComparison(supabase: any, submissionId: string) {
  const { data: submission, error } = await supabase
    .from('submissions')
    .select(`
      id,
      offers:submission_offers(
        id,
        total_excl_vat,
        total_incl_vat,
        delay_proposal,
        status,
        company:companies(name),
        items:submission_offer_items(
          label,
          quantity,
          unit_price
        )
      )
    `)
    .eq('id', submissionId)
    .maybeSingle();

  if (error) throw error;
  if (!submission) throw new Error('Soumission introuvable');

  const offers = submission.offers || [];

  if (!offers.length) {
    return {
      submissionId,
      offers: [],
      items: [],
    };
  }

  const offersSummary = offers.map((o: any) => ({
    offerId: o.id,
    companyName: o.company.name,
    totalExclVat: Number(o.total_excl_vat),
    totalInclVat: Number(o.total_incl_vat),
    delayProposal: o.delay_proposal,
    status: o.status,
  }));

  const itemMap = new Map<string, {
    label: string;
    byOffer: {
      offerId: string;
      companyName: string;
      unitPrice: number | null;
      quantity: number | null;
      total: number | null;
    }[];
  }>();

  for (const offer of offers) {
    for (const item of offer.items || []) {
      const key = item.label.trim();
      if (!itemMap.has(key)) {
        itemMap.set(key, {
          label: item.label,
          byOffer: [],
        });
      }
      const total = item.quantity != null && item.unit_price != null
        ? Number(item.quantity) * Number(item.unit_price)
        : null;

      itemMap.get(key)!.byOffer.push({
        offerId: offer.id,
        companyName: offer.company.name,
        unitPrice: item.unit_price != null ? Number(item.unit_price) : null,
        quantity: item.quantity ?? null,
        total,
      });
    }
  }

  const itemsComparison = Array.from(itemMap.values());

  return {
    submissionId,
    offers: offersSummary,
    items: itemsComparison,
  };
}
