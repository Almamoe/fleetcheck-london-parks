import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'supervisor' | 'driver' | 'user';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  department?: string;
  created_at: string;
  created_by?: string;
}

/**
 * Check if the current user has a specific role
 */
export const hasRole = async (role: AppRole): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', role)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking user role:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

/**
 * Check if the current user is an admin or supervisor
 */
export const isAdminOrSupervisor = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'supervisor']);

    if (error) {
      console.error('Error checking admin/supervisor role:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking admin/supervisor role:', error);
    return false;
  }
};

/**
 * Get all roles for the current user
 */
export const getUserRoles = async (): Promise<UserRole[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }
};

/**
 * Assign a role to a user (admin only)
 */
export const assignRole = async (
  userId: string, 
  role: AppRole, 
  department?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if current user is admin
    const isAdmin = await hasRole('admin');
    if (!isAdmin) {
      return { success: false, error: 'Only admins can assign roles' };
    }

    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role,
        department,
      });

    if (error) {
      console.error('Error assigning role:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error assigning role:', error);
    return { success: false, error: 'Failed to assign role' };
  }
};

/**
 * Remove a role from a user (admin only)
 */
export const removeRole = async (
  userId: string, 
  role: AppRole
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if current user is admin
    const isAdmin = await hasRole('admin');
    if (!isAdmin) {
      return { success: false, error: 'Only admins can remove roles' };
    }

    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (error) {
      console.error('Error removing role:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error removing role:', error);
    return { success: false, error: 'Failed to remove role' };
  }
};