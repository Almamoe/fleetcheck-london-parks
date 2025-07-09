
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminRequestNotification {
  name: string;
  email: string;
  department: string;
  reason: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, department, reason }: AdminRequestNotification = await req.json();

    console.log('Sending admin request notification email...');
    
    const emailResponse = await resend.emails.send({
      from: "FleetCheck Admin <onboarding@resend.dev>",
      to: ["almamoha664@gmail.com"], // Your specified email - can be changed later
      subject: `New Admin Access Request - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #059669; padding-bottom: 20px; }
                .header h1 { color: #059669; margin: 0; font-size: 24px; }
                .section { margin-bottom: 25px; }
                .info-item { background-color: #f9fafb; padding: 12px; border-radius: 6px; margin-bottom: 15px; }
                .info-label { font-weight: bold; color: #374151; display: block; margin-bottom: 4px; }
                .info-value { color: #6b7280; }
                .reason { background-color: #f3f4f6; padding: 15px; border-radius: 6px; white-space: pre-wrap; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔑 New Admin Access Request</h1>
                    <p>FleetCheck - City of London Parks & Recreation</p>
                </div>

                <div class="section">
                    <div class="info-item">
                        <span class="info-label">Applicant Name:</span>
                        <span class="info-value">${name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email Address:</span>
                        <span class="info-value">${email}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Department:</span>
                        <span class="info-value">${department}</span>
                    </div>
                </div>

                <div class="section">
                    <h3 style="color: #374151; margin-bottom: 10px;">Reason for Request:</h3>
                    <div class="reason">${reason}</div>
                </div>

                <div class="footer">
                    <p>Request submitted on ${new Date().toLocaleString()}</p>
                    <p>Please review this request and take appropriate action in the FleetCheck admin panel.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    console.log("Admin request notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Admin request notification sent successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending admin request notification:", error);
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
