// src/pages/admin/components/KpiGrid.tsx
import { motion, type Variants } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { KPIS } from "./data";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE, delay: i * 0.04 },
  }),
};

export function KpiGrid() {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {KPIS.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          variants={cardVariant}
          initial="hidden"
          animate="show"
          custom={i}
        >
          <Card className="rounded-2xl border-border/50 p-4 hover:border-[hsl(var(--gold)/0.3)] transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--gold)/0.08)] flex items-center justify-center group-hover:bg-[hsl(var(--gold)/0.14)] transition-colors">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <span className="text-[10px] text-green-500 flex items-center gap-0.5 font-medium">
                <TrendingUp className="h-2.5 w-2.5" />
                {kpi.change}
              </span>
            </div>
            <p className="text-xl font-display font-bold leading-none mb-1">{kpi.value}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider leading-tight">
              {kpi.label}
            </p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}