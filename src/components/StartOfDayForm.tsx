
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface StartOfDayFormProps {
  driverName: string;
  onSubmit: (data: any) => void;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
  plateNumber: string;
  department: string;
}

const StartOfDayForm = ({ driverName, onSubmit }: StartOfDayFormProps) => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    vehicleId: '',
    vehicleName: '',
    odometerStart: '',
    notes: '',
    equipment: {
      headlights: false,
      taillights: false,
      turnSignals: false,
      brakes: false,
      tires: false,
      mirrors: false,
      windshield: false,
      horn: false,
      seatbelt: false,
      plow: false,
      trailer: false,
      hydraulics: false,
    }
  });

  useEffect(() => {
    const savedVehicles = JSON.parse(localStorage.getItem('fleetcheck-vehicles') || '[]');
    setVehicles(savedVehicles);
  }, []);

  const handleVehicleSelect = (vehicleId: string) => {
    if (vehicleId === 'add-new') {
      navigate('/vehicles');
      return;
    }
    
    const selectedVehicle = vehicles.find(v => v.id === vehicleId);
    setFormData(prev => ({
      ...prev,
      vehicleId: vehicleId,
      vehicleName: selectedVehicle ? `${selectedVehicle.name} (${selectedVehicle.plateNumber})` : ''
    }));
  };

  const handleEquipmentChange = (item: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [item]: checked
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId) {
      alert('Please select a vehicle before continuing.');
      return;
    }
    onSubmit(formData);
  };

  const equipmentItems = [
    { key: 'headlights', label: 'Headlights' },
    { key: 'taillights', label: 'Taillights' },
    { key: 'turnSignals', label: 'Turn Signals' },
    { key: 'brakes', label: 'Brakes' },
    { key: 'tires', label: 'Tires' },
    { key: 'mirrors', label: 'Mirrors' },
    { key: 'windshield', label: 'Windshield' },
    { key: 'horn', label: 'Horn' },
    { key: 'seatbelt', label: 'Seatbelt' },
    { key: 'plow', label: 'Plow (if equipped)' },
    { key: 'trailer', label: 'Trailer (if equipped)' },
    { key: 'hydraulics', label: 'Hydraulics' },
  ];

  return (
    <div className="min-h-screen bg-emerald-50 p-4">
      <Card className="max-w-2xl mx-auto shadow-xl border-0">
        <CardHeader className="text-center bg-emerald-700 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Start of Day Inspection</CardTitle>
          <p className="text-emerald-100">Driver: <span className="font-semibold">{driverName}</span></p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-emerald-800">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="h-11 border-emerald-300 focus:border-emerald-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium text-emerald-800">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="h-11 border-emerald-300 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle" className="text-sm font-medium text-emerald-800">
                Select Vehicle
              </Label>
              <Select onValueChange={handleVehicleSelect} required>
                <SelectTrigger className="h-11 border-emerald-300 focus:border-emerald-500">
                  <SelectValue placeholder="Choose a vehicle..." />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} - {vehicle.plateNumber} ({vehicle.type})
                    </SelectItem>
                  ))}
                  <SelectItem value="add-new" className="text-emerald-700 font-medium">
                    <div className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Vehicle
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="odometerStart" className="text-sm font-medium text-emerald-800">
                Starting Odometer Reading
              </Label>
              <Input
                id="odometerStart"
                type="number"
                value={formData.odometerStart}
                onChange={(e) => setFormData(prev => ({ ...prev, odometerStart: e.target.value }))}
                placeholder="Enter odometer reading"
                className="h-11 text-base border-emerald-300 focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold text-emerald-800">Equipment Inspection</Label>
              <p className="text-sm text-emerald-700">Check all items that are in good working condition:</p>
              
              <div className="grid grid-cols-2 gap-4">
                {equipmentItems.map((item) => (
                  <div key={item.key} className="flex items-center space-x-3">
                    <Checkbox
                      id={item.key}
                      checked={formData.equipment[item.key as keyof typeof formData.equipment]}
                      onCheckedChange={(checked) => handleEquipmentChange(item.key, checked as boolean)}
                      className="h-5 w-5 border-emerald-400 data-[state=checked]:bg-emerald-600"
                    />
                    <Label 
                      htmlFor={item.key} 
                      className="text-sm font-medium cursor-pointer select-none text-emerald-800"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-emerald-800">
                Notes (Issues, Concerns, or Additional Information)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter any issues, concerns, or additional information about the vehicle..."
                className="min-h-24 resize-none border-emerald-300 focus:border-emerald-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
            >
              Complete Start of Day Inspection
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartOfDayForm;
