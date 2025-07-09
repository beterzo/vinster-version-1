
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { supabase } from "https://esm.sh/@supabase/supabase-js@2.50.0";

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

const emailSubjects = {
  signup: {
    nl: "Bevestig je account bij Vinster",
    en: "Confirm your Vinster account"
  },
  recovery: {
    nl: "Reset je Vinster wachtwoord",
    en: "Reset your Vinster password"
  }
};

// Create Supabase client for database queries
const supabaseClient = supabase(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

// Get user language from database
const getUserLanguage = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('language')
      .eq('id', userId)
      .single();
    
    if (!error && data?.language) {
      return data.language;
    }
  } catch (error) {
    console.log("Could not fetch user language from database:", error);
  }
  return 'nl'; // Default to Dutch
};

// Extract language from redirect URL
const getLanguageFromRedirect = (redirectUrl: string): string => {
  try {
    const url = new URL(redirectUrl);
    const langParam = url.searchParams.get('lang');
    if (langParam && (langParam === 'nl' || langParam === 'en')) {
      return langParam;
    }
  } catch (error) {
    console.log("Could not extract language from redirect URL:", error);
  }
  return 'nl'; // Default to Dutch
};

// Signup email template
const createSignupEmailHtml = (firstName: string, verificationUrl: string, language: string) => {
  const isNl = language === 'nl';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${isNl ? 'Bevestig je Vinster account' : 'Confirm your Vinster account'}</title>
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Vinster</div>
          <div>${isNl ? 'Jouw venster op de toekomst' : 'Your window to the future'}</div>
        </div>
        <div class="content">
          <h1 class="title">${isNl ? 'Bevestig je email adres' : 'Confirm your email address'}</h1>
          <p class="message">${isNl ? `Hoi ${firstName}, bedankt voor je aanmelding! Klik op de knop hieronder om je account te activeren.` : `Hi ${firstName}, thanks for signing up! Click the button below to activate your account.`}</p>
          <a href="${verificationUrl}" class="button">
            ${isNl ? 'Activeer mijn account' : 'Activate my account'}
          </a>
        </div>
        <div class="footer">
          <p>${isNl ? 'Als je dit account niet hebt aangemaakt, kun je deze email negeren.' : "If you didn't create this account, you can safely ignore this email."}</p>
          <p>${isNl ? 'Met vriendelijke groet,' : 'Best regards,'}<br><strong>Team Vinster</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Password reset email template
const createPasswordResetEmailHtml = (firstName: string, resetUrl: string, language: string) => {
  const isNl = language === 'nl';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${isNl ? 'Reset je Vinster wachtwoord' : 'Reset your Vinster password'}</title>
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Vinster</div>
          <div>${isNl ? 'Jouw venster op de toekomst' : 'Your window to the future'}</div>
        </div>
        <div class="content">
          <h1 class="title">${isNl ? 'Reset je wachtwoord' : 'Reset your password'}</h1>
          <p class="message">${isNl ? `Hoi ${firstName}, je hebt een wachtwoord reset aangevraagd. Klik op de knop hieronder om een nieuw wachtwoord in te stellen.` : `Hi ${firstName}, you requested a password reset. Click the button below to set a new password.`}</p>
          <a href="${resetUrl}" class="button">
            ${isNl ? 'Nieuw wachtwoord instellen' : 'Set new password'}
          </a>
          <div class="security-notice">
            <p style="margin: 0; font-size: 14px;"><strong>${isNl ? 'Veiligheidsmelding:' : 'Security notice:'}</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">${isNl ? 'Deze link is 60 minuten geldig en kan maar één keer gebruikt worden.' : 'This link is valid for 60 minutes and can only be used once.'}</p>
          </div>
        </div>
        <div class="footer">
          <p>${isNl ? 'Als je geen wachtwoord reset hebt aangevraagd, kun je deze email negeren.' : "If you didn't request a password reset, you can safely ignore this email."}</p>
          <p>${isNl ? 'Met vriendelijke groet,' : 'Best regards,'}<br><strong>Team Vinster</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  const startTime = Date.now();
  console.log("🚀 Email webhook started at:", new Date().toISOString());

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate API key
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

    // Parse payload
    const payload: AuthEventPayload = await req.json();
    console.log("📧 Processing auth event for:", payload.user.email, "| Event type:", payload.email_data?.email_action_type);

    // Process signup and recovery events
    const eventType = payload.email_data?.email_action_type;
    if (eventType !== "signup" && eventType !== "recovery") {
      console.log("⚠️ Not a signup or recovery event, ignoring");
      return new Response(JSON.stringify({ 
        success: false, 
        message: `Not a supported event type: ${eventType}` 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const user = payload.user;
    
    // Determine language (priority: database > redirect URL > default)
    let userLanguage = 'nl';
    
    // Try to get language from database first
    const dbLanguage = await getUserLanguage(user.id);
    if (dbLanguage) {
      userLanguage = dbLanguage;
    } else {
      // Fallback to redirect URL parameter
      const redirectLanguage = getLanguageFromRedirect(payload.email_data.redirect_to);
      userLanguage = redirectLanguage;
    }
    
    const firstName = user.user_metadata?.first_name || (userLanguage === 'en' ? 'there' : 'daar');
    const emailSubject = emailSubjects[eventType as keyof typeof emailSubjects][userLanguage as keyof typeof emailSubjects.signup] || emailSubjects[eventType as keyof typeof emailSubjects].nl;

    console.log("📧 Preparing email with:", {
      to: user.email,
      language: userLanguage,
      firstName: firstName,
      subject: emailSubject,
      eventType: eventType
    });

    let emailHtml: string;
    let actionUrl: string;

    if (eventType === "signup") {
      // Create verification URL for signup
      actionUrl = `https://aqajxxevifmhdjlvqhkz.supabase.co/auth/v1/verify?token=${payload.email_data.token_hash}&type=signup&redirect_to=${encodeURIComponent(payload.email_data.redirect_to)}`;
      emailHtml = createSignupEmailHtml(firstName, actionUrl, userLanguage);
    } else {
      // Create reset URL for password recovery
      actionUrl = `https://aqajxxevifmhdjlvqhkz.supabase.co/auth/v1/verify?token=${payload.email_data.token_hash}&type=recovery&redirect_to=${encodeURIComponent(payload.email_data.redirect_to)}`;
      emailHtml = createPasswordResetEmailHtml(firstName, actionUrl, userLanguage);
    }

    console.log("📤 Sending email via Resend from team@vinster.ai...");

    // Primary attempt with team@vinster.ai
    const emailResponse = await resend.emails.send({
      from: "Team Vinster <team@vinster.ai>",
      to: [user.email],
      subject: emailSubject,
      html: emailHtml,
    });

    if (emailResponse.error) {
      console.error("❌ Primary email failed:", emailResponse.error);
      
      // Fallback to verified domain
      console.log("🔄 Trying with fallback sender domain...");
      
      const fallbackResponse = await resend.emails.send({
        from: "Team Vinster <onboarding@resend.dev>",
        to: [user.email],
        subject: emailSubject,
        html: emailHtml,
      });

      if (fallbackResponse.error) {
        console.error("❌ Fallback email also failed:", fallbackResponse.error);
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Email sending failed: " + fallbackResponse.error.message 
        }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const duration = Date.now() - startTime;
      console.log(`✅ Fallback email sent successfully in ${duration}ms:`, fallbackResponse.data?.id);

      return new Response(JSON.stringify({ 
        success: true, 
        message: `${eventType} email sent successfully (using fallback sender)`,
        emailId: fallbackResponse.data?.id,
        sender: "onboarding@resend.dev",
        language: userLanguage,
        eventType: eventType,
        duration: `${duration}ms`
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Primary email sent successfully in ${duration}ms:`, emailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `${eventType} email sent successfully`,
      emailId: emailResponse.data?.id,
      sender: "team@vinster.ai",
      language: userLanguage,
      eventType: eventType,
      duration: `${duration}ms`
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ Webhook error after ${duration}ms:`, error.message);
    console.error("Stack trace:", error.stack);
    
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
