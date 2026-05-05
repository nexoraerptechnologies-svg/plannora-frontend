// src/pages/Login.tsx
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth, getRedirectPath } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslate } from "@/i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay: i * 0.07 },
  }),
};

export default function Login() {
  // ✅ user → currentUser,  isLoading → isAuthLoading  (aliases locales)
  const { login, isLoading: isAuthLoading, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");

  if (currentUser) {
    navigate(getRedirectPath(currentUser), { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (!result.success) setError(result.error ?? "Error desconocido.");
  };

  return (
    <div className="min-h-screen flex bg-background">

      {/* Panel izquierdo decorativo (desktop) */}
      <div className="hidden lg:flex w-[400px] shrink-0 flex-col justify-between bg-[#0C0C0E] border-r border-border p-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[hsl(var(--gold)/0.07)] blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-gold flex items-center justify-center">
            <span className="font-display font-bold text-[#0C0C0E] text-lg">P</span>
          </div>
          <span className="font-display text-white text-[17px] font-semibold tracking-wide">Plannora</span>
          <span className="text-[10px] text-white/25 tracking-widest uppercase">by Nexora</span>
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote className="font-display text-[30px] font-light leading-snug text-white">
            Bienvenido de{" "}
            <em className="italic text-[hsl(var(--gold))]">vuelta.</em>
          </blockquote>
          <p className="text-[14px] text-white/40 leading-relaxed max-w-[260px]">
            Accede a tu panel para continuar planeando cada detalle de tu evento.
          </p>
          <div className="flex flex-col gap-2">
            {[
              { val: "+2,400", label: "eventos creados" },
              { val: "94%",    label: "tasa de confirmación RSVP" },
              { val: "4.9 ★",  label: "calificación promedio" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-4 py-2.5 border border-white/[0.06]">
                <span className="font-display text-[hsl(var(--gold))] text-[15px] font-medium min-w-[56px]">{s.val}</span>
                <span className="text-[12px] text-white/35">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-white/15 relative z-10">© 2025 Plannora. Todos los derechos reservados.</p>
      </div>

      {/* Panel derecho: formulario */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle variant="dropdown" />
        </div>

        <motion.div initial="hidden" animate="show" className="w-full max-w-[400px]">

          {/* Logo mobile */}
          <motion.div variants={fadeUp} custom={0} className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-gold flex items-center justify-center">
                <span className="font-display font-bold text-[#0C0C0E] text-lg">P</span>
              </div>
              <span className="font-display text-[17px] font-semibold">Plannora</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeUp} custom={0} className="mb-8">
            <h1 className="font-display text-3xl font-light mb-1.5">{t("auth.welcomeBack")}</h1>
            <p className="text-muted-foreground text-[14px]">Ingresa a tu cuenta para continuar.</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <motion.div variants={fadeUp} custom={1} className="space-y-1.5">
              <Label className="text-[12px]">{t("auth.email")}</Label>
              <Input
                type="email"
                placeholder="tu@correo.com"
                className="rounded-xl h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isAuthLoading}
                autoComplete="email"
                required
              />
            </motion.div>

            <motion.div variants={fadeUp} custom={2} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[12px]">{t("auth.password")}</Label>
                <Link to="/forgot-password" className="text-[11px] text-[hsl(var(--gold))] hover:underline">
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="rounded-xl h-11 pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isAuthLoading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/20 rounded-xl px-3.5 py-3"
              >
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-px" />
                <p className="text-[12px] text-destructive leading-snug">{error}</p>
              </motion.div>
            )}

            <motion.div variants={fadeUp} custom={3}>
              <Button
                variant="gold"
                className="w-full rounded-xl h-11 text-[14px] font-medium"
                disabled={isAuthLoading}
              >
                {isAuthLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-[#0C0C0E]/30 border-t-[#0C0C0E] animate-spin" />
                    Ingresando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t("auth.signIn")}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={fadeUp} custom={4} className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-[11px] text-muted-foreground">
              ¿Nuevo en Plannora?
            </span>
          </motion.div>

          {/* Register CTA */}
          <motion.div variants={fadeUp} custom={5}>
            <Button variant="outline" className="w-full rounded-xl h-11 text-[13px]" asChild>
              <Link to="/register">Crear cuenta gratis</Link>
            </Button>
          </motion.div>

          {/* Legal */}
          <motion.p variants={fadeUp} custom={6} className="text-center text-[11px] text-muted-foreground mt-5">
            Al continuar aceptas los{" "}
            <Link to="/terms" className="underline hover:text-foreground transition-colors">Términos de uso</Link>{" "}
            y la{" "}
            <Link to="/privacy" className="underline hover:text-foreground transition-colors">Política de privacidad</Link>.
          </motion.p>

          {/* Demo accounts (solo en modo demo) */}
          <DemoAccounts />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Demo accounts panel ──────────────────────────────────────────────────────
// Se muestra automáticamente cuando VITE_API_URL no está definido

function DemoAccounts() {
  const { mockUsers, login, isLoading } = useAuth();
  const navigate = useNavigate();

  if (!mockUsers.length) return null;

  const handleQuickLogin = async (email: string) => {
    const result = await login(email, "demo");
    if (result.success) {
      const u = mockUsers.find((m) => m.email === email);
      if (u) navigate(getRedirectPath(u), { replace: true });
    }
  };

  const ROLE_PILL: Record<string, string> = {
    superadmin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    admin:      "bg-red-500/10 text-red-400 border-red-500/20",
    host:       "bg-[hsl(var(--gold)/0.1)] text-[hsl(var(--gold))] border-[hsl(var(--gold)/0.2)]",
    guest:      "bg-green-500/10 text-green-400 border-green-500/20",
    staff:      "bg-blue-500/10 text-blue-400 border-blue-500/20",
    vendor:     "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-6 rounded-2xl border border-border bg-card/50 p-4"
    >
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center mb-3">
        Cuentas demo
      </p>
      <div className="space-y-1">
        {mockUsers.map((u) => (
          <button
            key={u.id}
            onClick={() => handleQuickLogin(u.email)}
            disabled={isLoading}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/60 transition-colors text-left disabled:opacity-50"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-gold flex items-center justify-center text-[9px] font-bold text-[#0C0C0E] shrink-0">
              {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium truncate">{u.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
            </div>
            <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${ROLE_PILL[u.role] ?? ""}`}>
              {u.role}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}