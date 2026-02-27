import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accessCode, userId } = await req.json();

    if (!accessCode || !userId) {
      return new Response(
        JSON.stringify({ success: false, message: "Access code and user ID are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Search for promotion codes matching the access code
    const promotionCodes = await stripe.promotionCodes.list({
      code: accessCode.trim(),
      active: true,
      limit: 1,
    });

    if (promotionCodes.data.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or expired access code" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const promoCode = promotionCodes.data[0];
    const coupon = promoCode.coupon;

    // Check if it's a 100% discount
    const isFreeAccess =
      (coupon.percent_off === 100) ||
      (coupon.amount_off !== null && coupon.amount_off !== undefined && coupon.percent_off === null);

    // For amount-based coupons, we accept any 100% equivalent
    // For simplicity, we check percent_off === 100
    if (coupon.percent_off !== 100) {
      return new Response(
        JSON.stringify({ success: false, message: "This code is not valid for free access" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Grant access - update has_paid
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ has_paid: true })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating payment status:", updateError);
      throw new Error("Failed to grant access");
    }

    // Deactivate the promotion code so it can't be reused
    await stripe.promotionCodes.update(promoCode.id, { active: false });

    // Log entry event
    await supabaseAdmin.from("entry_events").insert({
      user_id: userId,
      entry_method: "promo_code",
      code: accessCode.trim(),
      source: "stripe_promo",
    });

    console.log(`✅ Access code "${accessCode}" validated and deactivated for user: ${userId}`);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error validating access code:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
