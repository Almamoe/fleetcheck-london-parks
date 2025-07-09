import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import SupervisorsPage from "./pages/SupervisorsPage";
import InspectionHistory from "./pages/InspectionHistory";
import { DashboardLayout } from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import AuthForm from "./components/AuthForm";
import { useNavigate } from "react-router-dom";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminRequestForm from "@/components/AdminRequestForm";

const queryClient = new QueryClient();

const AuthPage = () => {
  const navigate = useNavigate();
  
  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  return <AuthForm onAuthSuccess={handleAuthSuccess} />;
};

const AdminRequestPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            src="/lovable-uploads/d06e4237-0209-4e8b-ab56-fa47f79f7ca5.png"
            alt="City of London"
            className="h-20 w-20 mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">FleetCheck</h1>
          <p className="text-emerald-700">Admin Access Request</p>
        </div>
        <AdminRequestForm />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/signin" element={<AuthPage />} />
            <Route path="/inspection" element={<Index />} />
            <Route path="/admin-request" element={
              <ProtectedRoute>
                <AdminRequestPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AdminProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </AdminProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/vehicles" element={
              <ProtectedRoute>
                <AdminProtectedRoute>
                  <DashboardLayout>
                    <Vehicles />
                  </DashboardLayout>
                </AdminProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/supervisors" element={
              <ProtectedRoute>
                <AdminProtectedRoute>
                  <DashboardLayout>
                    <SupervisorsPage />
                  </DashboardLayout>
                </AdminProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <AdminProtectedRoute>
                  <DashboardLayout>
                    <InspectionHistory />
                  </DashboardLayout>
                </AdminProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
