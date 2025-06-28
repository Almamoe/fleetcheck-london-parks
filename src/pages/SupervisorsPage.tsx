
import React from 'react';
import SupervisorManager from '@/components/SupervisorManager';

const SupervisorsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Supervisor Management</h1>
      <SupervisorManager showTitle={false} />
    </div>
  );
};

export default SupervisorsPage;
