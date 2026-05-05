import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { type UserRole } from "@/context/AuthContext";
import { toast } from "sonner";
import { useTranslate } from "@/i18n/LanguageContext";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE, delay: i * 0.07 },
  }),
};

// ─── Role option ───────────────────────────────────────────────────────────────

type RoleOption = {
  value: UserRole;
  label: string;
  desc: string;
  emoji: string;
};

const ROLES: RoleOption[] = [
  {
    value: "host",
    label: "Organizador",
    desc: "Planeo mi propio evento",
    emoji: "🎊",
  },
  {
    value: "vendor",
    label: "Proveedor",
    desc: "Ofrezco servicios para eventos",
    emoji: "🏢",
  },
  {
    value: "staff",
    label: "Staff",
    desc: "Soy parte del equipo de un evento",
    emoji: "🎯",
  },
];

function RoleCard({
  option,
  selected,
  onClick,
}: {
  option: RoleOption;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full text-left p-3.5 rounded-xl border transition-all duration-200
        ${
          selected
            ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold)/0.08)]"
            : "border-border bg-card hover:border-[hsl(var(--gold)/0.4)] hover:bg-card/80"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl leading-none">{option.emoji}</span>
        <div className="flex-1 min-w-0">
          <p
            className={`text-[13px] font-medium ${
              selected ? "text-foreground" : "text-foreground/80"
            }`}
          >
            {option.label}
          </p>
          <p className="text-[11px] text-muted-foreground">{option.desc}</p>
        </div>
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="w-5 h-5 rounded-full bg-[hsl(var(--gold))] flex items-center justify-center shrink-0"
            >
              <Check className="h-3 w-3 text-[#0C0C0E]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}

