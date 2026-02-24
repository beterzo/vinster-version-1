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
    const { organisation_type_id, vacancies, replace } = await req.json();

    if (!organisation_type_id || !vacancies || !Array.isArray(vacancies)) {
      throw new Error('organisation_type_id and vacancies array are required');
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // If replace mode, delete existing vacancies for this org
    if (replace) {
      const { error: deleteError } = await supabase
        .from('organisation_vacancies')
        .delete()
        .eq('organisation_type_id', organisation_type_id);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }
      console.log('Deleted existing vacancies for org:', organisation_type_id);
    }

    // Insert new vacancies in batches of 100
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < vacancies.length; i += batchSize) {
      const batch = vacancies.slice(i, i + batchSize).map((v: any) => ({
        title: v.title || 'Onbekend',
        department: v.department || null,
        description: v.description || null,
        year: v.year || null,
        organisation_type_id,
      }));

      const { error: insertError } = await supabase
        .from('organisation_vacancies')
        .insert(batch);

      if (insertError) {
        console.error('Insert error at batch', i, insertError);
        throw insertError;
      }
      inserted += batch.length;
    }

    console.log(`Imported ${inserted} vacancies for org: ${organisation_type_id}`);

    return new Response(JSON.stringify({ success: true, count: inserted }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
