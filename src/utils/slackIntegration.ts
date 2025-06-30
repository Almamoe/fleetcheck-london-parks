
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

interface SlackAttachment {
  color?: string;
  title?: string;
  fields?: Array<{
    title: string;
    value: string;
    short: boolean;
  }>;
}

interface SlackMessage {
  text: string;
  attachments: SlackAttachment[];
}

export const sendToSlack = async (inspectionData: InspectionData, webhookUrl: string) => {
  console.log('=== SENDING TO SLACK ===');
  console.log('Webhook URL:', webhookUrl);
  console.log('Inspection data:', inspectionData);

  // Validate webhook URL
  if (!webhookUrl.includes('hooks.slack.com')) {
    throw new Error('Invalid Slack webhook URL. Please provide a valid Slack webhook URL.');
  }

  // Prepare equipment status
  const equipmentPassed = Object.entries(inspectionData.equipment)
    .filter(([_, value]) => value)
    .map(([key, _]) => key)
    .join(', ') || 'None';

  const equipmentFailed = Object.entries(inspectionData.equipment)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key)
    .join(', ') || 'All passed';

  const totalMiles = inspectionData.odometerEnd && inspectionData.odometerStart
    ? parseInt(inspectionData.odometerEnd) - parseInt(inspectionData.odometerStart)
    : 0;

  const reportId = `FL-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

  // Create Slack message payload
  const slackMessage: SlackMessage = {
    text: `🚗 New Fleet Inspection Report - ${reportId}`,
    attachments: [
      {
        color: equipmentFailed === 'All passed' ? 'good' : 'warning',
        fields: [
          {
            title: 'Driver Information',
            value: `*Name:* ${inspectionData.driverName}\n*ID:* ${inspectionData.driverId || 'N/A'}\n*Vehicle:* ${inspectionData.vehicleName || 'N/A'}`,
            short: true
          },
          {
            title: 'Inspection Details',
            value: `*Date:* ${inspectionData.date}\n*Time:* ${inspectionData.time}\n*Report ID:* ${reportId}`,
            short: true
          },
          {
            title: 'Odometer Reading',
            value: `*Start:* ${inspectionData.odometerStart}\n*End:* ${inspectionData.odometerEnd || 'N/A'}\n*Miles:* ${totalMiles}`,
            short: true
          },
          {
            title: 'Equipment Status',
            value: `*✅ Passed:* ${equipmentPassed}\n*❌ Failed:* ${equipmentFailed}`,
            short: true
          }
        ]
      }
    ]
  };

  // Add notes if they exist
  if (inspectionData.notes || inspectionData.endNotes || inspectionData.damageReport) {
    const notesFields = [];
    
    if (inspectionData.notes) {
      notesFields.push({
        title: 'Start Notes',
        value: inspectionData.notes,
        short: false
      });
    }
    
    if (inspectionData.endNotes) {
      notesFields.push({
        title: 'End Notes',
        value: inspectionData.endNotes,
        short: false
      });
    }
    
    if (inspectionData.damageReport) {
      notesFields.push({
        title: 'Damage Report',
        value: inspectionData.damageReport,
        short: false
      });
    }

    slackMessage.attachments.push({
      color: 'info',
      title: 'Additional Notes',
      fields: notesFields
    });
  }

  // Add supervisor info
  if (inspectionData.supervisor) {
    slackMessage.attachments.push({
      color: 'info',
      title: 'Supervisor Information',
      fields: [
        {
          title: 'Assigned Supervisor',
          value: `*Name:* ${inspectionData.supervisor.name}\n*Email:* ${inspectionData.supervisor.email}\n*Department:* ${inspectionData.supervisor.department}`,
          short: false
        }
      ]
    });
  }

  try {
    console.log('Sending data to Slack...');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status} ${response.statusText}`);
    }

    console.log('Data sent to Slack successfully');
    return { success: true, message: 'Inspection report sent to Slack successfully!' };
  } catch (error) {
    console.error('Error sending to Slack:', error);
    throw new Error('Failed to send data to Slack. Please check your webhook URL and internet connection.');
  }
};

// Function to get Slack webhook setup instructions
export const getSlackSetupInstructions = () => {
  return [
    "Go to your Slack workspace and navigate to the channel where you want to receive inspection reports",
    "Click on the channel name at the top to open channel details",
    "Go to the 'Integrations' tab and click 'Add an app'",
    "Search for 'Incoming Webhooks' and click 'Add to Slack'",
    "Choose the channel where you want notifications to appear",
    "Click 'Add Incoming WebHooks integration'",
    "Copy the Webhook URL that appears (it starts with https://hooks.slack.com/...)",
    "Paste the webhook URL in the field below and click 'Send to Slack'"
  ];
};
