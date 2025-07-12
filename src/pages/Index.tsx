import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import DriverSignIn from '@/components/DriverSignIn';
import StartOfDayForm from '@/components/StartOfDayForm';
import EndOfDayForm from '@/components/EndOfDayForm';
import DigitalSignature from '@/components/DigitalSignature';
import ReviewInspection from '@/components/ReviewInspection';
import SupervisorSelection from '@/components/SupervisorSelection';
import SubmissionSuccess from '@/components/SubmissionSuccess';
import { createOrGetDriver, createOrGetVehicle, createOrGetSupervisor, saveInspection } from '@/utils/supabaseOperations';

type InspectionStep = 'signin' | 'startday' | 'endday' | 'signature' | 'review' | 'supervisor' | 'success';

interface Supervisor {
  id: string;
  name: string;
  email: string;
  department: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<InspectionStep>('signin');
  const [driverInfo, setDriverInfo] = useState({ name: '', id: '' });
  const [startOfDayData, setStartOfDayData] = useState(null);
  const [endOfDayData, setEndOfDayData] = useState(null);
  const [signatureData, setSignatureData] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor>();

  const handleSignIn = async (name: string, id: string) => {
    try {
      // Store driver info in Supabase
      console.log('Storing driver info in Supabase:', { name, id });
      await createOrGetDriver(name, id);
      
      setDriverInfo({ name, id });
      setCurrentStep('startday');
    } catch (error) {
      console.error('Error storing driver info:', error);
      // Continue with the flow even if Supabase fails
      setDriverInfo({ name, id });
      setCurrentStep('startday');
    }
  };

  const handleStartOfDay = (data: any) => {
    setStartOfDayData(data);
    setCurrentStep('endday');
  };

  const handleEndOfDay = (data: any) => {
    setEndOfDayData(data);
    setCurrentStep('signature');
  };

  const handleSignature = (signature: string) => {
    setSignatureData(signature);
    setCurrentStep('review');
  };

  const handleReviewProceed = () => {
    setCurrentStep('supervisor');
  };

  const handleReviewBack = () => {
    setCurrentStep('signature');
  };

  const handleSupervisorSelection = async (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    
    try {
      console.log('Saving complete inspection to Supabase...');
      
      // Create/get all the required IDs
      const driverId = await createOrGetDriver(driverInfo.name, driverInfo.id);
      const vehicleId = await createOrGetVehicle(startOfDayData.selectedVehicle);
      const supervisorId = await createOrGetSupervisor(supervisor);
      
      // Save the inspection
      const inspectionId = await saveInspection({
        driverId,
        vehicleId,
        supervisorId,
        startOfDay: startOfDayData,
        endOfDay: endOfDayData,
        signature: signatureData
      });
      
      console.log('Inspection saved with ID:', inspectionId);
      
      // Also keep localStorage backup for compatibility with enhanced data structure
      const completeInspection = {
        driverName: driverInfo.name,
        driverId: driverInfo.id,
        selectedVehicle: startOfDayData.selectedVehicle,
        vehicleName: startOfDayData.selectedVehicle?.name 
          ? `${startOfDayData.selectedVehicle.name} (${startOfDayData.selectedVehicle.plate_number})`
          : 'Unknown Vehicle',
        date: startOfDayData.date,
        time: startOfDayData.time,
        odometerStart: startOfDayData.odometerStart,
        odometerEnd: endOfDayData.odometerEnd,
        endTime: endOfDayData.endTime,
        equipment: startOfDayData.equipment,
        notes: startOfDayData.notes,
        startNotes: startOfDayData.notes,
        endNotes: endOfDayData.endNotes,
        damageReport: endOfDayData.damageReport,
        comments: endOfDayData.comments,
        signature: signatureData,
        supervisor: supervisor,
        submittedAt: new Date().toISOString(),
        supabaseId: inspectionId
      };
      
      const existingInspections = JSON.parse(localStorage.getItem('fleetcheck-inspections') || '[]');
      existingInspections.push(completeInspection);
      localStorage.setItem('fleetcheck-inspections', JSON.stringify(existingInspections));
      
      setCurrentStep('success');
    } catch (error) {
      console.error('Error saving inspection to Supabase:', error);
      
      // Fallback to localStorage only if Supabase fails
      const completeInspection = {
        driverName: driverInfo.name,
        driverId: driverInfo.id,
        selectedVehicle: startOfDayData.selectedVehicle,
        vehicleName: startOfDayData.selectedVehicle?.name 
          ? `${startOfDayData.selectedVehicle.name} (${startOfDayData.selectedVehicle.plate_number})`
          : 'Unknown Vehicle',
        date: startOfDayData.date,
        time: startOfDayData.time,
        odometerStart: startOfDayData.odometerStart,
        odometerEnd: endOfDayData.odometerEnd,
        endTime: endOfDayData.endTime,
        equipment: startOfDayData.equipment,
        notes: startOfDayData.notes,
        startNotes: startOfDayData.notes,
        endNotes: endOfDayData.endNotes,
        damageReport: endOfDayData.damageReport,
        comments: endOfDayData.comments,
        signature: signatureData,
        supervisor: supervisor,
        submittedAt: new Date().toISOString(),
        error: 'Failed to save to database'
      };
      
      const existingInspections = JSON.parse(localStorage.getItem('fleetcheck-inspections') || '[]');
      existingInspections.push(completeInspection);
      localStorage.setItem('fleetcheck-inspections', JSON.stringify(existingInspections));
      
      console.log('Inspection saved to localStorage as fallback');
      setCurrentStep('success');
    }
  };

