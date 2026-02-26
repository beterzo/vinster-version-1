import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get all org types
    const { data: orgTypes } = await supabase
      .from('organisation_types')
      .select('id, name, parent_type_id')
      .order('name');

    // Get all sessions
    const { data: sessions } = await supabase
      .from('user_organisation_sessions')
      .select('id, organisation_type_id, created_at');

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

    // Get uses_count from access codes as fallback
    const { data: allCodes } = await supabase
      .from('organisation_access_codes')
      .select('organisation_type_id, uses_count');

    // Sum uses_count per org type
    const codeUsesMap = new Map<string, number>();
    (allCodes || []).forEach(c => {
      if (c.organisation_type_id) {
        codeUsesMap.set(c.organisation_type_id, (codeUsesMap.get(c.organisation_type_id) || 0) + (c.uses_count || 0));
      }
    });

    const stats = (orgTypes || []).map(ot => {
      const orgSessions = (sessions || []).filter(s => s.organisation_type_id === ot.id);
      const sessionTotal = orgSessions.length;
      const codeTotal = codeUsesMap.get(ot.id) || 0;
      const thisMonth = orgSessions.filter(s => s.created_at >= thisMonthStart).length;
      const lastMonth = orgSessions.filter(s => s.created_at >= lastMonthStart && s.created_at < thisMonthStart).length;
      return {
        org_name: ot.name,
        org_id: ot.id,
        parent_type_id: ot.parent_type_id || null,
        this_month: thisMonth,
        last_month: lastMonth,
        total: Math.max(sessionTotal, codeTotal),
      };
    });

    // Get all access codes with org type names
    const { data: codesRaw } = await supabase
      .from('organisation_access_codes')
      .select('id, code, organisation_type_id, uses_count, max_uses, is_active, last_used_at')
      .order('created_at', { ascending: false });

    const orgMap = new Map((orgTypes || []).map(ot => [ot.id, ot.name]));

    const codes = (codesRaw || []).map(c => ({
      id: c.id,
      code: c.code,
      org_name: orgMap.get(c.organisation_type_id) || 'Onbekend',
      uses_count: c.uses_count || 0,
      max_uses: c.max_uses,
      is_active: c.is_active ?? true,
      last_used_at: c.last_used_at,
    }));

    return new Response(JSON.stringify({ stats, codes, org_types: orgTypes || [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
