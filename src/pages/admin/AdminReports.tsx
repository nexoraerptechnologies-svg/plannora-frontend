import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Eye, Ban, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const reports = [
  { id: "r-1", type: "vendor", target: "Quick Catering Co.", reporter: "Alan Nexora", reason: "Misleading pricing information", date: "Today", status: "pending" },
  { id: "r-2", type: "photo", target: "Photo #342", reporter: "María García", reason: "Inappropriate content", date: "Today", status: "pending" },
  { id: "r-3", type: "event", target: "Birthday Bash", reporter: "System", reason: "Suspicious activity detected", date: "Yesterday", status: "under_review" },
  { id: "r-4", type: "vendor", target: "DJ Elektra", reporter: "Elena Rivera", reason: "Did not show up to event", date: "2 days ago", status: "resolved" },
  { id: "r-5", type: "photo", target: "Photo #128", reporter: "Carlos R.", reason: "Copyright violation", date: "3 days ago", status: "resolved" },
  { id: "r-6", type: "vendor", target: "Flores Elegantes", reporter: "Valentina C.", reason: "Poor service quality", date: "4 days ago", status: "dismissed" },
];

const typeColors: Record<string, string> = {
  vendor: "bg-accent/10 text-accent",
  photo: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]",
  event: "bg-destructive/10 text-destructive",
};

const statusColors: Record<string, string> = {
  pending: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]",
  under_review: "bg-accent/10 text-accent",
  resolved: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
  dismissed: "bg-muted text-muted-foreground",
};

export default function AdminReports() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? reports : reports.filter((r) => r.status === filter);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Reports & Moderation</h1>
        <p className="text-muted-foreground mt-1">Review reports, moderate content, and enforce policies.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {[
          { label: "Pending", count: reports.filter((r) => r.status === "pending").length, icon: Clock, color: "text-[hsl(var(--warning))]" },
          { label: "Under Review", count: reports.filter((r) => r.status === "under_review").length, icon: Eye, color: "text-accent" },
          { label: "Resolved", count: reports.filter((r) => r.status === "resolved").length, icon: CheckCircle2, color: "text-[hsl(var(--success))]" },
          { label: "Dismissed", count: reports.filter((r) => r.status === "dismissed").length, icon: Trash2, color: "text-muted-foreground" },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/50 p-4">
            <s.icon className={`h-4 w-4 ${s.color} mb-1`} />
            <p className="text-2xl font-display font-bold">{s.count}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        {["all", "pending", "under_review", "resolved", "dismissed"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f ? "bg-accent text-accent-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`}>
            {f === "all" ? "All" : f.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((report, i) => (
          <motion.div key={report.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="rounded-2xl border-border/50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{report.target}</p>
                    <Badge variant="secondary" className={`text-[8px] rounded-full ${typeColors[report.type]}`}>{report.type}</Badge>
                    <Badge variant="secondary" className={`text-[8px] rounded-full ${statusColors[report.status]}`}>{report.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{report.reason}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Reported by {report.reporter} · {report.date}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"><Eye className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-destructive"><Ban className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-[hsl(var(--success))]"><CheckCircle2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
