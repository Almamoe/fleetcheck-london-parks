
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StartOfDayFormProps {
  driverName: string;
  onSubmit: (data: any) => void;
}

const StartOfDayForm = ({ driverName, onSubmit }: StartOfDayFormProps) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
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
    <div className="min-h-screen bg-slate-50 p-4">
      <Card className="max-w-2xl mx-auto shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-slate-800">Start of Day Inspection</CardTitle>
          <p className="text-slate-600">Driver: <span className="font-semibold">{driverName}</span></p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-slate-700">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="h-11"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium text-slate-700">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="odometerStart" className="text-sm font-medium text-slate-700">
                Starting Odometer Reading
              </Label>
              <Input
                id="odometerStart"
                type="number"
                value={formData.odometerStart}
                onChange={(e) => setFormData(prev => ({ ...prev, odometerStart: e.target.value }))}
                placeholder="Enter odometer reading"
                className="h-11 text-base"
                required
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold text-slate-800">Equipment Inspection</Label>
              <p className="text-sm text-slate-600">Check all items that are in good working condition:</p>
              
              <div className="grid grid-cols-2 gap-4">
                {equipmentItems.map((item) => (
                  <div key={item.key} className="flex items-center space-x-3">
                    <Checkbox
                      id={item.key}
                      checked={formData.equipment[item.key as keyof typeof formData.equipment]}
                      onCheckedChange={(checked) => handleEquipmentChange(item.key, checked as boolean)}
                      className="h-5 w-5"
                    />
                    <Label 
                      htmlFor={item.key} 
                      className="text-sm font-medium cursor-pointer select-none"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                Notes (Issues, Concerns, or Additional Information)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter any issues, concerns, or additional information about the vehicle..."
                className="min-h-24 resize-none"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-amber-600 hover:bg-amber-700 text-white font-medium"
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
