import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import RoleHub from "./pages/RoleHub";
import GroupPracticeRadar from "./pages/GroupPracticeRadar";
import TransferPortal from "./pages/TransferPortal";
import ReferralDetail from "./pages/ReferralDetail";
import StaffDirectory from "./pages/StaffDirectory";
import MyRadar from "./pages/MyRadar";
import MyTransferPortal from "./pages/MyTransferPortal";
import CoachingRadar from "./pages/CoachingRadar";
import HomeRadar from "./pages/HomeRadar";
import NotFound from "./pages/NotFound";
import { OperatingProfileProvider } from "@/context/OperatingProfileContext";

// Comms
import CommsHub from "./pages/practice/CommsHub";
import CommsAnnouncements from "./pages/practice/CommsAnnouncements";
import CommsStaffUpdates from "./pages/practice/CommsStaffUpdates";
import CommsResources from "./pages/practice/CommsResources";
import CommsSupervision from "./pages/practice/CommsSupervision";

// People
import PeopleHub from "./pages/practice/PeopleHub";
import WorkerProfileWizard from "./pages/practice/WorkerProfileWizard";
import ProfileReviews from "./pages/practice/ProfileReviews";

// Operations
import OperationsHub from "./pages/practice/OperationsHub";
import OpsClients from "./pages/practice/OpsClients";
import OpsCaseload from "./pages/practice/OpsCaseload";
import OpsTreatmentPlans from "./pages/practice/OpsTreatmentPlans";
import OpsPayers from "./pages/practice/OpsPayers";
import OpsVendors from "./pages/practice/OpsVendors";

const queryClient = new QueryClient();

const isStaffRole = (role?: string) => role === 'THERAPIST' || role === 'INTERN';

const getDefaultRoute = (role?: string) => isStaffRole(role) ? '/practice/my-radar' : '/hub';

const ProtectedRoute: React.FC<{ children: React.ReactNode; ownerOnly?: boolean }> = ({ children, ownerOnly }) => {
  const { isAuthenticated, isProfileComplete, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!isProfileComplete) return <Navigate to="/profile-setup" replace />;
  if (ownerOnly && user?.role !== 'OWNER') return <Navigate to={getDefaultRoute(user?.role)} replace />;
  return <>{children}</>;
};

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isProfileComplete, user } = useAuth();
  if (isAuthenticated && isProfileComplete) return <Navigate to={getDefaultRoute(user?.role)} replace />;
  if (isAuthenticated && !isProfileComplete) return <Navigate to="/profile-setup" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AuthRoute><Login /></AuthRoute>} />
    <Route path="/profile-setup" element={<ProfileSetup />} />
    <Route path="/hub" element={<ProtectedRoute><RoleHub /></ProtectedRoute>} />
    
    {/* Owner: Group Practice */}
    <Route path="/practice/radar" element={<ProtectedRoute ownerOnly><GroupPracticeRadar /></ProtectedRoute>} />
    <Route path="/practice/transfers" element={<ProtectedRoute ownerOnly><TransferPortal /></ProtectedRoute>} />
    <Route path="/practice/transfers/:id" element={<ProtectedRoute><ReferralDetail /></ProtectedRoute>} />
    <Route path="/practice/staff" element={<ProtectedRoute ownerOnly><StaffDirectory /></ProtectedRoute>} />
    
    {/* Therapist/Intern */}
    <Route path="/practice/my-radar" element={<ProtectedRoute><MyRadar /></ProtectedRoute>} />
    <Route path="/practice/my-transfers" element={<ProtectedRoute><MyTransferPortal /></ProtectedRoute>} />
    
    {/* Comms */}
    <Route path="/practice/comms" element={<ProtectedRoute><CommsHub /></ProtectedRoute>} />
    <Route path="/practice/comms/announcements" element={<ProtectedRoute><CommsAnnouncements /></ProtectedRoute>} />
    <Route path="/practice/comms/staff-updates" element={<ProtectedRoute><CommsStaffUpdates /></ProtectedRoute>} />
    <Route path="/practice/comms/resources" element={<ProtectedRoute><CommsResources /></ProtectedRoute>} />
    <Route path="/practice/comms/supervision" element={<ProtectedRoute><CommsSupervision /></ProtectedRoute>} />
    
    {/* People */}
    <Route path="/practice/people" element={<ProtectedRoute><PeopleHub /></ProtectedRoute>} />
    <Route path="/practice/people/my-profile" element={<ProtectedRoute><WorkerProfileWizard /></ProtectedRoute>} />
    <Route path="/practice/people/reviews" element={<ProtectedRoute ownerOnly><ProfileReviews /></ProtectedRoute>} />
    <Route path="/practice/people/review/:id" element={<ProtectedRoute ownerOnly><ProfileReviews /></ProtectedRoute>} />
    
    {/* Operations */}
    <Route path="/practice/ops" element={<ProtectedRoute><OperationsHub /></ProtectedRoute>} />
    <Route path="/practice/ops/clients" element={<ProtectedRoute ownerOnly><OpsClients /></ProtectedRoute>} />
    <Route path="/practice/ops/caseload" element={<ProtectedRoute><OpsCaseload /></ProtectedRoute>} />
    <Route path="/practice/ops/treatment-plans" element={<ProtectedRoute><OpsTreatmentPlans /></ProtectedRoute>} />
    <Route path="/practice/ops/payers" element={<ProtectedRoute><OpsPayers /></ProtectedRoute>} />
    <Route path="/practice/ops/vendors" element={<ProtectedRoute ownerOnly><OpsVendors /></ProtectedRoute>} />
    
    {/* Stub roles (owner only) */}
    <Route path="/coaching" element={<ProtectedRoute ownerOnly><CoachingRadar /></ProtectedRoute>} />
    <Route path="/home" element={<ProtectedRoute ownerOnly><HomeRadar /></ProtectedRoute>} />
    
    {/* DEV ONLY — remove before release */}
    <Route path="/dev/onboarding" element={<WorkerProfileWizard />} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <OperatingProfileProvider>
            <AppRoutes />
          </OperatingProfileProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
