import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, MapPin, FileText, Wrench, AlertTriangle } from 'lucide-react';

interface ReviewInspectionProps {
  driverInfo: { name: string; id: string };
  startOfDayData: any;
  endOfDayData: any;
  signatureData: string;
  onProceed: () => void;
  onBack: () => void;
}

const ReviewInspection: React.FC<ReviewInspectionProps> = ({
  driverInfo,
  startOfDayData,
  endOfDayData,
  signatureData,
  onProceed,
  onBack
}) => {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getEquipmentStatus = (equipment: any) => {
    if (!equipment) return [];
    return Object.entries(equipment).map(([key, value]) => ({
      name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      status: value === true ? 'Issues Found' : 'Good'
    }));
  };

  const startEquipmentItems = getEquipmentStatus(startOfDayData?.equipment || {});
  const endEquipmentItems = getEquipmentStatus(endOfDayData?.equipment || {});
  const hasStartIssues = startEquipmentItems.some(item => item.status === 'Issues Found');
  const hasEndIssues = endEquipmentItems.some(item => item.status === 'Issues Found');

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Review Your Inspection</h1>
          <p className="text-muted-foreground">
            Please review all the information below before submitting
          </p>
        </div>

        {/* Driver & Vehicle Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Driver & Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Driver Name</label>
                <p className="text-lg font-semibold">{driverInfo.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Driver ID</label>
                <p className="text-lg">{driverInfo.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Vehicle</label>
                <p className="text-lg font-semibold">
                  {startOfDayData?.selectedVehicle?.name} ({startOfDayData?.selectedVehicle?.plate_number})
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Department</label>
                <p className="text-lg">{startOfDayData?.selectedVehicle?.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time & Date Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Time & Mileage Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Inspection Date</label>
                <p className="text-lg">{formatDate(startOfDayData?.date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Start Time</label>
                <p className="text-lg">{formatTime(startOfDayData?.time)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">End Time</label>
                <p className="text-lg">{endOfDayData?.endTime ? formatTime(endOfDayData.endTime) : 'Not recorded'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Distance</label>
                <p className="text-lg">
                  {startOfDayData?.odometerStart} → {endOfDayData?.odometerEnd || 'Pending'} km
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              Equipment Status
              {(hasStartIssues || hasEndIssues) && (
                <Badge variant="destructive" className="ml-2">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Issues Found
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Start of Day Equipment */}
            <div>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground">Start of Day Equipment Inspection</h4>
              <div className="grid md:grid-cols-3 gap-3">
                {startEquipmentItems.map((item) => (
                  <div key={`start-${item.name}`} className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm font-medium">{item.name}</span>
                    <Badge 
                      variant={item.status === 'Good' ? 'default' : 'destructive'}
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* End of Day Equipment */}
            {endEquipmentItems.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 text-sm text-muted-foreground">End of Day Equipment Inspection</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  {endEquipmentItems.map((item) => (
                    <div key={`end-${item.name}`} className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="text-sm font-medium">{item.name}</span>
                      <Badge 
                        variant={item.status === 'Good' ? 'default' : 'destructive'}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes & Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Notes & Comments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {startOfDayData?.notes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Start of Day Notes</label>
                <p className="mt-1 p-3 bg-muted rounded-lg">{startOfDayData.notes}</p>
              </div>
            )}
            
            {endOfDayData?.notes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">End of Day Notes</label>
                <p className="mt-1 p-3 bg-muted rounded-lg">{endOfDayData.notes}</p>
              </div>
            )}
            
            {endOfDayData?.damageReport && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Damage Report</label>
                <p className="mt-1 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  {endOfDayData.damageReport}
                </p>
              </div>
            )}
            
            {endOfDayData?.comments && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Additional Comments</label>
                <p className="mt-1 p-3 bg-muted rounded-lg">{endOfDayData.comments}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signature Confirmation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Digital Signature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="default">
                <CheckCircle className="w-3 h-3 mr-1" />
                Signature Captured
              </Badge>
              <span className="text-sm text-muted-foreground">
                Driver signature has been recorded
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1"
          >
            Back to Edit
          </Button>
          <Button 
            onClick={onProceed}
            className="flex-1"
            size="lg"
          >
            Proceed to Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewInspection;