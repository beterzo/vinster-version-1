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
  for (let i = 5; i >= 0; i--) {
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

interface EntryEvent {
  user_id: string;
  entry_method: string;
  redeemed_at: string;
  org_id: string | null;
}

function uniqueUsersPerMonth(
  events: EntryEvent[],
  months: { key: string; start: string; end: string }[],
  predicate: (e: EntryEvent) => boolean
): { monthly: Record<string, number>; total: number } {
  const monthly: Record<string, number> = {};
  const totalSet = new Set<string>();
  for (const m of months) {
    const startTs = new Date(m.start).getTime();
    const endTs = new Date(m.end).getTime();
    const usersInMonth = new Set<string>();
    for (const e of events) {
      if (!predicate(e) || !e.redeemed_at) continue;
      const ts = new Date(e.redeemed_at).getTime();
      if (ts >= startTs && ts < endTs) {
        usersInMonth.add(e.user_id);
        totalSet.add(e.user_id);
      }
    }
    monthly[m.key] = usersInMonth.size;
  }
  return { monthly, total: totalSet.size };
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

    // Internal test accounts should never show up in billable stats.
    const TEST_DOMAINS = ['@beterzo.tech', '@vinster.ai', '@deloopbaanopleiding.nl'];

    const [orgTypesRes, entryEventsRes, testUsersRes] = await Promise.all([
      supabase.from('organisation_types').select('id, name, parent_type_id, is_unique').order('name'),
      supabase.from('entry_events').select('user_id, entry_method, redeemed_at, org_id'),
      supabase.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    const orgTypes = orgTypesRes.data || [];

    const testUserIds = new Set<string>(
      (testUsersRes.data?.users ?? [])
        .filter((u: any) => {
          const email = (u.email || '').toLowerCase();
          return TEST_DOMAINS.some(d => email.endsWith(d));
        })
        .map((u: any) => u.id)
    );

    const entryEvents: EntryEvent[] = (entryEventsRes.data || []).filter((e: EntryEvent) => !testUserIds.has(e.user_id));

    // Row 1: totaal unieke gebruikers per maand (alle entry_methods)
    const total_usage = uniqueUsersPerMonth(entryEvents, months, () => true);

    // Row 2: per organisatietype (branches, is_unique=false), incl. sub-orgs
    const branches = orgTypes.filter(ot => !ot.is_unique && !ot.parent_type_id);
    const branch_stats = branches.map(ot => {
      const childIds = new Set(
        orgTypes.filter(o => o.parent_type_id === ot.id).map(o => o.id)
      );
      const { monthly, total } = uniqueUsersPerMonth(entryEvents, months, e =>
        e.entry_method === 'organisation_access_code' &&
        (e.org_id === ot.id || (e.org_id !== null && childIds.has(e.org_id)))
      );
      return { org_id: ot.id, org_name: ot.name, monthly, total };
    });

    // Row 3: per bedrijf met eigen versie (is_unique=true)
    const uniqueOrgs = orgTypes.filter(ot => ot.is_unique);
    const unique_org_stats = uniqueOrgs.map(ot => {
      const { monthly, total } = uniqueUsersPerMonth(entryEvents, months, e =>
        e.entry_method === 'organisation_access_code' && e.org_id === ot.id
      );
      return { org_id: ot.id, org_name: ot.name, monthly, total };
    });

    return new Response(JSON.stringify({
      monthly_columns,
      total_usage,
      branch_stats,
      unique_org_stats,
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
