
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface EndOfDayFormProps {
  driverName: string;
  startData: any;
  onSubmit: (data: any) => void;
}

const EndOfDayForm = ({ driverName, startData, onSubmit }: EndOfDayFormProps) => {
  const [formData, setFormData] = useState({
    endTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
    odometerEnd: '',
    equipmentCondition: 'good',
    damageReport: '',
    hasPhoto: false,
    notes: '',
    equipment: {
      tires: false,
      lights: false,
      brakes: false,
      mirrors: false,
      seatBelts: false,
      horn: false,
      windshieldWipers: false,
      fluidLeaks: false,
      bodyDamage: false,
      engineIssues: false,
      brakePedal: false,
      steeringWheel: false,
    },
  });

  const equipmentItems = [
    { key: 'tires', label: 'Tires (damage, wear, pressure)' },
    { key: 'lights', label: 'Lights (headlights, taillights, turn signals)' },
    { key: 'brakes', label: 'Brakes (performance issues)' },
    { key: 'mirrors', label: 'Mirrors (damage, visibility)' },
    { key: 'seatBelts', label: 'Seat belts (functionality)' },
    { key: 'horn', label: 'Horn (working properly)' },
    { key: 'windshieldWipers', label: 'Windshield wipers' },
    { key: 'fluidLeaks', label: 'Fluid leaks' },
    { key: 'bodyDamage', label: 'Body damage' },
    { key: 'engineIssues', label: 'Engine issues' },
    { key: 'brakePedal', label: 'Brake pedal (soft, hard, vibration)' },
    { key: 'steeringWheel', label: 'Steering wheel (looseness, vibration)' },
  ];

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
    onSubmit({ ...formData, startData });
  };

  const kmDriven = formData.odometerEnd && startData.odometerStart 
    ? parseInt(formData.odometerEnd) - parseInt(startData.odometerStart)
    : 0;

  return (
    <div className="min-h-screen bg-emerald-50 p-4">
      <Card className="max-w-2xl mx-auto shadow-xl border-0">
        <CardHeader className="text-center bg-emerald-700 text-white">
          <CardTitle className="text-2xl">End of Day Inspection</CardTitle>
          <p className="text-emerald-100">Driver: <span className="font-semibold">{driverName}</span></p>
          <div className="flex justify-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Started: {startData.time}</Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Start ODO: {startData.odometerStart}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-medium text-emerald-800">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="h-11 border-emerald-300 focus:border-emerald-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="odometerEnd" className="text-sm font-medium text-emerald-800">
                  Ending Odometer Reading (km)
                </Label>
                <Input
                  id="odometerEnd"
                  type="number"
                  value={formData.odometerEnd}
                  onChange={(e) => setFormData(prev => ({ ...prev, odometerEnd: e.target.value }))}
                  placeholder="Enter ending odometer"
                  className="h-11 text-base border-emerald-300 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {kmDriven > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 font-semibold">
                  Km Driven Today: <span className="text-xl">{kmDriven}</span>
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="border border-emerald-200 rounded-lg p-4 bg-red-50">
                <Label className="text-base font-semibold text-emerald-800 mb-3 block">
                  End of Day Equipment Inspection
                </Label>
                <p className="text-sm text-emerald-600 mb-4">
                  Check any items that have issues or problems:
                </p>
               
                <div className="grid grid-cols-2 gap-4">
                  {equipmentItems.map((item) => (
                    <div key={item.key} className="flex items-center space-x-3">
                      <Checkbox
                        id={item.key}
                        checked={formData.equipment[item.key as keyof typeof formData.equipment]}
                        onCheckedChange={(checked) => handleEquipmentChange(item.key, checked as boolean)}
                        className="h-5 w-5 border-red-400 data-[state=checked]:bg-red-600"
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
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-emerald-800">
                Overall Equipment Condition
              </Label>
              <Select value={formData.equipmentCondition} onValueChange={(value) => setFormData(prev => ({ ...prev, equipmentCondition: value }))}>
                <SelectTrigger className="h-11 border-emerald-300 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent - No issues</SelectItem>
                  <SelectItem value="good">Good - Minor wear</SelectItem>
                  <SelectItem value="fair">Fair - Some maintenance needed</SelectItem>
                  <SelectItem value="poor">Poor - Requires immediate attention</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="damageReport" className="text-sm font-medium text-emerald-800">
                Damage Report (if applicable)
              </Label>
              <Textarea
                id="damageReport"
                value={formData.damageReport}
                onChange={(e) => setFormData(prev => ({ ...prev, damageReport: e.target.value }))}
                placeholder="Describe any new damage, issues, or concerns..."
                className="min-h-24 resize-none border-emerald-300 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-emerald-800">
                Photo Documentation
              </Label>
              <div className="border-2 border-dashed border-emerald-300 rounded-lg p-6 text-center bg-emerald-50">
                <p className="text-emerald-700 mb-2">Tap to add photos of any damage</p>
                <Button type="button" variant="outline" className="mt-2 border-emerald-600 text-emerald-700 hover:bg-emerald-100">
                  📷 Add Photo
                </Button>
                <p className="text-xs text-emerald-600 mt-2">Photos help supervisors assess damage quickly</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endNotes" className="text-sm font-medium text-emerald-800">
                End of Day Notes
              </Label>
              <Textarea
                id="endNotes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional information about today's work or vehicle condition..."
                className="min-h-24 resize-none border-emerald-300 focus:border-emerald-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
            >
              Complete End of Day Inspection
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EndOfDayForm;
