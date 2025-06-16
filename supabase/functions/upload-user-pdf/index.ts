
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Upload PDF function called')
    
    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { user_id, pdf_URL, filename } = await req.json()
    
    if (!user_id || !pdf_URL || !filename) {
      throw new Error('Missing required fields: user_id, pdf_URL, or filename')
    }

    console.log(`Processing PDF download for user: ${user_id}, filename: ${filename}, URL: ${pdf_URL}`)

    // Validate URL format
    let url;
    try {
      url = new URL(pdf_URL);
    } catch (error) {
      throw new Error('Invalid PDF URL provided');
    }

    // Download PDF from the provided URL
    console.log(`Downloading PDF from: ${pdf_URL}`);
    const pdfResponse = await fetch(pdf_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Supabase-Function/1.0'
      }
    });

    if (!pdfResponse.ok) {
      throw new Error(`Failed to download PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
    }

    // Check if the response is actually a PDF
    const contentType = pdfResponse.headers.get('content-type');
    if (contentType && !contentType.includes('application/pdf') && !contentType.includes('application/octet-stream')) {
      console.warn(`Warning: Content-Type is ${contentType}, expected application/pdf`);
    }

    // Convert response to ArrayBuffer and then to Uint8Array
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    const pdfBuffer = new Uint8Array(pdfArrayBuffer);
    
    console.log(`Downloaded PDF size: ${pdfBuffer.length} bytes`);
    
    // Create file path: user_id/filename
    const filePath = `${user_id}/${filename}`
    
    // Upload PDF to storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('user-reports')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    console.log('PDF uploaded successfully:', uploadData)

    // Update user_reports table with PDF path and status
    const { error: updateError } = await supabaseAdmin
      .from('user_reports')
      .update({
        pdf_file_path: filePath,
        pdf_generated_at: new Date().toISOString(),
        report_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw updateError
    }

    console.log('User report updated successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'PDF downloaded and uploaded successfully',
        file_path: filePath,
        file_size: pdfBuffer.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in upload-user-pdf function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
