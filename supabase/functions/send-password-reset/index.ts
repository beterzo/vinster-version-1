
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { PasswordResetEmailNL } from './_templates/password-reset-nl.tsx';
import { PasswordResetEmailEN } from './_templates/password-reset-en.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  language: 'nl' | 'en';
  resetUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Password reset email function called');

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, language, resetUrl }: PasswordResetRequest = await req.json();
    console.log('Processing password reset for:', email, 'Language:', language);

    // Choose template based on language
    const isNL = language === 'nl';
    const EmailTemplate = isNL ? PasswordResetEmailNL : PasswordResetEmailEN;
    
    const html = await renderAsync(
      React.createElement(EmailTemplate, {
        resetUrl,
        userEmail: email
      })
    );

    console.log('Sending email via Resend...');

    const { error } = await resend.emails.send({
      from: "Vinster <team@vinster.ai>",
      to: [email],
      subject: isNL ? "Reset je Vinster wachtwoord" : "Reset your Vinster password",
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    console.log('Password reset email sent successfully');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
