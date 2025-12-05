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
    const pathSegments = url.pathname.split('/').filter(Boolean);

    // POST /integrations/sendgrid/send - Send email via SendGrid
    if (pathSegments[0] === 'sendgrid' && pathSegments[1] === 'send') {
      const body = await req.json();
      const result = await sendEmailViaSendGrid(body);
      return jsonResponse(result);
    }

    // POST /integrations/twilio/send-sms - Send SMS via Twilio
    if (pathSegments[0] === 'twilio' && pathSegments[1] === 'send-sms') {
      const body = await req.json();
      const result = await sendSMSViaTwilio(body);
      return jsonResponse(result);
    }

    // POST /integrations/swisssign/create-signature - Create signature request
    if (pathSegments[0] === 'swisssign' && pathSegments[1] === 'create-signature') {
      const body = await req.json();
      const result = await createSwissSignSignature(supabase, body);
      return jsonResponse(result);
    }

    // POST /integrations/swisssign/check-status - Check signature status
    if (pathSegments[0] === 'swisssign' && pathSegments[1] === 'check-status') {
      const body = await req.json();
      const result = await checkSwissSignStatus(body);
      return jsonResponse(result);
    }

    // POST /integrations/stripe/create-checkout - Create Stripe checkout session
    if (pathSegments[0] === 'stripe' && pathSegments[1] === 'create-checkout') {
      const body = await req.json();
      const result = await createStripeCheckout(body);
      return jsonResponse(result);
    }

    // POST /integrations/stripe/webhook - Stripe webhook handler
    if (pathSegments[0] === 'stripe' && pathSegments[1] === 'webhook') {
      const body = await req.text();
      const signature = req.headers.get('stripe-signature');
      const result = await handleStripeWebhook(supabase, body, signature);
      return jsonResponse(result);
    }

    return jsonResponse({ error: 'Route not found' }, 404);

  } catch (error) {
    console.error('Integrations function error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// =====================================================
// SENDGRID INTEGRATION
// =====================================================

async function sendEmailViaSendGrid(params: any) {
  const apiKey = Deno.env.get('SENDGRID_API_KEY');
  
  if (!apiKey) {
    console.warn('SendGrid API key not configured');
    return {
      success: false,
      provider: 'sendgrid',
      message: 'SendGrid not configured. Set SENDGRID_API_KEY environment variable.',
    };
  }

  const { to, from, subject, html, text, cc, bcc, attachments } = params;

  if (!to || !from || !subject || (!html && !text)) {
    throw new Error('Missing required fields: to, from, subject, and html or text');
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }],
          cc: cc ? (Array.isArray(cc) ? cc.map(email => ({ email })) : [{ email: cc }]) : undefined,
          bcc: bcc ? (Array.isArray(bcc) ? bcc.map(email => ({ email })) : [{ email: bcc }]) : undefined,
        }],
        from: { email: from },
        subject,
        content: [
          html ? { type: 'text/html', value: html } : null,
          text ? { type: 'text/plain', value: text } : null,
        ].filter(Boolean),
        attachments: attachments || [],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid error: ${error}`);
    }

    return {
      success: true,
      provider: 'sendgrid',
      message_id: response.headers.get('x-message-id'),
    };
  } catch (error: any) {
    console.error('SendGrid error:', error);
    throw error;
  }
}

// =====================================================
// TWILIO INTEGRATION
// =====================================================

async function sendSMSViaTwilio(params: any) {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!accountSid || !authToken || !fromNumber) {
    console.warn('Twilio not configured');
    return {
      success: false,
      provider: 'twilio',
      message: 'Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.',
    };
  }

  const { to, message } = params;

  if (!to || !message) {
    throw new Error('Missing required fields: to, message');
  }

  try {
    const auth = btoa(`${accountSid}:${authToken}`);
    
    const body = new URLSearchParams({
      To: to,
      From: fromNumber,
      Body: message,
    });

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Twilio error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();

    return {
      success: true,
      provider: 'twilio',
      message_sid: result.sid,
      status: result.status,
    };
  } catch (error: any) {
    console.error('Twilio error:', error);
    throw error;
  }
}

// =====================================================
// SWISSSIGN INTEGRATION (Qualified Electronic Signature)
// =====================================================

async function createSwissSignSignature(supabase: any, params: any) {
  const apiKey = Deno.env.get('SWISSSIGN_API_KEY');
  const apiSecret = Deno.env.get('SWISSSIGN_API_SECRET');

  if (!apiKey || !apiSecret) {
    console.warn('SwissSign not configured');
    return {
      success: false,
      provider: 'swisssign',
      message: 'SwissSign not configured. Set SWISSSIGN_API_KEY and SWISSSIGN_API_SECRET.',
      fallback_url: params.callback_url || null,
    };
  }

  const { document_id, document_url, signers, callback_url } = params;

  if (!document_id || !document_url || !signers || signers.length === 0) {
    throw new Error('Missing required fields: document_id, document_url, signers');
  }

  try {
    // In production, replace with actual SwissSign API endpoint
    // This is a placeholder implementation
    const response = await fetch('https://api.swisssign.com/v1/signatures', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document: {
          id: document_id,
          url: document_url,
          name: params.document_name || 'Document to sign',
        },
        signers: signers.map((signer: any) => ({
          email: signer.email,
          first_name: signer.first_name,
          last_name: signer.last_name,
          phone: signer.phone,
          signature_type: 'qualified', // qualified, advanced, or simple
        })),
        callback_url,
        language: params.language || 'fr',
        expires_at: params.expires_at || null,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SwissSign error: ${error}`);
    }

    const result = await response.json();

    // Save signature request in database
    await supabase.from('signature_requests').insert({
      document_id,
      provider: 'swisssign',
      provider_request_id: result.id,
      status: 'pending',
      signers: signers,
      callback_url,
    });

    return {
      success: true,
      provider: 'swisssign',
      request_id: result.id,
      signature_urls: result.signature_urls,
      expires_at: result.expires_at,
    };
  } catch (error: any) {
    console.error('SwissSign error:', error);
    // Fallback: return simple signature URL
    return {
      success: false,
      provider: 'swisssign',
      error: error.message,
      fallback_url: callback_url,
      message: 'SwissSign not available. Use fallback URL for simple signature.',
    };
  }
}

