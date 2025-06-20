
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Resend } from "npm:resend@4.0.0"
import { renderAsync } from "npm:@react-email/components@0.0.22"
import React from "npm:react@18.3.1"
import { WelcomeEmail } from "./_templates/welcome-email.tsx"
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

interface EmailRequest {
  type: 'welcome' | 'confirmation'
  to: string
  firstName?: string
  confirmationUrl?: string
  loginUrl?: string
}

const handler = async (req: Request): Promise<Response> => {
  console.log('📧 Email function called')
  
  // Handle CORS preflight requests
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
    const { type, to, firstName, confirmationUrl, loginUrl }: EmailRequest = await req.json()
    console.log(`📧 Sending ${type} email to:`, to)

    let html: string
    let subject: string

    // Generate the appropriate email template
    switch (type) {
      case 'welcome':
        html = await renderAsync(
          React.createElement(WelcomeEmail, {
            firstName,
            loginUrl: loginUrl || `${supabaseUrl.replace('/rest/v1', '')}/login`
          })
        )
        subject = 'Welkom bij Vinster - Jouw venster op de toekomst'
        break

      case 'confirmation':
        if (!confirmationUrl) {
          throw new Error('Confirmation URL is required for confirmation emails')
        }
        html = await renderAsync(
          React.createElement(ConfirmationEmail, {
            firstName,
            confirmationUrl
          })
        )
        subject = 'Bevestig je emailadres voor Vinster'
        break

      default:
        throw new Error(`Unknown email type: ${type}`)
    }

    // Send the email via Resend
    const emailResponse = await resend.emails.send({
      from: "Vinster <hello@vinster.nl>",
      to: [to],
      subject,
      html,
    })

    if (emailResponse.error) {
      console.error('❌ Resend error:', emailResponse.error)
      throw emailResponse.error
    }

    console.log("✅ Email sent successfully:", emailResponse.data?.id)

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
    console.error("❌ Error in send-email function:", error)
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send email",
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
