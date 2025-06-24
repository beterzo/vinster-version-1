
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactFormRequest = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Alle velden zijn verplicht" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email to team@vinster.ai
    const emailResponse = await resend.emails.send({
      from: "Team Vinster <team@vinster.ai>",
      to: ["team@vinster.ai"],
      subject: `Nieuwe contactaanvraag van ${name}`,
      html: `
        <h2>Nieuwe contactaanvraag via Vinster</h2>
        <p><strong>Naam:</strong> ${name}</p>
        <p><strong>E-mailadres:</strong> ${email}</p>
        <p><strong>Bericht:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Dit bericht is verzonden via het contactformulier op de Vinster website.</em></p>
      `,
    });

    // Send confirmation email to the sender
    await resend.emails.send({
      from: "Team Vinster <team@vinster.ai>",
      to: [email],
      subject: "Bedankt voor je bericht aan Vinster",
      html: `
        <h2>Bedankt voor je bericht!</h2>
        <p>Beste ${name},</p>
        <p>We hebben je bericht ontvangen en nemen zo snel mogelijk contact met je op.</p>
        <p><strong>Jouw bericht:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p>Met vriendelijke groet,<br>Het Vinster team</p>
      `,
    });

    console.log("Contact email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ message: "Email verzonden" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
