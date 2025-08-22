
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

    // Validate and sanitize inputs to prevent injection attacks
    if (!supervisorEmail || !supervisorName || !driverName) {
      throw new Error('Missing required fields');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supervisorEmail)) {
      throw new Error('Invalid email format');
    }

    // Sanitize text inputs (remove HTML and control characters)
    const sanitize = (text: string): string => {
      return text.replace(/<[^>]*>/g, '').replace(/[\x00-\x1f\x7f]/g, '').trim();
    };

    const sanitizedSupervisorName = sanitize(supervisorName);
    const sanitizedDriverName = sanitize(driverName);

    console.log('Processing inspection confirmation for driver:', sanitizedDriverName);

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
      const endEquipmentEntries = Object.entries(inspectionData.endEquipment);
      const filteredEntries = endEquipmentEntries.filter(([_, value]) => value === true);
      
      const endIssues = filteredEntries.map(([key, _]) => {
        // Convert camelCase to readable format and sanitize
        const readable = key.replace(/([A-Z])/g, ' $1').trim();
        const formatted = readable.charAt(0).toUpperCase() + readable.slice(1);
        return sanitize(formatted);
      });
      endEquipmentIssues.push(...endIssues);
    }
    
    // Prepare separate equipment issues strings
    const startEquipmentIssuesStr = startEquipmentIssues.length > 0 ? startEquipmentIssues.join(', ') : 'None reported';
    const endEquipmentIssuesStr = endEquipmentIssues.length > 0 ? endEquipmentIssues.join(', ') : 'None reported';
    
    // Log summary without sensitive details
    console.log('Equipment issues processed - Start:', startEquipmentIssues.length, 'End:', endEquipmentIssues.length);

    // Calculate total miles
    const odometerStart = inspectionData.odometerStart;
    const odometerEnd = inspectionData.odometerEnd;
    const totalMiles = odometerEnd && odometerStart
      ? parseInt(odometerEnd) - parseInt(odometerStart)
      : 0;

    // Get inspection date and time
    const inspectionDate = inspectionData.date || new Date().toLocaleDateString();
    const inspectionTime = inspectionData.time || new Date().toLocaleTimeString();

    // Collect all notes/comments - check multiple possible field names and sanitize
    const startNotes = sanitize(inspectionData.notes || inspectionData.startNotes || '');
    const endNotes = sanitize(inspectionData.endNotes || '');
    const damageReport = sanitize(inspectionData.damageReport || '');
    const comments = sanitize(inspectionData.comments || '');

    // Extract vehicle name properly
    const vehicleName = inspectionData.selectedVehicle?.name 
      ? `${inspectionData.selectedVehicle.name} (${inspectionData.selectedVehicle.plate_number})`
      : inspectionData.vehicleName || 'Unknown Vehicle';

    console.log('Preparing email template for report:', reportId);
    
    // Render the React Email template
    const html = await renderAsync(
      React.createElement(InspectionConfirmationEmail, {
        reportId,
        driverName: sanitizedDriverName,
        vehicleName: sanitize(vehicleName),
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
        supervisorName: sanitizedSupervisorName,
      })
    );
    
    console.log('Email template rendered successfully');

    // Send email to supervisor
    const supervisorEmailResponse = await resend.emails.send({
      from: "FleetCheck <onboarding@resend.dev>",
      to: [supervisorEmail],
      subject: `Fleet Inspection Report - ${reportId} - ${sanitizedDriverName}`,
      html,
    });

    console.log("Email sent successfully to supervisor, ID:", supervisorEmailResponse.data?.id);

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
