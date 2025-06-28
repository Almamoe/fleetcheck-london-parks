
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, UserCheck } from 'lucide-react';

interface Supervisor {
  id: string;
  name: string;
  email: string;
  department: string;
}

interface SupervisorManagerProps {
  onSupervisorSelect: (supervisor: Supervisor) => void;
  selectedSupervisor?: Supervisor;
}

const SupervisorManager = ({ onSupervisorSelect, selectedSupervisor }: SupervisorManagerProps) => {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSupervisor, setNewSupervisor] = useState({
    name: '',
    email: '',
    department: ''
  });

  useEffect(() => {
    // Load supervisors from localStorage
    const savedSupervisors = JSON.parse(localStorage.getItem('fleetcheck-supervisors') || '[]');
    if (savedSupervisors.length === 0) {
      // Add default supervisors
      const defaultSupervisors = [
        { id: '1', name: 'John Smith', email: 'j.smith@london.ca', department: 'Fleet Supervisor' },
        { id: '2', name: 'Sarah Johnson', email: 's.johnson@london.ca', department: 'Yard Supervisor' }
      ];
      setSupervisors(defaultSupervisors);
      localStorage.setItem('fleetcheck-supervisors', JSON.stringify(defaultSupervisors));
    } else {
      setSupervisors(savedSupervisors);
    }
  }, []);

  const addSupervisor = () => {
    if (newSupervisor.name && newSupervisor.email) {
      const supervisor: Supervisor = {
        id: Date.now().toString(),
        ...newSupervisor
      };
      const updated = [...supervisors, supervisor];
      setSupervisors(updated);
      localStorage.setItem('fleetcheck-supervisors', JSON.stringify(updated));
      setNewSupervisor({ name: '', email: '', department: '' });
      setShowAddForm(false);
    }
  };

  const deleteSupervisor = (id: string) => {
    const updated = supervisors.filter(s => s.id !== id);
    setSupervisors(updated);
    localStorage.setItem('fleetcheck-supervisors', JSON.stringify(updated));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0">
      <CardHeader className="text-center bg-emerald-700 text-white">
        <CardTitle className="text-xl flex items-center justify-center gap-2">
          <UserCheck size={24} />
          Select Supervisor
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {supervisors.map((supervisor) => (
            <div
              key={supervisor.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedSupervisor?.id === supervisor.id
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-slate-200 hover:border-emerald-300'
              }`}
              onClick={() => onSupervisorSelect(supervisor)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-slate-800">{supervisor.name}</h3>
                  <p className="text-sm text-slate-600">{supervisor.email}</p>
                  <p className="text-sm text-emerald-700">{supervisor.department}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSupervisor(supervisor.id);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}

          {showAddForm ? (
            <div className="p-4 border-2 border-dashed border-emerald-300 rounded-lg bg-emerald-50">
              <div className="space-y-3">
                <div>
                  <Label className="text-emerald-800">Name</Label>
                  <Input
                    value={newSupervisor.name}
                    onChange={(e) => setNewSupervisor(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter supervisor name"
                    className="border-emerald-300"
                  />
                </div>
                <div>
                  <Label className="text-emerald-800">Email</Label>
                  <Input
                    type="email"
                    value={newSupervisor.email}
                    onChange={(e) => setNewSupervisor(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                    className="border-emerald-300"
                  />
                </div>
                <div>
                  <Label className="text-emerald-800">Department</Label>
                  <Input
                    value={newSupervisor.department}
                    onChange={(e) => setNewSupervisor(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Enter department"
                    className="border-emerald-300"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addSupervisor} className="bg-emerald-700 hover:bg-emerald-800">
                    Add Supervisor
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowAddForm(true)}
              variant="outline"
              className="w-full border-2 border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <Plus size={20} />
              Add New Supervisor
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupervisorManager;
