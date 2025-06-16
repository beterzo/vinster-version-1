
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bevestig je e-mailadres - Vinster</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        background-color: #f8f9fa;
        color: #1a1a1a;
        margin: 0;
        padding: 0;
        line-height: 1.6;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: linear-gradient(135deg, #002855 0%, #003875 100%);
        padding: 40px 40px 30px 40px;
        text-align: center;
      }
      .logo {
        max-width: 120px;
        height: auto;
        margin-bottom: 20px;
      }
      .header h1 {
        color: #ffffff;
        font-size: 28px;
        font-weight: 700;
        margin: 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .content {
        padding: 40px;
        text-align: center;
      }
      .welcome-text {
        font-size: 18px;
        color: #002855;
        font-weight: 600;
        margin-bottom: 20px;
      }
      .description {
        font-size: 16px;
        color: #4a5568;
        margin-bottom: 30px;
        line-height: 1.7;
      }
      .confirm-button {
        display: inline-block;
        background: linear-gradient(135deg, #002855 0%, #003875 100%);
        color: #ffffff;
        text-decoration: none;
        padding: 16px 32px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 16px;
        text-align: center;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 40, 85, 0.2);
        border: none;
        cursor: pointer;
      }
      .confirm-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 40, 85, 0.3);
      }
      .alternative-link {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
      }
      .alternative-text {
        font-size: 14px;
        color: #718096;
        margin-bottom: 10px;
      }
      .url-link {
        color: #002855;
        word-break: break-all;
        font-size: 12px;
        text-decoration: underline;
      }
      .footer {
        background-color: #f8f9fa;
        padding: 30px 40px;
        text-align: center;
        border-top: 1px solid #e2e8f0;
      }
      .footer-text {
        font-size: 14px;
        color: #718096;
        margin: 0 0 10px 0;
      }
      .footer-brand {
        font-size: 12px;
        color: #a0aec0;
        margin: 0;
      }
      .accent-bar {
        height: 4px;
        background: linear-gradient(90deg, #FBBF24 0%, #F59E0B 100%);
      }
      
      @media only screen and (max-width: 600px) {
        .email-container {
          margin: 10px;
          border-radius: 8px;
        }
        .header, .content, .footer {
          padding: 30px 20px;
        }
        .header h1 {
          font-size: 24px;
        }
        .confirm-button {
          padding: 14px 28px;
          font-size: 15px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="accent-bar"></div>
      
      <div class="header">
        <img src="https://vinster-journey-dashboard.lovable.app/lovable-uploads/2e668999-7dcb-4ce4-b077-05e65938fe2e.png" alt="Vinster Logo" class="logo" />
        <h1>Welkom bij Vinster!</h1>
      </div>
      
      <div class="content">
        <div class="welcome-text">
          Hallo ${name}, we zijn blij dat je er bent! 🎉
        </div>
        
        <div class="description">
          Je hebt je succesvol aangemeld voor Vinster. Klik op de onderstaande knop om je e-mailadres te bevestigen en toegang te krijgen tot jouw persoonlijke loopbaanprofiel.
        </div>
        
        <a href="${confirmUrl}" class="confirm-button">
          Bevestig je e-mailadres
        </a>
        
        <div class="alternative-link">
          <div class="alternative-text">
            Werkt de knop niet? Kopieer deze link naar je browser:
          </div>
          <a href="${confirmUrl}" class="url-link">${confirmUrl}</a>
        </div>
      </div>
      
      <div class="footer">
        <div class="footer-text">
          Ontvang je deze mail per ongeluk? Dan kun je dit bericht gewoon negeren.
        </div>
        <div class="footer-brand">
          © 2024 Vinster - Jouw reis naar een betere loopbaan
        </div>
      </div>
    </div>
  </body>
</html>`;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Email confirmation webhook received:", req.method);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailData = await req.json();
    console.log("Email webhook payload:", JSON.stringify(payload, null, 2));

    const { user, email_data } = payload;
    const { token_hash, email_action_type, redirect_to, site_url } = email_data;

    // Construct the confirmation URL to redirect to the main website
    const baseUrl = "https://vinster-journey-dashboard.lovable.app";
    const confirmUrl = `${site_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${baseUrl}`;
    
    console.log("Sending beautiful confirmation email to:", user.email);
    console.log("Confirmation URL:", confirmUrl);

    const firstName = user.user_metadata?.first_name;
    const emailHtml = getEmailTemplate(confirmUrl, firstName);

    const emailResponse = await resend.emails.send({
      from: "Vinster <onboarding@resend.dev>",
      to: [user.email],
      subject: "🎉 Bevestig je e-mailadres voor Vinster",
      html: emailHtml,
    });

    console.log("Beautiful email sent successfully:", emailResponse);

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
