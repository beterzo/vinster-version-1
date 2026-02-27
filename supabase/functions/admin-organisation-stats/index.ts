import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getMonthKey(date: Date): string {
  const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${months[date.getMonth()]} '${String(date.getFullYear()).slice(2)}`;
}

function getLast6Months(): { key: string; start: string; end: string }[] {
  const now = new Date();
  const months: { key: string; start: string; end: string }[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    months.push({
      key: getMonthKey(d),
      start: d.toISOString(),
      end: next.toISOString(),
    });
  }
  return months;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const months = getLast6Months();
    const monthly_columns = months.map(m => m.key);

    // Fetch all data - now including has_paid and is_unique
    const [orgTypesRes, sessionsRes, profilesRes, codesRes] = await Promise.all([
      supabase.from('organisation_types').select('id, name, parent_type_id, is_unique').order('name'),
      supabase.from('user_organisation_sessions').select('id, organisation_type_id, created_at, user_id'),
      supabase.from('profiles').select('id, created_at, has_paid'),
      supabase.from('organisation_access_codes').select('id, code, organisation_type_id, uses_count, max_uses, is_active, last_used_at').order('created_at', { ascending: false }),
    ]);

    const orgTypes = orgTypesRes.data || [];
    const sessions = sessionsRes.data || [];
    const profiles = profilesRes.data || [];
    const codesRaw = codesRes.data || [];

    // Build a set of paid user IDs for quick lookup
    const paidUserIds = new Set(profiles.filter(p => p.has_paid).map(p => p.id));
    const paidProfiles = profiles.filter(p => p.has_paid);

    // General stats: only count paid profiles
    const orgUserIds = new Set(sessions.map(s => s.user_id));

    const general_stats: Record<string, { total: number; org: number; normal: number }> = {};

    for (const m of months) {
      const inMonth = paidProfiles.filter(p => p.created_at >= m.start && p.created_at < m.end);
      const org = inMonth.filter(p => orgUserIds.has(p.id)).length;
      const normal = inMonth.length - org;
      general_stats[m.key] = { total: inMonth.length, org, normal };
    }
    const totalAll = paidProfiles.length;
    const totalOrg = paidProfiles.filter(p => orgUserIds.has(p.id)).length;
    const totalNormal = totalAll - totalOrg;

    // Account KPIs: new profiles per month with paid/code breakdown
    const sessionsWithCode = sessions.filter(s => s.access_code_id);
    const usersWithCode = new Set(sessionsWithCode.map(s => s.user_id));

    const account_kpis: Record<string, { total_new_profiles: number; new_paid_accounts: number; new_unpaid_accounts: number; via_payment: number; via_code: number }> = {};
    let kpiTotals = { total_new_profiles: 0, new_paid_accounts: 0, new_unpaid_accounts: 0, via_payment: 0, via_code: 0 };

    for (const m of months) {
      const newInMonth = profiles.filter(p => p.created_at >= m.start && p.created_at < m.end);
      const total_new = newInMonth.length;
      const via_payment = newInMonth.filter(p => p.has_paid).length;
      const via_code = newInMonth.filter(p => usersWithCode.has(p.id)).length;
      const new_paid = newInMonth.filter(p => p.has_paid || usersWithCode.has(p.id)).length;
      const new_unpaid = total_new - new_paid;

      account_kpis[m.key] = { total_new_profiles: total_new, new_paid_accounts: new_paid, new_unpaid_accounts: new_unpaid, via_payment, via_code };
      kpiTotals.total_new_profiles += total_new;
      kpiTotals.new_paid_accounts += new_paid;
      kpiTotals.new_unpaid_accounts += new_unpaid;
      kpiTotals.via_payment += via_payment;
      kpiTotals.via_code += via_code;
    }

    // Build is_unique lookup
    const isUniqueMap = new Map(orgTypes.map(ot => [ot.id, ot.is_unique ?? false]));

    // Org stats with monthly breakdown
    const stats = orgTypes.map(ot => {
      const isUnique = isUniqueMap.get(ot.id) || false;
      const orgSessions = sessions.filter(s => s.organisation_type_id === ot.id);

      // For branches (is_unique=false): only count sessions from paid users
      // For specific orgs (is_unique=true): count all sessions (code = access)
      const filteredSessions = isUnique
        ? orgSessions
        : orgSessions.filter(s => paidUserIds.has(s.user_id));

      const monthly: Record<string, number> = {};
      for (const m of months) {
        monthly[m.key] = filteredSessions.filter(s => s.created_at >= m.start && s.created_at < m.end).length;
      }

      return {
        org_name: ot.name,
        org_id: ot.id,
        parent_type_id: ot.parent_type_id || null,
        is_unique: isUnique,
        monthly,
        total: isUnique ? orgSessions.length : filteredSessions.length,
      };
    });

    // Access codes with org names
    const orgMap = new Map(orgTypes.map(ot => [ot.id, ot.name]));
    const codes = codesRaw.map(c => ({
      id: c.id,
      code: c.code,
      org_name: orgMap.get(c.organisation_type_id) || 'Onbekend',
      uses_count: c.uses_count || 0,
      max_uses: c.max_uses,
      is_active: c.is_active ?? true,
      last_used_at: c.last_used_at,
    }));

    return new Response(JSON.stringify({
      stats,
      codes,
      org_types: orgTypes,
      monthly_columns,
      general_stats,
      general_totals: { total: totalAll, org: totalOrg, normal: totalNormal },
      account_kpis,
      account_kpi_totals: kpiTotals,
    }), {
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
