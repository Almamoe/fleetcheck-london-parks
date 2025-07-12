import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { sendInspectionConfirmation } from '@/utils/emailConfirmation';
import { downloadInspectionPDF } from '@/utils/pdfGenerator';
import { useToast } from '@/components/ui/use-toast';

interface SubmissionSuccessProps {
  inspectionData: any;
  onNewInspection: () => void;
  onGoToDashboard: () => void;
}

const SubmissionSuccess = ({ inspectionData, onNewInspection, onGoToDashboard }: SubmissionSuccessProps) => {
  const { toast } = useToast();
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const generateReportId = () => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FL-${date}-${random}`;
  };

  const handleSendEmailConfirmation = async () => {
    if (!inspectionData.supervisor?.email) {
      toast({
        title: "No Supervisor Email",
        description: "Please ensure a supervisor with an email address is selected.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingEmail(true);
    setEmailStatus('idle');

    try {
      console.log('=== SENDING EMAIL CONFIRMATION ===');
      
      await sendInspectionConfirmation(
        inspectionData, 
        inspectionData.supervisor, 
        inspectionData.driverName
      );
      
      setEmailStatus('success');
      toast({
        title: "Email Sent!",
        description: `Inspection confirmation sent to ${inspectionData.supervisor.name}`,
      });
    } catch (error) {
      console.error('Failed to send email confirmation:', error);
      setEmailStatus('error');
      toast({
        title: "Email Failed",
        description: error instanceof Error ? error.message : 'Failed to send email confirmation',
        variant: "destructive",
      });
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      const result = downloadInspectionPDF(inspectionData);
      if (result.success) {
        toast({
          title: "PDF Generated!",
          description: `Report ${result.reportId} is ready for download/print`,
        });
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF report",
        variant: "destructive",
      });
    }
  };

  const reportId = generateReportId();

  // Extract vehicle name properly
  const vehicleName = inspectionData.selectedVehicle?.name 
    ? `${inspectionData.selectedVehicle.name} (${inspectionData.selectedVehicle.plate_number})`
    : inspectionData.vehicleName || 'Unknown Vehicle';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-4xl shadow-2xl border-0">
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-center mb-4">
            <img
              src="/lovable-uploads/d06e4237-0209-4e8b-ab56-fa47f79f7ca5.png"
              alt="City of London"
              className="h-16 w-16"
            />
          </div>
          
          <div className="text-6xl mb-4 text-center">✅</div>
          
          <h1 className="text-3xl font-bold text-emerald-800 text-center">Inspection Complete!</h1>
          
          <p className="text-emerald-700 text-lg text-center">
            Your daily vehicle inspection has been completed. Send it to your supervisor using the options below.
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

            <div className="flex justify-between items-center">
              <span className="font-medium text-emerald-800">Vehicle:</span>
              <span className="text-emerald-700">{vehicleName}</span>
            </div>

            {inspectionData.supervisor && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-emerald-800">Supervisor:</span>
                <div className="text-right">
                  <div className="text-emerald-700 font-medium">{inspectionData.supervisor.name}</div>
                  <div className="text-sm text-emerald-600">{inspectionData.supervisor.department}</div>
                </div>
              </div>
            )}
          </div>

          {/* PDF Download Button */}
          <div className="bg-white rounded-lg p-6 border border-emerald-200">
            <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
              <Download className="mr-2 h-5 w-5" />
              Download Report
            </h3>
            <p className="text-emerald-700 text-sm mb-4">
              Generate a PDF report of this inspection for your records or printing.
            </p>
            <Button 
              onClick={handleDownloadPDF}
              className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF Report
            </Button>
          </div>

          {/* Email Section */}
          <div className="bg-white rounded-lg p-6 border border-emerald-200 space-y-4">
            <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Send Email Confirmation
            </h3>
            
            {inspectionData.supervisor && (
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm text-emerald-700 mb-2">
                  <strong>Email will be sent to:</strong>
                </p>
                <div className="text-emerald-800">
                  <div className="font-medium">{inspectionData.supervisor.name}</div>
                  <div className="text-sm">{inspectionData.supervisor.email}</div>
                  <div className="text-sm text-emerald-600">{inspectionData.supervisor.department}</div>
                </div>
              </div>
            )}

            {emailStatus === 'success' && (
              <div className="bg-green-50 border border-green-300 rounded-lg p-4 flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">Email Sent Successfully!</p>
                  <p className="text-green-700 text-sm mt-1">
                    The inspection report has been sent to {inspectionData.supervisor?.name}.
                  </p>
                </div>
              </div>
            )}

            {emailStatus === 'error' && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Failed to send email</p>
                  <p className="text-red-700 text-sm mt-1">Please check your Resend configuration and try again.</p>
                </div>
              </div>
            )}

            <Button 
              onClick={handleSendEmailConfirmation}
              disabled={isSubmittingEmail || !inspectionData.supervisor?.email}
              className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
            >
              {isSubmittingEmail ? (
                <>
                  <Mail className="mr-2 h-4 w-4 animate-pulse" />
                  Sending Email...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email to Supervisor
                </>
              )}
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
              Go to Dashboard
            </Button>
          </div>

          <p className="text-xs text-emerald-600 pt-4 text-center">
            City of London Parks & Recreation Department - FleetCheck v1.0
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionSuccess;