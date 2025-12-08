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

    if (method === 'POST' && pathSegments[0] === 'pdf' && pathSegments[1] === 'generate') {
      const body = await req.json();
      return await generatePdfDocument(supabase, body);
    }

    if (method === 'GET' && pathSegments[0] === 'projects' && pathSegments[2] === 'buyer-dossier.pdf') {
      const buyerId = pathSegments[1];
      return await generateBuyerDossierPDF(supabase, buyerId);
    }

    if (method === 'GET' && pathSegments[0] === 'projects' && pathSegments[2] === 'financial-report.pdf') {
      const projectId = pathSegments[1];
      return await generateFinancialReportPDF(supabase, projectId);
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
      price_total,
      price_base,
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
    lot.price_total || lot.price_base || '',
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
      price_total,
      price_base,
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
      priceTotal: lot.price_total,
      priceBase: lot.price_base,
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

async function generatePdfDocument(supabase: any, body: any) {
  const { documentType, data, organizationId, projectId } = body;

  let htmlContent = '';
  let title = '';

  switch (documentType) {
    case 'invoice':
      htmlContent = generateInvoiceHTML(data);
      title = `Facture_${data.invoiceNumber}`;
      break;
    case 'buyer_dossier':
      htmlContent = generateBuyerDossierHTML(data);
      title = `Dossier_Acheteur_${data.buyer.lastName}`;
      break;
    case 'financial_report':
      htmlContent = generateFinancialReportHTML(data);
      title = `Rapport_Financier_${data.project.code}`;
      break;
    case 'submission_comparison':
      htmlContent = generateSubmissionComparisonHTML(data);
      title = `Comparatif_Soumission`;
      break;
    default:
      throw new Error(`Type de document non supporté: ${documentType}`);
  }

  return new Response(htmlContent, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/html; charset=utf-8',
      'X-Document-Title': title,
    },
  });
}

async function generateBuyerDossierPDF(supabase: any, buyerId: string) {
  const { data: buyer, error: buyerError } = await supabase
    .from('buyers')
    .select(`
      *,
      lot:lots(*,
        building:buildings(*),
        floor:floors(*),
        project:projects(*)
      ),
      documents:buyer_documents(*)
    `)
    .eq('id', buyerId)
    .maybeSingle();

  if (buyerError) throw buyerError;
  if (!buyer) throw new Error('Acheteur introuvable');

  const htmlContent = generateBuyerDossierHTML({ buyer });

  return new Response(htmlContent, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `inline; filename="dossier_acheteur_${buyer.last_name}.html"`,
    },
  });
}

async function generateFinancialReportPDF(supabase: any, projectId: string) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select(`
      *,
      cfc_budgets(*)
    `)
    .eq('id', projectId)
    .maybeSingle();

  if (projectError) throw projectError;
  if (!project) throw new Error('Projet introuvable');

  const htmlContent = generateFinancialReportHTML({ project });

  return new Response(htmlContent, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `inline; filename="rapport_financier_${project.code}.html"`,
    },
  });
}

