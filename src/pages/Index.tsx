import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import DriverSignIn from '@/components/DriverSignIn';
import StartOfDayForm from '@/components/StartOfDayForm';
import EndOfDayForm from '@/components/EndOfDayForm';
import DigitalSignature from '@/components/DigitalSignature';
import SupervisorSelection from '@/components/SupervisorSelection';
import SubmissionSuccess from '@/components/SubmissionSuccess';

type InspectionStep = 'signin' | 'startday' | 'endday' | 'signature' | 'supervisor' | 'success';

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

  const handleSignIn = (name: string, id: string) => {
    setDriverInfo({ name, id });
    setCurrentStep('startday');
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
    setCurrentStep('supervisor');
  };

  const handleSupervisorSelection = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    
    // Save complete inspection data
    const completeInspection = {
      driverName: driverInfo.name,
      driverId: driverInfo.id,
      startOfDay: startOfDayData,
      endOfDay: endOfDayData,
      signature: signatureData,
      supervisor: supervisor,
      submittedAt: new Date().toISOString(),
    };
    
    // Store in localStorage (in production, this would go to a database)
    const existingInspections = JSON.parse(localStorage.getItem('fleetcheck-inspections') || '[]');
    existingInspections.push(completeInspection);
    localStorage.setItem('fleetcheck-inspections', JSON.stringify(existingInspections));
    
    console.log('Inspection submitted to supervisor:', supervisor.name, completeInspection);
    setCurrentStep('success');
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
              ...startOfDayData, 
              ...endOfDayData 
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
