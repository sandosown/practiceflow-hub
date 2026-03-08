import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider, useSession } from "@/context/SessionContext";
import { getDashboardRoute } from "@/lib/routing";

// Public pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordReset from "./pages/PasswordReset";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Dashboard shells
import OwnerDashboard from "./pages/dashboard/OwnerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import SupervisorDashboard from "./pages/dashboard/SupervisorDashboard";
import ClinicianDashboard from "./pages/dashboard/ClinicianDashboard";
import InternClinicalDashboard from "./pages/dashboard/InternClinicalDashboard";
import InternBusinessDashboard from "./pages/dashboard/InternBusinessDashboard";
import StaffDashboard from "./pages/dashboard/StaffDashboard";

const queryClient = new QueryClient();

/** Redirects authenticated users away from public auth pages */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, session } = useSession();
  if (isAuthenticated && session) {
    return <Navigate to={getDashboardRoute(session)} replace />;
  }
  return <>{children}</>;
};

/** Requires authentication; redirects to /login otherwise */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSession();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

/** Catch-all: redirects to correct dashboard or login */
const RootRedirect = () => {
  const { isAuthenticated, session } = useSession();
  if (isAuthenticated && session) {
    return <Navigate to={getDashboardRoute(session)} replace />;
  }
  return <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Root redirect */}
    <Route path="/" element={<RootRedirect />} />

    {/* Public auth routes */}
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/password-reset" element={<PublicRoute><PasswordReset /></PublicRoute>} />
    <Route path="/reset-password" element={<ResetPassword />} />

    {/* Protected dashboard shells */}
    <Route path="/dashboard/owner" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
    <Route path="/dashboard/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
    <Route path="/dashboard/supervisor" element={<ProtectedRoute><SupervisorDashboard /></ProtectedRoute>} />
    <Route path="/dashboard/clinician" element={<ProtectedRoute><ClinicianDashboard /></ProtectedRoute>} />
    <Route path="/dashboard/intern/clinical" element={<ProtectedRoute><InternClinicalDashboard /></ProtectedRoute>} />
    <Route path="/dashboard/intern/business" element={<ProtectedRoute><InternBusinessDashboard /></ProtectedRoute>} />
    <Route path="/dashboard/staff" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />

    {/* Onboarding placeholder */}
    <Route path="/onboarding" element={<ProtectedRoute><div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Onboarding — Phase 2</p></div></ProtectedRoute>} />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionProvider>
          <AppRoutes />
        </SessionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
