import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthEventPayload {
  user: {
    id: string;
    email: string;
    user_metadata: {
      first_name?: string;
      last_name?: string;
      language?: string;
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
  };
}

// Email subjects for different languages and actions
const emailSubjects = {
  signup: {
    nl: "Bevestig je account bij Vinster",
    en: "Confirm your Vinster account", 
    de: "Bestätigen Sie Ihr Vinster-Konto",
    no: "Bekreft din Vinster-konto"
  },
  recovery: {
    nl: "Reset je Vinster wachtwoord",
    en: "Reset your Vinster password",
    de: "Vinster-Passwort zurücksetzen",
    no: "Tilbakestill ditt Vinster-passord"
  }
};

// Initialize Supabase client with proper error handling
let supabaseClient: any = null;
try {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase environment variables");
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  
  supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  console.log("✅ Supabase client initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize Supabase client:", error);
}

// Check if email is unsubscribed
const isEmailUnsubscribed = async (email: string): Promise<boolean> => {
  if (!supabaseClient) return false;
  
  try {
    const { data, error } = await supabaseClient
      .from('email_unsubscribes')
      .select('email')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.log("⚠️ Error checking unsubscribe status:", error.message);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.log("⚠️ Exception checking unsubscribe status:", error);
    return false;
  }
};

// Generate unsubscribe token
const generateUnsubscribeToken = async (email: string): Promise<string> => {
  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "fallback-secret";
  const data = new TextEncoder().encode(email + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
};

// Get user language from database by user ID
const getUserLanguageById = async (userId: string): Promise<string | null> => {
  if (!supabaseClient) {
    console.log("⚠️ Supabase client not available for user ID lookup");
    return null;
  }

  try {
    console.log(`🔍 Fetching language for user ID: ${userId}`);
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('language')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.log("⚠️ Could not fetch user language from database by ID:", error.message);
      return null;
    }
    
    if (data?.language) {
      console.log(`✅ Found user language by ID: ${data.language}`);
      return data.language;
    }
  } catch (error) {
    console.log("⚠️ Exception fetching user language by ID:", error);
  }
  
  return null;
};

// Get user language from database by email (for password reset)
const getUserLanguageByEmail = async (email: string): Promise<string | null> => {
  if (!supabaseClient) {
    console.log("⚠️ Supabase client not available for email lookup");
    return null;
  }

  try {
    console.log(`🔍 Fetching user language by email: ${email}`);
    
    // First get the user ID from auth.users by email
    const { data: authData, error: authError } = await supabaseClient.auth.admin.listUsers();
    
    if (authError) {
      console.log("⚠️ Could not fetch users from auth:", authError.message);
      return null;
    }

    const user = authData.users.find((u: any) => u.email === email);
    if (!user) {
      console.log(`⚠️ User not found with email: ${email}`);
      return null;
    }

    console.log(`✅ Found user by email, now fetching profile for ID: ${user.id}`);
    
    // Now get the language from profiles table
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('language')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.log("⚠️ Could not fetch user profile by email lookup:", profileError.message);
      return null;
    }
    
    if (profileData?.language) {
      console.log(`✅ Found user language by email lookup: ${profileData.language}`);
      return profileData.language;
    }
  } catch (error) {
    console.log("⚠️ Exception fetching user language by email:", error);
  }
  
  return null;
};

// Extract language from redirect URL
const getLanguageFromRedirect = (redirectUrl: string): string | null => {
  try {
    const url = new URL(redirectUrl);
    const langParam = url.searchParams.get('lang');
    if (langParam && (langParam === 'nl' || langParam === 'en' || langParam === 'de' || langParam === 'no')) {
      console.log(`✅ Language from redirect URL: ${langParam}`);
      return langParam;
    }
  } catch (error) {
    console.log("⚠️ Could not extract language from redirect URL:", error);
  }
  return null;
};

