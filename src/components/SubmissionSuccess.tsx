
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-6xl mb-4">✅</div>
          
          <h1 className="text-3xl font-bold text-slate-800">Inspection Complete!</h1>
          
          <p className="text-slate-600 text-lg">
            Your daily vehicle inspection has been successfully submitted and saved.
          </p>

          <div className="bg-white rounded-lg p-6 space-y-4 border border-slate-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700">Report ID:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">{reportId}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700">Submission Time:</span>
              <span className="text-slate-600">{new Date().toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700">Driver:</span>
              <span className="text-slate-600">{inspectionData.driverName}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
            <ul className="text-blue-700 text-sm space-y-1 text-left">
              <li>📧 Report automatically emailed to supervisors</li>
              <li>📄 PDF report generated and stored</li>
              <li>💾 Data backed up to cloud storage</li>
              <li>🔍 Available for fleet maintenance review</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              onClick={onNewInspection}
              className="flex-1 h-12 text-base bg-slate-800 hover:bg-slate-700 text-white font-medium"
            >
              Start New Inspection
            </Button>
            
            <Button 
              variant="outline"
              className="flex-1 h-12 text-base border-2 font-medium"
            >
              📱 View Dashboard
            </Button>
          </div>

          <p className="text-xs text-slate-500 pt-4">
            City of London Parks & Recreation Department - FleetCheck v1.0
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionSuccess;
