
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Users, FileText, Plus } from 'lucide-react';

const Dashboard = () => {
  const recentInspections = JSON.parse(localStorage.getItem('fleetcheck-inspections') || '[]').slice(-5);
  const vehicles = JSON.parse(localStorage.getItem('fleetcheck-vehicles') || '[]');
  const supervisors = JSON.parse(localStorage.getItem('fleetcheck-supervisors') || '[]');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <Link to="/inspection">
          <Button className="bg-emerald-700 hover:bg-emerald-800">
            <Plus className="mr-2 h-4 w-4" />
            New Inspection
          </Button>
        </Link>
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
            <div className="text-2xl font-bold text-slate-800">{recentInspections.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Recent Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          {recentInspections.length > 0 ? (
            <div className="space-y-3">
              {recentInspections.map((inspection: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">{inspection.driverName}</p>
                    <p className="text-sm text-slate-600">
                      {new Date(inspection.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm text-emerald-700">
                    Sent to: {inspection.supervisor?.name || 'N/A'}
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
