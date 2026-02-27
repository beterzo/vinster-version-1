import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const translations: Record<string, {
  subject: string;
  heading: string;
  tagline: string;
  thankYou: string;
  codesTitle: string;
  instructionsTitle: string;
  instruction1: string;
  instruction2: string;
  instruction3: string;
  greeting: string;
  signature: string;
  kvk: string;
}> = {
  nl: {
    subject: "Je Vinster toegangscodes",
    heading: "Je toegangscodes zijn klaar!",
    tagline: "Jouw venster op de toekomst",
    thankYou: "Bedankt voor je bestelling! Hieronder vind je de toegangscodes die je kunt delen met je cliënten.",
    codesTitle: "Jouw toegangscodes",
    instructionsTitle: "Hoe gebruik je de codes?",
    instruction1: "Deel een code met je cliënt",
    instruction2: "Je cliënt maakt een account aan op vinster.ai",
    instruction3: "Bij de betaling voert je cliënt de code in als kortingscode — het volledige bedrag wordt dan kwijtgescholden",
    greeting: "Met vriendelijke groet,",
    signature: "Team Vinster",
    kvk: "KvK: 95498516",
  },
  en: {
    subject: "Your Vinster access codes",
    heading: "Your access codes are ready!",
    tagline: "Your window to the future",
    thankYou: "Thank you for your order! Below you'll find the access codes you can share with your clients.",
    codesTitle: "Your access codes",
    instructionsTitle: "How to use the codes?",
    instruction1: "Share a code with your client",
    instruction2: "Your client creates an account at vinster.ai",
    instruction3: "During payment, your client enters the code as a discount code — the full amount will be waived",
    greeting: "Best regards,",
    signature: "Team Vinster",
    kvk: "KvK: 95498516",
  },
  de: {
    subject: "Ihre Vinster Zugangscodes",
    heading: "Ihre Zugangscodes sind bereit!",
    tagline: "Ihr Fenster in die Zukunft",
    thankYou: "Vielen Dank für Ihre Bestellung! Nachfolgend finden Sie die Zugangscodes, die Sie mit Ihren Klienten teilen können.",
    codesTitle: "Ihre Zugangscodes",
    instructionsTitle: "Wie verwenden Sie die Codes?",
    instruction1: "Teilen Sie einen Code mit Ihrem Klienten",
    instruction2: "Ihr Klient erstellt ein Konto auf vinster.ai",
    instruction3: "Bei der Zahlung gibt Ihr Klient den Code als Rabattcode ein — der volle Betrag wird erlassen",
    greeting: "Mit freundlichen Grüßen,",
    signature: "Team Vinster",
    kvk: "KvK: 95498516",
  },
  no: {
    subject: "Dine Vinster tilgangskoder",
    heading: "Dine tilgangskoder er klare!",
    tagline: "Ditt vindu til fremtiden",
    thankYou: "Takk for din bestilling! Nedenfor finner du tilgangskodene du kan dele med dine klienter.",
    codesTitle: "Dine tilgangskoder",
    instructionsTitle: "Hvordan bruker du kodene?",
    instruction1: "Del en kode med din klient",
    instruction2: "Din klient oppretter en konto på vinster.ai",
    instruction3: "Ved betaling skriver klienten inn koden som rabattkode — hele beløpet blir da frafalt",
    greeting: "Med vennlig hilsen,",
    signature: "Team Vinster",
    kvk: "KvK: 95498516",
  },
};

function generateReadableCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `VINSTER-${part()}-${part()}`;
}

function buildEmailHtml(codes: string[], lang: string): string {
  const t = translations[lang] || translations.nl;
  
  const codeRows = codes.map((code) => `
    <tr>
      <td style="padding: 10px 16px; border-bottom: 1px solid #E5E7EB;">
        <code style="font-family: 'Courier New', monospace; font-size: 16px; font-weight: 700; color: #232D4B; letter-spacing: 1px;">${code}</code>
      </td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
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
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #CBD5E1;">${t.tagline}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #232D4B;">${t.heading}</h2>
              <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 24px; color: #6B7280;">${t.thankYou}</p>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #232D4B;">${t.codesTitle}</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB; margin-bottom: 32px;">
                ${codeRows}
              </table>
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #232D4B;">${t.instructionsTitle}</h3>
              <table cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="padding: 6px 12px 6px 0; vertical-align: top;">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #232D4B; color: #FFFFFF; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700;">1</span>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: #6B7280; line-height: 22px;">${t.instruction1}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px 6px 0; vertical-align: top;">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #232D4B; color: #FFFFFF; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700;">2</span>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: #6B7280; line-height: 22px;">${t.instruction2}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px 6px 0; vertical-align: top;">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #232D4B; color: #FFFFFF; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700;">3</span>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: #6B7280; line-height: 22px;">${t.instruction3}</td>
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
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #6B7280;">${t.greeting}</p>
              <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #232D4B;">${t.signature}</p>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #9CA3AF;">${t.kvk}</p>
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

async function fulfillProfessionalCodes(stripe: Stripe, session: Stripe.Checkout.Session): Promise<void> {
  const metadata = session.metadata || {};
  
  // Prevent double fulfillment
  if (metadata.fulfilled === "true") {
    console.log("Session already fulfilled, skipping:", session.id);
    return;
  }

  const quantity = parseInt(metadata.quantity || "1");
  const email = metadata.email;
  const language = metadata.language || "nl";

  if (!email) {
    throw new Error("No email found in session metadata");
  }

  // Generate promotion codes
  const codes: string[] = [];
  for (let i = 0; i < quantity; i++) {
    const code = generateReadableCode();
    
    const coupon = await stripe.coupons.create({
      percent_off: 100,
      duration: "once",
      max_redemptions: 1,
      name: `Vinster Professional Code - ${code}`,
    });

    await stripe.promotionCodes.create({
      coupon: coupon.id,
      code,
      max_redemptions: 1,
    });

    codes.push(code);
  }

  // Mark session as fulfilled
  await stripe.checkout.sessions.update(session.id, {
    metadata: { ...metadata, fulfilled: "true" },
  });

  // Send email via Resend
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }

  const t = translations[language] || translations.nl;
  const emailHtml = buildEmailHtml(codes, language);

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: "Vinster <noreply@vinster.ai>",
      to: [email],
      subject: t.subject,
      html: emailHtml,
    }),
  });

  if (!emailResponse.ok) {
    const errorText = await emailResponse.text();
    console.error("Resend error:", errorText);
    console.error("Failed to send email, but codes were generated successfully");
  }

  console.log(`Successfully generated ${codes.length} codes for ${email} via webhook`);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200 });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET not configured");
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response(JSON.stringify({ error: "No signature" }), { status: 400 });
    }

    // Verify webhook signature
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

    console.log(`Received Stripe event: ${event.type}, id: ${event.id}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};

      if (metadata.type === "professional_codes" && session.payment_status === "paid") {
        console.log(`Processing professional codes fulfillment for session: ${session.id}`);
        await fulfillProfessionalCodes(stripe, session);
      }

      // Log entry_event for individual payments (not professional codes)
      if (!metadata.type && session.payment_status === "paid" && metadata.user_id) {
        const { createClient } = await import("npm:@supabase/supabase-js@2.57.2");
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );
        await supabaseAdmin.from("entry_events").insert({
          user_id: metadata.user_id,
          entry_method: "stripe_payment",
          stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
          source: "webhook",
        });
        console.log(`✅ Entry event logged for user ${metadata.user_id} via webhook`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
