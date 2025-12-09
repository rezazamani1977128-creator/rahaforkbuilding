import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DemoProvider } from "@/contexts/DemoContext";
import { DemoBanner, DemoBadge } from "@/components/demo/DemoBanner";
import { UpgradeModal } from "@/components/demo/UpgradeModal";
import { ProtectedRoute, ManagerRoute, ResidentRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Auth Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import SelectBuildingPage from "./pages/auth/SelectBuildingPage";
import UnauthorizedPage from "./pages/auth/UnauthorizedPage";

// Manager & Resident Pages
import Dashboard from "./pages/Dashboard";
import Units from "./pages/Units";
import Charges from "./pages/Charges";
import ResidentDashboard from "./pages/ResidentDashboard";
import PaymentWizard from "./pages/PaymentWizard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Badges from "./pages/Badges";
import Leaderboard from "./pages/Leaderboard";
import Rewards from "./pages/Rewards";
import Challenges from "./pages/Challenges";
import NotFound from "./pages/NotFound";

// Phase 2 Pages
import { ResidentsPage } from "./pages/manager/ResidentsPage";
import { PaymentsPage } from "./pages/manager/PaymentsPage";
import { ExpensesPage } from "./pages/manager/ExpensesPage";

// Phase 3 Pages
import { BuildingFundPage } from "./pages/manager/BuildingFundPage";
import { ReportsPage } from "./pages/manager/ReportsPage";

// Phase 4 Pages
import { AnnouncementsPage } from "./pages/manager/AnnouncementsPage";
import { VotingPage } from "./pages/manager/VotingPage";
import { MaintenancePage } from "./pages/manager/MaintenancePage";

// Phase 5 - Resident Pages
import { ResidentLayout } from "./components/layout/ResidentLayout";
import { MyChargesPage } from "./pages/resident/MyChargesPage";
import { PaymentPage } from "./pages/resident/PaymentPage";
import { PaymentSuccessPage } from "./pages/resident/PaymentSuccessPage";
import { PaymentFailurePage } from "./pages/resident/PaymentFailurePage";
import { PaymentHistoryPage } from "./pages/resident/PaymentHistoryPage";
import { MyRequestsPage } from "./pages/resident/MyRequestsPage";
import { BuildingInfoPage } from "./pages/resident/BuildingInfoPage";
import { ProfilePage } from "./pages/resident/ProfilePage";
import { ResidentAnnouncementsPage } from "./pages/resident/ResidentAnnouncementsPage";
import { MessagesPage } from "./pages/resident/MessagesPage";
import { ResidentVotingPage } from "./pages/resident/ResidentVotingPage";
import { NotificationsPage as ResidentNotificationsPage } from "./pages/resident/NotificationsPage";

// Phase 6 - Community Features
import { MarketplacePage } from "./pages/community/MarketplacePage";
import { EventsPage } from "./pages/community/EventsPage";
import { DiscussionsPage } from "./pages/community/DiscussionsPage";

// Phase 7 - Documents & Settings
import { DocumentsPage } from "./pages/manager/DocumentsPage";
import { SettingsPage } from "./pages/manager/SettingsPage";
import { HelpPage } from "./pages/manager/HelpPage";
import { UnitsPage } from "./pages/manager/UnitsPage";
import { NotificationsPage } from "./pages/manager/NotificationsPage";

// Demo Mode - Public Pages
import { LandingPage } from "./pages/public/LandingPage";
import { PricingPage } from "./pages/public/PricingPage";
import { ContactPage } from "./pages/public/ContactPage";

const queryClient = new QueryClient();

// Helper component to redirect based on role
function DashboardRedirect() {
  const { currentBuilding, isLoading } = useAuth();
  
  if (isLoading) return null;
  
  if (currentBuilding?.role === 'manager' || currentBuilding?.role === 'board_member') {
    return <Navigate to="/manager/dashboard" replace />;
  }
  
  return <Navigate to="/resident/dashboard" replace />;
}

const App = () => {
  console.log('🟢 App component rendering...');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <DemoProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <DemoBanner />
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing-old" element={<Landing />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Building Selection */}
              <Route 
                path="/select-building" 
                element={
                  <ProtectedRoute requireBuilding={false}>
                    <SelectBuildingPage />
                  </ProtectedRoute>
                } 
              />

              {/* Manager Routes */}
              <Route 
                path="/manager/*" 
                element={
                  <ManagerRoute>
                    <DashboardLayout />
                  </ManagerRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="units" element={<UnitsPage />} />
                <Route path="charges" element={<Charges />} />
                <Route path="charges/new" element={<Charges />} />
                <Route path="residents" element={<ResidentsPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="expenses" element={<ExpensesPage />} />
                <Route path="fund" element={<BuildingFundPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="announcements" element={<AnnouncementsPage />} />
                <Route path="polls" element={<VotingPage />} />
                <Route path="requests" element={<MaintenancePage />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="badges" element={<Badges />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="rewards" element={<Rewards />} />
                <Route path="challenges" element={<Challenges />} />
              </Route>

              {/* Resident Routes - Phase 5 */}
              <Route 
                path="/resident/*" 
                element={
                  <ResidentRoute>
                    <ResidentLayout />
                  </ResidentRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ResidentDashboard />} />
                <Route path="charges" element={<MyChargesPage />} />
                <Route path="pay" element={<PaymentPage />} />
                <Route path="payment/success" element={<PaymentSuccessPage />} />
                <Route path="payment/failure" element={<PaymentFailurePage />} />
                <Route path="history" element={<PaymentHistoryPage />} />
                <Route path="requests" element={<MyRequestsPage />} />
                <Route path="announcements" element={<ResidentAnnouncementsPage />} />
                <Route path="voting" element={<ResidentVotingPage />} />
                <Route path="notifications" element={<ResidentNotificationsPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="building" element={<BuildingInfoPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Community Routes - Phase 6 (Accessible to all authenticated users) */}
              <Route 
                path="/community/*" 
                element={
                  <ProtectedRoute>
                    <ResidentLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="marketplace" replace />} />
                <Route path="marketplace" element={<MarketplacePage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="discussions" element={<DiscussionsPage />} />
              </Route>

              {/* Legacy Routes - Redirect to proper locations */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
              <Route path="/resident" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><PaymentWizard /></ProtectedRoute>} />
              <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
              <Route path="/payment/failed" element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
              {/* Global Demo Components */}
              <UpgradeModal />
              <DemoBadge />
            </BrowserRouter>
          </TooltipProvider>
          </DemoProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
