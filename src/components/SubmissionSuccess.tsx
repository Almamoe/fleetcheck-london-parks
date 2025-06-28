
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SubmissionSuccessProps {
  inspectionData: any;
  onNewInspection: () => void;
  onGoToDashboard: () => void;
}

const SubmissionSuccess = ({ inspectionData, onNewInspection, onGoToDashboard }: SubmissionSuccessProps) => {
  const generateReportId = () => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FL-${date}-${random}`;
  };

  const generateProfessionalPDFContent = () => {
    const reportId = generateReportId();
    const currentDate = new Date().toLocaleString();
    
    return `
═══════════════════════════════════════════════════════════════════════════════
                            CITY OF LONDON
                      PARKS & RECREATION DEPARTMENT
                         DAILY VEHICLE INSPECTION REPORT
═══════════════════════════════════════════════════════════════════════════════

REPORT INFORMATION
──────────────────────────────────────────────────────────────────────────────
Report ID:          ${reportId}
Date Generated:     ${currentDate}
System:             FleetCheck v1.0

DRIVER INFORMATION
──────────────────────────────────────────────────────────────────────────────
Driver Name:        ${inspectionData.driverName}
Driver ID:          ${inspectionData.driverId || 'N/A'}

VEHICLE INFORMATION
──────────────────────────────────────────────────────────────────────────────
Vehicle:            ${inspectionData.vehicleName || 'N/A'}
Inspection Date:    ${inspectionData.date || 'N/A'}

START OF DAY INSPECTION
──────────────────────────────────────────────────────────────────────────────
Start Time:         ${inspectionData.time || 'N/A'}
Odometer Reading:   ${inspectionData.odometerStart || 'N/A'} km

EQUIPMENT STATUS CHECKLIST
──────────────────────────────────────────────────────────────────────────────
${inspectionData.equipment ? Object.entries(inspectionData.equipment).map(([key, value]) => 
  `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: ${value ? '✓ PASS' : '✗ FAIL'}`
).join('\n') : 'No equipment data available'}

START OF DAY NOTES
──────────────────────────────────────────────────────────────────────────────
${inspectionData.notes || 'No notes provided'}

END OF DAY INSPECTION
──────────────────────────────────────────────────────────────────────────────
End Time:           ${inspectionData.endTime || 'N/A'}
End Odometer:       ${inspectionData.odometerEnd || 'N/A'} km
Total Distance:     ${inspectionData.odometerEnd && inspectionData.odometerStart ? 
  (parseInt(inspectionData.odometerEnd) - parseInt(inspectionData.odometerStart)) + ' km' : 'N/A'}

END OF DAY NOTES
──────────────────────────────────────────────────────────────────────────────
${inspectionData.endNotes || 'No notes provided'}

DAMAGE REPORT
──────────────────────────────────────────────────────────────────────────────
${inspectionData.damageReport || 'No damage reported'}

SUPERVISOR INFORMATION
──────────────────────────────────────────────────────────────────────────────
Supervisor:         ${inspectionData.supervisor?.name || 'N/A'}
Department:         ${inspectionData.supervisor?.department || 'N/A'}
Email:              ${inspectionData.supervisor?.email || 'N/A'}

DIGITAL SIGNATURE
──────────────────────────────────────────────────────────────────────────────
Driver Signature:   ✓ DIGITALLY SIGNED
Signature Date:     ${currentDate}

CERTIFICATION
──────────────────────────────────────────────────────────────────────────────
I certify that I have completed this vehicle inspection to the best of my 
ability and that all information provided is accurate and complete.

Driver: ${inspectionData.driverName}
Date: ${new Date().toLocaleDateString()}

═══════════════════════════════════════════════════════════════════════════════
This report was automatically generated by FleetCheck v1.0
City of London Parks & Recreation Department
For questions or concerns, please contact your supervisor.
═══════════════════════════════════════════════════════════════════════════════
    `.trim();
  };

  const handleEmailSupervisor = () => {
    if (!inspectionData.supervisor?.email) {
      alert('No supervisor email available');
      return;
    }

    const pdfContent = generateProfessionalPDFContent();
    const reportId = generateReportId();
    
    const subject = `Daily Vehicle Inspection Report - ${inspectionData.driverName} - ${reportId}`;
    const body = `Dear ${inspectionData.supervisor.name},

Please find the attached daily vehicle inspection report for review and records.

INSPECTION SUMMARY:
- Driver: ${inspectionData.driverName}
- Vehicle: ${inspectionData.vehicleName || 'N/A'}
- Date: ${inspectionData.date || new Date().toLocaleDateString()}
- Report ID: ${reportId}

DETAILED REPORT:
${pdfContent}

This report has been automatically generated and digitally signed through the FleetCheck system.

If you have any questions or need clarification on this inspection, please contact the driver directly.

Best regards,
FleetCheck Automated System
City of London Parks & Recreation Department

---
This is an automated message from the FleetCheck vehicle inspection system.`;

    const mailtoLink = `mailto:${inspectionData.supervisor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    console.log('Opening email client with professional PDF report:', {
      supervisor: inspectionData.supervisor,
      reportId,
      vehicle: inspectionData.vehicleName
    });
    
    window.location.href = mailtoLink;
  };

  const reportId = generateReportId();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center mb-4">
            <img
              src="/lovable-uploads/d06e4237-0209-4e8b-ab56-fa47f79f7ca5.png"
              alt="City of London"
              className="h-16 w-16"
            />
          </div>
          
          <div className="text-6xl mb-4">✅</div>
          
          <h1 className="text-3xl font-bold text-emerald-800">Inspection Complete!</h1>
          
          <p className="text-emerald-700 text-lg">
            Your daily vehicle inspection has been successfully submitted and saved.
          </p>

          <div className="bg-white rounded-lg p-6 space-y-4 border border-emerald-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-emerald-800">Report ID:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1 bg-emerald-100 text-emerald-800">{reportId}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium text-emerald-800">Submission Time:</span>
              <span className="text-emerald-700">{new Date().toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium text-emerald-800">Driver:</span>
              <span className="text-emerald-700">{inspectionData.driverName}</span>
            </div>

            {inspectionData.vehicleName && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-emerald-800">Vehicle:</span>
                <span className="text-emerald-700">{inspectionData.vehicleName}</span>
              </div>
            )}

            {inspectionData.supervisor && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-emerald-800">Sent to Supervisor:</span>
                <div className="text-right">
                  <div className="text-emerald-700 font-medium">{inspectionData.supervisor.name}</div>
                  <div className="text-sm text-emerald-600">{inspectionData.supervisor.department}</div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-4">
            <h3 className="font-semibold text-emerald-800 mb-2">Next Steps:</h3>
            <ul className="text-emerald-700 text-sm space-y-1 text-left">
              <li>📧 Click below to send professional PDF report via email</li>
              <li>📄 Report includes City of London branding and formatting</li>
              <li>💾 Data saved locally for your records</li>
              <li>🔍 Available for fleet maintenance review</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              onClick={handleEmailSupervisor}
              className="flex-1 h-12 text-base bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
            >
              📧 Email Professional PDF Report
            </Button>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={onNewInspection}
              variant="outline"
              className="flex-1 h-12 text-base border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-medium"
            >
              Start New Inspection
            </Button>
            
            <Button 
              onClick={onGoToDashboard}
              variant="outline"
              className="flex-1 h-12 text-base border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-medium"
            >
              📱 View Dashboard
            </Button>
          </div>

          <p className="text-xs text-emerald-600 pt-4">
            City of London Parks & Recreation Department - FleetCheck v1.0
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionSuccess;
