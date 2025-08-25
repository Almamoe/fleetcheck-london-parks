
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Users, FileText, Plus, RefreshCw } from 'lucide-react';
import { getInspections } from '@/utils/supabaseOperations';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Dashboard = () => {
  const location = useLocation();
  const [inspections, setInspections] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Refresh data when coming from inspection submission
  useEffect(() => {
    if (location.state?.refreshDashboard) {
      loadDashboardData();
    }
  }, [location.state]);

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data from Supabase...');
      
      // Load inspections
      const inspectionsData = await getInspections();
      console.log('Loaded inspections:', inspectionsData?.length || 0, 'records');
      setInspections(inspectionsData || []);
      
      // Load vehicles
      const { data: vehiclesData } = await supabase
        .from('vehicles')
        .select('*');
      setVehicles(vehiclesData || []);
      
      // Load supervisors
      const { data: supervisorsData } = await supabase
        .from('supervisors')
        .select('*');
      setSupervisors(supervisorsData || []);
      
      console.log('Dashboard data loaded successfully');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      
      // Fallback to localStorage
      const localInspections = JSON.parse(localStorage.getItem('fleetcheck-inspections') || '[]');
      const localVehicles = JSON.parse(localStorage.getItem('fleetcheck-vehicles') || '[]');
      const localSupervisors = JSON.parse(localStorage.getItem('fleetcheck-supervisors') || '[]');
      
      setInspections(localInspections.slice(-5));
      setVehicles(localVehicles);
      setSupervisors(localSupervisors);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    toast.info('Refreshing dashboard data...');
    await loadDashboardData();
    toast.success('Dashboard data refreshed!');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-emerald-300 text-emerald-700"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link to="/inspection">
            <Button className="bg-emerald-700 hover:bg-emerald-800">
              <Plus className="mr-2 h-4 w-4" />
              New Inspection
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{vehicles.length}</div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Supervisors</CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{supervisors.length}</div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Inspections</CardTitle>
            <FileText className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{inspections.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Recent Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          {inspections.length > 0 ? (
            <div className="space-y-3">
              {inspections.slice(-5).map((inspection: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">
                      {inspection.drivers?.name || inspection.driverName || 'Unknown Driver'}
                    </p>
                    <p className="text-sm text-slate-600">
                      {inspection.inspection_date ? 
                        new Date(inspection.inspection_date).toLocaleDateString() :
                        inspection.submittedAt ? new Date(inspection.submittedAt).toLocaleDateString() : 'Unknown Date'
                      }
                    </p>
                    {inspection.vehicles && (
                      <p className="text-xs text-slate-500">
                        Vehicle: {inspection.vehicles.name} ({inspection.vehicles.plate_number})
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-emerald-700">
                    Sent to: {inspection.supervisors?.name || inspection.supervisor?.name || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">No inspections completed yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
