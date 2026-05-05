import { motion } from "framer-motion";
import { ScrollText, LogIn, QrCode, MessageSquare, AlertCircle, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const logs = [
  { id: "l-1", type: "login", message: "Admin Nexora logged in", ip: "192.168.1.1", timestamp: "2026-04-08 14:32:01", level: "info" },
  { id: "l-2", type: "qr_scan", message: "QR scan: Guest María García checked in", ip: "10.0.0.5", timestamp: "2026-04-08 14:28:45", level: "info" },
  { id: "l-3", type: "message", message: "Message sent from Alan to DJ Elektra", ip: "192.168.1.2", timestamp: "2026-04-08 14:25:12", level: "info" },
  { id: "l-4", type: "error", message: "Failed payment attempt: Card declined for user Diego H.", ip: "10.0.0.8", timestamp: "2026-04-08 14:20:33", level: "error" },
  { id: "l-5", type: "login", message: "Elena Rivera logged in", ip: "192.168.1.15", timestamp: "2026-04-08 14:15:20", level: "info" },
  { id: "l-6", type: "error", message: "Rate limit exceeded: IP 203.0.113.5", ip: "203.0.113.5", timestamp: "2026-04-08 14:10:05", level: "warning" },
  { id: "l-7", type: "qr_scan", message: "QR scan: Guest Carlos Rodríguez checked in", ip: "10.0.0.5", timestamp: "2026-04-08 14:05:18", level: "info" },
  { id: "l-8", type: "login", message: "Failed login attempt for vendor@email.com", ip: "45.33.12.8", timestamp: "2026-04-08 14:00:42", level: "warning" },
  { id: "l-9", type: "message", message: "Vendor inquiry from Torres Family to Hacienda Los Robles", ip: "192.168.1.3", timestamp: "2026-04-08 13:55:30", level: "info" },
  { id: "l-10", type: "error", message: "Database connection timeout (recovered)", ip: "internal", timestamp: "2026-04-08 13:50:15", level: "error" },
];

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  login: LogIn,
  qr_scan: QrCode,
  message: MessageSquare,
  error: AlertCircle,
};

const levelColors: Record<string, string> = {
  info: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
  warning: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]",
  error: "bg-destructive/10 text-destructive",
};

export default function AdminLogs() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? logs : logs.filter((l) => l.type === filter);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">System Logs</h1>
        <p className="text-muted-foreground mt-1">Track all platform activity and system events.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "login", "qr_scan", "message", "error"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f ? "bg-accent text-accent-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`}>
            {f === "all" ? "All" : f === "qr_scan" ? "QR Scans" : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
          </button>
        ))}
      </div>

      <Card className="rounded-2xl border-border/50 overflow-hidden">
        <div className="divide-y divide-border/10 font-mono">
          {filtered.map((log, i) => {
            const Icon = typeIcons[log.type] || ScrollText;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="px-4 py-3 flex items-center gap-3 hover:bg-muted/10 transition-colors"
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-[10px] text-muted-foreground shrink-0 w-36">{log.timestamp}</span>
                <Badge variant="secondary" className={`text-[8px] rounded-full shrink-0 ${levelColors[log.level]}`}>{log.level}</Badge>
                <p className="text-xs text-foreground flex-1 min-w-0 truncate">{log.message}</p>
                <span className="text-[9px] text-muted-foreground shrink-0">{log.ip}</span>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