// Optimized language detection with minimal database calls
const detectUserLanguage = async (
  eventType: string, 
  userId: string, 
  email: string, 
  userMetadata: any, 
  redirectUrl: string
): Promise<string> => {
  console.log(`🌐 Starting language detection for ${eventType} event`);
  console.log(`📧 User: ${email}, UserID: ${userId}`);
  console.log(`🔗 Redirect URL: ${redirectUrl}`);
  console.log(`📝 User metadata:`, userMetadata);

  let detectedLanguage = 'nl'; // Default fallback
  let detectionMethod = 'default-fallback';

  // Priority 1: User metadata (available for both signup and recovery)
  if (userMetadata?.language) {
    detectedLanguage = userMetadata.language;
    detectionMethod = 'user-metadata';
    console.log(`✅ Language from user metadata: ${detectedLanguage}`);
    return detectedLanguage;
  }

  // Priority 2: Redirect URL (fast, no database call)
  const urlLanguage = getLanguageFromRedirect(redirectUrl);
  if (urlLanguage) {
    detectedLanguage = urlLanguage;
    detectionMethod = 'redirect-url';
    console.log(`✅ Language from redirect URL: ${detectedLanguage}`);
    return detectedLanguage;
  }

  // Priority 3: Database lookup only if absolutely necessary (for signup only)
  if (eventType === 'signup') {
    console.log("📧 SIGNUP: Trying database lookup as last resort...");
    const dbLanguage = await getUserLanguageById(userId);
    if (dbLanguage) {
      detectedLanguage = dbLanguage;
      detectionMethod = 'database-by-id';
      console.log(`✅ Language from database: ${detectedLanguage}`);
      return detectedLanguage;
    }
  }

  console.log(`🎯 Final language decision: ${detectedLanguage} (method: ${detectionMethod})`);
  return detectedLanguage;
};

// Create plain text version of signup email
const createSignupEmailText = (firstName: string, verificationUrl: string, language: string, unsubscribeUrl: string): string => {
  const texts = {
    nl: {
      greeting: `Hoi ${firstName},`,
      thanks: 'Bedankt voor je aanmelding bij Vinster!',
      instruction: 'Klik op de link hieronder om je account te activeren:',
      footer: 'Als je dit account niet hebt aangemaakt, kun je deze email negeren.',
      regards: 'Met vriendelijke groet,',
      signature: 'Team Vinster',
      tagline: 'Jouw venster op de toekomst',
      unsubscribe: 'Afmelden van Vinster emails:'
    },
    en: {
      greeting: `Hi ${firstName},`,
      thanks: 'Thanks for signing up with Vinster!',
      instruction: 'Click the link below to activate your account:',
      footer: "If you didn't create this account, you can safely ignore this email.",
      regards: 'Best regards,',
      signature: 'Team Vinster',
      tagline: 'Your window to the future',
      unsubscribe: 'Unsubscribe from Vinster emails:'
    },
    de: {
      greeting: `Hallo ${firstName},`,
      thanks: 'Vielen Dank für Ihre Anmeldung bei Vinster!',
      instruction: 'Klicken Sie auf den Link unten, um Ihr Konto zu aktivieren:',
      footer: 'Falls Sie dieses Konto nicht erstellt haben, können Sie diese E-Mail ignorieren.',
      regards: 'Mit freundlichen Grüßen,',
      signature: 'Team Vinster',
      tagline: 'Ihr Fenster zur Zukunft',
      unsubscribe: 'Von Vinster E-Mails abmelden:'
    },
    no: {
      greeting: `Hei ${firstName},`,
      thanks: 'Takk for at du registrerte deg hos Vinster!',
      instruction: 'Klikk på lenken nedenfor for å aktivere kontoen din:',
      footer: 'Hvis du ikke opprettet denne kontoen, kan du trygt ignorere denne e-posten.',
      regards: 'Vennlig hilsen,',
      signature: 'Team Vinster',
      tagline: 'Ditt vindu til fremtiden',
      unsubscribe: 'Meld deg av Vinster-e-poster:'
    }
  };
  
  const t = texts[language as keyof typeof texts] || texts.nl;
  
  return `
VINSTER
${t.tagline}

${t.greeting}

${t.thanks}

${t.instruction}

${verificationUrl}

${t.footer}

${t.regards}
${t.signature}

---
${t.unsubscribe}
${unsubscribeUrl}
  `.trim();
};

