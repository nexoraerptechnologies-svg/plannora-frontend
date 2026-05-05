// src/pages/Terms.tsx
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
    title: "Aceptación de términos",
    body: "Al acceder a Plannora by Nexora, aceptas quedar vinculado por estos Términos de Servicio y todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos, te pedimos que no utilices la plataforma.",
  },
  {
    num: "02",
    title: "Licencia de uso",
    body: "Se otorga permiso para utilizar temporalmente la plataforma con fines personales y no comerciales de gestión de eventos. Esta licencia no incluye modificar, copiar o distribuir la tecnología subyacente de la plataforma, ni utilizarla para actividades que violen las leyes aplicables.",
  },
  {
    num: "03",
    title: "Contenido del usuario",
    body: "Conservas la propiedad de todo el contenido que subas, incluyendo fotos, listas de invitados y detalles del evento. Al subirlo, otorgas a Plannora una licencia no exclusiva para mostrar y procesar dicho contenido exclusivamente con el fin de prestar el servicio.",
  },
  {
    num: "04",
    title: "Privacidad",
    body: "Tu privacidad es fundamental para nosotros. Consulta nuestra Política de Privacidad para obtener información detallada sobre cómo recopilamos, usamos y protegemos tus datos personales en cumplimiento con la legislación vigente.",
  },
  {
    num: "05",
    title: "Limitación de responsabilidad",
    body: "Plannora no será responsable de ningún daño directo, indirecto, incidental o consecuente que surja del uso o la imposibilidad de uso de la plataforma. El servicio se proporciona 'tal cual', sin garantías de ningún tipo, expresas o implícitas.",
  },
  {
    num: "06",
    title: "Modificaciones",
    body: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación. El uso continuado de la plataforma tras dichos cambios implica tu aceptación de los nuevos términos.",
  },
  {
    num: "07",
    title: "Ley aplicable",
    body: "Estos términos se rigen e interpretan de conformidad con las leyes de México. Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales competentes de Monterrey, Nuevo León.",
  },
];

export default function Terms() {
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
          className="mb-16"
        >
          <p className="text-[11px] tracking-[0.15em] uppercase text-[hsl(var(--gold))] mb-3">
            Legal
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-light leading-tight mb-4">
            Términos y{" "}
            <em className="italic text-[hsl(var(--gold))]">Condiciones</em>
          </h1>
          <p className="text-muted-foreground text-[14px]">
            Última actualización:{" "}
            <span className="text-foreground">26 de marzo de 2026</span>
          </p>
        </motion.div>

        {/* Intro callout */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="bg-[hsl(var(--gold)/0.06)] border border-[hsl(var(--gold)/0.2)] rounded-2xl px-6 py-5 mb-12"
        >
          <p className="text-[13px] text-foreground/80 leading-relaxed">
            Al utilizar <strong className="text-foreground font-medium">Plannora by Nexora</strong>, aceptas estos términos en su totalidad. Te recomendamos leerlos con atención antes de continuar. Si tienes dudas, escríbenos a{" "}
            <a
              href="mailto:legal@plannora.app"
              className="text-[hsl(var(--gold))] hover:underline"
            >
              legal@plannora.app
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
              {/* Number */}
              <span className="font-display text-[13px] text-[hsl(var(--gold)/0.5)] shrink-0 pt-0.5 w-8 group-hover:text-[hsl(var(--gold))] transition-colors">
                {s.num}
              </span>

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

        {/* Footer CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0}
          className="mt-16 pt-10 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <p className="text-[13px] font-medium mb-0.5">¿Preguntas sobre estos términos?</p>
            <p className="text-[12px] text-muted-foreground">
              Contáctanos en{" "}
              <a
                href="mailto:legal@plannora.app"
                className="text-[hsl(var(--gold))] hover:underline"
              >
                legal@plannora.app
              </a>
            </p>
          </div>
          <div className="flex gap-3 text-[12px]">
            <Link
              to="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Política de privacidad
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