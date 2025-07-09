
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
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
      return new Response(JSON.stringify({
        success: false,
        error: "Admin request not found or already processed",
        message: `The admin request for ${email} was not found or has already been processed.`
      }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders }
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

    // Return JSON response instead of HTML page
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Admin request approved successfully",
      details: {
        name: adminRequest.name,
        email: adminRequest.email,
        department: adminRequest.department,
        reason: adminRequest.reason
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
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
