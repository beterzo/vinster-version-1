
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("🚀 Unsubscribe handler started at:", new Date().toISOString());

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("❌ Missing Supabase environment variables");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Server configuration error" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === "GET") {
      // Handle unsubscribe page request
      const url = new URL(req.url);
      const email = url.searchParams.get('email');
      const token = url.searchParams.get('token');
      
      if (!email || !token) {
        return new Response(createUnsubscribeHtml('error', 'Invalid unsubscribe link'), {
          status: 400,
          headers: { "Content-Type": "text/html", ...corsHeaders },
        });
      }

      // Simple token validation (in production, use proper JWT or signed tokens)
      const expectedToken = await generateUnsubscribeToken(email);
      if (token !== expectedToken) {
        return new Response(createUnsubscribeHtml('error', 'Invalid or expired unsubscribe link'), {
          status: 400,
          headers: { "Content-Type": "text/html", ...corsHeaders },
        });
      }

      return new Response(createUnsubscribeHtml('form', '', email), {
        status: 200,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      });
    }

    if (req.method === "POST") {
      // Handle unsubscribe form submission
      const formData = await req.formData();
      const email = formData.get('email') as string;
      const reason = formData.get('reason') as string || null;
      const userAgent = req.headers.get('User-Agent') || null;
      
      // Extract IP address (considering potential proxy headers)
      const xForwardedFor = req.headers.get('X-Forwarded-For');
      const xRealIp = req.headers.get('X-Real-IP');
      const remoteAddr = req.headers.get('CF-Connecting-IP'); // Cloudflare
      
      let ipAddress = null;
      if (xForwardedFor) {
        ipAddress = xForwardedFor.split(',')[0].trim();
      } else if (xRealIp) {
        ipAddress = xRealIp;
      } else if (remoteAddr) {
        ipAddress = remoteAddr;
      }

      if (!email) {
        return new Response(createUnsubscribeHtml('error', 'Email address is required'), {
          status: 400,
          headers: { "Content-Type": "text/html", ...corsHeaders },
        });
      }

      console.log(`📧 Processing unsubscribe for: ${email}`);

      try {
        // Insert unsubscribe record (will ignore if already exists due to UNIQUE constraint)
        const { error } = await supabase
          .from('email_unsubscribes')
          .insert({
            email,
            reason,
            user_agent: userAgent,
            ip_address: ipAddress
          });

        if (error && !error.message.includes('duplicate key')) {
          console.error("❌ Error inserting unsubscribe:", error);
          return new Response(createUnsubscribeHtml('error', 'Failed to process unsubscribe request'), {
            status: 500,
            headers: { "Content-Type": "text/html", ...corsHeaders },
          });
        }

        console.log(`✅ Successfully unsubscribed: ${email}`);
        return new Response(createUnsubscribeHtml('success', 'You have been successfully unsubscribed from Vinster emails'), {
          status: 200,
          headers: { "Content-Type": "text/html", ...corsHeaders },
        });

      } catch (error) {
        console.error("❌ Exception during unsubscribe:", error);
        return new Response(createUnsubscribeHtml('error', 'An unexpected error occurred'), {
          status: 500,
          headers: { "Content-Type": "text/html", ...corsHeaders },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("❌ Unsubscribe handler error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

// Generate simple token for unsubscribe links
const generateUnsubscribeToken = async (email: string): Promise<string> => {
  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "fallback-secret";
  const data = new TextEncoder().encode(email + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
};

// Create HTML responses for unsubscribe page
const createUnsubscribeHtml = (type: 'form' | 'success' | 'error', message: string, email?: string): string => {
  const baseStyles = `
    body { font-family: Arial, sans-serif; background: #f8f9fa; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #E4C05B; margin-bottom: 8px; }
    .tagline { color: #232D4B; font-size: 14px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; }
    .form-group input, .form-group textarea { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; }
    .form-group textarea { height: 80px; resize: vertical; }
    .button { background: #FFCD3E; color: #1F2937; padding: 12px 24px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .button:hover { background: #E4C05B; }
    .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 6px; border: 1px solid #c3e6cb; }
    .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 6px; border: 1px solid #f5c6cb; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  `;

  if (type === 'form') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Unsubscribe - Vinster</title>
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Vinster</div>
            <div class="tagline">Your window to the future</div>
          </div>
          
          <h2>Unsubscribe from Vinster emails</h2>
          <p>We're sorry to see you go. Please confirm that you want to unsubscribe from all Vinster emails.</p>
          
          <form method="POST" action="/functions/v1/handle-unsubscribe">
            <input type="hidden" name="email" value="${email}">
            
            <div class="form-group">
              <label>Email address:</label>
              <input type="email" value="${email}" disabled>
            </div>
            
            <div class="form-group">
              <label>Why are you unsubscribing? (optional):</label>
              <textarea name="reason" placeholder="Help us improve by telling us why you're leaving..."></textarea>
            </div>
            
            <button type="submit" class="button">Unsubscribe</button>
          </form>
          
          <div class="footer">
            <p>If you didn't request this, you can safely ignore this page.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  if (type === 'success') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Successfully Unsubscribed - Vinster</title>
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Vinster</div>
            <div class="tagline">Your window to the future</div>
          </div>
          
          <div class="success">
            <h2>✅ ${message}</h2>
            <p>You will no longer receive emails from Vinster. If you change your mind, you can always sign up again on our website.</p>
          </div>
          
          <div class="footer">
            <p>Thank you for being part of the Vinster community.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  if (type === 'error') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Error - Vinster</title>
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Vinster</div>
            <div class="tagline">Your window to the future</div>
          </div>
          
          <div class="error">
            <h2>❌ ${message}</h2>
            <p>Please contact our support team at <a href="mailto:team@vinster.ai">team@vinster.ai</a> if you continue to experience issues.</p>
          </div>
          
          <div class="footer">
            <p>We apologize for any inconvenience.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  return '';
};

serve(handler);
