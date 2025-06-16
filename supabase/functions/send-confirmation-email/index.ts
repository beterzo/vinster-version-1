
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  user: {
    email: string;
    user_metadata?: {
      first_name?: string;
      last_name?: string;
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const getEmailTemplate = (confirmUrl: string, firstName?: string) => {
  const name = firstName ? firstName : "daar";
  
  return `<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <title>Bevestig je e-mailadres</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        background-color: #f4f6f8;
        color: #1a1a1a;
        padding: 40px;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        text-align: center;
      }
      h1 {
        color: #002855;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        margin-top: 24px;
        padding: 14px 24px;
        background-color: #002855;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Bevestig je e-mailadres</h1>
      <p>Welkom bij Vinster! We zijn blij dat je er bent.</p>
      <p>Klik op de onderstaande knop om je account te activeren en toegang te krijgen tot jouw persoonlijke loopbaanprofiel.</p>
      <a class="button" href="${confirmUrl}">Bevestig je e-mailadres</a>
      <p class="footer">Ontvang je deze mail per ongeluk? Dan kun je dit bericht gewoon negeren.</p>
    </div>
  </body>
</html>`;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Webhook received:", req.method);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailData = await req.json();
    console.log("Email webhook payload:", JSON.stringify(payload, null, 2));

    const { user, email_data } = payload;
    const { token_hash, email_action_type, redirect_to, site_url } = email_data;

    // Construct the confirmation URL
    const confirmUrl = `${site_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;
    
    console.log("Sending confirmation email to:", user.email);
    console.log("Confirmation URL:", confirmUrl);

    const firstName = user.user_metadata?.first_name;
    const emailHtml = getEmailTemplate(confirmUrl, firstName);

    const emailResponse = await resend.emails.send({
      from: "Vinster <onboarding@resend.dev>",
      to: [user.email],
      subject: "Bevestig je e-mailadres voor Vinster",
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
