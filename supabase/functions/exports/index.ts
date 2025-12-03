import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

    if (method === 'GET' && pathSegments[0] === 'projects' && pathSegments[2] === 'lots.csv') {
      const projectId = pathSegments[1];
      return await exportSalesProgramCSV(supabase, projectId);
    }

    if (method === 'GET' && pathSegments[0] === 'projects' && pathSegments[2] === 'lots.json') {
      const projectId = pathSegments[1];
      return await exportSalesProgramJSON(supabase, projectId);
    }

    if (method === 'GET' && pathSegments[0] === 'submissions' && pathSegments[2] === 'comparison.csv') {
      const submissionId = pathSegments[1];
      return await exportSubmissionComparisonCSV(supabase, submissionId);
    }

    if (method === 'GET' && pathSegments[0] === 'projects' && pathSegments[2] === 'cfc.csv') {
      const projectId = pathSegments[1];
      return await exportCfcReportCSV(supabase, projectId);
    }

    return new Response(JSON.stringify({ error: 'Route introuvable' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in exports function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function exportSalesProgramCSV(supabase: any, projectId: string) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', projectId)
    .maybeSingle();

  if (projectError) throw projectError;
  if (!project) throw new Error('Projet introuvable');

  const { data: lots, error: lotsError } = await supabase
    .from('lots')
    .select(`
      id,
      lot_number,
      rooms_label,
      surface_habitable,
      status,
      price_vat,
      price_qpt,
      building:buildings(id, name),
      floor:floors(id, label),
      buyer:buyers!lots_buyer_id_fkey(id, first_name, last_name)
    `)
    .eq('project_id', projectId)
    .order('building_id', { ascending: true })
    .order('lot_number', { ascending: true });

  if (lotsError) throw lotsError;

  const headers = [
    'Bâtiment',
    'Lot',
    'Étage',
    'Type',
    'Surface habitable',
    'Prix (CHF)',
    'Statut',
    'Acheteur',
  ];

  const rows = lots.map((lot: any) => [
    lot.building?.name || '',
    lot.lot_number,
    lot.floor?.label || '',
    lot.rooms_label || '',
    lot.surface_habitable || '',
    lot.price_vat || lot.price_qpt || '',
    lot.status,
    lot.buyer ? `${lot.buyer.first_name} ${lot.buyer.last_name}` : '',
  ]);

  const csvContent = [
    headers.join(';'),
    ...rows.map((row: any[]) => row.map(escapeCSV).join(';')),
  ].join('\n');

  return new Response(csvContent, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="programme_vente_${projectId}.csv"`,
    },
  });
}

async function exportSalesProgramJSON(supabase: any, projectId: string) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, name, code, address_street, address_city, address_postal_code')
    .eq('id', projectId)
    .maybeSingle();

  if (projectError) throw projectError;
  if (!project) throw new Error('Projet introuvable');

  const { data: lots, error: lotsError } = await supabase
    .from('lots')
    .select(`
      id,
      lot_number,
      rooms_label,
      surface_habitable,
      status,
      price_vat,
      price_qpt,
      building:buildings(id, name),
      floor:floors(id, label),
      buyer:buyers!lots_buyer_id_fkey(id, first_name, last_name, email)
    `)
    .eq('project_id', projectId)
    .order('building_id', { ascending: true })
    .order('lot_number', { ascending: true });

  if (lotsError) throw lotsError;

  const exportData = {
    project: {
      id: project.id,
      name: project.name,
      code: project.code,
      address: {
        street: project.address_street,
        city: project.address_city,
        postalCode: project.address_postal_code,
      },
    },
    lots: lots.map((lot: any) => ({
      id: lot.id,
      lotNumber: lot.lot_number,
      roomsLabel: lot.rooms_label,
      surfaceHabitable: lot.surface_habitable,
      status: lot.status,
      priceVat: lot.price_vat,
      priceQpt: lot.price_qpt,
      building: lot.building,
      floor: lot.floor,
      buyer: lot.buyer,
    })),
    exportedAt: new Date().toISOString(),
  };

  return new Response(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="programme_vente_${projectId}.json"`,
    },
  });
}

async function exportSubmissionComparisonCSV(supabase: any, submissionId: string) {
  const { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .select(`
      id,
      title,
      project:projects(id, name),
      offers:offers(
        id,
        total_excl_vat,
        total_incl_vat,
        status,
        company:companies(id, name),
        items:offer_items(
          id,
          label,
          quantity,
          unit_price
        )
      )
    `)
    .eq('id', submissionId)
    .maybeSingle();

  if (submissionError) throw submissionError;
  if (!submission) throw new Error('Soumission introuvable');

  const headers = [
    'Entreprise',
    'Montant HT (CHF)',
    'Montant TTC (CHF)',
    'Statut',
  ];

  const rows = submission.offers.map((offer: any) => [
    offer.company.name,
    offer.total_excl_vat || '',
    offer.total_incl_vat || '',
    offer.status,
  ]);

  const csvContent = [
    `Comparatif Soumission: ${submission.title}`,
    `Projet: ${submission.project.name}`,
    '',
    headers.join(';'),
    ...rows.map((row: any[]) => row.map(escapeCSV).join(';')),
  ].join('\n');

  return new Response(csvContent, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="comparatif_soumission_${submissionId}.csv"`,
    },
  });
}

async function exportCfcReportCSV(supabase: any, projectId: string) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', projectId)
    .maybeSingle();

  if (projectError) throw projectError;
  if (!project) throw new Error('Projet introuvable');

  const { data: cfcBudgets, error: cfcError } = await supabase
    .from('cfc_budgets')
    .select(`
      id,
      cfc_code,
      label,
      budget_initial,
      budget_revised,
      engagement_total,
      invoiced_total,
      paid_total
    `)
    .eq('project_id', projectId)
    .order('cfc_code', { ascending: true });

  if (cfcError) throw cfcError;

  const headers = [
    'CFC',
    'Libellé',
    'Budget initial (CHF)',
    'Budget révisé (CHF)',
    'Engagements (CHF)',
    'Facturé (CHF)',
    'Payé (CHF)',
  ];

  const rows = cfcBudgets.map((budget: any) => [
    budget.cfc_code,
    budget.label || '',
    budget.budget_initial || '',
    budget.budget_revised || '',
    budget.engagement_total || '',
    budget.invoiced_total || '',
    budget.paid_total || '',
  ]);

  const csvContent = [
    `Synthèse CFC - ${project.name}`,
    '',
    headers.join(';'),
    ...rows.map((row: any[]) => row.map(escapeCSV).join(';')),
  ].join('\n');

  return new Response(csvContent, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="cfc_${projectId}.csv"`,
    },
  });
}

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
