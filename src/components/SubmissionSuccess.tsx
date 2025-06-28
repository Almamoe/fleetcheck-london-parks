
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SubmissionSuccessProps {
  inspectionData: any;
  onNewInspection: () => void;
}

const SubmissionSuccess = ({ inspectionData, onNewInspection }: SubmissionSuccessProps) => {
  const generateReportId = () => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FL-${date}-${random}`;
  };

  const reportId = generateReportId();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardContent className="p-8 text-center space-y-6">
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
              <li>📧 Report automatically emailed to selected supervisor</li>
              <li>📄 PDF report generated and stored</li>
              <li>💾 Data backed up to cloud storage</li>
              <li>🔍 Available for fleet maintenance review</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              onClick={onNewInspection}
              className="flex-1 h-12 text-base bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
            >
              Start New Inspection
            </Button>
            
            <Button 
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
