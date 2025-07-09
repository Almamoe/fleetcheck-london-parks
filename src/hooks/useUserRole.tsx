
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'user';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.email) {
        setRole('user');
        setLoading(false);
        return;
      }

      // Check if user email is in the approved admins list
      const { data, error } = await supabase
        .from('admin_users')
        .select('email, role')
        .eq('email', user.email)
        .eq('approved', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      } else {
        // Ensure we only set valid UserRole values
        const userRole = data?.role === 'admin' ? 'admin' : 'user';
        setRole(userRole);
      }
      
      setLoading(false);
    };

    fetchUserRole();
  }, [user?.email]);

  return { role, loading, isAdmin: role === 'admin' };
};
