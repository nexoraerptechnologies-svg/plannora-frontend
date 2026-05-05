// src/pages/admin/AdminDashboard.tsx
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { KpiGrid }    from "./components/KpiGrid";
import { ChartsRow }  from "./components/ChartsRow";
import { LiveFeed }   from "./components/LiveFeed";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-100 max-w-7xl mx-auto px-6 py-10 flex flex-col gap-10"
    >
      {/* Header */}
      <div className="w-100">
        <p className="text-[11px] tracking-[0.15em] uppercase text-[hsl(var(--gold))] mb-1">
          Panel de control
        </p>
        <h1 className="font-display text-3xl font-light">
          Bienvenido,{" "}
          <em className="italic text-[hsl(var(--gold))]">
            {user?.name?.split(" ")[0] ?? "Admin"}
          </em>
        </h1>
        <p className="text-muted-foreground text-[14px] mt-1">
          Vista general de la plataforma en tiempo real.
        </p>
      </div>

      <KpiGrid />
      <ChartsRow />
      <LiveFeed />
    </motion.div>
  );
}