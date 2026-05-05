import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslate } from "@/i18n/LanguageContext";

export default function ForgotPassword() {
  const { t } = useTranslate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-gold mx-auto mb-4 flex items-center justify-center">
            <span className="text-gold-foreground font-display font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-display font-semibold">{t("auth.resetPassword")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("auth.resetDescription")}</p>
        </div>

        <Card className="rounded-2xl border-border/50 shadow-lg">
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label>{t("auth.email")}</Label>
              <Input type="email" placeholder="you@example.com" className="rounded-xl" />
            </div>
            <Button variant="gold" className="w-full rounded-xl h-11">{t("auth.resetLink")}</Button>
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> {t("auth.backToSignIn")}
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
