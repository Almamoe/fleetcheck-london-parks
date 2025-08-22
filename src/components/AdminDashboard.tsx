import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Users, UserCheck, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { hasRole, assignRole, removeRole, getUserRoles, type AppRole, type UserRole } from '@/utils/roleUtils';

interface UserData {
  id: string;
  email: string;
  created_at: string;
  roles: UserRole[];
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newRoleUserId, setNewRoleUserId] = useState('');
  const [newRole, setNewRole] = useState<AppRole>('user');
  const [newDepartment, setNewDepartment] = useState('');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const checkAdminAccess = async () => {
    try {
      const adminAccess = await hasRole('admin');
      setIsAdmin(adminAccess);
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Note: We can't directly access auth.users table from the client
      // This is a limitation - in a real application, you'd need an admin-only Edge Function
      // For now, we'll only show users who have roles assigned
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role,
          department,
          created_at,
          created_by
        `);

      if (error) {
        throw error;
      }

      // Group roles by user_id
      const usersMap = new Map<string, UserData>();
      
      userRoles?.forEach(role => {
        if (!usersMap.has(role.user_id)) {
          usersMap.set(role.user_id, {
            id: role.user_id,
            email: `User ${role.user_id.slice(0, 8)}...`, // We can't get email from auth.users
            created_at: role.created_at,
            roles: []
          });
        }
        usersMap.get(role.user_id)?.roles.push(role);
      });

      setUsers(Array.from(usersMap.values()));
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!newRoleUserId || !newRole) {
      toast({
        title: "Missing Information",
        description: "Please select a user and role.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await assignRole(newRoleUserId, newRole, newDepartment || undefined);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Role assigned successfully.",
        });
        
        // Refresh the users list
        await loadUsers();
        
        // Reset form
        setNewRoleUserId('');
        setNewRole('user');
        setNewDepartment('');
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to assign role.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "Failed to assign role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveRole = async (userId: string, role: AppRole) => {
    try {
      const result = await removeRole(userId, role);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Role removed successfully.",
        });
        
        // Refresh the users list
        await loadUsers();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to remove role.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: "Failed to remove role. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
        <div className="text-center py-8">
          <p className="text-slate-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-orange-800 mb-2">Admin Access Required</h3>
            <p className="text-orange-600">
              You need admin privileges to access user management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
      </div>

      {/* Add Role Form */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Assign Role to User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="userId" className="text-emerald-800">User ID</Label>
                <Input
                  id="userId"
                  value={newRoleUserId}
                  onChange={(e) => setNewRoleUserId(e.target.value)}
                  placeholder="Enter user ID"
                  className="border-emerald-300 focus:border-emerald-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Note: You can get user ID from Supabase Auth dashboard
                </p>
              </div>
              <div>
                <Label htmlFor="role" className="text-emerald-800">Role</Label>
                <Select value={newRole} onValueChange={(value: AppRole) => setNewRole(value)}>
                  <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department" className="text-emerald-800">Department (Optional)</Label>
                <Input
                  id="department"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="e.g., Parks & Recreation"
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAssignRole}
                  className="bg-emerald-700 hover:bg-emerald-800 w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Assign Role
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-8 w-8 text-emerald-600" />
                  <div>
                    <h3 className="font-medium text-slate-800">{user.email}</h3>
                    <p className="text-sm text-slate-600">User ID: {user.id}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.roles.map((role) => (
                        <div key={`${user.id}-${role.role}`} className="flex items-center gap-1">
                          <Badge 
                            variant="secondary" 
                            className={`${
                              role.role === 'admin' ? 'bg-red-100 text-red-800' :
                              role.role === 'supervisor' ? 'bg-blue-100 text-blue-800' :
                              role.role === 'driver' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {role.role}
                            {role.department && ` (${role.department})`}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRole(user.id, role.role)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 h-5 w-5 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card className="border-emerald-200">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No users with roles found.</p>
            <p className="text-sm text-slate-500">
              Note: Only users with assigned roles are displayed here. To assign roles to new users, 
              get their user ID from the Supabase Auth dashboard and use the form above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;