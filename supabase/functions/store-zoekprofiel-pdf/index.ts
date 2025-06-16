
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { user_id, pdf_url } = await req.json()

    if (!user_id || !pdf_url) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, pdf_url' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Basic URL validation
    try {
      new URL(pdf_url)
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid PDF URL format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('📄 Storing zoekprofiel PDF URL for user:', user_id)
    console.log('🔗 PDF URL:', pdf_url)

    // Update user_zoekprofielen table with PDF URL
    const { data: updateData, error: updateError } = await supabaseClient
      .from('user_zoekprofielen')
      .upsert({
        user_id,
        pdf_url: pdf_url,
        pdf_generated_at: new Date().toISOString(),
        pdf_status: 'completed'
      }, {
        onConflict: 'user_id'
      })

    if (updateError) {
      console.error('❌ Error updating user_zoekprofielen:', updateError)
      throw updateError
    }

    console.log('✅ User zoekprofiel updated successfully with PDF URL')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Zoekprofiel PDF URL stored successfully',
        pdf_url: pdf_url
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Error in store-zoekprofiel-pdf:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
