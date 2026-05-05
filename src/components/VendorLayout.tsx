import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth, ROLE_LABELS, ROLE_COLORS } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Package, MessageCircle, User, BarChart3, Settings, Store, Users, GitBranch, CalendarDays, Star, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { useVendors } from "@/context/VendorContext";

const mainNav = [
  { title: "Dashboard", url: "/vendor/dashboard", icon: LayoutDashboard },
  { title: "Leads", url: "/vendor/leads", icon: Users },
  { title: "Pipeline", url: "/vendor/pipeline", icon: GitBranch },
  { title: "Messages", url: "/vendor/messages", icon: MessageCircle },
];

const manageNav = [
  { title: "My Services", url: "/vendor/services", icon: Package },
  { title: "Availability", url: "/vendor/availability", icon: CalendarDays },
  { title: "Reviews", url: "/vendor/reviews", icon: Star },
  { title: "My Profile", url: "/vendor/profile", icon: User },
];

const insightNav = [
  { title: "Analytics", url: "/vendor/analytics", icon: BarChart3 },
  { title: "Notifications", url: "/vendor/notifications", icon: Bell },
  { title: "Settings", url: "/vendor/settings", icon: Settings },
];

function VendorSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
  const { conversations, notifications } = useVendors();
  const navigate = useNavigate();
  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0);
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const renderNav = (items: typeof mainNav, label?: string) => (
    <SidebarGroup>
      {label && !collapsed && <SidebarGroupLabel className="text-[9px] uppercase tracking-wider text-sidebar-foreground/40 px-3">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} end={item.url === "/vendor/dashboard"} className="rounded-xl transition-all duration-200 relative" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                  <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                  {item.title === "Messages" && totalUnread > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center">{totalUnread}</span>
                  )}
                  {item.title === "Notifications" && unreadNotifs > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center">{unreadNotifs}</span>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center flex-shrink-0">
          <Store className="h-4 w-4 text-gold-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-display font-semibold text-sidebar-accent-foreground text-sm">Vendor Portal</span>
            <span className="text-[10px] text-sidebar-foreground/50 tracking-wider uppercase">Planora</span>
          </div>
        )}
      </div>
      {!collapsed && user && (
        <div className="px-4 pb-2">
          <Badge variant="outline" className={`text-[8px] rounded-full border w-full justify-center ${ROLE_COLORS[user.role]}`}>{ROLE_LABELS[user.role]}</Badge>
        </div>
      )}
      <SidebarContent className="px-2">
        {renderNav(mainNav)}
        {renderNav(manageNav, "Manage")}
        {renderNav(insightNav, "Insights")}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button onClick={() => { logout(); navigate("/login", { replace: true }); }} className="text-sidebar-foreground/60 hover:text-sidebar-foreground rounded-xl w-full flex items-center">
                <LogOut className="h-4 w-4 mr-3" />
                {!collapsed && <span>Sign Out</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function VendorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-surface">
        <VendorSidebar />
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          <header className="h-14 flex items-center px-3 sm:px-4 border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-10">
            <SidebarTrigger className="mr-2 sm:mr-4" />
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {user && (
                <>
                  <Badge variant="outline" className={`text-[9px] rounded-full border hidden sm:inline-flex ${ROLE_COLORS[user.role]}`}>{ROLE_LABELS[user.role]}</Badge>
                  <span className="text-xs text-muted-foreground hidden md:block">{user.name}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-xs font-semibold text-gold-foreground">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <ThemeToggle variant="dropdown" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { logout(); navigate("/login", { replace: true }); }}>
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
