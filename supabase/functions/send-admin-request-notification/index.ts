
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
    
    // Generate approval token (simple base64 encoding - in production use JWT or similar)
    const approvalToken = btoa(email + 'approval_secret_key');
    const approvalUrl = `https://pibwxhhrjerjyxcqokzd.supabase.co/functions/v1/approve-admin-request?email=${encodeURIComponent(email)}&token=${approvalToken}`;
    
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
                .approval-section { text-align: center; margin: 30px 0; padding: 20px; background-color: #f0f9ff; border-radius: 8px; border: 1px solid #0ea5e9; }
                .approve-button { 
                    display: inline-block; 
                    background-color: #059669; 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    font-size: 16px;
                    margin: 10px 0;
                }
                .approve-button:hover { background-color: #047857; }
                .warning { background-color: #fef3c7; padding: 15px; border-radius: 6px; margin-top: 20px; border-left: 4px solid #f59e0b; }
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

                <div class="approval-section">
                    <h3 style="color: #0ea5e9; margin-top: 0;">Quick Approval</h3>
                    <p>Click the button below to approve this admin access request:</p>
                    <a href="#" onclick="approveRequest('${approvalUrl}')" class="approve-button">✅ Approve Admin Access</a>
                    <p style="font-size: 12px; color: #6b7280; margin-top: 15px;">
                        This will grant <strong>${email}</strong> admin access to FleetCheck immediately.
                    </p>
                </div>
                
                <script>
                async function approveRequest(url) {
                    try {
                        const response = await fetch(url);
                        const result = await response.json();
                        
                        if (result.success) {
                            alert('✅ Admin request approved successfully!\\n\\nUser: ' + result.details.name + '\\nEmail: ' + result.details.email + ' now has admin access.');
                        } else {
                            alert('❌ ' + result.message);
                        }
                    } catch (error) {
                        alert('❌ Error processing approval: ' + error.message);
                    }
                }
                </script>

                <div class="warning">
                    <strong>⚠️ Security Notice:</strong> Only approve this request if you recognize the applicant and their need for admin access is legitimate. Admin users have full access to all FleetCheck features and data.
                </div>

                <div class="footer">
                    <p>Request submitted on ${new Date().toLocaleString()}</p>
                    <p>If you cannot approve via the button above, please review this request manually in the FleetCheck admin panel.</p>
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
