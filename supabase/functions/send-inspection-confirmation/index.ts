
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InspectionConfirmationRequest {
  inspectionData: any;
  supervisorEmail: string;
  supervisorName: string;
  driverName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inspectionData, supervisorEmail, supervisorName, driverName }: InspectionConfirmationRequest = await req.json();

    console.log('Received inspection data:', JSON.stringify(inspectionData, null, 2));

    // Generate report ID
    const reportId = `FL-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // Prepare equipment status - handle both formats
    let equipmentIssues = 'None reported';
    if (inspectionData.equipment) {
      const issues = Object.entries(inspectionData.equipment)
        .filter(([_, value]) => value === true)
        .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').trim())
        .join(', ');
      equipmentIssues = issues || 'None reported';
    }

    // Calculate total miles
    const odometerStart = inspectionData.odometerStart;
    const odometerEnd = inspectionData.odometerEnd;
    const totalMiles = odometerEnd && odometerStart
      ? parseInt(odometerEnd) - parseInt(odometerStart)
      : 0;

    // Get inspection date and time
    const inspectionDate = inspectionData.date || new Date().toLocaleDateString();
    const inspectionTime = inspectionData.time || new Date().toLocaleTimeString();

    // Send email to supervisor
    const supervisorEmailResponse = await resend.emails.send({
      from: "FleetCheck <onboarding@resend.dev>",
      to: [supervisorEmail],
      subject: `Fleet Inspection Report - ${reportId} - ${driverName}`,
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
                .section h2 { color: #374151; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #059669; padding-left: 12px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
                .info-item { background-color: #f9fafb; padding: 12px; border-radius: 6px; }
                .info-label { font-weight: bold; color: #374151; display: block; margin-bottom: 4px; }
                .info-value { color: #6b7280; }
                .equipment-status { background-color: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; }
                .equipment-good { background-color: #d1fae5; border-left-color: #10b981; }
                .notes { background-color: #f3f4f6; padding: 15px; border-radius: 6px; white-space: pre-wrap; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚗 Fleet Inspection Report</h1>
                    <p>Report ID: <strong>${reportId}</strong></p>
                    <p>City of London Parks & Recreation Department</p>
                </div>

                <div class="section">
                    <h2>📋 Inspection Details</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Driver Name:</span>
                            <span class="info-value">${driverName}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Vehicle:</span>
                            <span class="info-value">${inspectionData.vehicleName || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Date & Time:</span>
                            <span class="info-value">${inspectionDate} at ${inspectionTime}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Start Odometer:</span>
                            <span class="info-value">${odometerStart || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">End Odometer:</span>
                            <span class="info-value">${odometerEnd || 'N/A'}</span>
                        </div>
                        ${totalMiles > 0 ? `<div class="info-item"><span class="info-label">Total Miles:</span><span class="info-value">${totalMiles}</span></div>` : ''}
                    </div>
                </div>

                <div class="section">
                    <h2>🔧 Equipment Status</h2>
                    <div class="equipment-status ${equipmentIssues === 'None reported' ? 'equipment-good' : ''}">
                        <div>
                            <strong>⚠️ Issues Reported:</strong> ${equipmentIssues}
                        </div>
                    </div>
                </div>

                ${(inspectionData.notes || inspectionData.endNotes || inspectionData.damageReport) ? `
                <div class="section">
                    <h2>📝 Additional Notes</h2>
                    ${inspectionData.notes ? `<div style="margin-bottom: 15px;"><strong>Start Notes:</strong><div class="notes">${inspectionData.notes}</div></div>` : ''}
                    ${inspectionData.endNotes ? `<div style="margin-bottom: 15px;"><strong>End Notes:</strong><div class="notes">${inspectionData.endNotes}</div></div>` : ''}
                    ${inspectionData.damageReport ? `<div><strong>Damage Report:</strong><div class="notes">${inspectionData.damageReport}</div></div>` : ''}
                </div>` : ''}

                <div class="footer">
                    <p>This report was generated on ${new Date().toLocaleString()}</p>
                    <p>FleetCheck v1.0 - City of London Parks & Recreation Department</p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    console.log("Supervisor email sent successfully:", supervisorEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Inspection confirmation sent successfully",
      reportId,
      emailId: supervisorEmailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-inspection-confirmation function:", error);
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
