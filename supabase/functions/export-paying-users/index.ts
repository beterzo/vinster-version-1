import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get all paying user IDs
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id")
      .eq("has_paid", true);

    if (profilesError) throw profilesError;

    const payingIds = new Set((profiles || []).map((p: any) => p.id));

    // Fetch all users via admin API (paginated)
    const emails: string[] = [];
    let page = 1;
    const perPage = 1000;
    while (true) {
      const { data: { users }, error } = await supabase.auth.admin.listUsers({
        page,
        perPage,
      });
      if (error) throw error;
      for (const u of users) {
        if (payingIds.has(u.id) && u.email) {
          emails.push(u.email);
        }
      }
      if (users.length < perPage) break;
      page++;
    }

    emails.sort();

    return new Response(JSON.stringify({ emails }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