// Create plain text version of password reset email
const createPasswordResetEmailText = (firstName: string, resetUrl: string, language: string, unsubscribeUrl: string): string => {
  const texts = {
    nl: {
      greeting: `Hoi ${firstName},`,
      message: 'Je hebt een wachtwoord reset aangevraagd. Klik op de link hieronder om een nieuw wachtwoord in te stellen:',
      security: 'Veiligheidsmelding: Deze link is 60 minuten geldig en kan maar één keer gebruikt worden.',
      footer: 'Als je geen wachtwoord reset hebt aangevraagd, kun je deze email negeren.',
      regards: 'Met vriendelijke groet,',
      signature: 'Team Vinster',
      tagline: 'Jouw venster op de toekomst',
      unsubscribe: 'Afmelden van Vinster emails:'
    },
    en: {
      greeting: `Hi ${firstName},`,
      message: 'You requested a password reset. Click the link below to set a new password:',
      security: 'Security notice: This link is valid for 60 minutes and can only be used once.',
      footer: "If you didn't request a password reset, you can safely ignore this email.",
      regards: 'Best regards,',
      signature: 'Team Vinster',
      tagline: 'Your window to the future',
      unsubscribe: 'Unsubscribe from Vinster emails:'
    },
    de: {
      greeting: `Hallo ${firstName},`,
      message: 'Sie haben ein Zurücksetzen des Passworts angefordert. Klicken Sie auf den Link unten, um ein neues Passwort zu setzen:',
      security: 'Sicherheitshinweis: Dieser Link ist 60 Minuten gültig und kann nur einmal verwendet werden.',
      footer: 'Falls Sie kein Zurücksetzen des Passworts angefordert haben, können Sie diese E-Mail ignorieren.',
      regards: 'Mit freundlichen Grüßen,',
      signature: 'Team Vinster',
      tagline: 'Ihr Fenster zur Zukunft',
      unsubscribe: 'Von Vinster E-Mails abmelden:'
    },
    no: {
      greeting: `Hei ${firstName},`,
      message: 'Du har bedt om tilbakestilling av passord. Klikk på lenken nedenfor for å sette et nytt passord:',
      security: 'Sikkerhetsmelding: Denne lenken er gyldig i 60 minutter og kan kun brukes én gang.',
      footer: 'Hvis du ikke ba om tilbakestilling av passord, kan du trygt ignorere denne e-posten.',
      regards: 'Vennlig hilsen,',
      signature: 'Team Vinster',
      tagline: 'Ditt vindu til fremtiden',
      unsubscribe: 'Meld deg av Vinster-e-poster:'
    }
  };
  
  const t = texts[language as keyof typeof texts] || texts.nl;
  
  return `
VINSTER
${t.tagline}

${t.greeting}

${t.message}

${resetUrl}

${t.security}

${t.footer}

${t.regards}
${t.signature}

---
${t.unsubscribe}
${unsubscribeUrl}
  `.trim();
};

