import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { useAuth, ROLE_COLORS } from "@/context/AuthContext";
import { useTranslate } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { t } = useTranslate();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-surface">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          <header className="h-14 flex items-center px-3 sm:px-4 border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-10">
            <SidebarTrigger className="mr-2 sm:mr-4" />
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {user && (
                <>
                  <Badge variant="outline" className={`text-[9px] rounded-full border hidden sm:inline-flex ${ROLE_COLORS[user.role]}`}>
                    {t(`roles.${user.role}`)}
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
              {!user && (
                <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-xs font-semibold text-gold-foreground">
                  ?
                </div>
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
