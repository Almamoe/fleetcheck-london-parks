
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-emerald-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b">
            <SidebarTrigger className="text-slate-600" />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  src="/lovable-uploads/d06e4237-0209-4e8b-ab56-fa47f79f7ca5.png"
                  alt="City of London"
                  className="h-8 w-8"
                />
                <span className="text-emerald-800 font-semibold">FleetCheck Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">{user?.email}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-slate-600 hover:text-slate-800"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
