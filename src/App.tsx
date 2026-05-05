import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccessControlProvider } from "@/context/AccessControlContext";
import { VendorProvider } from "@/context/VendorContext";
import { BookingProvider } from "@/context/BookingContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { RequireAuth } from "@/components/RequireAuth";
import Index from "./pages/Index";
import DigitalInvitation from "./pages/DigitalInvitation";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import DashboardLayout from "./components/DashboardLayout";
import AdminLayout from "./components/AdminLayout";
import VendorLayout from "./components/VendorLayout";
import StaffLayout from "./components/StaffLayout";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Guests from "./pages/Guests";
import Tables from "./pages/Tables";
import Gallery from "./pages/Gallery";
import Settings from "./pages/Settings";
import PublicEvent from "./pages/PublicEvent";
import FloorPlanner from "./pages/FloorPlanner";
import Budget from "./pages/Budget";
import GuestInvitation from "./pages/GuestInvitation";
import GuestAppLayout from "./components/GuestAppLayout";
import GuestHome from "./pages/guest-app/GuestHome";
import GuestMyTable from "./pages/guest-app/GuestMyTable";
import GuestCamera from "./pages/guest-app/GuestCamera";
import GuestGallery from "./pages/guest-app/GuestGallery";
import GuestMusic from "./pages/guest-app/GuestMusic";
import GuestDJBooth from "./pages/guest-app/GuestDJBooth";
import GuestQR from "./pages/guest-app/GuestQR";
import GuestNotifications from "./pages/guest-app/GuestNotifications";
import CheckIn from "./pages/CheckIn";
import AccessDashboard from "./pages/AccessDashboard";
import VendorsMarketplace from "./pages/VendorsMarketplace";
import VendorProfile from "./pages/VendorProfile";
import HostVendors from "./pages/HostVendors";
import VendorBookings from "./pages/VendorBookings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEventDashboard from "./pages/admin/AdminEventDashboard";
import EventAdminLayout from "./components/EventAdminLayout";
import EventAdminDashboard from "./pages/event-admin/EventAdminDashboard";
import EventAdminGuests from "./pages/event-admin/EventAdminGuests";
import EventAdminTables from "./pages/event-admin/EventAdminTables";
import EventAdminFloorPlanner from "./pages/event-admin/EventAdminFloorPlanner";
import EventAdminCheckIn from "./pages/event-admin/EventAdminCheckIn";
import EventAdminTimeline from "./pages/event-admin/EventAdminTimeline";
import EventAdminGalleryMod from "./pages/event-admin/EventAdminGalleryMod";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminMarketplace from "./pages/admin/AdminMarketplace";
import AdminReports from "./pages/admin/AdminReports";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminFeatures from "./pages/admin/AdminFeatures";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorServices from "./pages/vendor/VendorServices";
import VendorMessages from "./pages/vendor/VendorMessages";
import VendorProfilePage from "./pages/vendor/VendorProfilePage";
import VendorAnalytics from "./pages/vendor/VendorAnalytics";
import VendorSettings from "./pages/vendor/VendorSettings";
import VendorLeads from "./pages/vendor/VendorLeads";
import VendorPipeline from "./pages/vendor/VendorPipeline";
import VendorAvailability from "./pages/vendor/VendorAvailability";
import VendorReviews from "./pages/vendor/VendorReviews";
import VendorNotifications from "./pages/vendor/VendorNotifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
      <TooltipProvider>
        <AuthProvider>
          <AccessControlProvider>
            <VendorProvider>
            <BookingProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/event/:eventSlug/invitation/:guestId" element={<DigitalInvitation />} />
                <Route path="/event/:slug" element={<PublicEvent />} />
                <Route path="/event/:slug/guest/:guestId" element={<GuestInvitation />} />
                <Route path="/event/:slug/guest/:guestId/app" element={<GuestAppLayout />}>
                  <Route index element={<GuestHome />} />
                  <Route path="home" element={<GuestHome />} />
                  <Route path="table" element={<GuestMyTable />} />
                  <Route path="camera" element={<GuestCamera />} />
                  <Route path="gallery" element={<GuestGallery />} />
                  <Route path="music" element={<GuestMusic />} />
                  <Route path="dj" element={<GuestDJBooth />} />
                  <Route path="qr" element={<GuestQR />} />
                  <Route path="notifications" element={<GuestNotifications />} />
                </Route>

                {/* Staff */}
                <Route path="/staff" element={<RequireAuth allowedRoles={["superadmin", "admin", "staff"]}><StaffLayout /></RequireAuth>}>
                  <Route path="check-in" element={<CheckIn />} />
                </Route>
                {/* Legacy redirect */}
                <Route path="/check-in" element={<RequireAuth allowedRoles={["superadmin", "admin", "staff"]}><StaffLayout /></RequireAuth>}>
                  <Route index element={<CheckIn />} />
                </Route>

                {/* Marketplace (public) */}
                <Route path="/vendors" element={<VendorsMarketplace />} />
                <Route path="/vendors/:vendorId" element={<VendorProfile />} />

                {/* Vendor Portal */}
                <Route path="/vendor" element={<RequireAuth allowedRoles={["superadmin", "vendor"]}><VendorLayout /></RequireAuth>}>
                  <Route path="dashboard" element={<VendorDashboard />} />
                  <Route path="leads" element={<VendorLeads />} />
                  <Route path="pipeline" element={<VendorPipeline />} />
                  <Route path="services" element={<VendorServices />} />
                  <Route path="messages" element={<VendorMessages />} />
                  <Route path="availability" element={<VendorAvailability />} />
                  <Route path="reviews" element={<VendorReviews />} />
                  <Route path="profile" element={<VendorProfilePage />} />
                  <Route path="analytics" element={<VendorAnalytics />} />
                  <Route path="notifications" element={<VendorNotifications />} />
                  <Route path="settings" element={<VendorSettings />} />
                </Route>

                {/* Host Dashboard */}
                <Route path="/host" element={<RequireAuth allowedRoles={["superadmin", "host"]}><DashboardLayout /></RequireAuth>}>
                  <Route index element={<Dashboard />} />
                  <Route path="events" element={<Events />} />
                  <Route path="guests" element={<Guests />} />
                  <Route path="tables" element={<Tables />} />
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="floor-planner" element={<FloorPlanner />} />
                  <Route path="access" element={<AccessDashboard />} />
                  <Route path="vendors" element={<HostVendors />} />
                  <Route path="vendor-bookings" element={<VendorBookings />} />
                  <Route path="budget" element={<Budget />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Admin (superadmin only) */}
                <Route path="/admin" element={<RequireAuth allowedRoles={["superadmin"]}><AdminLayout /></RequireAuth>}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="event-dashboard" element={<AdminEventDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="vendors" element={<AdminVendors />} />
                  <Route path="marketplace" element={<AdminMarketplace />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="revenue" element={<AdminRevenue />} />
                  <Route path="subscriptions" element={<AdminSubscriptions />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="logs" element={<AdminLogs />} />
                  <Route path="features" element={<AdminFeatures />} />
                  <Route path="notifications" element={<AdminNotifications />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Event Admin */}
                <Route path="/event-admin" element={<RequireAuth allowedRoles={["admin"]}><EventAdminLayout /></RequireAuth>}>
                  <Route path="dashboard" element={<EventAdminDashboard />} />
                  <Route path="guests" element={<EventAdminGuests />} />
                  <Route path="tables" element={<EventAdminTables />} />
                  <Route path="floor-planner" element={<EventAdminFloorPlanner />} />
                  <Route path="check-in" element={<EventAdminCheckIn />} />
                  <Route path="timeline" element={<EventAdminTimeline />} />
                  <Route path="gallery-moderation" element={<EventAdminGalleryMod />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            </BookingProvider>
          </VendorProvider>
        </AccessControlProvider>
      </AuthProvider>
    </TooltipProvider>
    </LanguageProvider>
  </ThemeProvider>
</QueryClientProvider>
);

export default App;
