
import { supabase } from '@/integrations/supabase/client';

export const sendInspectionConfirmation = async (inspectionData: any, supervisor: any, driverName: string) => {
  try {
    console.log('Sending inspection confirmation email...');
    
    const { data, error } = await supabase.functions.invoke('send-inspection-confirmation', {
      body: {
        inspectionData,
        supervisorEmail: supervisor.email,
        supervisorName: supervisor.name,
        driverName
      }
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }

    console.log('Confirmation email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    throw error;
  }
};
