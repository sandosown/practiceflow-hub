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
    
    {/* Stub roles (owner only) */}
    <Route path="/coaching" element={<ProtectedRoute ownerOnly><CoachingRadar /></ProtectedRoute>} />
    <Route path="/home" element={<ProtectedRoute ownerOnly><HomeRadar /></ProtectedRoute>} />
    
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
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
