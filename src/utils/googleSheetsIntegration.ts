
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

export const sendToGoogleSheets = async (inspectionData: InspectionData, sheetUrl: string) => {
  console.log('=== SENDING TO GOOGLE SHEETS ===');
  console.log('Sheet URL:', sheetUrl);
  console.log('Inspection data:', inspectionData);

  // Extract the sheet ID from the Google Sheets URL
  const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!sheetIdMatch) {
    throw new Error('Invalid Google Sheets URL. Please provide a valid Google Sheets URL.');
  }

  const sheetId = sheetIdMatch[1];
  const webAppUrl = `https://script.google.com/macros/s/${sheetId}/exec`;

  // Prepare the data to send
  const equipmentStatus = Object.entries(inspectionData.equipment)
    .filter(([_, value]) => value)
    .map(([key, _]) => key)
    .join(', ') || 'None checked';

  const failedEquipment = Object.entries(inspectionData.equipment)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key)
    .join(', ') || 'All passed';

  const totalMiles = inspectionData.odometerEnd && inspectionData.odometerStart
    ? parseInt(inspectionData.odometerEnd) - parseInt(inspectionData.odometerStart)
    : 0;

  const rowData = {
    timestamp: new Date().toLocaleString(),
    reportId: `FL-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    driverName: inspectionData.driverName,
    driverId: inspectionData.driverId || 'N/A',
    vehicleName: inspectionData.vehicleName || 'N/A',
    date: inspectionData.date,
    startTime: inspectionData.time,
    endTime: inspectionData.endNotes || 'N/A',
    startOdometer: inspectionData.odometerStart,
    endOdometer: inspectionData.odometerEnd || 'N/A',
    totalMiles: totalMiles.toString(),
    equipmentPassed: equipmentStatus,
    equipmentFailed: failedEquipment,
    startNotes: inspectionData.notes || 'None',
    endNotes: inspectionData.endNotes || 'None',
    damageReport: inspectionData.damageReport || 'None',
    supervisorName: inspectionData.supervisor?.name || 'N/A',
    supervisorEmail: inspectionData.supervisor?.email || 'N/A',
    supervisorDepartment: inspectionData.supervisor?.department || 'N/A',
    submittedAt: inspectionData.submittedAt
  };

  try {
    console.log('Sending data to Google Sheets...');
    
    // Use a simple fetch with form data since Google Apps Script expects form data
    const formData = new FormData();
    Object.entries(rowData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(webAppUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // Required for Google Apps Script
    });

    console.log('Data sent to Google Sheets successfully');
    return { success: true, message: 'Inspection data sent to Google Sheets successfully!' };
  } catch (error) {
    console.error('Error sending to Google Sheets:', error);
    throw new Error('Failed to send data to Google Sheets. Please check your internet connection and sheet URL.');
  }
};

// Function to create the Google Apps Script code that users need to add to their sheet
export const getGoogleAppsScriptCode = () => {
  return `
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Get the data from the POST request
    const data = e.parameter;
    
    // Check if this is the first row (add headers)
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp', 'Report ID', 'Driver Name', 'Driver ID', 'Vehicle Name',
        'Date', 'Start Time', 'End Time', 'Start Odometer', 'End Odometer',
        'Total Miles', 'Equipment Passed', 'Equipment Failed', 'Start Notes',
        'End Notes', 'Damage Report', 'Supervisor Name', 'Supervisor Email',
        'Supervisor Department', 'Submitted At'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format the header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4CAF50');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
    }
    
    // Add the new row
    const newRow = [
      data.timestamp || '',
      data.reportId || '',
      data.driverName || '',
      data.driverId || '',
      data.vehicleName || '',
      data.date || '',
      data.startTime || '',
      data.endTime || '',
      data.startOdometer || '',
      data.endOdometer || '',
      data.totalMiles || '',
      data.equipmentPassed || '',
      data.equipmentFailed || '',
      data.startNotes || '',
      data.endNotes || '',
      data.damageReport || '',
      data.supervisorName || '',
      data.supervisorEmail || '',
      data.supervisorDepartment || '',
      data.submittedAt || ''
    ];
    
    sheet.appendRow(newRow);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, newRow.length);
    
    return ContentService.createTextOutput('Success');
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput('Error: ' + error.toString());
  }
}
`;
};
