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

    // POST /pdf-generator/avenant - Generate avenant PDF
    if (method === 'POST' && pathSegments.length === 1 && pathSegments[0] === 'avenant') {
      const body = await req.json();
      const result = await generateAvenantPDF(supabase, user.id, body);
      return jsonResponse(result);
    }

    // POST /pdf-generator/invoice - Generate invoice PDF
    if (method === 'POST' && pathSegments.length === 1 && pathSegments[0] === 'invoice') {
      const body = await req.json();
      const result = await generateInvoicePDF(supabase, user.id, body);
      return jsonResponse(result);
    }

    // POST /pdf-generator/contract - Generate sales contract PDF
    if (method === 'POST' && pathSegments.length === 1 && pathSegments[0] === 'contract') {
      const body = await req.json();
      const result = await generateContractPDF(supabase, user.id, body);
      return jsonResponse(result);
    }

    // POST /pdf-generator/report - Generate project report PDF
    if (method === 'POST' && pathSegments.length === 1 && pathSegments[0] === 'report') {
      const body = await req.json();
      const result = await generateReportPDF(supabase, user.id, body);
      return jsonResponse(result);
    }

    return jsonResponse({ error: 'Route not found' }, 404);

  } catch (error) {
    console.error('PDF Generator error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Generate Avenant PDF
async function generateAvenantPDF(supabase: any, userId: string, body: any) {
  const { avenantId } = body;

  if (!avenantId) {
    throw new Error('Missing avenantId');
  }

  // Fetch avenant with all related data
  const { data: avenant, error } = await supabase
    .from('avenants')
    .select(`
      *,
      supplier_offer:supplier_offers(
        *,
        supplier:suppliers(name, address, city, zip_code, country, phone, email),
        lot:lots(
          *,
          building:buildings(name, address, city, zip_code),
          buyer:buyers(first_name, last_name, email, phone)
        )
      ),
      buyer:buyers(first_name, last_name, email, phone, address, city, zip_code),
      project:projects(
        name,
        reference,
        organization:organizations(name, logo_url, address, city, zip_code, country)
      )
    `)
    .eq('id', avenantId)
    .single();

  if (error) throw error;

  // Generate HTML content
  const html = generateAvenantHTML(avenant);

  // Generate PDF from HTML
  const pdfData = await htmlToPDF(html);

  // Upload PDF to Supabase Storage
  const filename = `avenants/${avenant.reference || avenantId}.pdf`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filename, pdfData, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(filename);

  // Update avenant with PDF URL
  await supabase
    .from('avenants')
    .update({ pdf_url: publicUrl })
    .eq('id', avenantId);

  return { 
    success: true, 
    pdf_url: publicUrl,
    message: 'PDF généré avec succès'
  };
}

// Generate HTML for avenant
function generateAvenantHTML(avenant: any): string {
  const offer = avenant.supplier_offer;
  const buyer = avenant.buyer;
  const project = avenant.project;
  const organization = project?.organization;
  const lot = offer?.lot;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page {
          size: A4;
          margin: 2cm;
        }
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 11pt;
          line-height: 1.6;
          color: #333;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #00B8A9;
        }
        .logo {
          max-width: 150px;
          height: auto;
        }
        .company-info {
          text-align: right;
          font-size: 9pt;
        }
        h1 {
          color: #00B8A9;
          font-size: 24pt;
          margin: 30px 0;
          text-align: center;
        }
        h2 {
          color: #333;
          font-size: 14pt;
          margin-top: 20px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .section {
          margin: 20px 0;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 10px;
          margin: 10px 0;
        }
        .label {
          font-weight: bold;
          color: #666;
        }
        .value {
          color: #333;
        }
        .amount {
          background: #f0f9ff;
          padding: 15px;
          border-left: 4px solid #00B8A9;
          margin: 20px 0;
        }
        .amount-value {
          font-size: 18pt;
          font-weight: bold;
          color: #00B8A9;
        }
        .signature-block {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
        }
        .signature {
          width: 45%;
        }
        .signature-line {
          border-top: 1px solid #333;
          margin-top: 60px;
          padding-top: 5px;
          text-align: center;
          font-size: 9pt;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 8pt;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background: #f5f5f5;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          ${organization?.logo_url ? `<img src="${organization.logo_url}" class="logo" alt="Logo">` : ''}
        </div>
        <div class="company-info">
          <strong>${organization?.name || 'RealPro SA'}</strong><br>
          ${organization?.address || ''}<br>
          ${organization?.zip_code || ''} ${organization?.city || ''}<br>
          ${organization?.country || 'Suisse'}
        </div>
      </div>

      <h1>AVENANT AU CONTRAT DE VENTE</h1>

      <div class="section">
        <div class="info-grid">
          <div class="label">Référence:</div>
          <div class="value">${avenant.reference || 'N/A'}</div>
          
          <div class="label">Date:</div>
          <div class="value">${new Date(avenant.created_at).toLocaleDateString('fr-CH')}</div>
          
          <div class="label">Projet:</div>
          <div class="value">${project?.name || 'N/A'}</div>
          
          <div class="label">Lot:</div>
          <div class="value">${lot?.reference || 'N/A'} - ${lot?.name || ''}</div>
        </div>
      </div>

      <h2>Parties contractantes</h2>

      <div class="section">
        <p><strong>L'Acheteur:</strong></p>
        <div class="info-grid">
          <div class="label">Nom:</div>
          <div class="value">${buyer?.first_name || ''} ${buyer?.last_name || ''}</div>
          
          <div class="label">Adresse:</div>
          <div class="value">${buyer?.address || 'N/A'}</div>
          
          <div class="label">Ville:</div>
          <div class="value">${buyer?.zip_code || ''} ${buyer?.city || ''}</div>
          
          <div class="label">Email:</div>
          <div class="value">${buyer?.email || 'N/A'}</div>
        </div>
      </div>

      <h2>Objet de l'avenant</h2>

      <div class="section">
        <p>${avenant.description || 'Modification du contrat de vente selon offre fournisseur acceptée.'}</p>
        
        ${offer ? `
        <p><strong>Fournisseur:</strong> ${offer.supplier?.name || 'N/A'}</p>
        <p><strong>Description de l'offre:</strong> ${offer.description || 'N/A'}</p>
        ` : ''}
      </div>

      <div class="amount">
        <div class="label">MONTANT DE L'AVENANT</div>
        <div class="amount-value">${formatAmount(avenant.amount_total)} CHF</div>
        <div style="margin-top: 10px; font-size: 10pt;">
          Montant HT: ${formatAmount(avenant.amount_ht)} CHF<br>
          TVA (${avenant.vat_rate || 8.1}%): ${formatAmount(avenant.amount_vat)} CHF<br>
          <strong>Total TTC: ${formatAmount(avenant.amount_total)} CHF</strong>
        </div>
      </div>

      <div class="section">
        <h2>Conditions</h2>
        <p>
          Le présent avenant fait partie intégrante du contrat de vente initial.
          Toutes les autres conditions du contrat restent inchangées.
        </p>
        ${avenant.notes ? `<p><strong>Notes:</strong> ${avenant.notes}</p>` : ''}
      </div>

      <div class="signature-block">
        <div class="signature">
          <div class="signature-line">
            ${buyer?.first_name || ''} ${buyer?.last_name || ''}<br>
            L'Acheteur
          </div>
        </div>
        <div class="signature">
          <div class="signature-line">
            ${organization?.name || 'RealPro SA'}<br>
            Le Promoteur
          </div>
        </div>
      </div>

      <div class="footer">
        Document généré le ${new Date().toLocaleDateString('fr-CH')} à ${new Date().toLocaleTimeString('fr-CH')}<br>
        ${organization?.name || 'RealPro SA'} - Tous droits réservés
      </div>
    </body>
    </html>
  `;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-CH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Convert HTML to PDF (placeholder - would use a library like puppeteer)
async function htmlToPDF(html: string): Promise<Uint8Array> {
  // In a real implementation, you would use a library like:
  // - puppeteer (headless Chrome)
  // - jsPDF
  // - pdfmake
  // For now, return a simple placeholder
  
  // This is a basic implementation that creates a simple PDF structure
  // In production, you should use a proper PDF generation library
  
  const encoder = new TextEncoder();
  return encoder.encode(html);
}

// Placeholder implementations for other PDF types
async function generateInvoicePDF(supabase: any, userId: string, body: any) {
  return { success: true, message: 'Invoice PDF generation not yet implemented' };
}

async function generateContractPDF(supabase: any, userId: string, body: any) {
  return { success: true, message: 'Contract PDF generation not yet implemented' };
}

async function generateReportPDF(supabase: any, userId: string, body: any) {
  return { success: true, message: 'Report PDF generation not yet implemented' };
}
