
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { VerificationEmail } from "./_templates/verification-email.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

// Email subjects in different languages
const emailSubjects = {
  nl: "Bevestig je account bij Vinster",
  en: "Confirm your Vinster account"
};

const handler = async (req: Request): Promise<Response> => {
  console.log("🔐 Verification email webhook called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: AuthEventPayload = await req.json();
    console.log("📧 Auth Event payload received:", JSON.stringify(payload, null, 2));

    // Check if it's a signup event
    if (payload.email_data?.email_action_type !== "signup") {
      console.log("❌ Not a signup event, ignoring");
      return new Response(JSON.stringify({ success: false, message: "Not a signup event" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const user = payload.user;
    console.log("👤 New user signup:", user.email);

    // Detect language from user metadata, default to Dutch
    const userLanguage = user.user_metadata?.language || 'nl';
    console.log("🌍 User language detected:", userLanguage);

    // Create the correct verification URL that will redirect to email-confirmed
    const redirectUrl = 'https://vinster.ai/email-confirmed';
    console.log("🔗 Using redirect URL:", redirectUrl);

    // Use the token_hash (not token) for the verification URL
    const verificationUrl = `https://aqajxxevifmhdjlvqhkz.supabase.co/auth/v1/verify?token=${payload.email_data.token_hash}&type=signup&redirect_to=${encodeURIComponent(redirectUrl)}`;

    console.log("✅ Verification URL created:", verificationUrl);

    // Get user metadata
    const firstName = user.user_metadata?.first_name || (userLanguage === 'en' ? 'there' : 'daar');
    const lastName = user.user_metadata?.last_name || '';

    // Get appropriate email subject
    const emailSubject = emailSubjects[userLanguage as keyof typeof emailSubjects] || emailSubjects.nl;

    // Render email template with language
    const emailHtml = await renderAsync(
      VerificationEmail({
        firstName,
        lastName,
        verificationUrl,
        email: user.email,
        language: userLanguage
      })
    );

    // Send verification email from team@vinster.ai domain
    const emailResponse = await resend.emails.send({
      from: "Team Vinster <team@vinster.ai>",
      to: [user.email],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("📧 Email sent:", emailResponse);
    console.log("🌍 Email sent in language:", userLanguage);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Verification email sent",
      emailId: emailResponse.data?.id,
      language: userLanguage,
      subject: emailSubject,
      redirectUrl: redirectUrl,
      verificationUrl: verificationUrl
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("❌ Error in verification email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
