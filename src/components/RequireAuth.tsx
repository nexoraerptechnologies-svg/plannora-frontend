import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useTranslate } from "@/i18n/LanguageContext";

interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RequireAuth({ children, allowedRoles }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}

function AccessDenied() {
  const { user } = useAuth();
  const { t } = useTranslate();
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <Card className="max-w-md w-full rounded-2xl p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <Shield className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-display font-semibold">{t("accessDenied.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("accessDenied.message")}
          {user && ` ${t("accessDenied.roleMessage").replace("{role}", user.role)}`}
        </p>
        <Link to="/login">
          <Button variant="gold" className="rounded-xl">{t("accessDenied.backToLogin")}</Button>
        </Link>
      </Card>
    </div>
  );
}
