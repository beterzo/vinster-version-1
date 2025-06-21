
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Resend } from "npm:resend@4.0.0"
import { renderAsync } from "npm:@react-email/components@0.0.22"
import React from "npm:react@18.3.1"
import { ConfirmationEmail } from "./_templates/confirmation-email.tsx"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface ConfirmationEmailRequest {
  email: string
  firstName?: string
  confirmationUrl: string
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
    const { email, firstName, confirmationUrl }: ConfirmationEmailRequest = await req.json()
    console.log('📧 Sending confirmation email to:', email)

    // Render the confirmation email
    const html = await renderAsync(
      React.createElement(ConfirmationEmail, {
        firstName,
        confirmationUrl
      })
    )

    // Send via Resend - UPDATED TO USE VERIFIED DOMAIN
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
