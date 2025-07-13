
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

    console.log('=== INSPECTION DATA RECEIVED ===');
    console.log('Full inspection data:', JSON.stringify(inspectionData, null, 2));
    console.log('endEquipment exists:', !!inspectionData.endEquipment);
    console.log('endEquipment value:', inspectionData.endEquipment);

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
      console.log('=== PROCESSING END EQUIPMENT ===');
      console.log('Raw endEquipment:', JSON.stringify(inspectionData.endEquipment, null, 2));
      
      const endEquipmentEntries = Object.entries(inspectionData.endEquipment);
      console.log('All endEquipment entries:', endEquipmentEntries);
      
      const filteredEntries = endEquipmentEntries.filter(([_, value]) => value === true);
      console.log('Filtered true entries:', filteredEntries);
      
      const endIssues = filteredEntries.map(([key, _]) => {
        // Convert camelCase to readable format
        const readable = key.replace(/([A-Z])/g, ' $1').trim();
        const formatted = readable.charAt(0).toUpperCase() + readable.slice(1);
        console.log(`Converting "${key}" to "${formatted}"`);
        return formatted;
      });
      console.log('Final end issues array:', endIssues);
      endEquipmentIssues.push(...endIssues);
    } else {
      console.log('No endEquipment data found');
    }
    
    // Prepare separate equipment issues strings
    const startEquipmentIssuesStr = startEquipmentIssues.length > 0 ? startEquipmentIssues.join(', ') : 'None reported';
    const endEquipmentIssuesStr = endEquipmentIssues.length > 0 ? endEquipmentIssues.join(', ') : 'None reported';
    
    console.log('Start equipment issues:', startEquipmentIssues);
    console.log('End equipment issues:', endEquipmentIssues);
    console.log('Start equipment issues string:', startEquipmentIssuesStr);
    console.log('End equipment issues string:', endEquipmentIssuesStr);

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

    console.log('=== PREPARING EMAIL TEMPLATE ===');
    console.log('startEquipmentIssues being passed to template:', startEquipmentIssuesStr);
    console.log('endEquipmentIssues being passed to template:', endEquipmentIssuesStr);
    
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
        startEquipmentIssues: startEquipmentIssuesStr,
        endEquipmentIssues: endEquipmentIssuesStr,
        startNotes,
        endNotes,
        damageReport,
        comments,
        supervisorName,
      })
    );
    
    console.log('=== EMAIL HTML GENERATED ===');
    console.log('Email HTML contains end equipment:', html.includes('End of Day Equipment'));

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
