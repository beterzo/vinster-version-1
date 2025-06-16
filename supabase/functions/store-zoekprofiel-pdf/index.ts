
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

    const { user_id, pdf_data, filename, metadata } = await req.json()

    if (!user_id || !pdf_data) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, pdf_data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('📄 Storing zoekprofiel PDF for user:', user_id)

    // Decode base64 PDF data
    const pdfBuffer = Uint8Array.from(atob(pdf_data), c => c.charCodeAt(0))
    
    // Generate file path
    const fileExtension = filename?.split('.').pop() || 'pdf'
    const filePath = `${user_id}/zoekprofiel.${fileExtension}`

    // Upload PDF to storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('zoekprofiel-pdfs')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      console.error('❌ Error uploading PDF:', uploadError)
      throw uploadError
    }

    console.log('✅ PDF uploaded successfully:', uploadData)

    // Update user_zoekprofielen table
    const { data: updateData, error: updateError } = await supabaseClient
      .from('user_zoekprofielen')
      .upsert({
        user_id,
        pdf_file_path: filePath,
        pdf_generated_at: new Date().toISOString(),
        pdf_status: 'completed'
      }, {
        onConflict: 'user_id'
      })

    if (updateError) {
      console.error('❌ Error updating user_zoekprofielen:', updateError)
      throw updateError
    }

    console.log('✅ User zoekprofiel updated successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Zoekprofiel PDF stored successfully',
        file_path: filePath
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
