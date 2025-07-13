
import { supabase } from '@/integrations/supabase/client';

export const sendInspectionConfirmation = async (inspectionData: any, supervisor: any, driverName: string) => {
  try {
    console.log('Sending inspection confirmation email...');
    console.log('Inspection data being sent:', inspectionData);
    
    // Extract vehicle name properly
    const vehicleName = inspectionData.selectedVehicle?.name 
      ? `${inspectionData.selectedVehicle.name} (${inspectionData.selectedVehicle.plate_number})`
      : inspectionData.vehicleName || 'Unknown Vehicle';
    
    const { data, error } = await supabase.functions.invoke('send-inspection-confirmation', {
      body: {
        inspectionData: {
          driverName,
          vehicleName,
          date: inspectionData.date,
          time: inspectionData.time,
          odometerStart: inspectionData.odometerStart,
          odometerEnd: inspectionData.odometerEnd,
          equipment: inspectionData.equipment || {},
          endEquipment: inspectionData.endEquipment || {},
          notes: inspectionData.notes || inspectionData.startNotes,
          endNotes: inspectionData.endNotes,
          damageReport: inspectionData.damageReport,
          endTime: inspectionData.endTime,
          // Also include alternative field names in case they're used
          startNotes: inspectionData.startNotes,
          comments: inspectionData.comments
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
