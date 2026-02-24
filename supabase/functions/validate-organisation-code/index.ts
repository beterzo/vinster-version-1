import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Code is verplicht." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Look up the code
    const { data: accessCode, error: lookupError } = await supabase
      .from("organisation_access_codes")
      .select("id, code, organisation_type_id, is_active, uses_count, max_uses")
      .eq("code", code.trim())
      .single();

    if (lookupError || !accessCode) {
      return new Response(
        JSON.stringify({ error: "Deze code is niet geldig of niet meer actief." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!accessCode.is_active) {
      return new Response(
        JSON.stringify({ error: "Deze code is niet geldig of niet meer actief." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (accessCode.max_uses !== null && accessCode.uses_count >= accessCode.max_uses) {
      return new Response(
        JSON.stringify({ error: "Deze code is niet geldig of niet meer actief." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Increment uses_count and set last_used_at
    const { error: updateError } = await supabase
      .from("organisation_access_codes")
      .update({
        uses_count: accessCode.uses_count + 1,
        last_used_at: new Date().toISOString(),
      })
      .eq("id", accessCode.id);

    if (updateError) {
      console.error("Failed to update access code:", updateError);
      return new Response(
        JSON.stringify({ error: "Er is een fout opgetreden. Probeer het opnieuw." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get organisation type info
    const { data: orgType } = await supabase
      .from("organisation_types")
      .select("id, slug, name")
      .eq("id", accessCode.organisation_type_id)
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        organisation_type_id: accessCode.organisation_type_id,
        access_code_id: accessCode.id,
        organisation: orgType,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Er is een fout opgetreden." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