async function checkSwissSignStatus(params: any) {
  const apiKey = Deno.env.get('SWISSSIGN_API_KEY');

  if (!apiKey) {
    return { status: 'unknown', message: 'SwissSign not configured' };
  }

  const { request_id } = params;

  if (!request_id) {
    throw new Error('Missing request_id');
  }

  try {
    const response = await fetch(`https://api.swisssign.com/v1/signatures/${request_id}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check signature status');
    }

    const result = await response.json();

    return {
      status: result.status, // pending, signed, rejected, expired
      signed_at: result.signed_at,
      signed_document_url: result.signed_document_url,
      signers_status: result.signers,
    };
  } catch (error: any) {
    console.error('SwissSign status check error:', error);
    throw error;
  }
}

// =====================================================
// STRIPE INTEGRATION (Placeholder)
// =====================================================

async function createStripeCheckout(params: any) {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');

  if (!stripeKey) {
    return {
      success: false,
      message: 'Stripe not configured',
    };
  }

  // Placeholder implementation
  return {
    success: true,
    checkout_url: 'https://checkout.stripe.com/...',
    session_id: 'cs_test_...',
  };
}

async function handleStripeWebhook(supabase: any, body: string, signature: string | null) {
  // Verify webhook signature and process events
  // Placeholder implementation
  return {
    received: true,
  };
}

// =====================================================
// CONFIGURATION HELPERS
// =====================================================

export function getIntegrationsConfig() {
  return {
    sendgrid: {
      configured: !!Deno.env.get('SENDGRID_API_KEY'),
      features: ['email', 'templates', 'tracking'],
    },
    twilio: {
      configured: !!(Deno.env.get('TWILIO_ACCOUNT_SID') && Deno.env.get('TWILIO_AUTH_TOKEN')),
      features: ['sms', 'voice'],
    },
    swisssign: {
      configured: !!(Deno.env.get('SWISSSIGN_API_KEY') && Deno.env.get('SWISSSIGN_API_SECRET')),
      features: ['qualified_signature', 'advanced_signature'],
    },
    stripe: {
      configured: !!Deno.env.get('STRIPE_SECRET_KEY'),
      features: ['payments', 'subscriptions', 'invoices'],
    },
  };
}
