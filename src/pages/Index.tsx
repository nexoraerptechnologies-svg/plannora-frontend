import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckIcon } from "lucide-react";
import { useTranslate } from "@/i18n/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";

// ─── Animation variants ────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay: i * 0.08 },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

// ─── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "⬡",
    tag: "Drag & Drop",
    title: "Floor Planner Visual",
    desc: "Diseña tu salón en tiempo real. Arrastra mesas, asigna invitados y visualiza el espacio al instante.",
  },
  {
    icon: "◎",
    tag: "QR Check-in",
    title: "Gestión de Invitados",
    desc: "Lista de invitados, confirmaciones RSVP, check-in por QR y seguimiento en tiempo real desde un solo lugar.",
  },
  {
    icon: "◈",
    tag: "Mobile-first",
    title: "App para Invitados",
    desc: "Tus invitados acceden a su mesa, suben fotos, piden canciones y reciben notificaciones desde su celular.",
  },
  {
    icon: "◳",
    tag: "Tiempo real",
    title: "Galería Colaborativa",
    desc: "Todos comparten fotos en tiempo real. Modera, descarga en masa y preserva cada momento mágico.",
  },
  {
    icon: "◐",
    tag: "Próximamente",
    title: "Marketplace Proveedores",
    desc: "Encuentra, cotiza y contrata catering, música, fotografía y más — todo dentro de Plannora.",
  },
  {
    icon: "◑",
    tag: "Dashboard",
    title: "Analytics del Evento",
    desc: "Asistencia, presupuesto, engagement de invitados y más métricas en un dashboard elegante.",
  },
];

const STEPS = [
  {
    num: "1",
    title: "Crea tu evento",
    desc: "Registra los datos principales: fecha, lugar, tipo de evento y cantidad de invitados.",
  },
  {
    num: "2",
    title: "Organiza invitados",
    desc: "Importa tu lista, envía invitaciones digitales y gestiona confirmaciones en tiempo real.",
  },
  {
    num: "3",
    title: "Diseña el salón",
    desc: "Usa el Floor Planner para asignar mesas, espacios VIP y zonas especiales visualmente.",
  },
  {
    num: "4",
    title: "Disfruta el día",
    desc: "Check-in por QR, fotos en tiempo real y tu equipo coordinado desde la app del evento.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "0",
    priceNote: "Para siempre gratis",
    featured: false,
    badge: null,
    cta: "Comenzar gratis",
    ctaTo: "/register",
    features: [
      { text: "1 evento activo", active: true },
      { text: "Hasta 50 invitados", active: true },
      { text: "Floor Planner básico", active: true },
      { text: "Galería (sin moderación)", active: false },
      { text: "Soporte por email", active: false },
    ],
  },
  {
    name: "Pro",
    price: "49",
    priceNote: "por evento · pago único",
    featured: true,
    badge: "Más popular",
    cta: "Obtener Pro",
    ctaTo: "/register?plan=pro",
    features: [
      { text: "Invitados ilimitados", active: true },
      { text: "Floor Planner completo", active: true },
      { text: "App para invitados", active: true },
      { text: "Check-in por QR", active: true },
      { text: "Galería con moderación", active: true },
      { text: "DJ Booth + peticiones", active: true },
      { text: "Analytics completo", active: true },
      { text: "Soporte prioritario", active: true },
    ],
  },
  {
    name: "Business",
    price: "199",
    priceNote: "por mes · multi-evento",
    featured: false,
    badge: null,
    cta: "Contactar ventas",
    ctaTo: "/register?plan=business",
    features: [
      { text: "Eventos ilimitados", active: true },
      { text: "White-label (tu marca)", active: true },
      { text: "Marketplace de proveedores", active: true },
      { text: "Panel multi-admin", active: true },
      { text: "API access", active: true },
      { text: "Onboarding dedicado", active: true },
    ],
  },
];

const TESTIMONIALS = [
  {
    initials: "AM",
    quote:
      "El floor planner nos ahorró horas de trabajo. Todo el equipo podía ver los cambios en tiempo real el día del evento.",
    name: "Ana & Miguel",
    role: "Boda — Guadalajara, Nov 2024",
  },
  {
    initials: "CR",
    quote:
      "La app para invitados fue lo más comentado del evento. Todos subiendo fotos y pidiendo canciones desde el celular.",
    name: "Carla & Roberto",
    role: "Boda — CDMX, Dic 2024",
  },
  {
    initials: "LP",
    quote:
      "Soy wedding planner y ya uso Plannora en todos mis eventos. El check-in por QR cambió completamente el proceso de entrada.",
    name: "Lucía Palomino",
    role: "Wedding Planner Profesional",
  },
];

