import { Users, LayoutGrid, Settings, Home, PartyPopper, Image, Store, LogOut, Crown, DollarSign, Heart, CalendarDays } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth, ROLE_COLORS } from "@/context/AuthContext";
import { useTranslate } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
  const { t } = useTranslate();
  const navigate = useNavigate();

  const hostNav = [
    { title: t("nav.myEvent"), url: "/host", icon: Home, group: t("nav.overview") },
    { title: t("nav.eventDetails"), url: "/host/events", icon: PartyPopper, group: t("nav.overview") },
    { title: t("nav.guestList"), url: "/host/guests", icon: Users, group: t("nav.overview") },
    { title: t("nav.vendors"), url: "/host/vendors", icon: Store, group: t("nav.services") },
    { title: t("nav.bookings"), url: "/host/vendor-bookings", icon: CalendarDays, group: t("nav.services") },
    { title: t("nav.budget"), url: "/host/budget", icon: DollarSign, group: t("nav.services") },
    { title: t("nav.gallery"), url: "/host/gallery", icon: Image, group: t("nav.experience") },
    { title: t("nav.seating"), url: "/host/tables", icon: LayoutGrid, group: t("nav.experience") },
    { title: t("nav.settings"), url: "/host/settings", icon: Settings, group: t("nav.system") },
  ];

  const groups = [t("nav.overview"), t("nav.services"), t("nav.experience"), t("nav.system")];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center flex-shrink-0">
          <span className="text-gold-foreground font-display font-bold text-sm">P</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-display font-semibold text-sidebar-accent-foreground text-sm">Planora</span>
            <span className="text-[10px] text-sidebar-foreground/50 tracking-wider uppercase">{t("common.byNexora")}</span>
          </div>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && user && (
        <div className="px-4 pb-2">
          <Badge variant="outline" className={`text-[8px] rounded-full border w-full justify-center ${ROLE_COLORS[user.role]}`}>
            {(user.role === "superadmin" || user.role === "host") && <Crown className="h-2.5 w-2.5 mr-1" />}
            {t(`roles.${user.role}`)}
          </Badge>
        </div>
      )}

      <SidebarContent className="px-2">
        {groups.map((group) => {
          const items = hostNav.filter((n) => n.group === group);
          if (items.length === 0) return null;
          return (
            <SidebarGroup key={group}>
              <SidebarGroupLabel className="text-sidebar-foreground/40 text-[9px] uppercase tracking-widest">{group}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.url === "/host"}
                          className="rounded-xl transition-all duration-200"
                          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                        >
                          <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button onClick={handleLogout} className="text-sidebar-foreground/60 hover:text-sidebar-foreground rounded-xl w-full flex items-center">
                <LogOut className="h-4 w-4 mr-3" />
                {!collapsed && <span>{t("auth.signOut")}</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
