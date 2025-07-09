
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { PasswordResetEmailNL } from './_templates/password-reset-nl.tsx';
import { PasswordResetEmailEN } from './_templates/password-reset-en.tsx';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const hookSecret = Deno.env.get('SEND_PASSWORD_RESET_HOOK_SECRET') as string;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Password reset email function called');

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if this is a webhook call from Supabase Auth
    const authHeader = req.headers.get('authorization');
    const isWebhook = req.headers.get('webhook-signature');
    
    if (isWebhook && hookSecret) {
      // Handle webhook from Supabase Auth
      console.log('Processing webhook from Supabase Auth');
      
      const payload = await req.text();
      const headers = Object.fromEntries(req.headers);
      const wh = new Webhook(hookSecret);
      
      const {
        user,
        email_data: { token_hash, redirect_to }
      } = wh.verify(payload, headers) as {
        user: { email: string }
        email_data: {
          token_hash: string
          redirect_to: string
          email_action_type: string
        }
      };

      // Extract language from redirect_to URL
      const url = new URL(redirect_to);
      const language = url.searchParams.get('lang') || 'nl';
      const isNL = language === 'nl';
      
      // Build the reset URL
      const resetUrl = `${redirect_to}&token_hash=${token_hash}`;
      
      console.log('Webhook - sending password reset email to:', user.email, 'Language:', language);
      
      const EmailTemplate = isNL ? PasswordResetEmailNL : PasswordResetEmailEN;
      
      const html = await renderAsync(
        React.createElement(EmailTemplate, {
          resetUrl,
          userEmail: user.email
        })
      );

      const { error } = await resend.emails.send({
        from: "Vinster <team@vinster.ai>",
        to: [user.email],
        subject: isNL ? "Reset je Vinster wachtwoord" : "Reset your Vinster password",
        html,
      });

      if (error) {
        console.error('Webhook - Resend error:', error);
        throw error;
      }

      console.log('Webhook - Password reset email sent successfully');
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
      
    } else {
      // Handle direct API call (fallback)
      console.log('Processing direct API call');
      
      const { email, language, resetUrl } = await req.json();
      console.log('Direct call - Processing password reset for:', email, 'Language:', language);

      const isNL = language === 'nl';
      const EmailTemplate = isNL ? PasswordResetEmailNL : PasswordResetEmailEN;
      
      const html = await renderAsync(
        React.createElement(EmailTemplate, {
          resetUrl,
          userEmail: email
        })
      );

      console.log('Direct call - Sending email via Resend...');

      const { error } = await resend.emails.send({
        from: "Vinster <team@vinster.ai>",
        to: [email],
        subject: isNL ? "Reset je Vinster wachtwoord" : "Reset your Vinster password",
        html,
      });

      if (error) {
        console.error('Direct call - Resend error:', error);
        throw error;
      }

      console.log('Direct call - Password reset email sent successfully');
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
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
