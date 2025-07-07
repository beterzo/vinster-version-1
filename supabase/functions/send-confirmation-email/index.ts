
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { VerificationEmail } from "./_templates/verification-email.tsx";

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
  nl: "Bevestig je account bij Vinster",
  en: "Confirm your Vinster account"
};

// Fallback HTML template in case React Email fails
const createFallbackEmailHtml = (firstName: string, verificationUrl: string, language: string) => {
  const isNl = language === 'nl';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 32px; font-weight: bold; color: #E4C05B; }
        .tagline { color: #232D4B; font-size: 14px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
        .button { display: inline-block; padding: 16px 40px; background: #FFCD3E; color: #1F2937; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Vinster</div>
          <div class="tagline">${isNl ? 'Jouw venster op de toekomst' : 'Your window to the future'}</div>
        </div>
        <div class="content">
          <h2>${isNl ? 'Bevestig je email adres' : 'Confirm your email address'}</h2>
          <p>${isNl ? `Hoi ${firstName}, bedankt voor je aanmelding! Klik op de knop hieronder om je account te activeren.` : `Hi ${firstName}, thanks for signing up! Click the button below to activate your account.`}</p>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">
              ${isNl ? 'Activeer mijn account' : 'Activate my account'}
            </a>
          </div>
        </div>
        <div class="footer">
          <p>${isNl ? 'Als je dit account niet hebt aangemaakt, kun je deze email negeren.' : "If you didn't create this account, you can safely ignore this email."}</p>
          <p>${isNl ? 'Met vriendelijke groet,' : 'Best regards,'}<br>Team Vinster</p>
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

    console.log("✅ RESEND_API_KEY found");
    const resend = new Resend(resendApiKey);

    // Parse payload
    const payload: AuthEventPayload = await req.json();
    console.log("📧 Processing signup for:", payload.user.email);

    // Validate event type
    if (payload.email_data?.email_action_type !== "signup") {
      console.log("⚠️ Not a signup event, ignoring");
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Not a signup event" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const user = payload.user;
    const userLanguage = user.user_metadata?.language || 'nl';
    const redirectUrl = 'https://vinster.ai/email-confirmed';
    
    // Create verification URL
    const verificationUrl = `https://aqajxxevifmhdjlvqhkz.supabase.co/auth/v1/verify?token=${payload.email_data.token_hash}&type=signup&redirect_to=${encodeURIComponent(redirectUrl)}`;

    const firstName = user.user_metadata?.first_name || (userLanguage === 'en' ? 'there' : 'daar');
    const lastName = user.user_metadata?.last_name || '';
    const emailSubject = emailSubjects[userLanguage as keyof typeof emailSubjects] || emailSubjects.nl;

    console.log("📧 Attempting to render email template...");

    let emailHtml: string;
    
    // Try React Email template first, with fallback
    try {
      emailHtml = await renderAsync(
        VerificationEmail({
          firstName,
          lastName,
          verificationUrl,
          email: user.email,
          language: userLanguage
        })
      );
      console.log("✅ React Email template rendered successfully");
    } catch (templateError) {
      console.warn("⚠️ React Email template failed, using fallback:", templateError.message);
      emailHtml = createFallbackEmailHtml(firstName, verificationUrl, userLanguage);
    }

    console.log("📧 Sending email via Resend...");

    // Send email with team@vinster.ai as sender
    const emailResponse = await resend.emails.send({
      from: "Team Vinster <team@vinster.ai>",
      to: [user.email],
      subject: emailSubject,
      html: emailHtml,
    });

    if (emailResponse.error) {
      console.error("❌ Resend error:", emailResponse.error);
      
      // If domain not verified, try with fallback domain
      if (emailResponse.error.message?.includes('domain') || emailResponse.error.message?.includes('verify')) {
        console.log("🔄 Trying with fallback domain...");
        
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
          message: "Verification email sent successfully (fallback domain used)",
          emailId: fallbackResponse.data?.id,
          language: userLanguage,
          duration: `${duration}ms`
        }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      return new Response(JSON.stringify({ 
        success: false, 
        error: "Email sending failed: " + emailResponse.error.message 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Email sent successfully in ${duration}ms:`, emailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Verification email sent successfully",
      emailId: emailResponse.data?.id,
      language: userLanguage,
      duration: `${duration}ms`
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error after ${duration}ms:`, error.message);
    console.error("Stack:", error.stack);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      duration: `${duration}ms`
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