function generateInvoiceHTML(data: any): string {
  const { invoice, buyer, company } = data;

  return `
<!DOCTYPE html>
<html lang="fr-CH">
<head>
  <meta charset="UTF-8">
  <title>Facture ${invoice.number}</title>
  <style>
    @page { size: A4; margin: 2cm; }
    body { font-family: 'Helvetica', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #333; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .logo { max-width: 150px; }
    .invoice-title { font-size: 24pt; font-weight: bold; color: #0066cc; margin-bottom: 10px; }
    .invoice-number { font-size: 12pt; color: #666; }
    .addresses { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .address-block { width: 45%; }
    .address-title { font-weight: bold; color: #0066cc; margin-bottom: 5px; }
    .invoice-details { margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #0066cc; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    .total-row { font-weight: bold; font-size: 13pt; background: #f5f5f5; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #0066cc; font-size: 9pt; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="invoice-title">FACTURE</div>
      <div class="invoice-number">N° ${invoice.number}</div>
      <div style="margin-top: 10px;">Date: ${new Date(invoice.date).toLocaleDateString('fr-CH')}</div>
      ${invoice.dueDate ? `<div>Échéance: ${new Date(invoice.dueDate).toLocaleDateString('fr-CH')}</div>` : ''}
    </div>
    ${company.logoUrl ? `<img src="${company.logoUrl}" alt="${company.name}" class="logo" />` : ''}
  </div>

  <div class="addresses">
    <div class="address-block">
      <div class="address-title">Émetteur</div>
      <div><strong>${company.name}</strong></div>
      <div>${company.address}</div>
      <div>${company.postalCode} ${company.city}</div>
      ${company.vat ? `<div>TVA: ${company.vat}</div>` : ''}
    </div>
    <div class="address-block">
      <div class="address-title">Client</div>
      <div><strong>${buyer.firstName} ${buyer.lastName}</strong></div>
      <div>${buyer.address}</div>
      <div>${buyer.postalCode} ${buyer.city}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="width: 120px; text-align: right;">Montant (CHF)</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items?.map((item: any) => `
        <tr>
          <td>${item.description}</td>
          <td style="text-align: right;">${formatCHF(item.amount)}</td>
        </tr>
      `).join('') || `
        <tr>
          <td>${invoice.description}</td>
          <td style="text-align: right;">${formatCHF(invoice.amount)}</td>
        </tr>
      `}
      <tr class="total-row">
        <td>TOTAL</td>
        <td style="text-align: right;">${formatCHF(invoice.totalAmount || invoice.amount)}</td>
      </tr>
    </tbody>
  </table>

  ${invoice.notes ? `<div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #0066cc;"><strong>Remarques:</strong><br>${invoice.notes}</div>` : ''}

  <div class="footer">
    <div>${company.name} • ${company.address} • ${company.postalCode} ${company.city}</div>
    ${company.phone ? `<div>Tél: ${company.phone}` : ''}${company.email ? ` • Email: ${company.email}` : ''}</div>
    ${company.website ? `<div>Web: ${company.website}</div>` : ''}
  </div>
</body>
</html>
  `;
}

function generateBuyerDossierHTML(data: any): string {
  const { buyer } = data;
  const lot = buyer.lot;
  const project = lot?.project;

  return `
<!DOCTYPE html>
<html lang="fr-CH">
<head>
  <meta charset="UTF-8">
  <title>Dossier Acheteur - ${buyer.first_name} ${buyer.last_name}</title>
  <style>
    @page { size: A4; margin: 2cm; }
    body { font-family: 'Helvetica', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #333; }
    .header { background: #0066cc; color: white; padding: 30px; margin: -2cm -2cm 30px -2cm; }
    h1 { margin: 0; font-size: 28pt; }
    h2 { color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 5px; margin-top: 30px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
    .info-item { padding: 10px; background: #f9f9f9; }
    .info-label { font-weight: bold; color: #666; font-size: 9pt; }
    .info-value { font-size: 11pt; margin-top: 3px; }
    .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 10pt; font-weight: bold; }
    .status-reserved { background: #fef3c7; color: #92400e; }
    .status-signed { background: #d1fae5; color: #065f46; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th { background: #f3f4f6; padding: 10px; text-align: left; font-weight: 600; }
    td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Dossier Acheteur</h1>
    <div style="font-size: 14pt; margin-top: 10px;">${buyer.first_name} ${buyer.last_name}</div>
  </div>

  <h2>Informations Personnelles</h2>
  <div class="info-grid">
    <div class="info-item">
      <div class="info-label">Nom complet</div>
      <div class="info-value">${buyer.first_name} ${buyer.last_name}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Email</div>
      <div class="info-value">${buyer.email || 'Non renseigné'}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Téléphone</div>
      <div class="info-value">${buyer.phone || 'Non renseigné'}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Adresse</div>
      <div class="info-value">${buyer.address || 'Non renseignée'}</div>
    </div>
  </div>

  ${lot ? `
    <h2>Lot Réservé</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Projet</div>
        <div class="info-value">${project?.name || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Lot</div>
        <div class="info-value">${lot.lot_number}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Type</div>
        <div class="info-value">${lot.rooms_label || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Surface</div>
        <div class="info-value">${lot.surface_habitable || 'N/A'} m²</div>
      </div>
      <div class="info-item">
        <div class="info-label">Prix</div>
        <div class="info-value">${formatCHF(lot.price_total || lot.price_base)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Statut</div>
        <div class="info-value">
          <span class="status-badge status-${lot.status?.toLowerCase()}">${lot.status}</span>
        </div>
      </div>
    </div>
  ` : ''}

  ${buyer.documents && buyer.documents.length > 0 ? `
    <h2>Documents</h2>
    <table>
      <thead>
        <tr>
          <th>Document</th>
          <th>Type</th>
          <th style="width: 120px;">Statut</th>
        </tr>
      </thead>
      <tbody>
        ${buyer.documents.map((doc: any) => `
          <tr>
            <td>${doc.name || doc.label}</td>
            <td>${doc.type || 'N/A'}</td>
            <td>
              ${doc.status === 'validated' ? '✅ Validé' : doc.status === 'pending' ? '⏳ En attente' : '📄 Soumis'}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : ''}

  <div style="margin-top: 50px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
    <div style="font-size: 9pt; color: #666;">
      <strong>Document généré le ${new Date().toLocaleDateString('fr-CH')} à ${new Date().toLocaleTimeString('fr-CH')}</strong>
    </div>
    <div style="font-size: 9pt; color: #666; margin-top: 5px;">
      RealPro Suite - Plateforme de gestion immobilière
    </div>
  </div>
</body>
</html>
  `;
}

function generateFinancialReportHTML(data: any): string {
  const { project } = data;
  const cfcBudgets = project.cfc_budgets || [];

  const totalBudget = cfcBudgets.reduce((sum: number, b: any) => sum + (b.budget_revised || b.budget_initial || 0), 0);
  const totalEngaged = cfcBudgets.reduce((sum: number, b: any) => sum + (b.engagement_total || 0), 0);
  const totalInvoiced = cfcBudgets.reduce((sum: number, b: any) => sum + (b.invoiced_total || 0), 0);
  const totalPaid = cfcBudgets.reduce((sum: number, b: any) => sum + (b.paid_total || 0), 0);

  return `
<!DOCTYPE html>
<html lang="fr-CH">
<head>
  <meta charset="UTF-8">
  <title>Rapport Financier - ${project.name}</title>
  <style>
    @page { size: A4 landscape; margin: 2cm; }
    body { font-family: 'Helvetica', Arial, sans-serif; font-size: 10pt; line-height: 1.4; color: #333; }
    .header { background: #0066cc; color: white; padding: 20px; margin: -2cm -2cm 30px -2cm; }
    h1 { margin: 0; font-size: 24pt; }
    h2 { color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 5px; margin-top: 25px; }
    .summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
    .summary-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; }
    .summary-label { font-size: 9pt; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
    .summary-value { font-size: 20pt; font-weight: bold; color: #111827; margin-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 9pt; }
    th { background: #374151; color: white; padding: 10px 8px; text-align: left; font-weight: 600; }
    td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
    tr:hover { background: #f9fafb; }
    .total-row { background: #f3f4f6; font-weight: bold; border-top: 2px solid #374151; }
    .amount { text-align: right; font-family: 'Courier New', monospace; }
    .progress-bar { background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden; }
    .progress-fill { background: linear-gradient(90deg, #10b981, #059669); height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 8pt; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Rapport Financier CFC</h1>
    <div style="font-size: 14pt; margin-top: 10px;">${project.name} • ${project.code}</div>
  </div>

  <div class="summary-cards">
    <div class="summary-card">
      <div class="summary-label">Budget Total</div>
      <div class="summary-value">${formatCHF(totalBudget)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Engagements</div>
      <div class="summary-value">${formatCHF(totalEngaged)}</div>
      <div style="font-size: 9pt; color: #6b7280; margin-top: 5px;">
        ${((totalEngaged / totalBudget) * 100).toFixed(1)}% du budget
      </div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Facturé</div>
      <div class="summary-value">${formatCHF(totalInvoiced)}</div>
      <div style="font-size: 9pt; color: #6b7280; margin-top: 5px;">
        ${((totalInvoiced / totalBudget) * 100).toFixed(1)}% du budget
      </div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Payé</div>
      <div class="summary-value">${formatCHF(totalPaid)}</div>
      <div style="font-size: 9pt; color: #6b7280; margin-top: 5px;">
        ${((totalPaid / totalBudget) * 100).toFixed(1)}% du budget
      </div>
    </div>
  </div>

  <h2>Détail par CFC</h2>
  <table>
    <thead>
      <tr>
        <th>CFC</th>
        <th>Libellé</th>
        <th class="amount">Budget</th>
        <th class="amount">Engagé</th>
        <th class="amount">Facturé</th>
        <th class="amount">Payé</th>
        <th class="amount">Solde</th>
        <th style="width: 150px;">Avancement</th>
      </tr>
    </thead>
    <tbody>
      ${cfcBudgets.map((budget: any) => {
        const budgetAmount = budget.budget_revised || budget.budget_initial || 0;
        const engaged = budget.engagement_total || 0;
        const invoiced = budget.invoiced_total || 0;
        const paid = budget.paid_total || 0;
        const solde = budgetAmount - paid;
        const progress = budgetAmount > 0 ? (paid / budgetAmount) * 100 : 0;

        return `
          <tr>
            <td><strong>${budget.cfc_code}</strong></td>
            <td>${budget.label || 'N/A'}</td>
            <td class="amount">${formatCHF(budgetAmount)}</td>
            <td class="amount">${formatCHF(engaged)}</td>
            <td class="amount">${formatCHF(invoiced)}</td>
            <td class="amount">${formatCHF(paid)}</td>
            <td class="amount" style="color: ${solde < 0 ? '#dc2626' : '#059669'};">
              ${formatCHF(solde)}
            </td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min(progress, 100)}%;">
                  ${progress.toFixed(0)}%
                </div>
              </div>
            </td>
          </tr>
        `;
      }).join('')}
      <tr class="total-row">
        <td colspan="2">TOTAL</td>
        <td class="amount">${formatCHF(totalBudget)}</td>
        <td class="amount">${formatCHF(totalEngaged)}</td>
        <td class="amount">${formatCHF(totalInvoiced)}</td>
        <td class="amount">${formatCHF(totalPaid)}</td>
        <td class="amount">${formatCHF(totalBudget - totalPaid)}</td>
        <td></td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 30px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
    <strong>Note:</strong> Ce rapport présente la situation financière à la date du ${new Date().toLocaleDateString('fr-CH')}.
    Les montants sont exprimés en CHF (Francs Suisses).
  </div>

  <div style="margin-top: 30px; font-size: 8pt; color: #9ca3af; text-align: center;">
    RealPro Suite - Rapport généré le ${new Date().toLocaleDateString('fr-CH')} à ${new Date().toLocaleTimeString('fr-CH')}
  </div>
</body>
</html>
  `;
}

function generateSubmissionComparisonHTML(data: any): string {
  return `
<!DOCTYPE html>
<html lang="fr-CH">
<head>
  <meta charset="UTF-8">
  <title>Comparatif Soumissions</title>
  <style>
    @page { size: A4; margin: 2cm; }
    body { font-family: 'Helvetica', Arial, sans-serif; font-size: 11pt; }
    h1 { color: #0066cc; }
  </style>
</head>
<body>
  <h1>Comparatif Soumissions</h1>
  <p>Fonctionnalité en cours de développement...</p>
</body>
</html>
  `;
}

function formatCHF(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return 'CHF 0.00';
  return `CHF ${amount.toLocaleString('fr-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
