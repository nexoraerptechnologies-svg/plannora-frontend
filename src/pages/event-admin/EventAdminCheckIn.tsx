import { motion } from "framer-motion";
import { QrCode, CheckCircle, XCircle, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const recentScans = [
  { name: "María García", time: "2 min ago", status: "approved" },
  { name: "Carlos López", time: "5 min ago", status: "approved" },
  { name: "Unknown Guest", time: "8 min ago", status: "denied" },
  { name: "Ana Martínez", time: "12 min ago", status: "approved" },
  { name: "Diego Morales", time: "15 min ago", status: "approved" },
];

export default function EventAdminCheckIn() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Check-in Control</h1>
        <p className="text-muted-foreground mt-1">Monitor arrivals and manage QR access in real-time.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {[
          { label: "Arrived", value: "142", icon: CheckCircle, color: "text-[hsl(var(--success))]" },
          { label: "Expected", value: "106", icon: Clock, color: "text-accent" },
          { label: "Denied", value: "3", icon: XCircle, color: "text-destructive" },
          { label: "Total", value: "248", icon: Users, color: "text-foreground" },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/50 p-4">
            <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
            <p className="text-2xl font-display font-bold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-border/50 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Check-in Progress</span>
          <span className="text-sm font-medium">57%</span>
        </div>
        <Progress value={57} className="h-3" />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
              <QrCode className="h-4 w-4 text-accent" /> QR Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-accent/30 flex items-center justify-center mb-4">
              <QrCode className="h-16 w-16 text-accent/30" />
            </div>
            <Button variant="gold" className="rounded-xl">Activate Scanner</Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display font-semibold">Recent Scans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentScans.map((scan, i) => (
              <div key={i} className="flex items-center gap-3">
                {scan.status === "approved" ? (
                  <CheckCircle className="h-4 w-4 text-[hsl(var(--success))] shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{scan.name}</p>
                  <p className="text-[10px] text-muted-foreground">{scan.time}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] rounded-full ${scan.status === "approved" ? "text-[hsl(var(--success))] border-[hsl(var(--success))]/30" : "text-destructive border-destructive/30"}`}>
                  {scan.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
