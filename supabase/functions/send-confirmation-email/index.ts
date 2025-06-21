
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Resend } from "npm:resend@4.0.0"
import { renderAsync } from "npm:@react-email/components@0.0.22"
import React from "npm:react@18.3.1"
import { ConfirmationEmail } from "./_templates/confirmation-email.tsx"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface ConfirmationEmailRequest {
  email: string
  firstName?: string
  confirmationUrl: string
}

interface AuthWebhookPayload {
  type: string
  table: string
  record: any
  schema: string
  old_record?: any
}

const handler = async (req: Request): Promise<Response> => {
  console.log('📧 Send confirmation email function called')
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    })
  }

  try {
    const requestData = await req.json()
    console.log('📧 Request data received:', JSON.stringify(requestData, null, 2))

    let email: string
    let firstName: string | undefined
    let confirmationUrl: string

    // Check if this is an Auth webhook payload or direct API call
    if (requestData.type && requestData.table === 'users' && requestData.record) {
      // This is a Supabase Auth webhook
      console.log('📧 Processing as Auth webhook')
      const user = requestData.record
      
      email = user.email
      firstName = user.raw_user_meta_data?.first_name || user.user_metadata?.first_name
      
      // Generate confirmation URL
      confirmationUrl = `${supabaseUrl.replace('/rest/v1', '')}/auth/v1/verify?token=${user.confirmation_token}&type=signup&redirect_to=${encodeURIComponent('https://vinster-version-1.lovable.app/login')}`
      
      console.log('📧 Auth webhook - email:', email, 'firstName:', firstName)
    } else if (requestData.email && requestData.confirmationUrl) {
      // This is a direct API call
      console.log('📧 Processing as direct API call')
      email = requestData.email
      firstName = requestData.firstName
      confirmationUrl = requestData.confirmationUrl
      
      console.log('📧 Direct API call - email:', email, 'firstName:', firstName)
    } else {
      console.error('❌ Invalid request format:', requestData)
      throw new Error('Invalid request format. Expected either Auth webhook or direct API call with email and confirmationUrl.')
    }

    if (!email) {
      console.error('❌ No email address found in request')
      throw new Error('Email address is required')
    }

    console.log('📧 Sending confirmation email to:', email)

    // Render the confirmation email
    const html = await renderAsync(
      React.createElement(ConfirmationEmail, {
        firstName,
        confirmationUrl
      })
    )

    // Send via Resend
    const emailResponse = await resend.emails.send({
      from: "Vinster <noreply@vinster.ai>",
      to: [email],
      subject: 'Bevestig je emailadres voor Vinster',
      html,
    })

    if (emailResponse.error) {
      console.error('❌ Resend error:', emailResponse.error)
      throw emailResponse.error
    }

    console.log("✅ Confirmation email sent:", emailResponse.data?.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data?.id 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    )

  } catch (error: any) {
    console.error("❌ Error in send-confirmation-email function:", error)
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send confirmation email",
        success: false 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    )
  }
}

serve(handler)
