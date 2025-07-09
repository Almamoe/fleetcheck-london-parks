
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const token = url.searchParams.get('token');

    if (!email || !token) {
      return new Response('Missing email or token parameter', { status: 400 });
    }

    // Simple token validation (in production, use a more secure method)
    const expectedToken = btoa(email + 'approval_secret_key');
    if (token !== expectedToken) {
      return new Response('Invalid token', { status: 401 });
    }

    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if the admin request exists
    const { data: adminRequest, error: fetchError } = await supabase
      .from('admin_requests')
      .select('*')
      .eq('email', email)
      .eq('status', 'pending')
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching admin request:', fetchError);
      return new Response('Error fetching admin request', { status: 500 });
    }

    if (!adminRequest) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Admin Request Not Found</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .message { background: #f44336; color: white; padding: 20px; border-radius: 8px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="message">
                <h2>❌ Admin Request Not Found</h2>
                <p>The admin request for ${email} was not found or has already been processed.</p>
            </div>
        </body>
        </html>
      `, {
        status: 404,
        headers: { "Content-Type": "text/html", ...corsHeaders }
      });
    }

    // Update the admin request status to approved
    const { error: updateRequestError } = await supabase
      .from('admin_requests')
      .update({ status: 'approved' })
      .eq('email', email);

    if (updateRequestError) {
      console.error('Error updating admin request:', updateRequestError);
      return new Response('Error updating admin request', { status: 500 });
    }

    // Add the user to admin_users table
    const { error: insertAdminError } = await supabase
      .from('admin_users')
      .insert({
        email: adminRequest.email,
        role: 'admin',
        approved: true
      });

    if (insertAdminError) {
      console.error('Error adding admin user:', insertAdminError);
      return new Response('Error adding admin user', { status: 500 });
    }

    console.log(`Admin request approved for: ${email}`);

    // Return success page
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Admin Request Approved</title>
          <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }
              .message { background: #4CAF50; color: white; padding: 30px; border-radius: 8px; display: inline-block; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .details { background: white; padding: 20px; margin-top: 20px; border-radius: 8px; color: #333; }
              .user-info { text-align: left; margin: 15px 0; }
              .label { font-weight: bold; color: #666; }
          </style>
      </head>
      <body>
          <div class="message">
              <h2>✅ Admin Request Approved!</h2>
              <p>The admin access request has been successfully approved.</p>
          </div>
          <div class="details">
              <h3>Request Details:</h3>
              <div class="user-info">
                  <div><span class="label">Name:</span> ${adminRequest.name}</div>
                  <div><span class="label">Email:</span> ${adminRequest.email}</div>
                  <div><span class="label">Department:</span> ${adminRequest.department}</div>
                  <div><span class="label">Reason:</span> ${adminRequest.reason}</div>
              </div>
              <p><strong>${adminRequest.email}</strong> now has admin access to FleetCheck.</p>
          </div>
      </body>
      </html>
    `, {
      status: 200,
      headers: { "Content-Type": "text/html", ...corsHeaders }
    });

  } catch (error: any) {
    console.error("Error in approve-admin-request function:", error);
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
