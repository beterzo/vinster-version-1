
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

const handler = async (req: Request): Promise<Response> => {
  const startTime = Date.now();
  console.log("🚀 Email webhook started at:", new Date().toISOString());

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Quick validation of API key
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

    // Initialize Resend client
    const resend = new Resend(resendApiKey);

    // Parse payload quickly
    const payload: AuthEventPayload = await req.json();
    console.log("📧 Processing signup for:", payload.user.email);

    // Quick validation
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
    
    // Create verification URL with token_hash
    const verificationUrl = `https://aqajxxevifmhdjlvqhkz.supabase.co/auth/v1/verify?token=${payload.email_data.token_hash}&type=signup&redirect_to=${encodeURIComponent(redirectUrl)}`;

    const firstName = user.user_metadata?.first_name || (userLanguage === 'en' ? 'there' : 'daar');
    const lastName = user.user_metadata?.last_name || '';
    const emailSubject = emailSubjects[userLanguage as keyof typeof emailSubjects] || emailSubjects.nl;

    console.log("📧 Rendering email template...");

    // Render email template
    const emailHtml = await renderAsync(
      VerificationEmail({
        firstName,
        lastName,
        verificationUrl,
        email: user.email,
        language: userLanguage
      })
    );

    console.log("📧 Sending email via Resend...");

    // Send email - use fallback domain if vinster.ai not verified
    const emailResponse = await resend.emails.send({
      from: "Team Vinster <onboarding@resend.dev>", // Fallback to verified domain
      to: [user.email],
      subject: emailSubject,
      html: emailHtml,
    });

    if (emailResponse.error) {
      console.error("❌ Resend error:", emailResponse.error);
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
