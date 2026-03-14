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

// Owner GP pages
import GroupPracticeDashboard from "./pages/dashboard/GroupPracticeDashboard";
import OfficeBoard from "./pages/dashboard/OfficeBoard";
import GPModulePlaceholder from "./pages/dashboard/GPModulePlaceholder";
import ChartsRequiringAction from "./pages/dashboard/modules/ChartsRequiringAction";
import ClientDatabase from "./pages/dashboard/modules/ClientDatabase";
import ReferralPipeline from "./pages/dashboard/modules/ReferralPipeline";
import TreatmentPlanTracker from "./pages/dashboard/modules/TreatmentPlanTracker";
import SupervisionStructure from "./pages/dashboard/modules/SupervisionStructure";
import ManagementCenter from "./pages/dashboard/modules/ManagementCenter";
import InsuranceDatabase from "./pages/dashboard/modules/InsuranceDatabase";
import VendorDatabase from "./pages/dashboard/modules/VendorDatabase";
import FinanceTab from "./pages/dashboard/modules/FinanceTab";
import MajorMoments from "./pages/dashboard/modules/MajorMoments";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, session } = useSession();
  if (isAuthenticated && session) {
    return <Navigate to={getDashboardRoute(session)} replace />;
  }
  return <>{children}</>;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSession();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RootRedirect = () => {
  const { isAuthenticated, session } = useSession();
  if (isAuthenticated && session) {
    return <Navigate to={getDashboardRoute(session)} replace />;
  }
  return <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RootRedirect />} />

    {/* Public */}
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/password-reset" element={<PublicRoute><PasswordReset /></PublicRoute>} />
    <Route path="/reset-password" element={<ResetPassword />} />

    {/* Dashboards */}
    <Route path="/dashboard/owner" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
    <Route path="/dashboard/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
    <Route path="/dashboard/supervisor" element={<ProtectedRoute><SupervisorDashboard /></ProtectedRoute>} />
    <Route path="/dashboard/clinician" element={<ProtectedRoute><ClinicianDashboard /></ProtectedRoute>} />
    <Route path="/dashboard/intern/clinical" element={<ProtectedRoute><InternClinicalDashboard /></ProtectedRoute>} />
    <Route path="/dashboard/intern/business" element={<ProtectedRoute><InternBusinessDashboard /></ProtectedRoute>} />
    <Route path="/dashboard/staff" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />

    {/* Owner GP sub-pages */}
    <Route path="/dashboard/owner/group-practice" element={<ProtectedRoute><GroupPracticeDashboard /></ProtectedRoute>} />
    <Route path="/dashboard/owner/group-practice/office-board" element={<ProtectedRoute><OfficeBoard /></ProtectedRoute>} />
    <Route path="/dashboard/owner/group-practice/charts" element={<ProtectedRoute><ChartsRequiringAction /></ProtectedRoute>} />
    <Route path="/dashboard/owner/group-practice/management" element={<ProtectedRoute><ManagementCenter /></ProtectedRoute>} />
    <Route path="/dashboard/owner/group-practice/clients" element={<ProtectedRoute><ClientDatabase /></ProtectedRoute>} />
    <Route path="/dashboard/owner/group-practice/caseload" element={<ProtectedRoute><CaseloadIntegration /></ProtectedRoute>} />
    <Route path="/dashboard/owner/group-practice/treatment" element={<ProtectedRoute><TreatmentPlanTracker /></ProtectedRoute>} />
    <Route path="/dashboard/owner/group-practice/supervision" element={<ProtectedRoute><SupervisionStructure /></ProtectedRoute>} />
    <Route path="/dashboard/owner/group-practice/finance" element={<ProtectedRoute><FinanceTab /></ProtectedRoute>} />
    <Route path="/dashboard/owner/group-practice/insurance" element={<ProtectedRoute><InsuranceDatabase /></ProtectedRoute>} />
    <Route path="/dashboard/owner/group-practice/vendors" element={<ProtectedRoute><VendorDatabase /></ProtectedRoute>} />
    <Route path="/dashboard/owner/group-practice/major-moments" element={<ProtectedRoute><MajorMoments /></ProtectedRoute>} />

    {/* Settings */}
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

    {/* Onboarding placeholder */}
    <Route path="/onboarding" element={<ProtectedRoute><div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Onboarding — Phase 3</p></div></ProtectedRoute>} />

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
