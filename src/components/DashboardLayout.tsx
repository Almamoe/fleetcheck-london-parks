
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-emerald-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b">
            <SidebarTrigger className="text-slate-600" />
            <div className="flex items-center gap-2">
              <img
                src="/lovable-uploads/d06e4237-0209-4e8b-ab56-fa47f79f7ca5.png"
                alt="City of London"
                className="h-8 w-8"
              />
              <span className="text-emerald-800 font-semibold">FleetCheck Dashboard</span>
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
