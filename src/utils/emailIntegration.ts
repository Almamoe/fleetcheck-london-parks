
interface InspectionData {
  driverName: string;
  driverId?: string;
  vehicleName?: string;
  date: string;
  time: string;
  odometerStart: string;
  odometerEnd?: string;
  equipment: Record<string, boolean>;
  notes: string;
  endNotes?: string;
  damageReport?: string;
  supervisor?: {
    name: string;
    email: string;
    department: string;
  };
  submittedAt: string;
}

interface SMTPSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

export const sendInspectionEmail = async (inspectionData: InspectionData, smtpSettings: SMTPSettings) => {
  console.log('=== SENDING INSPECTION EMAIL ===');
  console.log('SMTP Settings:', { ...smtpSettings, pass: '[HIDDEN]' });
  console.log('Inspection data:', inspectionData);

  // Generate report ID
  const reportId = `FL-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

  // Prepare equipment status
  const equipmentIssues = Object.entries(inspectionData.equipment)
    .filter(([_, value]) => value)
    .map(([key, _]) => key)
    .join(', ') || 'None reported';

  const equipmentWorking = Object.entries(inspectionData.equipment)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key)
    .join(', ') || 'All equipment reported as working';

  const totalMiles = inspectionData.odometerEnd && inspectionData.odometerStart
    ? parseInt(inspectionData.odometerEnd) - parseInt(inspectionData.odometerStart)
    : 0;

  // Create email content
  const subject = `Fleet Inspection Report - ${reportId} - ${inspectionData.driverName}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #059669; padding-bottom: 20px; }
            .header h1 { color: #059669; margin: 0; font-size: 24px; }
            .header p { color: #6b7280; margin: 5px 0 0 0; }
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
                        <span class="info-value">${inspectionData.driverName}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Driver ID:</span>
                        <span class="info-value">${inspectionData.driverId || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Vehicle:</span>
                        <span class="info-value">${inspectionData.vehicleName || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Date & Time:</span>
                        <span class="info-value">${inspectionData.date} at ${inspectionData.time}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Start Odometer:</span>
                        <span class="info-value">${inspectionData.odometerStart}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">End Odometer:</span>
                        <span class="info-value">${inspectionData.odometerEnd || 'N/A'}</span>
                    </div>
                </div>
                ${totalMiles > 0 ? `<div class="info-item"><span class="info-label">Total Miles:</span><span class="info-value">${totalMiles}</span></div>` : ''}
            </div>

            <div class="section">
                <h2>🔧 Equipment Status</h2>
                <div class="equipment-status ${equipmentIssues === 'None reported' ? 'equipment-good' : ''}">
                    <div style="margin-bottom: 10px;">
                        <strong>⚠️ Issues Reported:</strong> ${equipmentIssues}
                    </div>
                    <div>
                        <strong>✅ Working Equipment:</strong> ${equipmentWorking}
                    </div>
                </div>
            </div>

            ${inspectionData.notes || inspectionData.endNotes || inspectionData.damageReport ? `
            <div class="section">
                <h2>📝 Additional Notes</h2>
                ${inspectionData.notes ? `<div style="margin-bottom: 15px;"><strong>Start Notes:</strong><div class="notes">${inspectionData.notes}</div></div>` : ''}
                ${inspectionData.endNotes ? `<div style="margin-bottom: 15px;"><strong>End Notes:</strong><div class="notes">${inspectionData.endNotes}</div></div>` : ''}
                ${inspectionData.damageReport ? `<div><strong>Damage Report:</strong><div class="notes">${inspectionData.damageReport}</div></div>` : ''}
            </div>` : ''}

            ${inspectionData.supervisor ? `
            <div class="section">
                <h2>👤 Supervisor Information</h2>
                <div class="info-item">
                    <span class="info-label">Name:</span> <span class="info-value">${inspectionData.supervisor.name}</span><br>
                    <span class="info-label">Email:</span> <span class="info-value">${inspectionData.supervisor.email}</span><br>
                    <span class="info-label">Department:</span> <span class="info-value">${inspectionData.supervisor.department}</span>
                </div>
            </div>` : ''}

            <div class="footer">
                <p>This report was generated on ${new Date().toLocaleString()}</p>
                <p>FleetCheck v1.0 - City of London Parks & Recreation Department</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const textContent = `
Fleet Inspection Report - ${reportId}
City of London Parks & Recreation Department

INSPECTION DETAILS:
- Driver: ${inspectionData.driverName} (ID: ${inspectionData.driverId || 'N/A'})
- Vehicle: ${inspectionData.vehicleName || 'N/A'}
- Date & Time: ${inspectionData.date} at ${inspectionData.time}
- Odometer Start: ${inspectionData.odometerStart}
- Odometer End: ${inspectionData.odometerEnd || 'N/A'}
${totalMiles > 0 ? `- Total Miles: ${totalMiles}` : ''}

EQUIPMENT STATUS:
- Issues Reported: ${equipmentIssues}
- Working Equipment: ${equipmentWorking}

${inspectionData.notes ? `START NOTES: ${inspectionData.notes}\n` : ''}
${inspectionData.endNotes ? `END NOTES: ${inspectionData.endNotes}\n` : ''}
${inspectionData.damageReport ? `DAMAGE REPORT: ${inspectionData.damageReport}\n` : ''}

${inspectionData.supervisor ? `SUPERVISOR: ${inspectionData.supervisor.name} (${inspectionData.supervisor.email}) - ${inspectionData.supervisor.department}\n` : ''}

Report generated on ${new Date().toLocaleString()}
FleetCheck v1.0
  `;

  try {
    // Since we're in a frontend-only environment, we'll use a service like EmailJS
    // For now, we'll simulate the email sending and provide instructions
    console.log('Email content prepared:', { subject, htmlContent: htmlContent.substring(0, 200) + '...' });
    
    // In a real implementation, you would use a service like EmailJS or send this to your backend
    // For demonstration, we'll return success with instructions
    return { 
      success: true, 
      message: 'Email content prepared successfully! To actually send emails, you would need to integrate with a service like EmailJS or set up a backend endpoint.',
      emailData: {
        to: inspectionData.supervisor?.email,
        subject,
        html: htmlContent,
        text: textContent
      }
    };
  } catch (error) {
    console.error('Error preparing email:', error);
    throw new Error('Failed to prepare email content. Please check your settings and try again.');
  }
};

export const getEmailSetupInstructions = () => {
  return [
    "For email integration, you'll need to use a service like EmailJS (emailjs.com) which works with frontend applications",
    "Sign up for EmailJS and create a new service (Gmail, Outlook, etc.)",
    "Get your EmailJS service ID, template ID, and public key",
    "Create an email template in EmailJS with variables for the inspection data",
    "Install EmailJS SDK: npm install @emailjs/browser",
    "Configure the email sending in the application with your EmailJS credentials",
    "Test the integration with a sample inspection report",
    "Alternative: Set up a backend service to handle SMTP email sending"
  ];
};
