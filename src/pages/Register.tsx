import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/context/AuthContext";
import { toast } from "sonner";
import { useTranslate } from "@/i18n/LanguageContext";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const [role, setRole] = useState<UserRole>("host");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("auth.accountCreated"));
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-gold mx-auto mb-4 flex items-center justify-center">
            <span className="text-gold-foreground font-display font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-display font-semibold">{t("auth.createAccount")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("auth.startPlanning")}</p>
        </div>

        <Card className="rounded-2xl border-border/50 shadow-lg">
          <CardContent className="p-6 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t("auth.firstName")}</Label>
                  <Input placeholder="Alan" className="rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label>{t("auth.lastName")}</Label>
                  <Input placeholder="Nexora" className="rounded-xl" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("auth.email")}</Label>
                <Input type="email" placeholder="you@example.com" className="rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label>{t("auth.password")}</Label>
                <Input type="password" placeholder={t("auth.createPassword")} className="rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label>{t("auth.iAm")}</Label>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="host">{t("auth.hostOption")}</SelectItem>
                    <SelectItem value="vendor">{t("auth.vendorOption")}</SelectItem>
                    <SelectItem value="staff">{t("auth.staffOption")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="gold" className="w-full rounded-xl h-11">{t("auth.createAccountBtn")}</Button>
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
              {t("auth.hasAccount")} <Link to="/login" className="text-accent hover:underline">{t("auth.signIn")}</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
