import { motion } from "framer-motion";
import { Users, CheckCircle2, Clock, Shield, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAccessControl } from "@/context/AccessControlContext";
import { useState } from "react";

export default function AccessDashboard() {
  const { guests, stats, event } = useAccessControl();
  const [search, setSearch] = useState("");

  const filtered = search
    ? guests.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    : guests;

  const percentage = stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">Access Control</h1>
          <p className="text-muted-foreground mt-1">Real-time guest check-in monitoring</p>
        </div>
        <Badge variant="outline" className="border-accent/30 text-accent gap-1.5 rounded-full px-3 py-1">
          <Shield className="h-3 w-3" /> Live
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border/50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Guests</p>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-display font-semibold mt-2">{stats.total}</p>
          <p className="text-xs text-muted-foreground mt-1">{event.name}</p>
        </Card>

        <Card className="rounded-2xl border-[hsl(142,70%,45%)]/20 bg-[hsl(142,70%,45%)]/5 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[hsl(142,70%,45%)] uppercase tracking-wider">Checked In</p>
            <CheckCircle2 className="h-4 w-4 text-[hsl(142,70%,45%)]" />
          </div>
          <p className="text-3xl font-display font-semibold mt-2 text-[hsl(142,70%,45%)]">{stats.checkedIn}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[hsl(142,70%,45%)] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{percentage}%</span>
          </div>
        </Card>

        <Card className="rounded-2xl border-accent/20 bg-accent/5 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-accent uppercase tracking-wider">Pending</p>
            <Clock className="h-4 w-4 text-accent" />
          </div>
          <p className="text-3xl font-display font-semibold mt-2 text-accent">{stats.pending}</p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting arrival</p>
        </Card>

        <Card className="rounded-2xl border-border/50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Check-in Rate</p>
          </div>
          <p className="text-3xl font-display font-semibold mt-2">{percentage}%</p>
          <p className="text-xs text-muted-foreground mt-1">of total guests</p>
        </Card>
      </div>

      {/* Search & Table */}
      <Card className="rounded-2xl border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guest..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl bg-muted/30 border-border/30"
            />
          </div>
          <p className="text-xs text-muted-foreground">{filtered.length} guests</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Guest</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Status</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Table</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Check-in</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Meal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((guest, i) => (
                <motion.tr
                  key={guest.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/10 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-[10px] font-semibold text-accent shrink-0">
                        {guest.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{guest.name}</p>
                        <p className="text-[10px] text-muted-foreground">{guest.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] rounded-full ${
                        guest.status === "checked-in"
                          ? "bg-[hsl(142,70%,45%)]/15 text-[hsl(142,70%,45%)] border border-[hsl(142,70%,45%)]/20"
                          : "bg-accent/10 text-accent border border-accent/20"
                      }`}
                    >
                      {guest.status === "checked-in" ? "Arrived" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{guest.table}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{guest.checkInTime || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{guest.mealPreference}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
