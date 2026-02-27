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

    // FIX 1: added access_code_id to sessions select
    const [orgTypesRes, sessionsRes, profilesRes, codesRes, entryEventsRes] = await Promise.all([
      supabase.from('organisation_types').select('id, name, parent_type_id, is_unique').order('name'),
      supabase.from('user_organisation_sessions').select('id, organisation_type_id, created_at, user_id, access_code_id'),
      supabase.from('profiles').select('id, created_at, has_paid'),
      supabase.from('organisation_access_codes').select('id, code, organisation_type_id, uses_count, max_uses, is_active, last_used_at').order('created_at', { ascending: false }),
      supabase.from('entry_events').select('user_id, entry_method, redeemed_at'),
    ]);

    const orgTypes = orgTypesRes.data || [];
    const sessions = sessionsRes.data || [];
    const profiles = profilesRes.data || [];
    const codesRaw = codesRes.data || [];
    const entryEvents = entryEventsRes.data || [];

    // Build a set of paid user IDs for quick lookup
    const paidUserIds = new Set(profiles.filter(p => p.has_paid).map(p => p.id));
    const paidProfiles = profiles.filter(p => p.has_paid);

    // FIX 4: Build month-scoped org user sets instead of global
    const general_stats: Record<string, { total: number; org: number; normal: number }> = {};

    for (const m of months) {
      const inMonth = paidProfiles.filter(p => p.created_at >= m.start && p.created_at < m.end);
      // Only count users who had an org session in the SAME month
      const orgUserIdsInMonth = new Set(
        sessions
          .filter(s => s.created_at >= m.start && s.created_at < m.end)
          .map(s => s.user_id)
      );
      const org = inMonth.filter(p => orgUserIdsInMonth.has(p.id)).length;
      const normal = inMonth.length - org;
      general_stats[m.key] = { total: inMonth.length, org, normal };
    }

    // Totals: also scope org to sessions that overlap with profile month
    const totalAll = paidProfiles.length;
    const allOrgUserIds = new Set(sessions.map(s => s.user_id));
    const totalOrg = paidProfiles.filter(p => allOrgUserIds.has(p.id)).length;
    const totalNormal = totalAll - totalOrg;

    // Account KPIs: now correctly using access_code_id (FIX 1)
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

    // Entry KPIs based on entry_events table (single source of truth)
    const entry_kpis: Record<string, { total_with_access: number; via_stripe: number; via_promo: number; via_org_code: number }> = {};
    let entryTotals = { total_with_access: 0, via_stripe: 0, via_promo: 0, via_org_code: 0 };

    for (const m of months) {
      const newInMonth = profiles.filter(p => p.created_at >= m.start && p.created_at < m.end);
      const newUserIds = new Set(newInMonth.map(p => p.id));
      const relevantEvents = entryEvents.filter(e => newUserIds.has(e.user_id));
      const usersWithEntry = new Set(relevantEvents.map(e => e.user_id));
      const via_stripe = new Set(relevantEvents.filter(e => e.entry_method === 'stripe_payment').map(e => e.user_id)).size;
      const via_promo = new Set(relevantEvents.filter(e => e.entry_method === 'promo_code').map(e => e.user_id)).size;
      const via_org_code = new Set(relevantEvents.filter(e => e.entry_method === 'organisation_access_code').map(e => e.user_id)).size;
      entry_kpis[m.key] = { total_with_access: usersWithEntry.size, via_stripe, via_promo, via_org_code };
      entryTotals.total_with_access += usersWithEntry.size;
      entryTotals.via_stripe += via_stripe;
      entryTotals.via_promo += via_promo;
      entryTotals.via_org_code += via_org_code;
    }

    // Build is_unique lookup
    const isUniqueMap = new Map(orgTypes.map(ot => [ot.id, ot.is_unique ?? false]));

    // Org stats with monthly breakdown
    const stats = orgTypes.map(ot => {
      const isUnique = isUniqueMap.get(ot.id) || false;
      const orgSessions = sessions.filter(s => s.organisation_type_id === ot.id);

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

    // FIX 3: Compute unique_users per code from sessions
    const codeUniqueUsers = new Map<string, Set<string>>();
    for (const s of sessions) {
      if (s.access_code_id) {
        if (!codeUniqueUsers.has(s.access_code_id)) {
          codeUniqueUsers.set(s.access_code_id, new Set());
        }
        codeUniqueUsers.get(s.access_code_id)!.add(s.user_id);
      }
    }

    const orgMap = new Map(orgTypes.map(ot => [ot.id, ot.name]));
    const codes = codesRaw.map(c => ({
      id: c.id,
      code: c.code,
      org_name: orgMap.get(c.organisation_type_id) || 'Onbekend',
      uses_count: c.uses_count || 0,
      unique_users: codeUniqueUsers.get(c.id)?.size || 0,
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
      entry_kpis,
      entry_kpi_totals: entryTotals,
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
