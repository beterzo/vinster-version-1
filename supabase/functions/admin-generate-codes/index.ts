import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function generateReadableCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `VINSTER-${part()}-${part()}`;
}

function buildEmailHtml(codes: string[]): string {
  const codeRows = codes.map((code) => `
    <tr>
      <td style="padding: 10px 16px; border-bottom: 1px solid #E5E7EB;">
        <code style="font-family: 'Courier New', monospace; font-size: 16px; font-weight: 700; color: #232D4B; letter-spacing: 1px;">${code}</code>
      </td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * { font-family: 'Inter', Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F9FA;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F9FA; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #232D4B 0%, #2a3558 50%, #3d4a6b 100%); padding: 40px 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 36px; font-weight: 700; color: #E4C05B; letter-spacing: 1px;">Vinster</h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #CBD5E1;">Jouw venster op de toekomst</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #232D4B;">Je toegangscodes zijn klaar!</h2>
              <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 24px; color: #6B7280;">Hieronder vind je de toegangscodes die je kunt delen met je cliënten.</p>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #232D4B;">Jouw toegangscodes</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB; margin-bottom: 32px;">
                ${codeRows}
              </table>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #232D4B;">Hoe gebruik je de codes?</h3>
              <table cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="padding: 6px 12px 6px 0; vertical-align: top;">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #232D4B; color: #FFFFFF; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700;">1</span>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: #6B7280; line-height: 22px;">Deel een code met je cliënt</td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px 6px 0; vertical-align: top;">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #232D4B; color: #FFFFFF; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700;">2</span>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: #6B7280; line-height: 22px;">Je cliënt maakt een account aan op vinster.ai</td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px 6px 0; vertical-align: top;">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #232D4B; color: #FFFFFF; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700;">3</span>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: #6B7280; line-height: 22px;">Bij de betaling voert je cliënt de code in als kortingscode — het volledige bedrag wordt dan kwijtgescholden</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px;">
              <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 0;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px 32px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #6B7280;">Met vriendelijke groet,</p>
              <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #232D4B;">Team Vinster</p>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #9CA3AF;">KvK: 95498516</p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                <a href="mailto:team@vinster.ai" style="color: #6366F1; text-decoration: none;">team@vinster.ai</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, quantity } = await req.json();

    if (!email || !quantity) {
      throw new Error("email and quantity are required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const codes: string[] = [];
    for (let i = 0; i < quantity; i++) {
      const code = generateReadableCode();
      const coupon = await stripe.coupons.create({
        percent_off: 100,
        duration: "once",
        max_redemptions: 1,
        name: `Pro Code ${code}`,
      });
      await stripe.promotionCodes.create({
        coupon: coupon.id,
        code,
        max_redemptions: 1,
      });
      codes.push(code);
    }

    // Send email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const emailHtml = buildEmailHtml(codes);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Vinster <noreply@vinster.ai>",
        to: [email],
        subject: "Je Vinster toegangscodes",
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend error:", errorText);
    }

    console.log(`Generated ${codes.length} codes for ${email}: ${codes.join(", ")}`);

    return new Response(JSON.stringify({ success: true, codes, codes_generated: codes.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