const LOGOS = [
  "Salón Imperial",
  "Bodas & Co.",
  "EventPro MX",
  "La Hacienda",
  "Nexora Events",
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <div
      className="rounded-xl bg-gradient-gold flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <span
        className="font-display font-semibold text-[#0C0C0E]"
        style={{ fontSize: size * 0.5 }}
      >
        P
      </span>
    </div>
  );
}

function PulseDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--gold))] opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--gold))]" />
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] tracking-[0.15em] uppercase text-[hsl(var(--gold))] mb-3">
      {children}
    </p>
  );
}

function SectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-display text-4xl md:text-5xl font-light leading-[1.08] mb-5 ${className}`}
    >
      {children}
    </h2>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <Link to="/" className="flex items-center gap-2.5">
        <LogoMark />
        <span className="font-display font-semibold text-[18px] tracking-wide">
          Plannora
        </span>
        <span className="text-[10px] text-muted-foreground tracking-widest uppercase hidden sm:block">
          by Nexora
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-1">
        <Button variant="ghost" className="rounded-xl text-muted-foreground hover:text-foreground" asChild>
          <a href="#features">Características</a>
        </Button>
        <Button variant="ghost" className="rounded-xl text-muted-foreground hover:text-foreground" asChild>
          <a href="#pricing">Precios</a>
        </Button>
        <Button variant="ghost" className="rounded-xl text-muted-foreground hover:text-foreground" asChild>
          <Link to="/vendors">Proveedores</Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle variant="dropdown" />
        <Button variant="ghost" asChild className="rounded-xl hidden sm:flex">
          <Link to="/login">Iniciar sesión</Link>
        </Button>
        <Button variant="gold" asChild className="rounded-xl">
          <Link to="/register">
            Comenzar gratis <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>
    </nav>
  );
}

function HeroMockup() {
  const tables = [
    { label: "Mesa 1", sub: "10 inv.", state: "filled" },
    { label: "Mesa 2", sub: "8 inv.", state: "filled" },
    { label: "Mesa 3", sub: "★ VIP", state: "selected" },
    { label: "Mesa 4", sub: "10 inv.", state: "filled" },
    { label: "Mesa 5", sub: "", state: "empty" },
    { label: "Mesa 6", sub: "9 inv.", state: "filled" },
    { label: "Mesa 7", sub: "", state: "empty" },
    { label: "Mesa 8", sub: "10 inv.", state: "filled" },
    { label: "Mesa 9", sub: "7 inv.", state: "filled" },
    { label: "Mesa 10", sub: "", state: "empty" },
  ];

  const tableClass = (state: string) => {
    const base =
      "h-11 rounded-lg border flex flex-col items-center justify-center text-[10px] transition-all";
    if (state === "filled")
      return `${base} bg-[hsl(var(--gold)/0.08)] border-[hsl(var(--gold)/0.3)] text-[hsl(var(--gold))] font-medium`;
    if (state === "selected")
      return `${base} bg-[hsl(var(--gold)/0.18)] border-[hsl(var(--gold))] text-[hsl(var(--gold))] font-semibold`;
    return `${base} border-border text-muted-foreground`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="relative"
    >
      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[hsl(var(--gold)/0.12)] blur-3xl pointer-events-none" />

      <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <span className="font-display text-sm text-[hsl(var(--gold))]">
            Floor Planner — Alan & Sofía
          </span>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-border" />
            ))}
          </div>
        </div>

        {/* Floor grid */}
        <div className="grid grid-cols-5 gap-1.5 mb-4">
          {tables.map((t) => (
            <div key={t.label} className={tableClass(t.state)}>
              <span>{t.label}</span>
              {t.sub && (
                <span className="text-[9px] mt-0.5 opacity-80">{t.sub}</span>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { val: "247", lbl: "Invitados" },
            { val: "24", lbl: "Mesas" },
            { val: "94%", lbl: "Confirmados" },
          ].map((s) => (
            <div key={s.lbl} className="bg-background rounded-lg p-2.5">
              <span className="font-display text-lg text-[hsl(var(--gold))] block">
                {s.val}
              </span>
              <span className="text-[10px] text-muted-foreground">{s.lbl}</span>
            </div>
          ))}
        </div>

        <div className="h-px bg-border my-3" />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            Evento: 14 Feb 2025
          </span>
          <span className="text-[11px] text-[hsl(var(--gold))] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            En línea · 3 admins
          </span>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute -bottom-4 left-5 bg-card border border-[hsl(var(--gold)/0.3)] rounded-xl px-4 py-2 flex items-center gap-2.5 shadow-xl"
      >
        <span className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-[11px] font-medium">Check-in activo · 183 ingresados</span>
      </motion.div>
    </motion.div>
  );
}

function HeroSection() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 lg:px-12 pt-20 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
      {/* Left */}
      <div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 bg-[hsl(var(--gold)/0.08)] border border-[hsl(var(--gold)/0.25)] rounded-full px-4 py-1.5 mb-7"
        >
          <PulseDot />
          <span className="text-[11px] tracking-widest uppercase text-[hsl(var(--gold))]">
            Plataforma premium de eventos
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="font-display text-5xl md:text-6xl lg:text-[64px] font-light leading-[1.06] mb-6"
        >
          Tu boda,
          <br />
          <em className="italic text-[hsl(var(--gold))]">perfectamente</em>
          <br />
          planeada.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="text-muted-foreground text-[16px] leading-relaxed mb-9 max-w-md"
        >
          Plannora centraliza cada detalle de tu evento: mesas, invitados,
          proveedores y cronograma — todo en una plataforma elegante.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-3"
        >
          <Button variant="gold" size="lg" asChild className="rounded-2xl px-7 h-12">
            <Link to="/register">
              Comenzar gratis{" "}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="rounded-2xl px-7 h-12">
            <Link to="/event/alan-y-sofia">Ver demo en vivo</Link>
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="show"
          className="flex items-center gap-3 mt-7"
        >
          <div className="flex">
            {["AM", "CR", "LV", "+"].map((init, i) => (
              <div
                key={init}
                className="w-7 h-7 rounded-full border-2 border-background bg-gradient-gold flex items-center justify-center text-[9px] font-semibold text-[#0C0C0E]"
                style={{ marginLeft: i === 0 ? 0 : -8 }}
              >
                {init}
              </div>
            ))}
          </div>
          <p className="text-[12px] text-muted-foreground">
            <span className="text-foreground font-medium">+2,400 parejas</span>{" "}
            ya confían en Plannora
          </p>
        </motion.div>
      </div>

      {/* Right — Mockup */}
      <HeroMockup />
    </div>
  );
}

function LogosBar() {
  return (
    <div className="border-y border-border bg-card/50">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-5 flex flex-wrap items-center gap-8 justify-center">
        <span className="text-[11px] text-muted-foreground tracking-widest uppercase whitespace-nowrap">
          Confiado por
        </span>
        {LOGOS.map((logo) => (
          <span
            key={logo}
            className="font-display text-[17px] text-foreground/15 select-none"
          >
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="max-w-[1100px] mx-auto px-6 lg:px-12 py-24">
      <SectionLabel>Plataforma completa</SectionLabel>
      <SectionTitle>
        Todo lo que necesitas,
        <br />
        <em className="italic text-[hsl(var(--gold))]">nada que sobre.</em>
      </SectionTitle>
      <p className="text-muted-foreground text-[16px] max-w-lg mb-16">
        Cada herramienta fue diseñada para que organizar tu evento se sienta
        como un placer, no una obligación.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-card hover:bg-card/60 transition-colors p-8 group"
          >
            <div className="w-11 h-11 rounded-xl bg-[hsl(var(--gold)/0.08)] border border-[hsl(var(--gold)/0.2)] flex items-center justify-center mb-5 text-xl group-hover:border-[hsl(var(--gold)/0.5)] transition-colors">
              {f.icon}
            </div>
            <h3 className="font-display text-[19px] font-normal mb-2.5">
              {f.title}
            </h3>
            <p className="text-muted-foreground text-[13px] leading-relaxed mb-4">
              {f.desc}
            </p>
            <span className="text-[10px] tracking-widest uppercase text-[hsl(var(--gold))] border-b border-[hsl(var(--gold)/0.4)] pb-0.5">
              {f.tag}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <div className="bg-card/50 border-y border-border">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-24">
        <SectionLabel>Proceso</SectionLabel>
        <SectionTitle>
          De la idea al{" "}
          <em className="italic text-[hsl(var(--gold))]">evento perfecto</em>
        </SectionTitle>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-[22px] left-[80px] right-[80px] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="text-center"
            >
              <div className="w-11 h-11 rounded-full bg-background border border-border flex items-center justify-center mx-auto mb-5 font-display text-lg text-[hsl(var(--gold))] relative z-10">
                {step.num}
              </div>
              <h3 className="font-display text-[18px] mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="max-w-[1100px] mx-auto px-6 lg:px-12 py-24">
      <SectionLabel>Precios</SectionLabel>
      <SectionTitle>
        Simple,{" "}
        <em className="italic text-[hsl(var(--gold))]">sin sorpresas.</em>
      </SectionTitle>
      <p className="text-muted-foreground text-[16px] mb-14">
        Un solo pago por evento. Sin suscripciones anuales obligatorias.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={`relative rounded-2xl border p-8 transition-colors ${
              plan.featured
                ? "border-[hsl(var(--gold)/0.5)] bg-gradient-to-b from-card to-card/60"
                : "border-border bg-card hover:border-[hsl(var(--gold)/0.3)]"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-gold text-[#0C0C0E] text-[10px] font-medium px-4 py-1 rounded-full whitespace-nowrap tracking-wide">
                {plan.badge}
              </div>
            )}

            <p className="text-[11px] tracking-widest uppercase text-muted-foreground mb-3">
              {plan.name}
            </p>
            <div className="font-display text-5xl font-light leading-none mb-1">
              <sup className="text-xl align-super">$</sup>
              {plan.price}
            </div>
            <p className="text-muted-foreground text-[12px] mb-7">
              {plan.priceNote}
            </p>

            <div className="h-px bg-border mb-6" />

            <ul className="space-y-1 mb-8">
              {plan.features.map((f) => (
                <li
                  key={f.text}
                  className={`flex items-center gap-3 py-1.5 border-b border-border/40 last:border-0 text-[13px] ${
                    f.active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <CheckIcon
                    className={`h-3.5 w-3.5 shrink-0 ${
                      f.active
                        ? "text-[hsl(var(--gold))]"
                        : "text-muted-foreground/40"
                    }`}
                  />
                  {f.text}
                </li>
              ))}
            </ul>

            <Button
              variant={plan.featured ? "gold" : "outline"}
              className="w-full rounded-xl h-11"
              asChild
            >
              <Link to={plan.ctaTo}>{plan.cta}</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <div className="bg-card/50 border-t border-border">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-24">
        <SectionLabel>Testimonios</SectionLabel>
        <SectionTitle>
          Lo que dicen{" "}
          <em className="italic text-[hsl(var(--gold))]">nuestros usuarios</em>
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-7 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4 text-[hsl(var(--gold))] text-[13px] tracking-widest">
                ★★★★★
              </div>
              <blockquote className="font-display text-[17px] italic leading-relaxed text-foreground mb-6 flex-1">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center text-[11px] font-semibold text-[#0C0C0E] shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-[13px] font-medium">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CtaSection() {
  return (
    <div className="border-t border-border bg-card/30">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-28 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[280px] rounded-full bg-[hsl(var(--gold)/0.07)] blur-3xl" />
        </div>

        <div className="relative">
          <SectionLabel>Empieza hoy</SectionLabel>
          <h2 className="font-display text-5xl md:text-6xl font-light leading-[1.08] mb-5">
            Tu evento merece
            <br />
            <em className="italic text-[hsl(var(--gold))]">
              algo extraordinario.
            </em>
          </h2>
          <p className="text-muted-foreground text-[16px] mb-10">
            Gratis para comenzar. Sin tarjeta de crédito.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="gold" size="lg" asChild className="rounded-2xl px-8 h-12">
              <Link to="/register">
                Crear mi evento gratis{" "}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-2xl px-8 h-12">
              <Link to="/event/alan-y-sofia">Ver demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-6 lg:px-12 py-10 max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <LogoMark size={28} />
        <span className="font-display text-[15px] font-semibold">Plannora</span>
        <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
          by Nexora
        </span>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/terms" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
          Términos
        </Link>
        <Link to="/privacy" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
          Privacidad
        </Link>
        <a href="#" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
          Soporte
        </a>
        <Link to="/vendors" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
          Proveedores
        </Link>
      </div>
      <p className="text-[12px] text-muted-foreground">
        © 2025 Plannora. Todos los derechos reservados.
      </p>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Index() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <LogosBar />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}