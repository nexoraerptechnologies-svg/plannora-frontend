import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useAuth, getRedirectPath, ROLE_COLORS } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslate } from "@/i18n/LanguageContext";

export default function Login() {
  const { login, isLoading, mockUsers } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user) navigate(getRedirectPath(user), { replace: true });
    } else {
      setError(result.error || t("auth.invalidCredentials"));
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setError("");
    const result = await login(userEmail, "demo");
    if (result.success) {
      const user = mockUsers.find((u) => u.email === userEmail);
      if (user) navigate(getRedirectPath(user), { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle variant="dropdown" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-gold mx-auto mb-4 flex items-center justify-center">
            <span className="text-gold-foreground font-display font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-display font-semibold">{t("auth.welcomeBack")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("auth.signInTo")} <span className="text-xs opacity-60">{t("common.byNexora")}</span></p>
        </div>

        <Card className="rounded-2xl border-border/50 shadow-lg">
          <CardContent className="p-6 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t("auth.email")}</Label>
                <Input type="email" placeholder="you@example.com" className="rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>{t("auth.password")}</Label>
                  <Link to="/forgot-password" className="text-xs text-accent hover:underline">{t("auth.forgotPassword")}</Link>
                </div>
                <Input type="password" placeholder="••••••••" className="rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error && <p className="text-destructive text-xs">{error}</p>}
              <Button variant="gold" className="w-full rounded-xl h-11" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.signIn")}
              </Button>
            </form>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">{t("common.or")}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="rounded-xl">Google</Button>
              <Button variant="outline" className="rounded-xl">Apple</Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {t("auth.noAccount")} <Link to="/register" className="text-accent hover:underline">{t("auth.signUp")}</Link>
            </p>
            <p className="text-center text-[11px] text-muted-foreground">
              {t("auth.termsAgree")} <Link to="/terms" className="underline">{t("auth.terms")}</Link> {t("auth.and")} <Link to="/privacy" className="underline">{t("auth.privacyPolicy")}</Link>.
            </p>
          </CardContent>
        </Card>

        {/* Demo accounts */}
        <Card className="rounded-2xl border-border/50 mt-4">
          <CardContent className="p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3 text-center">{t("auth.demoAccounts")}</p>
            <div className="space-y-2">
              {mockUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u.email)}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-[10px] font-semibold text-accent shrink-0">
                    {u.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                  </div>
                  <Badge variant="outline" className={`text-[8px] rounded-full border ${ROLE_COLORS[u.role]}`}>
                    {t(`roles.${u.role}`)}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
