
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, Eye, Clock } from 'lucide-react';

interface Inspection {
  driverName: string;
  driverId: string;
  startOfDay: any;
  endOfDay: any;
  signature: string;
  supervisor: any;
  submittedAt: string;
  editRequested?: boolean;
  editApproved?: boolean;
}

const InspectionHistory = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);

  useEffect(() => {
    const savedInspections = JSON.parse(localStorage.getItem('fleetcheck-inspections') || '[]');
    setInspections(savedInspections);
  }, []);

  const handleRequestEdit = (index: number) => {
    const updatedInspections = [...inspections];
    updatedInspections[index].editRequested = true;
    setInspections(updatedInspections);
    localStorage.setItem('fleetcheck-inspections', JSON.stringify(updatedInspections));
    alert('Edit request sent to supervisor for approval.');
  };

  const handleViewDetails = (inspection: Inspection) => {
    setSelectedInspection(inspection);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Inspection History</h1>
      </div>

      {selectedInspection ? (
        <Card className="border-emerald-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-slate-800">Inspection Details</CardTitle>
              <Button 
                variant="outline" 
                onClick={() => setSelectedInspection(null)}
                className="border-emerald-300 text-emerald-700"
              >
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Driver Information</h3>
                <p><span className="font-medium">Name:</span> {selectedInspection.driverName}</p>
                <p><span className="font-medium">ID:</span> {selectedInspection.driverId}</p>
                <p><span className="font-medium">Date:</span> {new Date(selectedInspection.submittedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Supervisor</h3>
                <p><span className="font-medium">Name:</span> {selectedInspection.supervisor?.name}</p>
                <p><span className="font-medium">Email:</span> {selectedInspection.supervisor?.email}</p>
              </div>
            </div>
            
            {selectedInspection.startOfDay && (
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Start of Day</h3>
                <p><span className="font-medium">Odometer:</span> {selectedInspection.startOfDay.odometer}</p>
                <p><span className="font-medium">Notes:</span> {selectedInspection.startOfDay.notes || 'None'}</p>
              </div>
            )}
            
            {selectedInspection.endOfDay && (
              <div>
                <h3 className="font-medium text-slate-800 mb-2">End of Day</h3>
                <p><span className="font-medium">Final Odometer:</span> {selectedInspection.endOfDay.finalOdometer}</p>
                <p><span className="font-medium">Notes:</span> {selectedInspection.endOfDay.notes || 'None'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inspections.length > 0 ? (
            inspections.map((inspection, index) => (
              <Card key={index} className="border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-emerald-600" />
                      <div>
                        <h3 className="font-medium text-slate-800">
                          Inspection by {inspection.driverName}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {new Date(inspection.submittedAt).toLocaleDateString()} - 
                          Sent to: {inspection.supervisor?.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {inspection.editRequested && !inspection.editApproved && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Edit Pending
                        </Badge>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(inspection)}
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      
                      {!inspection.editRequested && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRequestEdit(index)}
                          className="border-orange-300 text-orange-700 hover:bg-orange-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Request Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-emerald-200">
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
                <p className="text-slate-600">No inspections found.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default InspectionHistory;
