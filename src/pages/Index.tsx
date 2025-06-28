
import React, { useState } from 'react';
import Header from '@/components/Header';
import DriverSignIn from '@/components/DriverSignIn';
import StartOfDayForm from '@/components/StartOfDayForm';
import EndOfDayForm from '@/components/EndOfDayForm';
import DigitalSignature from '@/components/DigitalSignature';
import SubmissionSuccess from '@/components/SubmissionSuccess';

type InspectionStep = 'signin' | 'startday' | 'endday' | 'signature' | 'success';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<InspectionStep>('signin');
  const [driverInfo, setDriverInfo] = useState({ name: '', id: '' });
  const [startOfDayData, setStartOfDayData] = useState(null);
  const [endOfDayData, setEndOfDayData] = useState(null);
  const [signatureData, setSignatureData] = useState('');

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
    
    // Save complete inspection data
    const completeInspection = {
      driverName: driverInfo.name,
      driverId: driverInfo.id,
      startOfDay: startOfDayData,
      endOfDay: endOfDayData,
      signature: signature,
      submittedAt: new Date().toISOString(),
    };
    
    // Store in localStorage (in production, this would go to a database)
    const existingInspections = JSON.parse(localStorage.getItem('fleetcheck-inspections') || '[]');
    existingInspections.push(completeInspection);
    localStorage.setItem('fleetcheck-inspections', JSON.stringify(existingInspections));
    
    console.log('Inspection submitted:', completeInspection);
    setCurrentStep('success');
  };

  const handleNewInspection = () => {
    setCurrentStep('signin');
    setDriverInfo({ name: '', id: '' });
    setStartOfDayData(null);
    setEndOfDayData(null);
    setSignatureData('');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'signin':
        return <DriverSignIn onSignIn={handleSignIn} />;
      
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
      
      case 'success':
        return (
          <SubmissionSuccess 
            inspectionData={{ driverName: driverInfo.name, ...startOfDayData, ...endOfDayData }}
            onNewInspection={handleNewInspection} 
          />
        );
      
      default:
        return <DriverSignIn onSignIn={handleSignIn} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {currentStep !== 'signin' && <Header />}
      {renderCurrentStep()}
    </div>
  );
};

export default Index;
