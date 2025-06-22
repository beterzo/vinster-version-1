
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

interface WebhookPayload {
  type: string;
  table: string;
  record: any;
  schema: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("🔐 Verification email webhook called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: WebhookPayload = await req.json();
    console.log("📧 Webhook payload:", payload);

    // Only handle user signup events
    if (payload.type !== "INSERT" || payload.table !== "users") {
      console.log("❌ Not a user signup event, ignoring");
      return new Response(JSON.stringify({ success: false, message: "Not a signup event" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const user = payload.record;
    console.log("👤 New user signup:", user.email);

    // Create Supabase client for generating verification link
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Generate email verification token
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: user.email,
      options: {
        redirectTo: `${Deno.env.get("SUPABASE_URL")?.replace('supabase.co', 'supabase.app') || 'http://localhost:3000'}/auth/callback`
      }
    });

    if (error) {
      console.error("❌ Error generating verification link:", error);
      throw error;
    }

    console.log("✅ Verification link generated");

    // Get user metadata
    const firstName = user.raw_user_meta_data?.first_name || 'daar';
    const lastName = user.raw_user_meta_data?.last_name || '';

    // Render email template
    const emailHtml = await renderAsync(
      VerificationEmail({
        firstName,
        lastName,
        verificationUrl: data.properties?.action_link || '',
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
