import { Outlet, useNavigate } from "react-router-dom";
import { useAuth, ROLE_COLORS } from "@/context/AuthContext";
import { useTranslate } from "@/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function StaffLayout() {
  const { user, logout } = useAuth();
  const { t } = useTranslate();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 flex items-center justify-between px-4 border-b border-border/20 bg-background/90 backdrop-blur-lg sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent" />
          <div>
            <h1 className="text-sm font-display font-semibold text-foreground leading-tight">{t("scanner.accessControl")}</h1>
            <p className="text-[10px] text-muted-foreground">{t("scanner.staffScanner")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <Badge variant="outline" className={`text-[9px] rounded-full border ${ROLE_COLORS[user.role]}`}>
              {t(`roles.${user.role}`)}
            </Badge>
          )}
          <ThemeToggle variant="icon" />
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={handleLogout}>
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