  const handleNewInspection = () => {
    setCurrentStep('signin');
    setDriverInfo({ name: '', id: '' });
    setStartOfDayData(null);
    setEndOfDayData(null);
    setSignatureData('');
    setSelectedSupervisor(undefined);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'signin':
        return <DriverSignIn onSignIn={handleSignIn} onGoToDashboard={handleGoToDashboard} />;
      
      case 'startday':
        return (
          <StartOfDayForm 
            driverName={driverInfo.name} 
            onSubmit={handleStartOfDay} 
          />
        );
      
      case 'endday':
        return (
          <EndOfDayForm 
            driverName={driverInfo.name}
            startData={startOfDayData}
            onSubmit={handleEndOfDay} 
          />
        );
      
      case 'signature':
        return (
          <DigitalSignature 
            driverName={driverInfo.name}
            onSignature={handleSignature} 
          />
        );

      case 'review':
        return (
          <ReviewInspection
            driverInfo={driverInfo}
            startOfDayData={startOfDayData}
            endOfDayData={endOfDayData}
            signatureData={signatureData}
            onProceed={handleReviewProceed}
            onBack={handleReviewBack}
          />
        );

      case 'supervisor':
        return (
          <SupervisorSelection
            driverName={driverInfo.name}
            onSubmit={handleSupervisorSelection}
          />
        );
      
      case 'success':
        return (
          <SubmissionSuccess 
            inspectionData={{ 
              driverName: driverInfo.name, 
              supervisor: selectedSupervisor,
              selectedVehicle: startOfDayData.selectedVehicle,
              vehicleName: startOfDayData.selectedVehicle?.name 
                ? `${startOfDayData.selectedVehicle.name} (${startOfDayData.selectedVehicle.plate_number})`
                : 'Unknown Vehicle',
              date: startOfDayData.date,
              time: startOfDayData.time,
              odometerStart: startOfDayData.odometerStart,
              odometerEnd: endOfDayData.odometerEnd,
              endTime: endOfDayData.endTime,
              equipment: startOfDayData.equipment,
              notes: startOfDayData.notes,
              startNotes: startOfDayData.notes,
              endNotes: endOfDayData.endNotes,
              damageReport: endOfDayData.damageReport,
              comments: endOfDayData.comments
            }}
            onNewInspection={handleNewInspection}
            onGoToDashboard={handleGoToDashboard}
          />
        );
      
      default:
        return <DriverSignIn onSignIn={handleSignIn} onGoToDashboard={handleGoToDashboard} />;
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      {currentStep !== 'signin' && <Header />}
      {renderCurrentStep()}
    </div>
  );
};

export default Index;
