
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Driver = Database['public']['Tables']['drivers']['Row'];
type Vehicle = Database['public']['Tables']['vehicles']['Row'];
type Supervisor = Database['public']['Tables']['supervisors']['Row'];
type Inspection = Database['public']['Tables']['inspections']['Insert'];

export const createOrGetDriver = async (name: string, driverId: string): Promise<string> => {
  console.log('Creating or getting driver:', { name, driverId });
  
  // First, try to find existing driver
  const { data: existingDriver, error: findError } = await supabase
    .from('drivers')
    .select('id')
    .eq('driver_id', driverId)
    .maybeSingle();

  if (findError) {
    console.error('Error finding driver:', findError);
    throw findError;
  }

  if (existingDriver) {
    console.log('Found existing driver:', existingDriver.id);
    return existingDriver.id;
  }

  // Create new driver
  const { data: newDriver, error: createError } = await supabase
    .from('drivers')
    .insert({ name, driver_id: driverId })
    .select('id')
    .single();

  if (createError) {
    console.error('Error creating driver:', createError);
    throw createError;
  }

  console.log('Created new driver:', newDriver.id);
  return newDriver.id;
};

export const createOrGetVehicle = async (vehicleData: any): Promise<string> => {
  console.log('Creating or getting vehicle:', vehicleData);
  
  // Handle both old and new data structures
  const vehicleName = vehicleData.name;
  const plateNumber = vehicleData.plate_number || vehicleData.plateNumber;
  const vehicleType = vehicleData.type;
  const department = vehicleData.department;

  if (!vehicleName || !plateNumber) {
    console.error('Missing required vehicle data:', vehicleData);
    throw new Error('Vehicle name and plate number are required');
  }
  
  // Try to find existing vehicle by name and plate number
  const { data: existingVehicle, error: findError } = await supabase
    .from('vehicles')
    .select('id')
    .eq('name', vehicleName)
    .eq('plate_number', plateNumber)
    .maybeSingle();

  if (findError) {
    console.error('Error finding vehicle:', findError);
    throw findError;
  }

  if (existingVehicle) {
    console.log('Found existing vehicle:', existingVehicle.id);
    return existingVehicle.id;
  }

  // Create new vehicle
  const { data: newVehicle, error: createError } = await supabase
    .from('vehicles')
    .insert({
      name: vehicleName,
      type: vehicleType || 'Unknown',
      plate_number: plateNumber,
      department: department || 'Unknown'
    })
    .select('id')
    .single();

  if (createError) {
    console.error('Error creating vehicle:', createError);
    throw createError;
  }

  console.log('Created new vehicle:', newVehicle.id);
  return newVehicle.id;
};

export const createOrGetSupervisor = async (supervisorData: any): Promise<string> => {
  console.log('Creating or getting supervisor:', supervisorData);
  
  // Try to find existing supervisor by email
  const { data: existingSupervisor, error: findError } = await supabase
    .from('supervisors')
    .select('id')
    .eq('email', supervisorData.email)
    .maybeSingle();

  if (findError) {
    console.error('Error finding supervisor:', findError);
    throw findError;
  }

  if (existingSupervisor) {
    console.log('Found existing supervisor:', existingSupervisor.id);
    return existingSupervisor.id;
  }

  // Create new supervisor
  const { data: newSupervisor, error: createError } = await supabase
    .from('supervisors')
    .insert({
      name: supervisorData.name,
      email: supervisorData.email,
      department: supervisorData.department
    })
    .select('id')
    .single();

  if (createError) {
    console.error('Error creating supervisor:', createError);
    throw createError;
  }

  console.log('Created new supervisor:', newSupervisor.id);
  return newSupervisor.id;
};

export const saveInspection = async (inspectionData: any): Promise<string> => {
  console.log('Saving inspection to Supabase:', inspectionData);
  
  const { data: inspection, error } = await supabase
    .from('inspections')
    .insert({
      driver_id: inspectionData.driverId,
      vehicle_id: inspectionData.vehicleId,
      supervisor_id: inspectionData.supervisorId,
      inspection_date: inspectionData.startOfDay.date,
      start_time: inspectionData.startOfDay.time,
      end_time: inspectionData.endOfDay?.endTime,
      odometer_start: parseInt(inspectionData.startOfDay.odometerStart),
      odometer_end: inspectionData.endOfDay?.odometerEnd ? parseInt(inspectionData.endOfDay.odometerEnd) : null,
      equipment_issues: inspectionData.startOfDay.equipment,
      start_notes: inspectionData.startOfDay.notes,
      end_notes: inspectionData.endOfDay?.notes,
      damage_report: inspectionData.endOfDay?.damageReport,
      equipment_condition: inspectionData.endOfDay?.equipmentCondition,
      signature_data: inspectionData.signature,
      status: 'completed'
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error saving inspection:', error);
    throw error;
  }

  console.log('Saved inspection:', inspection.id);
  return inspection.id;
};

export const getInspections = async () => {
  const { data, error } = await supabase
    .from('inspections')
    .select(`
      *,
      drivers:driver_id(name, driver_id),
      vehicles:vehicle_id(name, plate_number),
      supervisors:supervisor_id(name, email, department)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inspections:', error);
    throw error;
  }

  return data;
};
