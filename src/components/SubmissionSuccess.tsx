import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { sendToSlack, getSlackSetupInstructions } from '@/utils/slackIntegration';
import { sendInspectionConfirmation } from '@/utils/emailConfirmation';
import { useToast } from '@/components/ui/use-toast';

interface SubmissionSuccessProps {
  inspectionData: any;
  onNewInspection: () => void;
  onGoToDashboard: () => void;
}

const SubmissionSuccess = ({ inspectionData, onNewInspection, onGoToDashboard }: SubmissionSuccessProps) => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSubmittingSlack, setIsSubmittingSlack] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [slackStatus, setSlackStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const generateReportId = () => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FL-${date}-${random}`;
  };

  // Load saved Slack webhook URL
  useEffect(() => {
    const savedUrl = localStorage.getItem('fleetcheck-slack-webhook');
    if (savedUrl) {
      setWebhookUrl(savedUrl);
    }
  }, []);

  const handleSendToSlack = async () => {
    if (!webhookUrl.trim()) {
      alert('Please enter your Slack webhook URL first.');
      return;
    }

    setIsSubmittingSlack(true);
    setSlackStatus('idle');
    setErrorMessage('');

    try {
      console.log('=== SENDING TO SLACK ===');
      console.log('Using webhook URL:', webhookUrl);
      
      // Save the URL for future use
      localStorage.setItem('fleetcheck-slack-webhook', webhookUrl);
      
      await sendToSlack(inspectionData, webhookUrl);
      
      setSlackStatus('success');
      console.log('Successfully sent to Slack');
    } catch (error) {
      console.error('Failed to send to Slack:', error);
      setSlackStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsSubmittingSlack(false);
    }
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

  const reportId = generateReportId();

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

            {inspectionData.vehicleName && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-emerald-800">Vehicle:</span>
                <span className="text-emerald-700">{inspectionData.vehicleName}</span>
              </div>
            )}

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

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">📧 Email</TabsTrigger>
              <TabsTrigger value="slack">💬 Slack</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4">
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
            </TabsContent>
            
            <TabsContent value="slack" className="space-y-4">
              <div className="bg-white rounded-lg p-6 border border-emerald-200 space-y-4">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">💬 Send to Slack</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl" className="text-sm font-medium text-emerald-800">
                    Slack Webhook URL
                  </Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    className="border-emerald-300 focus:border-emerald-500"
                  />
                  <p className="text-xs text-emerald-600">
                    Enter your Slack webhook URL to send inspection reports to your Slack channel
                  </p>
                </div>

                {slackStatus === 'success' && (
                  <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                    <p className="text-green-800 font-medium">✅ Successfully sent to Slack!</p>
                    <p className="text-green-700 text-sm">The inspection report has been posted to your Slack channel.</p>
                  </div>
                )}

                {slackStatus === 'error' && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                    <p className="text-red-800 font-medium">❌ Failed to send to Slack</p>
                    <p className="text-red-700 text-sm">{errorMessage}</p>
                  </div>
                )}

                <Button 
                  onClick={handleSendToSlack}
                  disabled={isSubmittingSlack}
                  className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
                >
                  {isSubmittingSlack ? '💬 Sending...' : '💬 Send to Slack'}
                </Button>

                <Button
                  onClick={() => setShowInstructions(!showInstructions)}
                  variant="outline"
                  className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                >
                  {showInstructions ? 'Hide Instructions' : '📋 Setup Instructions'}
                </Button>

                {showInstructions && (
                  <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-blue-800">Slack Setup Instructions:</h4>
                    <ol className="text-blue-700 text-sm space-y-2 list-decimal list-inside">
                      {getSlackSetupInstructions().map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

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
