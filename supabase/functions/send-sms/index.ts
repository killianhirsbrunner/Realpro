import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SMSRequest {
  phone_number: string;
  code: string;
  purpose: 'LOGIN' | 'PHONE_VERIFY' | 'TRANSACTION' | 'PASSWORD_RESET';
  language?: 'fr' | 'de' | 'en' | 'it';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { phone_number, code, purpose, language = 'fr' }: SMSRequest = await req.json();

    if (!phone_number || !code) {
      throw new Error('phone_number and code are required');
    }

    // Get message template based on purpose and language
    const message = getSMSMessage(code, purpose, language);

    // In production, use Twilio, MessageBird, or Swiss provider like Swisscom
    // For now, we'll use Twilio as example

    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      // Development mode - just log the message
      console.log('SMS would be sent:');
      console.log(`To: ${phone_number}`);
      console.log(`Message: ${message}`);
      console.log(`Code: ${code}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'SMS logged (development mode)',
          code_preview: code.substring(0, 2) + '****',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
      },
      body: new URLSearchParams({
        To: phone_number,
        From: TWILIO_PHONE_NUMBER,
        Body: message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send SMS');
    }

    const result = await response.json();

    // Log for audit
    console.log(`SMS sent to ${phone_number.substring(0, 6)}*** - SID: ${result.sid}`);

    return new Response(
      JSON.stringify({
        success: true,
        message_sid: result.sid,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending SMS:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

function getSMSMessage(
  code: string,
  purpose: 'LOGIN' | 'PHONE_VERIFY' | 'TRANSACTION' | 'PASSWORD_RESET',
  language: 'fr' | 'de' | 'en' | 'it'
): string {
  const templates: Record<string, Record<string, string>> = {
    LOGIN: {
      fr: `Votre code de connexion RealPro: ${code}. Valide 5 minutes. Ne le partagez pas.`,
      de: `Ihr RealPro-Anmeldecode: ${code}. Gültig für 5 Minuten. Nicht teilen.`,
      en: `Your RealPro login code: ${code}. Valid for 5 minutes. Do not share.`,
      it: `Il tuo codice di accesso RealPro: ${code}. Valido 5 minuti. Non condividerlo.`,
    },
    PHONE_VERIFY: {
      fr: `Code de vérification RealPro: ${code}. Ce code expire dans 5 minutes.`,
      de: `RealPro-Verifizierungscode: ${code}. Dieser Code läuft in 5 Minuten ab.`,
      en: `RealPro verification code: ${code}. This code expires in 5 minutes.`,
      it: `Codice di verifica RealPro: ${code}. Questo codice scade tra 5 minuti.`,
    },
    TRANSACTION: {
      fr: `Confirmez votre action RealPro avec le code: ${code}. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.`,
      de: `Bestätigen Sie Ihre RealPro-Aktion mit dem Code: ${code}. Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese Nachricht.`,
      en: `Confirm your RealPro action with code: ${code}. If you didn't request this, ignore this message.`,
      it: `Conferma la tua azione RealPro con il codice: ${code}. Se non hai richiesto questo, ignora questo messaggio.`,
    },
    PASSWORD_RESET: {
      fr: `Code de réinitialisation RealPro: ${code}. Si vous n'avez pas demandé de réinitialisation, ignorez ce message.`,
      de: `RealPro-Zurücksetzungscode: ${code}. Wenn Sie kein Zurücksetzen angefordert haben, ignorieren Sie diese Nachricht.`,
      en: `RealPro reset code: ${code}. If you didn't request a reset, ignore this message.`,
      it: `Codice di reimpostazione RealPro: ${code}. Se non hai richiesto un ripristino, ignora questo messaggio.`,
    },
  };

  return templates[purpose]?.[language] || templates[purpose]?.['fr'] || `Code RealPro: ${code}`;
}
