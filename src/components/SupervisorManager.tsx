
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Users, Check } from 'lucide-react';

interface Supervisor {
  id: string;
  name: string;
  email: string;
  department: string;
}

interface SupervisorManagerProps {
  onSupervisorSelect?: (supervisor: Supervisor) => void;
  selectedSupervisor?: Supervisor;
  showTitle?: boolean;
}

const SupervisorManager = ({ 
  onSupervisorSelect, 
  selectedSupervisor,
  showTitle = true 
}: SupervisorManagerProps) => {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSupervisor, setNewSupervisor] = useState({
    name: '',
    email: '',
    department: 'Parks & Recreation'
  });

  useEffect(() => {
    const savedSupervisors = JSON.parse(localStorage.getItem('fleetcheck-supervisors') || '[]');
    setSupervisors(savedSupervisors);
  }, []);

  const saveSupervisors = (updatedSupervisors: Supervisor[]) => {
    setSupervisors(updatedSupervisors);
    localStorage.setItem('fleetcheck-supervisors', JSON.stringify(updatedSupervisors));
  };

  const handleAddSupervisor = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSupervisor.name && newSupervisor.email) {
      const supervisor: Supervisor = {
        id: Date.now().toString(),
        ...newSupervisor
      };
      const updatedSupervisors = [...supervisors, supervisor];
      saveSupervisors(updatedSupervisors);
      setNewSupervisor({ name: '', email: '', department: 'Parks & Recreation' });
      setShowAddForm(false);
    }
  };

  const handleDeleteSupervisor = (id: string) => {
    const updatedSupervisors = supervisors.filter(supervisor => supervisor.id !== id);
    saveSupervisors(updatedSupervisors);
  };

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Available Supervisors</h2>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-700 hover:bg-emerald-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Supervisor
          </Button>
        </div>
      )}

      {!showTitle && (
        <div className="flex justify-end">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-700 hover:bg-emerald-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Supervisor
          </Button>
        </div>
      )}

      {showAddForm && (
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Add New Supervisor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSupervisor} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-emerald-800">Full Name</Label>
                  <Input
                    id="name"
                    value={newSupervisor.name}
                    onChange={(e) => setNewSupervisor({ ...newSupervisor, name: e.target.value })}
                    placeholder="e.g., John Smith"
                    className="border-emerald-300 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-emerald-800">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newSupervisor.email}
                    onChange={(e) => setNewSupervisor({ ...newSupervisor, email: e.target.value })}
                    placeholder="e.g., john.smith@london.ca"
                    className="border-emerald-300 focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="department" className="text-emerald-800">Department</Label>
                  <Input
                    id="department"
                    value={newSupervisor.department}
                    onChange={(e) => setNewSupervisor({ ...newSupervisor, department: e.target.value })}
                    className="border-emerald-300 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">
                  Add Supervisor
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {supervisors.map((supervisor) => (
          <Card 
            key={supervisor.id} 
            className={`border-emerald-200 cursor-pointer transition-all ${
              selectedSupervisor?.id === supervisor.id 
                ? 'ring-2 ring-emerald-500 bg-emerald-50' 
                : 'hover:bg-emerald-50'
            }`}
            onClick={() => onSupervisorSelect?.(supervisor)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-emerald-600" />
                  <div>
                    <h3 className="font-medium text-slate-800">{supervisor.name}</h3>
                    <p className="text-sm text-slate-600">{supervisor.email}</p>
                    <Badge variant="secondary" className="mt-1 bg-emerald-100 text-emerald-800">
                      {supervisor.department}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {selectedSupervisor?.id === supervisor.id && (
                    <Check className="h-5 w-5 text-emerald-600" />
                  )}
                  {!onSupervisorSelect && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSupervisor(supervisor.id);
                      }}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {supervisors.length === 0 && !showAddForm && (
        <Card className="border-emerald-200">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No supervisors added yet.</p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Supervisor
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupervisorManager;
