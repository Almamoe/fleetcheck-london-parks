
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Users, Check, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { isAdminOrSupervisor, hasRole } from '@/utils/roleUtils';

interface Supervisor {
  id: string;
  name: string;
  email: string;
  department: string;
}

interface SupervisorManagerProps {
  onSupervisorSelect?: (supervisor: Supervisor) => void;
  selectedSupervisor?: Supervisor;
  showTitle?: boolean;
}

const SupervisorManager = ({ 
  onSupervisorSelect, 
  selectedSupervisor,
  showTitle = true 
}: SupervisorManagerProps) => {
  const { toast } = useToast();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [canManageSupervisors, setCanManageSupervisors] = useState(false);
  const [canViewSupervisors, setCanViewSupervisors] = useState(false);
  const [newSupervisor, setNewSupervisor] = useState({
    name: '',
    email: '',
    department: 'Parks & Recreation'
  });

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    if (canViewSupervisors) {
      loadSupervisors();
    } else {
      setLoading(false);
    }
  }, [canViewSupervisors]);

  const checkPermissions = async () => {
    try {
      const [isAdminResult, canView] = await Promise.all([
        hasRole('admin'),
        isAdminOrSupervisor()
      ]);
      
      setCanManageSupervisors(true); // Allow public access to manage supervisors
      setCanViewSupervisors(true); // Allow public access to view supervisors for inspection submissions
    } catch (error) {
      console.error('Error checking permissions:', error);
      setCanManageSupervisors(true); // Allow public access even if permission check fails
      setCanViewSupervisors(true); // Allow public access even if permission check fails
    }
  };

  const loadSupervisors = async () => {
    try {
      console.log('Loading supervisors from Supabase...');
      setLoading(true);
      
      const { data, error } = await supabase
        .from('supervisors')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading supervisors from Supabase:', error);
        toast({
          title: "Database Error",
          description: "Failed to load supervisors from database. Please try refreshing the page.",
          variant: "destructive",
        });
        
        // Fallback to localStorage if Supabase fails
        const savedSupervisors = JSON.parse(localStorage.getItem('fleetcheck-supervisors') || '[]');
        setSupervisors(savedSupervisors);
      } else {
        console.log('Loaded supervisors from Supabase:', data);
        setSupervisors(data || []);
        
        // Also save to localStorage as backup
        if (data && data.length > 0) {
          localStorage.setItem('fleetcheck-supervisors', JSON.stringify(data));
        }
      }
    } catch (error) {
      console.error('Error loading supervisors:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to database. Please check your connection.",
        variant: "destructive",
      });
      
      // Fallback to localStorage
      const savedSupervisors = JSON.parse(localStorage.getItem('fleetcheck-supervisors') || '[]');
      setSupervisors(savedSupervisors);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupervisor.name || !newSupervisor.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Adding supervisor to Supabase:', newSupervisor);
      
      const { data, error } = await supabase
        .from('supervisors')
        .insert({
          name: newSupervisor.name,
          email: newSupervisor.email,
          department: newSupervisor.department
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding supervisor to Supabase:', error);
        toast({
          title: "Database Error",
          description: "Failed to add supervisor to database. Please try again.",
          variant: "destructive",
        });
        
        // Fallback to localStorage
        const supervisor: Supervisor = {
          id: Date.now().toString(),
          ...newSupervisor
        };
        const updatedSupervisors = [...supervisors, supervisor];
        setSupervisors(updatedSupervisors);
        localStorage.setItem('fleetcheck-supervisors', JSON.stringify(updatedSupervisors));
      } else {
        console.log('Added supervisor to Supabase:', data);
        const updatedSupervisors = [...supervisors, data];
        setSupervisors(updatedSupervisors);
        
        // Also update localStorage
        localStorage.setItem('fleetcheck-supervisors', JSON.stringify(updatedSupervisors));
        
        toast({
          title: "Success",
          description: "Supervisor added successfully.",
        });
      }
      
      setNewSupervisor({ name: '', email: '', department: 'Parks & Recreation' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding supervisor:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to database. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSupervisor = async (id: string) => {
    try {
      console.log('Deleting supervisor from Supabase:', id);
      
      const { error } = await supabase
        .from('supervisors')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting supervisor from Supabase:', error);
        toast({
          title: "Database Error",
          description: "Failed to delete supervisor from database. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('Deleted supervisor from Supabase');
        toast({
          title: "Success",
          description: "Supervisor deleted successfully.",
        });
      }
      
      // Update local state regardless of Supabase success/failure
      const updatedSupervisors = supervisors.filter(supervisor => supervisor.id !== id);
      setSupervisors(updatedSupervisors);
      localStorage.setItem('fleetcheck-supervisors', JSON.stringify(updatedSupervisors));
    } catch (error) {
      console.error('Error deleting supervisor:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to database. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {showTitle && (
          <h2 className="text-2xl font-bold text-slate-800">Available Supervisors</h2>
        )}
        <div className="text-center py-8">
          <p className="text-slate-600">Loading supervisors...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user doesn't have permission to view supervisors
  if (!canViewSupervisors) {
    return (
      <div className="space-y-6">
        {showTitle && (
          <h2 className="text-2xl font-bold text-slate-800">Available Supervisors</h2>
        )}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="text-center py-12">
            <Lock className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-orange-800 mb-2">Access Restricted</h3>
            <p className="text-orange-600">
              You need admin or supervisor privileges to view supervisor information.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTitle && canManageSupervisors && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Available Supervisors</h2>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-700 hover:bg-emerald-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Supervisor
          </Button>
        </div>
      )}

      {showTitle && !canManageSupervisors && (
        <h2 className="text-2xl font-bold text-slate-800">Available Supervisors</h2>
      )}

      {!showTitle && canManageSupervisors && (
        <div className="flex justify-end">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-700 hover:bg-emerald-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Supervisor
          </Button>
        </div>
      )}

      {showAddForm && canManageSupervisors && (
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Add New Supervisor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSupervisor} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-emerald-800">Full Name</Label>
                  <Input
                    id="name"
                    value={newSupervisor.name}
                    onChange={(e) => setNewSupervisor({ ...newSupervisor, name: e.target.value })}
                    placeholder="e.g., John Smith"
                    className="border-emerald-300 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-emerald-800">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newSupervisor.email}
                    onChange={(e) => setNewSupervisor({ ...newSupervisor, email: e.target.value })}
                    placeholder="e.g., john.smith@london.ca"
                    className="border-emerald-300 focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="department" className="text-emerald-800">Department</Label>
                  <Input
                    id="department"
                    value={newSupervisor.department}
                    onChange={(e) => setNewSupervisor({ ...newSupervisor, department: e.target.value })}
                    className="border-emerald-300 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">
                  Add Supervisor
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

      <div className="grid grid-cols-1 gap-4">
        {supervisors.map((supervisor) => (
          <Card 
            key={supervisor.id} 
            className={`border-emerald-200 cursor-pointer transition-all ${
              selectedSupervisor?.id === supervisor.id 
                ? 'ring-2 ring-emerald-500 bg-emerald-50' 
                : 'hover:bg-emerald-50'
            }`}
            onClick={() => onSupervisorSelect?.(supervisor)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-emerald-600" />
                  <div>
                    <h3 className="font-medium text-slate-800">{supervisor.name}</h3>
                    <p className="text-sm text-slate-600">{supervisor.email}</p>
                    <Badge variant="secondary" className="mt-1 bg-emerald-100 text-emerald-800">
                      {supervisor.department}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {selectedSupervisor?.id === supervisor.id && (
                    <Check className="h-5 w-5 text-emerald-600" />
                  )}
                  {!onSupervisorSelect && canManageSupervisors && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSupervisor(supervisor.id);
                      }}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {supervisors.length === 0 && !showAddForm && canManageSupervisors && (
        <Card className="border-emerald-200">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No supervisors added yet.</p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Supervisor
            </Button>
          </CardContent>
        </Card>
      )}

      {supervisors.length === 0 && !canManageSupervisors && (
        <Card className="border-emerald-200">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
            <p className="text-slate-600">No supervisors available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupervisorManager;
