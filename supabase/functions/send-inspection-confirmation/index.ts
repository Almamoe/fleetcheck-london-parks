
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { InspectionConfirmationEmail } from './_templates/inspection-confirmation.tsx';

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

    // Prepare equipment status - handle both start and end of day equipment
    const startEquipmentIssues: string[] = [];
    const endEquipmentIssues: string[] = [];
    
    // Process start of day equipment
    if (inspectionData.equipment) {
      const startIssues = Object.entries(inspectionData.equipment)
        .filter(([_, value]) => value === true)
        .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').trim());
      startEquipmentIssues.push(...startIssues);
    }
    
    // Process end of day equipment
    if (inspectionData.endEquipment) {
      const endIssues = Object.entries(inspectionData.endEquipment)
        .filter(([_, value]) => value === true)
        .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').trim());
      endEquipmentIssues.push(...endIssues);
    }
    
    // Combine all equipment issues
    const allIssues = [...startEquipmentIssues, ...endEquipmentIssues];
    const equipmentIssues = allIssues.length > 0 ? allIssues.join(', ') : 'None reported';

    // Calculate total miles
    const odometerStart = inspectionData.odometerStart;
    const odometerEnd = inspectionData.odometerEnd;
    const totalMiles = odometerEnd && odometerStart
      ? parseInt(odometerEnd) - parseInt(odometerStart)
      : 0;

    // Get inspection date and time
    const inspectionDate = inspectionData.date || new Date().toLocaleDateString();
    const inspectionTime = inspectionData.time || new Date().toLocaleTimeString();

    // Collect all notes/comments - check multiple possible field names
    const startNotes = inspectionData.notes || inspectionData.startNotes || '';
    const endNotes = inspectionData.endNotes || '';
    const damageReport = inspectionData.damageReport || '';
    const comments = inspectionData.comments || '';

    // Extract vehicle name properly
    const vehicleName = inspectionData.selectedVehicle?.name 
      ? `${inspectionData.selectedVehicle.name} (${inspectionData.selectedVehicle.plate_number})`
      : inspectionData.vehicleName || 'Unknown Vehicle';

    // Render the React Email template
    const html = await renderAsync(
      React.createElement(InspectionConfirmationEmail, {
        reportId,
        driverName,
        vehicleName,
        inspectionDate,
        inspectionTime,
        odometerStart: odometerStart || 'N/A',
        odometerEnd: odometerEnd || 'N/A',
        totalMiles,
        equipmentIssues,
        startNotes,
        endNotes,
        damageReport,
        comments,
        supervisorName,
      })
    );

    // Send email to supervisor
    const supervisorEmailResponse = await resend.emails.send({
      from: "FleetCheck <onboarding@resend.dev>",
      to: [supervisorEmail],
      subject: `Fleet Inspection Report - ${reportId} - ${driverName}`,
      html,
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
