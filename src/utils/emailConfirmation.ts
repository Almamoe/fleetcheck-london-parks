
import { supabase } from '@/integrations/supabase/client';

export const sendInspectionConfirmation = async (inspectionData: any, supervisor: any, driverName: string) => {
  try {
    console.log('Sending inspection confirmation email...');
    console.log('Inspection data being sent:', inspectionData);
    
    const { data, error } = await supabase.functions.invoke('send-inspection-confirmation', {
      body: {
        inspectionData: {
          driverName,
          vehicleName: inspectionData.selectedVehicle || inspectionData.vehicleName,
          date: inspectionData.date,
          time: inspectionData.time,
          odometerStart: inspectionData.odometerStart,
          odometerEnd: inspectionData.odometerEnd,
          equipment: inspectionData.equipment || {},
          notes: inspectionData.notes,
          endNotes: inspectionData.endNotes,
          damageReport: inspectionData.damageReport,
          endTime: inspectionData.endTime
        },
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
