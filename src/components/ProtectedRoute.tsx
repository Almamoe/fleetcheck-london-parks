
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <img
            src="/lovable-uploads/d06e4237-0209-4e8b-ab56-fa47f79f7ca5.png"
            alt="City of London"
            className="h-20 w-20 mx-auto mb-6"
          />
          <p className="text-emerald-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Always allow access - no authentication required
  return <>{children}</>;
};

export default ProtectedRoute;
