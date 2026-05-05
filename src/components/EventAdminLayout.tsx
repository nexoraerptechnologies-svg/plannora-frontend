import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth, ROLE_LABELS, ROLE_COLORS } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, LayoutGrid, Map, QrCode, Clock, Image, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const eventAdminNav = [
  { title: "Dashboard", url: "/event-admin/dashboard", icon: LayoutDashboard },
  { title: "Guests", url: "/event-admin/guests", icon: Users },
  { title: "Tables", url: "/event-admin/tables", icon: LayoutGrid },
  { title: "Floor Planner", url: "/event-admin/floor-planner", icon: Map },
  { title: "Check-in", url: "/event-admin/check-in", icon: QrCode },
  { title: "Timeline", url: "/event-admin/timeline", icon: Clock },
  { title: "Gallery Moderation", url: "/event-admin/gallery-moderation", icon: Image },
];

function EventAdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <div className={`px-4 py-5 border-b border-sidebar-border ${collapsed ? "px-2 py-3" : ""}`}>
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-display font-semibold text-sidebar-foreground">Planora</p>
                <p className="text-[9px] text-sidebar-foreground/50 uppercase tracking-wider">Event Admin</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto">
              <Shield className="h-4 w-4 text-destructive" />
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[9px] uppercase tracking-widest">Event Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {eventAdminNav.map((item) => (
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
      </SidebarContent>
    </Sidebar>
  );
}

export default function EventAdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-surface">
        <EventAdminSidebar />
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          <header className="h-14 flex items-center px-3 sm:px-4 border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-10">
            <SidebarTrigger className="mr-2 sm:mr-4" />
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-destructive" />
              <span className="text-sm font-display font-semibold hidden sm:inline">Event Admin</span>
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {user && (
                <>
                  <Badge variant="outline" className={`text-[9px] rounded-full border hidden sm:inline-flex ${ROLE_COLORS[user.role]}`}>
                    {ROLE_LABELS[user.role]}
                  </Badge>
                  <span className="text-xs text-muted-foreground hidden md:block">{user.name}</span>
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-xs font-semibold text-destructive">
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