// Signup email template with unsubscribe link
const createSignupEmailHtml = (firstName: string, verificationUrl: string, language: string, unsubscribeUrl: string) => {
  const texts = {
    nl: {
      tagline: 'Jouw venster op de toekomst',
      title: 'Bevestig je email adres',
      message: `Hoi ${firstName}, bedankt voor je aanmelding! Klik op de knop hieronder om je account te activeren.`,
      button: 'Activeer mijn account',
      footer: 'Als je dit account niet hebt aangemaakt, kun je deze email negeren.',
      regards: 'Met vriendelijke groet,',
      unsubscribe: 'Wil je geen emails meer ontvangen van Vinster?',
      unsubscribeLink: 'Afmelden'
    },
    en: {
      tagline: 'Your window to the future',
      title: 'Confirm your email address',
      message: `Hi ${firstName}, thanks for signing up! Click the button below to activate your account.`,
      button: 'Activate my account',
      footer: "If you didn't create this account, you can safely ignore this email.",
      regards: 'Best regards,',
      unsubscribe: 'Don\'t want to receive emails from Vinster anymore?',
      unsubscribeLink: 'Unsubscribe'
    },
    de: {
      tagline: 'Ihr Fenster zur Zukunft',
      title: 'Bestätigen Sie Ihre E-Mail-Adresse',
      message: `Hallo ${firstName}, vielen Dank für Ihre Anmeldung! Klicken Sie auf die Schaltfläche unten, um Ihr Konto zu aktivieren.`,
      button: 'Mein Konto aktivieren',
      footer: 'Falls Sie dieses Konto nicht erstellt haben, können Sie diese E-Mail ignorieren.',
      regards: 'Mit freundlichen Grüßen,',
      unsubscribe: 'Möchten Sie keine E-Mails mehr von Vinster erhalten?',
      unsubscribeLink: 'Abmelden'
    },
    no: {
      tagline: 'Ditt vindu til fremtiden',
      title: 'Bekreft e-postadressen din',
      message: `Hei ${firstName}, takk for at du registrerte deg! Klikk på knappen nedenfor for å aktivere kontoen din.`,
      button: 'Aktiver kontoen min',
      footer: 'Hvis du ikke opprettet denne kontoen, kan du trygt ignorere denne e-posten.',
      regards: 'Vennlig hilsen,',
      unsubscribe: 'Vil du ikke motta e-poster fra Vinster lenger?',
      unsubscribeLink: 'Meld deg av'
    }
  };
  
  const t = texts[language as keyof typeof texts] || texts.nl;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${emailSubjects.signup[language as keyof typeof emailSubjects.signup] || emailSubjects.signup.nl}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #232D4B 0%, #E4C05B 100%); padding: 30px; text-align: center; color: white; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
        .content { padding: 30px; text-align: center; }
        .title { font-size: 24px; font-weight: 600; color: #232D4B; margin-bottom: 16px; }
        .message { font-size: 16px; color: #666; margin-bottom: 30px; }
        .button { display: inline-block; padding: 15px 30px; background: #FFCD3E; color: #1F2937; text-decoration: none; border-radius: 6px; font-weight: 600; }
        .footer { padding: 20px; background: #f8f9fa; text-align: center; color: #666; font-size: 14px; }
        .unsubscribe { margin-top: 15px; font-size: 12px; color: #999; }
        .unsubscribe a { color: #999; text-decoration: underline; }
        .company-info { margin-top: 10px; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Vinster</div>
          <div>${t.tagline}</div>
        </div>
        <div class="content">
          <h1 class="title">${t.title}</h1>
          <p class="message">${t.message}</p>
          <a href="${verificationUrl}" class="button">
            ${t.button}
          </a>
        </div>
        <div class="footer">
          <p>${t.footer}</p>
          <p>${t.regards}<br><strong>Team Vinster</strong></p>
          <div class="company-info">
            Vinster B.V.<br>
            KvK: 04050762<br>
            team@vinster.ai
          </div>
          <div class="unsubscribe">
            ${t.unsubscribe} <a href="${unsubscribeUrl}">${t.unsubscribeLink}</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Password reset email template with unsubscribe link
const createPasswordResetEmailHtml = (firstName: string, resetUrl: string, language: string, unsubscribeUrl: string) => {
  const texts = {
    nl: {
      tagline: 'Jouw venster op de toekomst',
      title: 'Reset je wachtwoord',
      message: `Hoi ${firstName}, je hebt een wachtwoord reset aangevraagd. Klik op de knop hieronder om een nieuw wachtwoord in te stellen.`,
      button: 'Nieuw wachtwoord instellen',
      securityTitle: 'Veiligheidsmelding:',
      securityMessage: 'Deze link is 60 minuten geldig en kan maar één keer gebruikt worden.',
      footer: 'Als je geen wachtwoord reset hebt aangevraagd, kun je deze email negeren.',
      regards: 'Met vriendelijke groet,',
      unsubscribe: 'Wil je geen emails meer ontvangen van Vinster?',
      unsubscribeLink: 'Afmelden'
    },
    en: {
      tagline: 'Your window to the future',
      title: 'Reset your password',
      message: `Hi ${firstName}, you requested a password reset. Click the button below to set a new password.`,
      button: 'Set new password',
      securityTitle: 'Security notice:',
      securityMessage: 'This link is valid for 60 minutes and can only be used once.',
      footer: "If you didn't request a password reset, you can safely ignore this email.",
      regards: 'Best regards,',
      unsubscribe: 'Don\'t want to receive emails from Vinster anymore?',
      unsubscribeLink: 'Unsubscribe'
    },
    de: {
      tagline: 'Ihr Fenster zur Zukunft',
      title: 'Passwort zurücksetzen',
      message: `Hallo ${firstName}, Sie haben ein Zurücksetzen des Passworts angefordert. Klicken Sie auf die Schaltfläche unten, um ein neues Passwort zu setzen.`,
      button: 'Neues Passwort setzen',
      securityTitle: 'Sicherheitshinweis:',
      securityMessage: 'Dieser Link ist 60 Minuten gültig und kann nur einmal verwendet werden.',
      footer: 'Falls Sie kein Zurücksetzen des Passworts angefordert haben, können Sie diese E-Mail ignorieren.',
      regards: 'Mit freundlichen Grüßen,',
      unsubscribe: 'Möchten Sie keine E-Mails mehr von Vinster erhalten?',
      unsubscribeLink: 'Abmelden'
    },
    no: {
      tagline: 'Ditt vindu til fremtiden',
      title: 'Tilbakestill passordet ditt',
      message: `Hei ${firstName}, du har bedt om tilbakestilling av passord. Klikk på knappen nedenfor for å sette et nytt passord.`,
      button: 'Sett nytt passord',
      securityTitle: 'Sikkerhetsmelding:',
      securityMessage: 'Denne lenken er gyldig i 60 minutter og kan kun brukes én gang.',
      footer: 'Hvis du ikke ba om tilbakestilling av passord, kan du trygt ignorere denne e-posten.',
      regards: 'Vennlig hilsen,',
      unsubscribe: 'Vil du ikke motta e-poster fra Vinster lenger?',
      unsubscribeLink: 'Meld deg av'
    }
  };
  
  const t = texts[language as keyof typeof texts] || texts.nl;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${emailSubjects.recovery[language as keyof typeof emailSubjects.recovery] || emailSubjects.recovery.nl}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #232D4B 0%, #E4C05B 100%); padding: 30px; text-align: center; color: white; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
        .content { padding: 30px; text-align: center; }
        .title { font-size: 24px; font-weight: 600; color: #232D4B; margin-bottom: 16px; }
        .message { font-size: 16px; color: #666; margin-bottom: 30px; }
        .button { display: inline-block; padding: 15px 30px; background: #FFCD3E; color: #1F2937; text-decoration: none; border-radius: 6px; font-weight: 600; }
        .footer { padding: 20px; background: #f8f9fa; text-align: center; color: #666; font-size: 14px; }
        .security-notice { background: #f0f8ff; border-left: 4px solid #2754C5; padding: 15px; margin: 20px 0; }
        .unsubscribe { margin-top: 15px; font-size: 12px; color: #999; }
        .unsubscribe a { color: #999; text-decoration: underline; }
        .company-info { margin-top: 10px; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Vinster</div>
          <div>${t.tagline}</div>
        </div>
        <div class="content">
          <h1 class="title">${t.title}</h1>
          <p class="message">${t.message}</p>
          <a href="${resetUrl}" class="button">
            ${t.button}
          </a>
          <div class="security-notice">
            <p style="margin: 0; font-size: 14px;"><strong>${t.securityTitle}</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">${t.securityMessage}</p>
          </div>
        </div>
        <div class="footer">
          <p>${t.footer}</p>
          <p>${t.regards}<br><strong>Team Vinster</strong></p>
          <div class="company-info">
            Vinster B.V.<br>
            KvK: 04050762<br>
            team@vinster.ai
          </div>
          <div class="unsubscribe">
            ${t.unsubscribe} <a href="${unsubscribeUrl}">${t.unsubscribeLink}</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  const startTime = Date.now();
  console.log("🚀 Email webhook started at:", new Date().toISOString());

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("❌ RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "RESEND_API_KEY not configured" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("✅ RESEND_API_KEY found, initializing Resend client");
    const resend = new Resend(resendApiKey);

    // Parse and validate payload using Standard Webhooks verification
    let payload: AuthEventPayload;
    try {
      const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET');
      
      if (!hookSecret) {
        console.error("❌ SEND_EMAIL_HOOK_SECRET not configured");
        return new Response(JSON.stringify({ 
          error: {
            http_code: 500,
            message: "Webhook secret not configured" 
          }
        }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const rawPayload = await req.text();
      const headers = Object.fromEntries(req.headers);
      
      console.log("🔐 Verifying webhook signature...");
      
      // Extract the base64 part after "v1," prefix (Supabase stores as "v1,whsec_xxx")
      const secretParts = hookSecret.split(',');
      const webhookSecret = secretParts.length > 1 ? secretParts[1] : hookSecret;
      
      console.log("🔑 Using webhook secret format:", secretParts.length > 1 ? "v1,whsec_xxx (extracted)" : "direct");
      
      const wh = new Webhook(webhookSecret);
      payload = wh.verify(rawPayload, headers) as AuthEventPayload;
      
      console.log("✅ Webhook signature verified successfully");
      console.log("📧 Received auth event:", {
        email: payload.user?.email,
        eventType: payload.email_data?.email_action_type,
        userId: payload.user?.id,
        redirectTo: payload.email_data?.redirect_to,
        userMetadata: payload.user?.user_metadata
      });
    } catch (error: any) {
      console.error("❌ Webhook verification failed:", error);
      return new Response(JSON.stringify({ 
        error: {
          http_code: 401,
          message: "Webhook verification failed: " + error.message
        }
      }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Validate required fields
    if (!payload.user?.email || !payload.email_data?.email_action_type) {
      console.error("❌ Missing required fields in payload");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Missing required fields" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check if user has unsubscribed
    const isUnsubscribed = await isEmailUnsubscribed(payload.user.email);
    if (isUnsubscribed) {
      console.log(`🚫 User ${payload.user.email} has unsubscribed, skipping email`);
      return new Response(JSON.stringify({ 
        success: true, 
        message: "User has unsubscribed, email not sent" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Process only signup and recovery events
    const eventType = payload.email_data.email_action_type;
    if (eventType !== "signup" && eventType !== "recovery") {
      console.log(`⚠️ Ignoring unsupported event type: ${eventType}`);
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Event type ${eventType} not processed by this function` 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const user = payload.user;
    
    // Enhanced language detection
    const userLanguage = await detectUserLanguage(
      eventType,
      user.id,
      user.email,
      user.user_metadata,
      payload.email_data.redirect_to || ''
    );
    
    const firstName = user.user_metadata?.first_name || (userLanguage === 'en' ? 'there' : 'daar');
    const emailSubject = emailSubjects[eventType as keyof typeof emailSubjects][userLanguage as keyof typeof emailSubjects.signup] || emailSubjects[eventType as keyof typeof emailSubjects].nl;

    // Generate unsubscribe URL
    const unsubscribeToken = await generateUnsubscribeToken(user.email);
    const unsubscribeUrl = `https://aqajxxevifmhdjlvqhkz.supabase.co/functions/v1/handle-unsubscribe?email=${encodeURIComponent(user.email)}&token=${unsubscribeToken}`;

    console.log("📧 Preparing email:", {
      to: user.email,
      language: userLanguage,
      firstName: firstName,
      subject: emailSubject,
      eventType: eventType,
      originalRedirectTo: payload.email_data.redirect_to,
      unsubscribeUrl: unsubscribeUrl
    });

    // Create the appropriate email content and action URL
    let emailHtml: string;
    let emailText: string;
    let actionUrl: string;

    if (eventType === "signup") {
      // For signup, modify the redirect_to URL to include the language parameter
      const baseRedirectUrl = payload.email_data.redirect_to || 'https://vinster.ai/email-confirmed';
      const redirectUrl = new URL(baseRedirectUrl);
      redirectUrl.searchParams.set('lang', userLanguage);
      
      actionUrl = `https://aqajxxevifmhdjlvqhkz.supabase.co/auth/v1/verify?token=${payload.email_data.token_hash}&type=signup&redirect_to=${encodeURIComponent(redirectUrl.toString())}`;
      emailHtml = createSignupEmailHtml(firstName, actionUrl, userLanguage, unsubscribeUrl);
      emailText = createSignupEmailText(firstName, actionUrl, userLanguage, unsubscribeUrl);
      
      console.log("📧 Created signup URL with language parameter:", redirectUrl.toString());
    } else {
      // For recovery, create a direct link to reset-password page with token parameters
      const directResetUrl = `https://vinster.ai/reset-password?token_hash=${payload.email_data.token_hash}&type=recovery&lang=${userLanguage}`;
      console.log("🔗 Creating direct reset URL:", directResetUrl);
      
      actionUrl = directResetUrl;
      emailHtml = createPasswordResetEmailHtml(firstName, actionUrl, userLanguage, unsubscribeUrl);
      emailText = createPasswordResetEmailText(firstName, actionUrl, userLanguage, unsubscribeUrl);
    }

    console.log("📤 Sending multipart email via Resend...");

    // Try to send email with primary sender
    let emailResponse;
    try {
      emailResponse = await resend.emails.send({
        from: "Team Vinster <team@vinster.ai>",
        to: [user.email],
        subject: emailSubject,
        html: emailHtml,
        text: emailText, // Add plain text version
      });

      if (emailResponse.error) {
        console.log("⚠️ Primary sender failed, trying fallback...");
        
        // Fallback to verified domain
        emailResponse = await resend.emails.send({
          from: "Team Vinster <onboarding@resend.dev>",
          to: [user.email],
          subject: emailSubject,
          html: emailHtml,
          text: emailText, // Add plain text version
        });
      }
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Failed to send email: " + error.message 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (emailResponse.error) {
      console.error("❌ All email sending attempts failed:", emailResponse.error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Email sending failed: " + emailResponse.error.message 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Multipart email sent successfully in ${duration}ms:`, emailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `${eventType} email sent successfully with plain text support`,
      emailId: emailResponse.data?.id,
      language: userLanguage,
      eventType: eventType,
      duration: `${duration}ms`,
      finalActionUrl: actionUrl,
      unsubscribeUrl: unsubscribeUrl,
      approach: eventType === 'recovery' ? 'direct-reset-url' : 'supabase-verify-url-with-lang',
      emailFormat: 'multipart (HTML + plain text)'
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ Webhook error after ${duration}ms:`, error);
    console.error("Error stack:", error.stack);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
