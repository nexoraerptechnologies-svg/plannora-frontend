import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth, ROLE_LABELS, ROLE_COLORS } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, Crown, LayoutDashboard, Users, Calendar, Store, ShoppingBag, BarChart3, DollarSign, CreditCard, AlertTriangle, ScrollText, ToggleLeft, Bell, Settings, QrCode, Map, Clock, Image } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

// Super Admin: full platform control
const superAdminNav = [
  { title: "Control Center", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Events", url: "/admin/events", icon: Calendar },
  { title: "Vendors", url: "/admin/vendors", icon: Store },
  { title: "Marketplace", url: "/admin/marketplace", icon: ShoppingBag },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Revenue", url: "/admin/revenue", icon: DollarSign },
  { title: "Subscriptions", url: "/admin/subscriptions", icon: CreditCard },
  { title: "Reports", url: "/admin/reports", icon: AlertTriangle },
  { title: "System Logs", url: "/admin/logs", icon: ScrollText },
  { title: "Feature Control", url: "/admin/features", icon: ToggleLeft },
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

// Event Admin: event operations only
const eventAdminNav = [
  { title: "Event Dashboard", url: "/admin/event-dashboard", icon: LayoutDashboard },
  { title: "Guests", url: "/admin/events", icon: Users },
  { title: "Check-in", url: "/admin/checkin", icon: QrCode },
  { title: "Floor Planner", url: "/admin/floor-planner", icon: Map },
  { title: "Timeline", url: "/admin/timeline", icon: Clock },
  { title: "Gallery", url: "/admin/gallery-mod", icon: Image },
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";
  const navItems = isSuperAdmin ? superAdminNav : eventAdminNav;
  const roleLabel = isSuperAdmin ? "Super Admin" : "Event Admin";

  // Group items for superadmin, flat list for event admin
  const platformItems = isSuperAdmin ? navItems.slice(0, 5) : navItems;
  const businessItems = isSuperAdmin ? navItems.slice(5, 8) : [];
  const systemItems = isSuperAdmin ? navItems.slice(8) : [];

  const renderNavGroup = (items: typeof navItems, label: string) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/40 text-[9px] uppercase tracking-widest">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                  <item.icon className="mr-2 h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        {/* Brand */}
        <div className={`px-4 py-5 border-b border-sidebar-border ${collapsed ? "px-2 py-3" : ""}`}>
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                <Crown className="h-4 w-4 text-gold-foreground" />
              </div>
              <div>
                <p className="text-sm font-display font-semibold text-sidebar-foreground">Planora</p>
                <p className="text-[9px] text-sidebar-foreground/50 uppercase tracking-wider">{roleLabel}</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center mx-auto">
              <Crown className="h-4 w-4 text-gold-foreground" />
            </div>
          )}
        </div>

        {isSuperAdmin ? (
          <>
            {renderNavGroup(platformItems, "Platform")}
            {renderNavGroup(businessItems, "Business")}
            {renderNavGroup(systemItems, "System")}
          </>
        ) : (
          renderNavGroup(platformItems, "Event Operations")
        )}
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-surface">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          <header className="h-14 flex items-center px-3 sm:px-4 border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-10">
            <SidebarTrigger className="mr-2 sm:mr-4" />
            <div className="flex items-center gap-1.5">
              <Crown className="h-4 w-4 text-accent" />
              <span className="text-sm font-display font-semibold hidden sm:inline">{user?.role === "superadmin" ? "Super Admin" : "Event Admin"}</span>
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {user && (
                <>
                  <Badge variant="outline" className={`text-[9px] rounded-full border hidden sm:inline-flex ${ROLE_COLORS[user.role]}`}>
                    {ROLE_LABELS[user.role]}
                  </Badge>
                  <span className="text-xs text-muted-foreground hidden md:block">{user.name}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-xs font-semibold text-gold-foreground">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <ThemeToggle variant="dropdown" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={handleLogout}>
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>
          </header>
          <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
