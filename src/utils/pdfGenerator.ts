
export const generateInspectionPDF = (inspectionData: any) => {
  // Generate report ID
  const reportId = `FL-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  
  // Extract vehicle name properly
  const vehicleName = inspectionData.selectedVehicle?.name 
    ? `${inspectionData.selectedVehicle.name} (${inspectionData.selectedVehicle.plate_number})`
    : inspectionData.vehicleName || 'Unknown Vehicle';

  // Prepare equipment issues
  let equipmentIssues = 'None reported';
  if (inspectionData.equipment) {
    const issues = Object.entries(inspectionData.equipment)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').trim())
      .join(', ');
    equipmentIssues = issues || 'None reported';
  }

  // Calculate total miles
  const totalMiles = inspectionData.odometerEnd && inspectionData.odometerStart
    ? parseInt(inspectionData.odometerEnd) - parseInt(inspectionData.odometerStart)
    : 0;

  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
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
                    <span class="info-label">Vehicle:</span>
                    <span class="info-value">${vehicleName}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Date & Time:</span>
                    <span class="info-value">${inspectionData.date || new Date().toLocaleDateString()} at ${inspectionData.time || new Date().toLocaleTimeString()}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Start Odometer:</span>
                    <span class="info-value">${inspectionData.odometerStart || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">End Odometer:</span>
                    <span class="info-value">${inspectionData.odometerEnd || 'N/A'}</span>
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
    </body>
    </html>
  `;

  // Create a new window and print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }

  return { success: true, reportId };
};

export const downloadInspectionPDF = (inspectionData: any) => {
  // For now, we'll use the print functionality
  // In a real implementation, you might want to use a library like jsPDF or Puppeteer
  return generateInspectionPDF(inspectionData);
};
