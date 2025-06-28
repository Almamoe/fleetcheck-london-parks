
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, startData });
  };

  const milesDriven = formData.odometerEnd && startData.odometerStart 
    ? parseInt(formData.odometerEnd) - parseInt(startData.odometerStart)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <Card className="max-w-2xl mx-auto shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-slate-800">End of Day Inspection</CardTitle>
          <p className="text-slate-600">Driver: <span className="font-semibold">{driverName}</span></p>
          <div className="flex justify-center gap-2 mt-2">
            <Badge variant="secondary">Started: {startData.time}</Badge>
            <Badge variant="secondary">Start ODO: {startData.odometerStart}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-medium text-slate-700">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="h-11"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="odometerEnd" className="text-sm font-medium text-slate-700">
                  Ending Odometer Reading
                </Label>
                <Input
                  id="odometerEnd"
                  type="number"
                  value={formData.odometerEnd}
                  onChange={(e) => setFormData(prev => ({ ...prev, odometerEnd: e.target.value }))}
                  placeholder="Enter ending odometer"
                  className="h-11 text-base"
                  required
                />
              </div>
            </div>

            {milesDriven > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 font-semibold">
                  Miles Driven Today: <span className="text-xl">{milesDriven}</span>
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Overall Equipment Condition
              </Label>
              <Select value={formData.equipmentCondition} onValueChange={(value) => setFormData(prev => ({ ...prev, equipmentCondition: value }))}>
                <SelectTrigger className="h-11">
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
              <Label htmlFor="damageReport" className="text-sm font-medium text-slate-700">
                Damage Report (if applicable)
              </Label>
              <Textarea
                id="damageReport"
                value={formData.damageReport}
                onChange={(e) => setFormData(prev => ({ ...prev, damageReport: e.target.value }))}
                placeholder="Describe any new damage, issues, or concerns..."
                className="min-h-24 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Photo Documentation
              </Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50">
                <p className="text-slate-600 mb-2">Tap to add photos of any damage</p>
                <Button type="button" variant="outline" className="mt-2">
                  📷 Add Photo
                </Button>
                <p className="text-xs text-slate-500 mt-2">Photos help supervisors assess damage quickly</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endNotes" className="text-sm font-medium text-slate-700">
                End of Day Notes
              </Label>
              <Textarea
                id="endNotes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional information about today's work or vehicle condition..."
                className="min-h-24 resize-none"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-green-600 hover:bg-green-700 text-white font-medium"
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
