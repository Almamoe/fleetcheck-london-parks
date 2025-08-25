
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, Eye, Clock } from 'lucide-react';
import { getInspections } from '@/utils/supabaseOperations';

interface Inspection {
  driverName?: string;
  driverId?: string;
  startOfDay?: any;
  endOfDay?: any;
  signature?: string;
  supervisor?: any;
  submittedAt?: string;
  editRequested?: boolean;
  editApproved?: boolean;
  // Supabase fields
  id?: string;
  supabaseId?: string;
  drivers?: { name: string };
  vehicles?: { name: string; plate_number: string };
  supervisors?: { name: string; email: string };
  inspection_date?: string;
  start_time?: string;
  end_time?: string;
  odometer_start?: number;
  odometer_end?: number;
  start_notes?: string;
  end_notes?: string;
  equipment_issues?: any;
  signature_data?: string;
  status?: string;
}

const InspectionHistory = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInspections();
  }, []);

  const loadInspections = async () => {
    try {
      console.log('Loading inspections from Supabase...');
      const supabaseInspections = await getInspections();
      
      // Also get localStorage inspections as fallback
      const localInspections = JSON.parse(localStorage.getItem('fleetcheck-inspections') || '[]');
      
      // Combine both sources, preferring Supabase data
      const allInspections = [...(supabaseInspections || []), ...localInspections];
      
      // Remove duplicates by checking supabaseId or comparing unique fields
      const uniqueInspections = allInspections.filter((inspection, index, self) => {
        return index === self.findIndex(i => 
          (i.supabaseId && inspection.supabaseId && i.supabaseId === inspection.supabaseId) ||
          (!i.supabaseId && !inspection.supabaseId && 
           i.submittedAt === inspection.submittedAt && 
           i.driverName === inspection.driverName)
        );
      });
      
      setInspections(uniqueInspections);
      console.log('Loaded inspections:', uniqueInspections.length);
    } catch (error) {
      console.error('Error loading inspections:', error);
      
      // Fallback to localStorage only
      const localInspections = JSON.parse(localStorage.getItem('fleetcheck-inspections') || '[]');
      setInspections(localInspections);
    } finally {
      setLoading(false);
    }
  };

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
                <p><span className="font-medium">Name:</span> {selectedInspection.drivers?.name || selectedInspection.driverName}</p>
                <p><span className="font-medium">ID:</span> {selectedInspection.driverId}</p>
                <p><span className="font-medium">Date:</span> {
                  selectedInspection.inspection_date ? 
                    new Date(selectedInspection.inspection_date).toLocaleDateString() :
                    selectedInspection.submittedAt ? new Date(selectedInspection.submittedAt).toLocaleDateString() : 'Unknown'
                }</p>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Supervisor</h3>
                <p><span className="font-medium">Name:</span> {selectedInspection.supervisors?.name || selectedInspection.supervisor?.name}</p>
                <p><span className="font-medium">Email:</span> {selectedInspection.supervisors?.email || selectedInspection.supervisor?.email}</p>
              </div>
              {selectedInspection.vehicles && (
                <div>
                  <h3 className="font-medium text-slate-800 mb-2">Vehicle Information</h3>
                  <p><span className="font-medium">Vehicle:</span> {selectedInspection.vehicles.name}</p>
                  <p><span className="font-medium">Plate:</span> {selectedInspection.vehicles.plate_number}</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-slate-800 mb-2">Inspection Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-medium">Start Odometer (km):</span> {selectedInspection.odometer_start || selectedInspection.startOfDay?.odometer || 'N/A'}</p>
                  <p><span className="font-medium">End Odometer (km):</span> {selectedInspection.odometer_end || selectedInspection.endOfDay?.finalOdometer || 'N/A'}</p>
                  <p><span className="font-medium">Start Time:</span> {selectedInspection.start_time || 'N/A'}</p>
                  <p><span className="font-medium">End Time:</span> {selectedInspection.end_time || 'N/A'}</p>
                </div>
                <div>
                  <p><span className="font-medium">Start Notes:</span> {selectedInspection.start_notes || selectedInspection.startOfDay?.notes || 'None'}</p>
                  <p><span className="font-medium">End Notes:</span> {selectedInspection.end_notes || selectedInspection.endOfDay?.notes || 'None'}</p>
                  <p><span className="font-medium">Status:</span> {selectedInspection.status || 'Completed'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <Card className="border-emerald-200">
              <CardContent className="text-center py-12">
                <p className="text-slate-600">Loading inspections...</p>
              </CardContent>
            </Card>
          ) : inspections.length > 0 ? (
            inspections.map((inspection, index) => (
              <Card key={index} className="border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-emerald-600" />
                      <div>
                        <h3 className="font-medium text-slate-800">
                          Inspection by {inspection.drivers?.name || inspection.driverName}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {inspection.inspection_date ? 
                            new Date(inspection.inspection_date).toLocaleDateString() :
                            new Date(inspection.submittedAt).toLocaleDateString()
                          } - 
                          Sent to: {inspection.supervisors?.name || inspection.supervisor?.name}
                        </p>
                        {inspection.vehicles && (
                          <p className="text-xs text-slate-500">
                            Vehicle: {inspection.vehicles.name} ({inspection.vehicles.plate_number})
                          </p>
                        )}
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
