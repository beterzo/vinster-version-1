
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
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
  };
}

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
    console.log("🔍 User details:", {
      id: user.id,
      email: user.email,
      firstName: user.user_metadata?.first_name,
      lastName: user.user_metadata?.last_name
    });

    // Use the redirect_to from the payload, but ensure it points to the right domain
    let redirectUrl = payload.email_data.redirect_to;
    
    // Replace localhost with the Lovable preview URL if present
    if (redirectUrl.includes('localhost:3000')) {
      redirectUrl = redirectUrl.replace('localhost:3000', '228ae9dd-6d6a-406b-9dbd-95adecbe51b0.lovableproject.com');
    }

    // Create verification URL using the corrected redirect URL
    const verificationUrl = `${Deno.env.get("SUPABASE_URL")}/auth/v1/verify?token=${payload.email_data.token_hash}&type=${payload.email_data.email_action_type}&redirect_to=${redirectUrl}`;

    console.log("✅ Verification URL created:", verificationUrl);
    console.log("🔗 Token details:", {
      token: payload.email_data.token,
      tokenHash: payload.email_data.token_hash,
      actionType: payload.email_data.email_action_type
    });

    // Get user metadata
    const firstName = user.user_metadata?.first_name || 'daar';
    const lastName = user.user_metadata?.last_name || '';

    // Render email template
    const emailHtml = await renderAsync(
      VerificationEmail({
        firstName,
        lastName,
        verificationUrl,
        email: user.email
      })
    );

    // Send verification email
    const emailResponse = await resend.emails.send({
      from: "Vinster <noreply@vinster.ai>",
      to: [user.email],
      subject: "Bevestig je account bij Vinster",
      html: emailHtml,
    });

    console.log("📧 Email sent:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Verification email sent",
      emailId: emailResponse.data?.id 
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
