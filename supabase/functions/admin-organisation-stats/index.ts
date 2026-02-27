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

// ============================================================
// Shared helper: all widgets use this single function
// ============================================================
interface MonthlyAccessStats {
  total_with_access: number;
  via_stripe: number;
  via_promo: number;
  via_org_code: number;
  new_profiles: number;
  new_profiles_with_access: number;
}

interface EntryEvent {
  user_id: string;
  entry_method: string;
  redeemed_at: string;
  org_id: string | null;
  code: string | null;
}

interface Profile {
  id: string;
  created_at: string;
}

function getMonthlyAccessStats(
  entryEvents: EntryEvent[],
  profiles: Profile[],
  monthStart: string,
  monthEnd: string
): MonthlyAccessStats {
  // Filter entry_events by redeemed_at
  const eventsInMonth = entryEvents.filter(
    e => e.redeemed_at >= monthStart && e.redeemed_at < monthEnd
  );

  // DISTINCT user_ids per method
  const allUsers = new Set(eventsInMonth.map(e => e.user_id));
  const stripeUsers = new Set(eventsInMonth.filter(e => e.entry_method === 'stripe_payment').map(e => e.user_id));
  const promoUsers = new Set(eventsInMonth.filter(e => e.entry_method === 'promo_code').map(e => e.user_id));
  const orgUsers = new Set(eventsInMonth.filter(e => e.entry_method === 'organisation_access_code').map(e => e.user_id));

  // New profiles = profiles.created_at in month
  const newProfiles = profiles.filter(p => p.created_at >= monthStart && p.created_at < monthEnd);
  const newProfileIds = new Set(newProfiles.map(p => p.id));

  // New profiles that also have access in this month
  const newWithAccess = new Set([...allUsers].filter(uid => newProfileIds.has(uid)));

  return {
    total_with_access: allUsers.size,
    via_stripe: stripeUsers.size,
    via_promo: promoUsers.size,
    via_org_code: orgUsers.size,
    new_profiles: newProfiles.length,
    new_profiles_with_access: newWithAccess.size,
  };
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

    // Only 3 core fetches needed now
    const [orgTypesRes, entryEventsRes, profilesRes, codesRes] = await Promise.all([
      supabase.from('organisation_types').select('id, name, parent_type_id, is_unique').order('name'),
      supabase.from('entry_events').select('user_id, entry_method, redeemed_at, org_id, code'),
      supabase.from('profiles').select('id, created_at'),
      supabase.from('organisation_access_codes').select('id, code, organisation_type_id, uses_count, max_uses, is_active, last_used_at').order('created_at', { ascending: false }),
    ]);

    const orgTypes = orgTypesRes.data || [];
    const entryEvents: EntryEvent[] = entryEventsRes.data || [];
    const profiles: Profile[] = profilesRes.data || [];
    const codesRaw = codesRes.data || [];

    // ============================================================
    // Widget 1: Toegang per Maand (uses shared helper)
    // ============================================================
    const access_stats: Record<string, MonthlyAccessStats> = {};
    for (const m of months) {
      access_stats[m.key] = getMonthlyAccessStats(entryEvents, profiles, m.start, m.end);
    }

    // Totals across all time
    const allTime = getMonthlyAccessStats(entryEvents, profiles, '1970-01-01T00:00:00.000Z', '2099-01-01T00:00:00.000Z');

    // ============================================================
    // Widget 2: Algemeen Vinster Gebruik (same data, different grouping)
    // ============================================================
    const general_stats: Record<string, { total: number; org: number; normal: number }> = {};
    for (const m of months) {
      const s = access_stats[m.key];
      general_stats[m.key] = {
        total: s.total_with_access,
        org: s.via_org_code,
        normal: s.via_stripe + s.via_promo,
      };
    }
    const general_totals = {
      total: allTime.total_with_access,
      org: allTime.via_org_code,
      normal: allTime.via_stripe + allTime.via_promo,
    };

    // ============================================================
    // Widget 3: Gebruik per branche (entry_events, DISTINCT users, grouped by org_id)
    // ============================================================
    const orgCodeEvents = entryEvents.filter(e => e.entry_method === 'organisation_access_code' && e.org_id);

    const org_stats = orgTypes.map(ot => {
      const monthly: Record<string, number> = {};
      for (const m of months) {
        const usersInMonth = new Set(
          orgCodeEvents
            .filter(e => e.org_id === ot.id && e.redeemed_at >= m.start && e.redeemed_at < m.end)
            .map(e => e.user_id)
        );
        monthly[m.key] = usersInMonth.size;
      }

      const totalUsers = new Set(
        orgCodeEvents.filter(e => e.org_id === ot.id).map(e => e.user_id)
      );

      return {
        org_name: ot.name,
        org_id: ot.id,
        parent_type_id: ot.parent_type_id || null,
        monthly,
        total: totalUsers.size,
      };
    });

    // ============================================================
    // Widget 4: Toegangscodes (unique_users from entry_events)
    // ============================================================
    const codeUniqueUsers = new Map<string, Set<string>>();
    for (const e of orgCodeEvents) {
      if (e.code) {
        if (!codeUniqueUsers.has(e.code)) {
          codeUniqueUsers.set(e.code, new Set());
        }
        codeUniqueUsers.get(e.code)!.add(e.user_id);
      }
    }

    const orgMap = new Map(orgTypes.map(ot => [ot.id, ot.name]));
    const codes = codesRaw.map(c => ({
      id: c.id,
      code: c.code,
      org_name: orgMap.get(c.organisation_type_id) || 'Onbekend',
      uses_count: c.uses_count || 0,
      unique_users: codeUniqueUsers.get(c.code)?.size || 0,
      max_uses: c.max_uses,
      is_active: c.is_active ?? true,
      last_used_at: c.last_used_at,
    }));

    return new Response(JSON.stringify({
      monthly_columns,
      access_stats,
      access_totals: allTime,
      general_stats,
      general_totals,
      org_stats,
      codes,
      org_types: orgTypes,
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
