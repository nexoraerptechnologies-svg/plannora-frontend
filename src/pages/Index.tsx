import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, PartyPopper, Users, Image, LayoutGrid } from "lucide-react";
import { useTranslate } from "@/i18n/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Index() {
  const { t } = useTranslate();

  const features = [
    { icon: PartyPopper, title: t("landing.features.eventPlanning"), desc: t("landing.features.eventPlanningDesc") },
    { icon: Users, title: t("landing.features.guestManagement"), desc: t("landing.features.guestManagementDesc") },
    { icon: LayoutGrid, title: t("landing.features.tableLayouts"), desc: t("landing.features.tableLayoutsDesc") },
    { icon: Image, title: t("landing.features.sharedMemories"), desc: t("landing.features.sharedMemoriesDesc") },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-gold flex items-center justify-center">
            <span className="text-gold-foreground font-display font-bold text-sm">P</span>
          </div>
          <span className="font-display font-semibold">Planora</span>
          <span className="text-[10px] text-muted-foreground tracking-wider">{t("common.byNexora")}</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle variant="dropdown" />
          <Button variant="ghost" asChild className="rounded-xl"><Link to="/login">{t("auth.signIn")}</Link></Button>
          <Button variant="gold" asChild className="rounded-xl"><Link to="/register">{t("landing.startPlanning")}</Link></Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 lg:px-12 py-24 lg:py-36 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-gold uppercase tracking-[0.25em] text-sm mb-4">{t("landing.premiumEvent")}</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
            {t("landing.heroTitle1")}<br />{t("landing.heroTitle2")} <span className="text-gradient-gold">{t("landing.heroTitle3")}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
            {t("landing.heroDescription")}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="gold" size="lg" asChild className="rounded-2xl px-8 h-12">
              <Link to="/register">{t("landing.startPlanning")} <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-2xl px-8 h-12">
              <Link to="/event/alan-y-sofia">{t("landing.seeDemo")}</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-12 py-24 bg-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-semibold text-center mb-12">{t("landing.everythingYouNeed")}</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <f.icon className="h-8 w-8 text-gold mb-4" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-gold flex items-center justify-center">
            <span className="text-gold-foreground font-display font-bold text-xs">P</span>
          </div>
          <span className="font-display text-sm">Planora</span>
          <span className="text-[10px] text-muted-foreground">{t("common.byNexora")}</span>
        </div>
        <p className="text-xs text-muted-foreground">{t("common.rights")}</p>
      </footer>
    </div>
  );
}
