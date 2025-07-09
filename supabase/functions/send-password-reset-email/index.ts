
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PasswordResetRequest {
  email: string;
  language: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { email, language }: PasswordResetRequest = await req.json();
    console.log('Password reset request for:', email, 'Language:', language);

    // Check if user exists
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(email);
    
    if (userError || !user) {
      console.log('User not found:', email);
      // Return success anyway for security (don't reveal if email exists)
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's language preference from profiles table
    let userLanguage = language || 'nl';
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('language')
      .eq('id', user.user.id)
      .single();

    if (profile?.language) {
      userLanguage = profile.language;
    }

    console.log('Using language:', userLanguage);

    // Generate password reset link using Supabase's built-in functionality
    const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `https://vinster.ai/reset-password?lang=${userLanguage}`
      }
    });

    if (resetError || !resetData) {
      console.error('Error generating reset link:', resetError);
      throw new Error('Failed to generate reset link');
    }

    console.log('Reset link generated successfully');

    // Prepare email content based on language
    const emailContent = getEmailContent(userLanguage, resetData.properties.action_link);

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Vinster <noreply@vinster.ai>",
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log('Password reset email sent successfully:', emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in send-password-reset-email function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send password reset email' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

function getEmailContent(language: string, resetLink: string) {
  if (language === 'en') {
    return {
      subject: 'Reset your Vinster password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://vinster.ai/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" alt="Vinster" style="height: 60px;">
          </div>
          
          <h1 style="color: #1e3a8a; text-align: center; margin-bottom: 30px;">Reset your password</h1>
          
          <p>Hi there,</p>
          
          <p>We received a request to reset your password for your Vinster account. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
            ${resetLink}
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This link will expire in 1 hour for security reasons. If you didn't request this password reset, you can safely ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            This email was sent by Vinster. If you have questions, please contact our support team.
          </p>
        </body>
        </html>
      `
    };
  } else {
    // Dutch version
    return {
      subject: 'Reset je Vinster wachtwoord',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Wachtwoord opnieuw instellen</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://vinster.ai/lovable-uploads/0a60c164-79b3-4ce8-80cb-a3d37886f987.png" alt="Vinster" style="height: 60px;">
          </div>
          
          <h1 style="color: #1e3a8a; text-align: center; margin-bottom: 30px;">Wachtwoord opnieuw instellen</h1>
          
          <p>Hallo,</p>
          
          <p>We hebben een verzoek ontvangen om je wachtwoord voor je Vinster account opnieuw in te stellen. Klik op de knop hieronder om een nieuw wachtwoord aan te maken:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Wachtwoord Opnieuw Instellen
            </a>
          </div>
          
          <p>Als de knop niet werkt, kun je ook deze link kopiëren en plakken in je browser:</p>
          <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
            ${resetLink}
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Deze link verloopt na 1 uur om veiligheidsredenen. Als je dit wachtwoord reset verzoek niet hebt gedaan, kun je deze email veilig negeren.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            Deze email is verzonden door Vinster. Als je vragen hebt, neem dan contact op met ons support team.
          </p>
        </body>
        </html>
      `
    };
  }
}

serve(handler);
