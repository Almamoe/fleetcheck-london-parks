
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck, Plus, Trash2 } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  plateNumber: string;
  department: string;
}

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    type: '',
    plateNumber: '',
    department: 'Parks & Recreation'
  });

  useEffect(() => {
    const savedVehicles = JSON.parse(localStorage.getItem('fleetcheck-vehicles') || '[]');
    setVehicles(savedVehicles);
  }, []);

  const saveVehicles = (updatedVehicles: Vehicle[]) => {
    setVehicles(updatedVehicles);
    localStorage.setItem('fleetcheck-vehicles', JSON.stringify(updatedVehicles));
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVehicle.name && newVehicle.type && newVehicle.plateNumber) {
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        ...newVehicle
      };
      const updatedVehicles = [...vehicles, vehicle];
      saveVehicles(updatedVehicles);
      setNewVehicle({ name: '', type: '', plateNumber: '', department: 'Parks & Recreation' });
      setShowAddForm(false);
    }
  };

  const handleDeleteVehicle = (id: string) => {
    const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== id);
    saveVehicles(updatedVehicles);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Vehicle Management</h1>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Add New Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-emerald-800">Vehicle Name</Label>
                  <Input
                    id="name"
                    value={newVehicle.name}
                    onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                    placeholder="e.g., Truck 001"
                    className="border-emerald-300 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-emerald-800">Vehicle Type</Label>
                  <Input
                    id="type"
                    value={newVehicle.type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                    placeholder="e.g., Pickup Truck, Snow Plow"
                    className="border-emerald-300 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="plateNumber" className="text-emerald-800">Plate Number</Label>
                  <Input
                    id="plateNumber"
                    value={newVehicle.plateNumber}
                    onChange={(e) => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })}
                    placeholder="e.g., ABC-123"
                    className="border-emerald-300 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department" className="text-emerald-800">Department</Label>
                  <Input
                    id="department"
                    value={newVehicle.department}
                    onChange={(e) => setNewVehicle({ ...newVehicle, department: e.target.value })}
                    className="border-emerald-300 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">
                  Add Vehicle
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-lg text-slate-800">{vehicle.name}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteVehicle(vehicle.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium text-slate-600">Type:</span> {vehicle.type}</p>
                <p><span className="font-medium text-slate-600">Plate:</span> {vehicle.plateNumber}</p>
                <p><span className="font-medium text-slate-600">Department:</span> {vehicle.department}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vehicles.length === 0 && !showAddForm && (
        <Card className="border-emerald-200">
          <CardContent className="text-center py-12">
            <Truck className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No vehicles added yet.</p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Vehicle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Vehicles;
