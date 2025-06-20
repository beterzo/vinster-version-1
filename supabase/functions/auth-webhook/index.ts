
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

interface AuthWebhookPayload {
  type: string
  table: string
  record: any
  schema: string
  old_record?: any
}

const handler = async (req: Request): Promise<Response> => {
  console.log('🔐 Auth webhook called')
  
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
    const payload: AuthWebhookPayload = await req.json()
    console.log('🔐 Webhook payload:', payload)

    // Check if this is a user signup event that needs confirmation
    if (payload.type === 'INSERT' && payload.table === 'users' && payload.record) {
      const user = payload.record
      
      // Only send confirmation email if email is not yet confirmed
      if (!user.email_confirmed_at && user.email) {
        console.log('📧 Sending custom confirmation email to:', user.email)
        
        // Generate confirmation URL
        const confirmationUrl = `${supabaseUrl.replace('/rest/v1', '')}/auth/v1/verify?token=${user.confirmation_token}&type=signup&redirect_to=${encodeURIComponent('https://vinster-version-1.lovable.app/login')}`
        
        // Get user metadata
        const firstName = user.raw_user_meta_data?.first_name || user.user_metadata?.first_name
        
        // Render the confirmation email
        const html = await renderAsync(
          React.createElement(ConfirmationEmail, {
            firstName,
            confirmationUrl
          })
        )

        // Send via Resend
        const emailResponse = await resend.emails.send({
          from: "Vinster <hello@vinster.nl>",
          to: [user.email],
          subject: 'Bevestig je emailadres voor Vinster',
          html,
        })

        if (emailResponse.error) {
          console.error('❌ Resend error:', emailResponse.error)
          throw emailResponse.error
        }

        console.log("✅ Custom confirmation email sent:", emailResponse.data?.id)
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            emailId: emailResponse.data?.id,
            message: 'Custom confirmation email sent'
          }), 
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        )
      }
    }

    // For other webhook events, just return success
    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed' }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    )

  } catch (error: any) {
    console.error("❌ Error in auth webhook:", error)
    return new Response(
      JSON.stringify({ 
        error: error.message || "Webhook processing failed",
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