// ─── Password strength ─────────────────────────────────────────────────────────

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Débil", color: "bg-destructive" };
  if (score === 2) return { score, label: "Regular", color: "bg-orange-400" };
  if (score === 3) return { score, label: "Buena", color: "bg-yellow-400" };
  return { score, label: "Excelente", color: "bg-green-500" };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslate();

  const [role, setRole] = useState<UserRole>("host");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(t("auth.accountCreated"));
      setTimeout(() => navigate("/login"), 1200);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left panel (decorative) — hidden on mobile ── */}
      <div className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between bg-[#0C0C0E] border-r border-border p-12 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[hsl(var(--gold)/0.08)] blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-gold flex items-center justify-center">
            <span className="font-display font-bold text-[#0C0C0E] text-lg">P</span>
          </div>
          <span className="font-display text-white text-[17px] font-semibold">
            Plannora
          </span>
          <span className="text-[10px] text-white/30 tracking-widest uppercase">
            by Nexora
          </span>
        </div>

        {/* Quote block */}
        <div className="relative z-10 space-y-8">
          <blockquote className="font-display text-3xl font-light leading-snug text-white">
            Cada gran evento comienza con{" "}
            <em className="italic text-[hsl(var(--gold))]">una gran idea.</em>
          </blockquote>

          {/* Mini feature list */}
          <ul className="space-y-3">
            {[
              "Floor Planner visual en tiempo real",
              "App para invitados con QR",
              "Galería colaborativa del evento",
              "Analytics y check-in inteligente",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-[13px] text-white/60">
                <span className="w-5 h-5 rounded-full bg-[hsl(var(--gold)/0.15)] border border-[hsl(var(--gold)/0.3)] flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5 text-[hsl(var(--gold))]" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex">
              {["AM", "CR", "LV"].map((init, i) => (
                <div
                  key={init}
                  className="w-7 h-7 rounded-full border-2 border-[#0C0C0E] bg-gradient-gold flex items-center justify-center text-[9px] font-semibold text-[#0C0C0E]"
                  style={{ marginLeft: i === 0 ? 0 : -8 }}
                >
                  {init}
                </div>
              ))}
            </div>
            <p className="text-[12px] text-white/40">
              <span className="text-white/70">+2,400 parejas</span> ya planean con Plannora
            </p>
          </div>
        </div>

        <p className="text-[11px] text-white/20 relative z-10">
          © 2025 Plannora. Todos los derechos reservados.
        </p>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div
          initial="hidden"
          animate="show"
          className="w-full max-w-[440px]"
        >
          {/* Mobile logo */}
          <motion.div
            variants={fadeUp}
            custom={0}
            className="lg:hidden flex justify-center mb-8"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-gold flex items-center justify-center">
                <span className="font-display font-bold text-[#0C0C0E] text-lg">P</span>
              </div>
              <span className="font-display text-[17px] font-semibold">Plannora</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeUp} custom={0} className="mb-8">
            <h1 className="font-display text-3xl font-light mb-1.5">
              Crea tu cuenta
            </h1>
            <p className="text-muted-foreground text-[14px]">
              Empieza a planear tu evento hoy — es gratis.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name row */}
            <motion.div variants={fadeUp} custom={1} className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[12px]">{t("auth.firstName")}</Label>
                <Input
                  placeholder="Alan"
                  className="rounded-xl h-11"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px]">{t("auth.lastName")}</Label>
                <Input
                  placeholder="Nexora"
                  className="rounded-xl h-11"
                  required
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeUp} custom={2} className="space-y-1.5">
              <Label className="text-[12px]">{t("auth.email")}</Label>
              <Input
                type="email"
                placeholder="tu@correo.com"
                className="rounded-xl h-11"
                required
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp} custom={3} className="space-y-1.5">
              <Label className="text-[12px]">{t("auth.password")}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  className="rounded-xl h-11 pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Strength bar */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          s <= strength.score
                            ? strength.color
                            : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Contraseña:{" "}
                    <span
                      className={
                        strength.score >= 3
                          ? "text-green-500"
                          : strength.score === 2
                          ? "text-yellow-500"
                          : "text-destructive"
                      }
                    >
                      {strength.label}
                    </span>
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Role selector */}
            <motion.div variants={fadeUp} custom={4} className="space-y-2">
              <Label className="text-[12px]">Soy...</Label>
              <div className="space-y-2">
                {ROLES.map((r) => (
                  <RoleCard
                    key={r.value}
                    option={r}
                    selected={role === r.value}
                    onClick={() => setRole(r.value)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Terms */}
            <motion.div variants={fadeUp} custom={5}>
              <p className="text-[11px] text-muted-foreground">
                Al crear tu cuenta aceptas nuestros{" "}
                <Link
                  to="/terms"
                  className="text-[hsl(var(--gold))] hover:underline"
                >
                  Términos de uso
                </Link>{" "}
                y{" "}
                <Link
                  to="/privacy"
                  className="text-[hsl(var(--gold))] hover:underline"
                >
                  Política de privacidad
                </Link>
                .
              </p>
            </motion.div>

            {/* Submit */}
            <motion.div variants={fadeUp} custom={6}>
              <Button
                variant="gold"
                className="w-full rounded-xl h-11 text-[14px] font-medium"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-[#0C0C0E]/30 border-t-[#0C0C0E] animate-spin" />
                    Creando cuenta...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Crear mi cuenta
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          {/* <motion.div variants={fadeUp} custom={7} className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-[11px] text-muted-foreground">
              o continúa con
            </span>
          </motion.div> */}

          {/* Social */}
          {/* <motion.div
            variants={fadeUp}
            custom={8}
            className="grid grid-cols-2 gap-3"
          >
            <Button
              variant="outline"
              className="rounded-xl h-11 text-[13px] gap-2"
              type="button"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="rounded-xl h-11 text-[13px] gap-2"
              type="button"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.19 1.28-2.17 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </Button>
          </motion.div> */}

          {/* Sign in link */}
          <motion.p
            variants={fadeUp}
            custom={9}
            className="text-center text-[13px] text-muted-foreground mt-6"
          >
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-[hsl(var(--gold))] hover:underline font-medium"
            >
              Iniciar sesión
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}