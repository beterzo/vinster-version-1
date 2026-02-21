import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRICE_MAP: Record<string, { priceId: string; locale: string }> = {
  nl: { priceId: "price_1Rvvv7BiHXiKCcHU0KcdPOTI", locale: "nl" },
  en: { priceId: "price_1RvvuWBiHXiKCcHURzeouvup", locale: "en" },
  us: { priceId: "price_1SrvTuBiHXiKCcHU1cbMTgk1", locale: "en" },
  de: { priceId: "price_1RvvtyBiHXiKCcHUW0vJIVSL", locale: "de" },
  no: { priceId: "price_1RvvtKBiHXiKCcHU4ROeMOpf", locale: "nb" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !userData.user?.email) {
      throw new Error("User not authenticated");
    }
    const user = userData.user;

    const { language } = await req.json();
    const langKey = language || "nl";
    const config = PRICE_MAP[langKey] || PRICE_MAP["nl"];

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer already exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const origin = req.headers.get("origin") || "https://vinster.ai";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: config.priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      locale: config.locale as Stripe.Checkout.SessionCreateParams.Locale,
      allow_promotion_codes: true,
      invoice_creation: { enabled: true },
      metadata: { user_id: user.id },
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-required`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
