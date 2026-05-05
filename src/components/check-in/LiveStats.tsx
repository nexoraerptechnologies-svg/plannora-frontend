import { motion } from "framer-motion";
import { Users, CheckCircle2, XCircle, Zap, MapPin, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ScanRecord } from "@/context/AccessControlContext";

interface LiveStatsProps {
  stats: { total: number; checkedIn: number; pending: number };
  scanHistory: ScanRecord[];
  scansPerMinute: number;
}

export default function LiveStats({ stats, scanHistory, scansPerMinute }: LiveStatsProps) {
  const percentage = stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;
  const denied = scanHistory.filter((s) => s.result === "denied").length;
  const warnings = scanHistory.filter((s) => s.result === "warning").length;

  // Entrance breakdown
  const entranceCounts: Record<string, number> = {};
  scanHistory.filter((s) => s.result === "success").forEach((s) => {
    entranceCounts[s.entrance] = (entranceCounts[s.entrance] || 0) + 1;
  });

  const statCards = [
    { label: "Total Guests", value: stats.total, icon: Users, color: "text-foreground" },
    { label: "Checked In", value: stats.checkedIn, icon: CheckCircle2, color: "text-[hsl(var(--success))]" },
    { label: "Denied", value: denied, icon: XCircle, color: "text-destructive" },
    { label: "Scan Rate", value: `${scansPerMinute}/min`, icon: Zap, color: "text-accent" },
  ];

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="rounded-2xl border-border/30 p-4">
              <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
              <p className="text-2xl font-display font-bold">{s.value}</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="rounded-2xl border-border/30 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Check-in Progress</span>
          <span className="text-xs font-medium">{percentage}%</span>
        </div>
        <Progress value={percentage} className="h-3" />
        <p className="text-[10px] text-muted-foreground mt-2">{stats.checkedIn} of {stats.total} guests arrived</p>
      </Card>

      {Object.keys(entranceCounts).length > 0 && (
        <Card className="rounded-2xl border-border/30 p-4">
          <h3 className="text-xs font-display font-semibold mb-3 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-accent" /> Entrance Breakdown
          </h3>
          <div className="space-y-2">
            {Object.entries(entranceCounts).sort((a, b) => b[1] - a[1]).map(([entrance, count]) => (
              <div key={entrance} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{entrance}</span>
                <span className="text-xs font-medium">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {warnings > 0 && (
        <Card className="rounded-2xl border-[hsl(38,92%,50%)]/20 bg-[hsl(38,92%,50%)]/5 p-4">
          <h3 className="text-xs font-medium text-[hsl(38,92%,50%)]">⚠ Duplicate Scans: {warnings}</h3>
          <p className="text-[10px] text-muted-foreground mt-1">Guests attempted to check-in more than once</p>
        </Card>
      )}
    </div>
  );
}
