import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // POST /communications/send-email - Send email
    if (method === 'POST' && pathSegments.length === 1 && pathSegments[0] === 'send-email') {
      const body = await req.json();
      const result = await sendEmail(supabase, user.id, body);
      return jsonResponse(result);
    }

    // POST /communications/send-sms - Send SMS
    if (method === 'POST' && pathSegments.length === 1 && pathSegments[0] === 'send-sms') {
      const body = await req.json();
      const result = await sendSMS(supabase, user.id, body);
      return jsonResponse(result);
    }

    // POST /communications/send-bulk-email - Send bulk emails
    if (method === 'POST' && pathSegments.length === 1 && pathSegments[0] === 'send-bulk-email') {
      const body = await req.json();
      const result = await sendBulkEmail(supabase, user.id, body);
      return jsonResponse(result);
    }

    // POST /communications/send-template-email - Send email from template
    if (method === 'POST' && pathSegments.length === 1 && pathSegments[0] === 'send-template-email') {
      const body = await req.json();
      const result = await sendTemplateEmail(supabase, user.id, body);
      return jsonResponse(result);
    }

    return jsonResponse({ error: 'Route not found' }, 404);

  } catch (error) {
    console.error('Communications function error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Email templates
const EMAIL_TEMPLATES: Record<string, { subject: string; html: (data: any) => string }> = {
  workflow_approval_required: {
    subject: 'Approbation requise - {workflow_name}',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #00B8A9; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">RealPro SA</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-top: 0;">Approbation requise</h2>
          <p style="color: #666; line-height: 1.6;">
            Bonjour ${data.recipient_name},
          </p>
          <p style="color: #666; line-height: 1.6;">
            Une étape du workflow "${data.workflow_name}" nécessite votre approbation.
          </p>
          <div style="background: white; padding: 20px; border-left: 4px solid #00B8A9; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #333;">${data.step_name}</p>
            <p style="margin: 10px 0 0 0; color: #666;">${data.step_description || ''}</p>
          </div>
          <a href="${data.action_url}" style="display: inline-block; background: #00B8A9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Voir les détails</a>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Cet email a été envoyé automatiquement. Merci de ne pas y répondre.
          </p>
        </div>
      </div>
    `,
  },
  workflow_step_completed: {
    subject: 'Étape terminée - {workflow_name}',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #00B8A9; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">RealPro SA</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-top: 0;">Étape terminée</h2>
          <p style="color: #666; line-height: 1.6;">
            Bonjour ${data.recipient_name},
          </p>
          <p style="color: #666; line-height: 1.6;">
            L'étape "${data.step_name}" du workflow "${data.workflow_name}" a été terminée avec succès.
          </p>
          ${data.comment ? `<p style="color: #666; font-style: italic;">Commentaire : ${data.comment}</p>` : ''}
          <a href="${data.action_url}" style="display: inline-block; background: #00B8A9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Voir les détails</a>
        </div>
      </div>
    `,
  },
  avenant_ready_to_sign: {
    subject: 'Avenant à signer - {reference}',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #00B8A9; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">RealPro SA</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-top: 0;">Avenant prêt à signer</h2>
          <p style="color: #666; line-height: 1.6;">
            Bonjour ${data.buyer_name},
          </p>
          <p style="color: #666; line-height: 1.6;">
            Votre avenant au contrat de vente (référence ${data.reference}) est prêt à être signé.
          </p>
          <div style="background: white; padding: 20px; border-left: 4px solid #00B8A9; margin: 20px 0;">
            <p style="margin: 0; color: #666;">Projet : ${data.project_name}</p>
            <p style="margin: 10px 0 0 0; color: #666;">Lot : ${data.lot_reference}</p>
            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold; color: #00B8A9;">Montant : ${formatAmount(data.amount)} CHF</p>
          </div>
          <a href="${data.signature_url}" style="display: inline-block; background: #00B8A9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Signer l'avenant</a>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Ce lien de signature est sécurisé et unique.
          </p>
        </div>
      </div>
    `,
  },
  new_modification_offer: {
    subject: 'Nouvelle offre de modification disponible',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #00B8A9; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">RealPro SA</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-top: 0;">Nouvelle offre de modification</h2>
          <p style="color: #666; line-height: 1.6;">
            Bonjour,
          </p>
          <p style="color: #666; line-height: 1.6;">
            Une nouvelle offre de modification est disponible pour votre lot.
          </p>
          <div style="background: white; padding: 20px; border-left: 4px solid #00B8A9; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #333;">${data.offer_title}</p>
            <p style="margin: 10px 0; color: #666;">${data.offer_description}</p>
            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold; color: #00B8A9;">Montant : ${formatAmount(data.offer_amount)} CHF</p>
          </div>
          <a href="${data.offer_url}" style="display: inline-block; background: #00B8A9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Consulter l'offre</a>
        </div>
      </div>
    `,
  },
  payment_reminder: {
    subject: 'Rappel de paiement - {invoice_reference}',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #00B8A9; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">RealPro SA</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-top: 0;">Rappel de paiement</h2>
          <p style="color: #666; line-height: 1.6;">
            Bonjour ${data.buyer_name},
          </p>
          <p style="color: #666; line-height: 1.6;">
            Nous vous rappelons que le paiement de la facture ${data.invoice_reference} arrive à échéance le ${data.due_date}.
          </p>
          <div style="background: white; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">Montant : ${formatAmount(data.amount)} CHF</p>
            <p style="margin: 10px 0 0 0; color: #666;">Échéance : ${data.due_date}</p>
          </div>
          <a href="${data.invoice_url}" style="display: inline-block; background: #00B8A9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Voir la facture</a>
        </div>
      </div>
    `,
  },
};

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-CH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Send email
async function sendEmail(supabase: any, userId: string, body: any) {
  const { to, subject, html, text, cc, bcc, attachments } = body;

  if (!to || !subject || (!html && !text)) {
    throw new Error('Missing required fields: to, subject, and html or text');
  }

  // Log email in database
  const { data: emailLog, error: logError } = await supabase
    .from('email_logs')
    .insert({
      to_address: to,
      subject,
      html_body: html,
      text_body: text,
      sent_by: userId,
      status: 'queued',
    })
    .select()
    .single();

  if (logError) {
    console.error('Failed to log email:', logError);
  }

  // In production, integrate with an email service like:
  // - SendGrid
  // - Mailgun
  // - Amazon SES
  // - Postmark
  
  // For now, simulate sending
  console.log('Email would be sent:', { to, subject });

  // Update log status
  if (emailLog) {
    await supabase
      .from('email_logs')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', emailLog.id);
  }

  return {
    success: true,
    message: 'Email queued for sending',
    email_id: emailLog?.id,
  };
}

// Send SMS
async function sendSMS(supabase: any, userId: string, body: any) {
  const { to, message } = body;

  if (!to || !message) {
    throw new Error('Missing required fields: to, message');
  }

  // Log SMS in database
  const { data: smsLog, error: logError } = await supabase
    .from('sms_logs')
    .insert({
      to_number: to,
      message,
      sent_by: userId,
      status: 'queued',
    })
    .select()
    .single();

  if (logError) {
    console.error('Failed to log SMS:', logError);
  }

  // In production, integrate with an SMS service like:
  // - Twilio
  // - Vonage (Nexmo)
  // - MessageBird
  // - Swisscom SMS API
  
  // For now, simulate sending
  console.log('SMS would be sent:', { to, message });

  // Update log status
  if (smsLog) {
    await supabase
      .from('sms_logs')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', smsLog.id);
  }

  return {
    success: true,
    message: 'SMS queued for sending',
    sms_id: smsLog?.id,
  };
}

// Send bulk email
async function sendBulkEmail(supabase: any, userId: string, body: any) {
  const { recipients, subject, html, text } = body;

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    throw new Error('recipients must be a non-empty array');
  }

  const results = [];
  
  for (const recipient of recipients) {
    try {
      const result = await sendEmail(supabase, userId, {
        to: recipient.email,
        subject: subject.replace(/\{(\w+)\}/g, (_, key) => recipient[key] || ''),
        html: html?.replace(/\{(\w+)\}/g, (_, key) => recipient[key] || ''),
        text: text?.replace(/\{(\w+)\}/g, (_, key) => recipient[key] || ''),
      });
      results.push({ email: recipient.email, success: true, ...result });
    } catch (error) {
      results.push({ email: recipient.email, success: false, error: error.message });
    }
  }

  return {
    success: true,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  };
}

// Send email from template
async function sendTemplateEmail(supabase: any, userId: string, body: any) {
  const { to, template, data } = body;

  if (!to || !template || !data) {
    throw new Error('Missing required fields: to, template, data');
  }

  const emailTemplate = EMAIL_TEMPLATES[template];
  
  if (!emailTemplate) {
    throw new Error(`Template not found: ${template}`);
  }

  const subject = emailTemplate.subject.replace(/\{(\w+)\}/g, (_, key) => data[key] || '');
  const html = emailTemplate.html(data);

  return sendEmail(supabase, userId, { to, subject, html });
}
