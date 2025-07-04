
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { sendInspectionEmail, getEmailSetupInstructions } from '@/utils/emailIntegration';

interface EmailIntegrationProps {
  inspectionData: any;
}

const EmailIntegration = ({ inspectionData }: EmailIntegrationProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSendEmail = async () => {
    if (!inspectionData.supervisor?.email) {
      alert('No supervisor email found. Please select a supervisor first.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setErrorMessage('');

    try {
      console.log('=== SENDING INSPECTION EMAIL ===');
      console.log('Supervisor email:', inspectionData.supervisor.email);
      
      // Mock SMTP settings - in a real app, these would come from user input or configuration
      const mockSmtpSettings = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        user: 'your-email@gmail.com',
        pass: 'your-app-password'
      };
      
      const result = await sendInspectionEmail(inspectionData, mockSmtpSettings);
      
      setSubmissionStatus('success');
      console.log('Email prepared successfully:', result);
    } catch (error) {
      console.error('Failed to prepare email:', error);
      setSubmissionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center text-emerald-800">
          <Mail className="mr-2 h-5 w-5" />
          Email Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {submissionStatus === 'success' && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-4 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">Email Content Prepared!</p>
              <p className="text-green-700 text-sm mt-1">
                The inspection report email has been formatted and is ready to send. 
                To actually send emails, you'll need to integrate with EmailJS or set up a backend service.
              </p>
            </div>
          </div>
        )}

        {submissionStatus === 'error' && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Failed to prepare email</p>
              <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        <Button 
          onClick={handleSendEmail}
          disabled={isSubmitting || !inspectionData.supervisor?.email}
          className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
        >
          {isSubmitting ? (
            <>
              <Mail className="mr-2 h-4 w-4 animate-pulse" />
              Preparing Email...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send Email to Supervisor
            </>
          )}
        </Button>

        <Button
          onClick={() => setShowInstructions(!showInstructions)}
          variant="outline"
          className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50"
        >
          {showInstructions ? 'Hide Setup Instructions' : '📧 Email Setup Instructions'}
        </Button>

        {showInstructions && (
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-blue-800">Email Integration Setup:</h4>
            <ol className="text-blue-700 text-sm space-y-2 list-decimal list-inside">
              {getEmailSetupInstructions().map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailIntegration;
