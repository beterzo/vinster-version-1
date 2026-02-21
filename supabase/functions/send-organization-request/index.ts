import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrganizationRequest {
  name: string;
  email: string;
  organization: string;
  quantity: number;
  address: string;
  costCenter: string;
  comments: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, organization, quantity, address, costCenter, comments }: OrganizationRequest = await req.json();

    // Validate required fields
    if (!name || !email || !organization || !quantity || !address || !costCenter) {
      return new Response(
        JSON.stringify({ error: "Alle verplichte velden moeten ingevuld zijn" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const timestamp = new Date().toLocaleString("nl-NL", {
      timeZone: "Europe/Amsterdam",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const htmlEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#F0F4FF;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F4FF;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:#232D4B;padding:28px 40px;text-align:center;">
              <img src="https://vinster.lovable.app/lovable-uploads/597d8366-bb5f-4218-8d55-ff225da64b7d.png" alt="Vinster" width="140" style="display:block;margin:0 auto;" />
            </td>
          </tr>
          <!-- Title -->
          <tr>
            <td style="padding:32px 40px 16px;">
              <h1 style="margin:0;color:#232D4B;font-size:22px;font-weight:700;">Nieuwe aanvraag toegangscodes</h1>
              <p style="margin:8px 0 0;color:#6B7280;font-size:14px;">Via het organisatieformulier op vinster.ai</p>
            </td>
          </tr>
          <!-- Table -->
          <tr>
            <td style="padding:16px 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
                <tr style="background-color:#F0F4FF;">
                  <td style="padding:12px 16px;font-weight:600;color:#232D4B;font-size:14px;width:40%;border-bottom:1px solid #E5E7EB;">Naam</td>
                  <td style="padding:12px 16px;color:#374151;font-size:14px;border-bottom:1px solid #E5E7EB;">${escapeHtml(name)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;font-weight:600;color:#232D4B;font-size:14px;border-bottom:1px solid #E5E7EB;">E-mailadres</td>
                  <td style="padding:12px 16px;color:#374151;font-size:14px;border-bottom:1px solid #E5E7EB;"><a href="mailto:${escapeHtml(email)}" style="color:#2563EB;">${escapeHtml(email)}</a></td>
                </tr>
                <tr style="background-color:#F0F4FF;">
                  <td style="padding:12px 16px;font-weight:600;color:#232D4B;font-size:14px;border-bottom:1px solid #E5E7EB;">Organisatie</td>
                  <td style="padding:12px 16px;color:#374151;font-size:14px;border-bottom:1px solid #E5E7EB;">${escapeHtml(organization)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;font-weight:600;color:#232D4B;font-size:14px;border-bottom:1px solid #E5E7EB;">Aantal codes</td>
                  <td style="padding:12px 16px;color:#374151;font-size:14px;font-weight:700;border-bottom:1px solid #E5E7EB;">${quantity}</td>
                </tr>
                <tr style="background-color:#F0F4FF;">
                  <td style="padding:12px 16px;font-weight:600;color:#232D4B;font-size:14px;border-bottom:1px solid #E5E7EB;">Adres organisatie</td>
                  <td style="padding:12px 16px;color:#374151;font-size:14px;border-bottom:1px solid #E5E7EB;">${escapeHtml(address)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;font-weight:600;color:#232D4B;font-size:14px;border-bottom:1px solid #E5E7EB;">Kostenplaats</td>
                  <td style="padding:12px 16px;color:#374151;font-size:14px;border-bottom:1px solid #E5E7EB;">${escapeHtml(costCenter)}</td>
                </tr>
                <tr style="background-color:#F0F4FF;">
                  <td style="padding:12px 16px;font-weight:600;color:#232D4B;font-size:14px;border-bottom:1px solid #E5E7EB;">Opmerkingen</td>
                  <td style="padding:12px 16px;color:#374151;font-size:14px;border-bottom:1px solid #E5E7EB;">${escapeHtml(comments || "Geen opmerkingen")}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;font-weight:600;color:#232D4B;font-size:14px;">Tijdstip aanvraag</td>
                  <td style="padding:12px 16px;color:#374151;font-size:14px;">${timestamp}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#F9FAFB;padding:20px 40px;border-top:1px solid #E5E7EB;text-align:center;">
              <p style="margin:0;color:#9CA3AF;font-size:12px;">Dit bericht is automatisch verzonden via het organisatieformulier op vinster.ai</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const emailResponse = await resend.emails.send({
      from: "Team Vinster <team@vinster.ai>",
      to: ["team@vinster.ai", "kai@beterzo.tech"],
      subject: `Nieuwe organisatie-aanvraag: ${name} - ${organization} - ${quantity} codes`,
      html: htmlEmail,
    });

    console.log("Organization request email sent:", emailResponse);

    return new Response(
      JSON.stringify({ message: "Aanvraag verzonden" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-organization-request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

serve(handler);
