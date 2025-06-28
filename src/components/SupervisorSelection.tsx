
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import SupervisorManager from './SupervisorManager';

interface Supervisor {
  id: string;
  name: string;
  email: string;
  department: string;
}

interface SupervisorSelectionProps {
  driverName: string;
  onSubmit: (supervisor: Supervisor) => void;
}

const SupervisorSelection = ({ driverName, onSubmit }: SupervisorSelectionProps) => {
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor>();

  const handleContinue = () => {
    if (selectedSupervisor) {
      onSubmit(selectedSupervisor);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Almost Done, {driverName}!
          </h1>
          <p className="text-slate-600">
            Select which supervisor should receive your inspection report
          </p>
        </div>

        <SupervisorManager
          onSupervisorSelect={setSelectedSupervisor}
          selectedSupervisor={selectedSupervisor}
        />

        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedSupervisor}
            className="h-12 px-8 text-base bg-emerald-700 hover:bg-emerald-800 text-white font-medium disabled:bg-slate-400"
          >
            Submit Inspection Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupervisorSelection;
