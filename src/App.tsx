
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import SupervisorsPage from "./pages/SupervisorsPage";
import InspectionHistory from "./pages/InspectionHistory";
import { DashboardLayout } from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<Index />} />
          <Route path="/inspection" element={<Index />} />
          <Route path="/dashboard" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/vehicles" element={
            <DashboardLayout>
              <Vehicles />
            </DashboardLayout>
          } />
          <Route path="/supervisors" element={
            <DashboardLayout>
              <SupervisorsPage />
            </DashboardLayout>
          } />
          <Route path="/history" element={
            <DashboardLayout>
              <InspectionHistory />
            </DashboardLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
