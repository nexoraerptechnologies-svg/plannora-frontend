// src/pages/Privacy.tsx
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Eye, Share2, UserCheck, Mail, Lock } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay: i * 0.06 },
  }),
};

const SECTIONS = [
  {
    num: "01",
    icon: Eye,
    title: "Información que recopilamos",
    body: "Recopilamos la información que proporcionas directamente: nombre, correo electrónico, detalles del evento, listas de invitados y archivos multimedia. También recopilamos automáticamente datos de uso, información del dispositivo y registros de acceso para garantizar el correcto funcionamiento de la plataforma.",
  },
  {
    num: "02",
    icon: ShieldCheck,
    title: "Cómo usamos tu información",
    body: "Tus datos se utilizan exclusivamente para prestar y mejorar nuestros servicios: gestionar tus eventos, enviar notificaciones relevantes, garantizar la seguridad de la plataforma y personalizar tu experiencia. Nunca los utilizamos con fines distintos a los descritos en esta política.",
  },
  {
    num: "03",
    icon: Share2,
    title: "Compartición de datos",
    body: "No vendemos, alquilamos ni comercializamos tus datos personales. La información puede compartirse con proveedores de servicios que asisten en la operación de la plataforma, siempre bajo acuerdos de confidencialidad estrictos y únicamente en la medida necesaria para prestar el servicio.",
  },
  {
    num: "04",
    icon: Lock,
    title: "Seguridad de los datos",
    body: "Implementamos medidas técnicas y organizativas apropiadas para proteger tu información contra accesos no autorizados, pérdida accidental o destrucción. Utilizamos cifrado en tránsito (TLS) y en reposo para todos los datos sensibles almacenados en nuestra plataforma.",
  },
  {
    num: "05",
    icon: UserCheck,
    title: "Tus derechos",
    body: "Tienes derecho a acceder, rectificar, cancelar y oponerte al tratamiento de tus datos personales en cualquier momento. Puedes solicitar la portabilidad de tus datos o su eliminación completa contactando a nuestro equipo de soporte. Responderemos a tu solicitud en un plazo máximo de 15 días hábiles.",
  },
  {
    num: "06",
    icon: Mail,
    title: "Cookies y rastreo",
    body: "Utilizamos cookies esenciales para el funcionamiento de la plataforma y cookies analíticas para entender cómo se usa el servicio. Puedes controlar el uso de cookies no esenciales desde la configuración de tu navegador. No utilizamos cookies de publicidad de terceros.",
  },
];

const HIGHLIGHTS = [
  { icon: "🔒", label: "Datos cifrados en tránsito y en reposo" },
  { icon: "🚫", label: "No vendemos tu información personal" },
  { icon: "✅", label: "Cumplimiento con LGPDP (México)" },
  { icon: "🗑️", label: "Eliminación de datos a solicitud" },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-gold flex items-center justify-center">
              <span className="font-display font-bold text-[#0C0C0E] text-[11px]">P</span>
            </div>
            <span className="font-display text-[13px] font-semibold">Plannora</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Hero */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="mb-12"
        >
          <p className="text-[11px] tracking-[0.15em] uppercase text-[hsl(var(--gold))] mb-3">
            Legal
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-light leading-tight mb-4">
            Política de{" "}
            <em className="italic text-[hsl(var(--gold))]">Privacidad</em>
          </h1>
          <p className="text-muted-foreground text-[14px]">
            Última actualización:{" "}
            <span className="text-foreground">26 de marzo de 2026</span>
          </p>
        </motion.div>

        {/* Highlights grid */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="grid grid-cols-2 gap-3 mb-12"
        >
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.label}
              className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3"
            >
              <span className="text-[18px] leading-none shrink-0">{h.icon}</span>
              <span className="text-[12px] text-foreground/80 leading-snug">{h.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Intro callout */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="bg-[hsl(var(--gold)/0.06)] border border-[hsl(var(--gold)/0.2)] rounded-2xl px-6 py-5 mb-12"
        >
          <p className="text-[13px] text-foreground/80 leading-relaxed">
            En <strong className="text-foreground font-medium">Plannora by Nexora</strong> nos tomamos
            tu privacidad en serio. Esta política describe cómo recopilamos, usamos y protegemos
            tu información personal. Si tienes preguntas, escríbenos a{" "}
            <a href="mailto:privacy@plannora.app" className="text-[hsl(var(--gold))] hover:underline">
              privacy@plannora.app
            </a>
            .
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-0">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={s.num}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              custom={i}
              className="group flex gap-6 py-8 border-b border-border last:border-0"
            >
              {/* Left: number + icon */}
              <div className="flex flex-col items-center gap-2 shrink-0 w-8">
                <span className="font-display text-[12px] text-[hsl(var(--gold)/0.45)] group-hover:text-[hsl(var(--gold))] transition-colors">
                  {s.num}
                </span>
                <div className="w-7 h-7 rounded-lg bg-[hsl(var(--gold)/0.08)] border border-[hsl(var(--gold)/0.15)] flex items-center justify-center group-hover:border-[hsl(var(--gold)/0.4)] transition-colors">
                  <s.icon className="h-3.5 w-3.5 text-[hsl(var(--gold)/0.6)] group-hover:text-[hsl(var(--gold))] transition-colors" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-[18px] font-normal text-foreground mb-3">
                  {s.title}
                </h2>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  {s.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0}
          className="mt-16 pt-10 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <p className="text-[13px] font-medium mb-0.5">¿Preguntas sobre tu privacidad?</p>
            <p className="text-[12px] text-muted-foreground">
              Contáctanos en{" "}
              <a
                href="mailto:privacy@plannora.app"
                className="text-[hsl(var(--gold))] hover:underline"
              >
                privacy@plannora.app
              </a>
            </p>
          </div>
          <div className="flex gap-3 text-[12px]">
            <Link
              to="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Términos de uso
            </Link>
            <Link
              to="/register"
              className="text-[hsl(var(--gold))] hover:underline"
            >
              Crear cuenta →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}